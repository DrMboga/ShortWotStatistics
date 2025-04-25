import { VehicleData } from '../model/wargaming/vehicleStatistics';
import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { computed, inject } from '@angular/core';
import { IndexedDBService } from '../indexedDb/indexed-db.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { WargamingApiService } from '../services/wargaming-api.service';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { map, of, pipe, switchMap } from 'rxjs';
import { tapResponse } from '@ngrx/operators';
import { Vehicle } from '../model/wargaming/vehicle';

type TanksState = {
  applicationId: string;
  playerTanks: VehicleData[];
};

const initialState: TanksState = {
  applicationId: '',
  playerTanks: [],
};

export const TanksStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withHooks({
    onInit(store, indexedDb = inject(IndexedDBService)) {
      indexedDb
        .getAccountsAuthInfo()
        .pipe(takeUntilDestroyed())
        .subscribe(accountAuthInfo => {
          if (accountAuthInfo.length > 0 && accountAuthInfo[0].applicationId) {
            patchState(store, { applicationId: accountAuthInfo[0].applicationId });
          }
        });
    },
  }),
  withComputed(({ playerTanks }) => ({
    tanksCount: computed(() => playerTanks().length),
    mastersCount: computed(() => playerTanks().filter(t => t.mark_of_mastery === 4).length),
  })),
  withMethods((store, wargamingApi = inject(WargamingApiService)) => ({
    readPlayerTanks: rxMethod<{ accountId: string; accessToken: string }>(
      pipe(
        switchMap(({ accountId, accessToken }) => {
          if (!accountId || !accessToken || !store.applicationId()) {
            return of([]);
          }
          return wargamingApi
            .getTanksStatistics(store.applicationId(), accountId, accessToken)
            .pipe(
              switchMap(playerTanks => {
                if (playerTanks.length === 0) {
                  return of([]);
                }
                const tankIds = playerTanks.map(t => t.tank_id);
                return wargamingApi
                  .getShortTanksInfo(store.applicationId(), tankIds)
                  .pipe(map(vehicles => mapTanksWithVehicles(playerTanks, vehicles)));
              }),
              tapResponse({
                next: playerTanks => patchState(store, () => ({ playerTanks })),
                error: err => {
                  patchState(store, () => ({ playerTanks: [] }));
                  console.error(err);
                },
              }),
            );
        }),
      ),
    ),
  })),
);

const mapTanksWithVehicles = (tanks: VehicleData[], vehicles: Vehicle[]): VehicleData[] =>
  tanks.map(tank => {
    tank.vehicleInfo = vehicles.find(v => v.tank_id === tank.tank_id);
    return tank;
  });
