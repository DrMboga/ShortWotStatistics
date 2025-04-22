import { TankopediaAchievement } from '../model/wargaming/tankopedia-achievement';
import { PlayerAchievement } from '../model/player-achievement';
import { patchState, signalStore, withHooks, withMethods, withState } from '@ngrx/signals';
import { inject } from '@angular/core';
import { WargamingApiService } from '../services/wargaming-api.service';
import { IndexedDBService } from '../indexedDb/indexed-db.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { map, of, pipe, switchMap } from 'rxjs';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tapResponse } from '@ngrx/operators';

type AchievementState = {
  applicationId: string;
  tankopedia: TankopediaAchievement[];
  wotPlayerAchievements: PlayerAchievement[];
};

const initialState: AchievementState = {
  applicationId: '',
  tankopedia: [],
  wotPlayerAchievements: [],
};

export const AchievementsStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withHooks({
    onInit(store, indexedDb = inject(IndexedDBService), wotApi = inject(WargamingApiService)) {
      indexedDb
        .getAccountsAuthInfo()
        .pipe(
          takeUntilDestroyed(),
          switchMap(accountAuthInfo => {
            if (accountAuthInfo.length > 0 && accountAuthInfo[0].applicationId) {
              patchState(store, { applicationId: accountAuthInfo[0].applicationId });
              return wotApi.getTankopediaAchievements(accountAuthInfo[0].applicationId);
            }
            return of(undefined);
          }),
        )
        .subscribe(tankopedia => patchState(store, () => ({ tankopedia })));
    },
  }),
  withMethods((store, wargamingApi = inject(WargamingApiService)) => ({
    getPlayerAchievements: rxMethod<string>(
      pipe(
        switchMap(accountId => {
          if (!store.applicationId()) {
            return of([]);
          }
          return wargamingApi.getPlayerAchievements(store.applicationId(), accountId).pipe(
            map(playerAchievements => {
              const result: PlayerAchievement[] = [];
              for (const playerAchievement of playerAchievements) {
                const achievementInfo = store
                  .tankopedia()
                  .find(t => t.name === playerAchievement.name);
                if (achievementInfo) {
                  result.push({
                    name: achievementInfo.name,
                    count: playerAchievement.count,
                    section: achievementInfo.section,
                    sectionOrder: achievementInfo.section_order,
                    order: achievementInfo.order,
                    localizedName: achievementInfo.name_i18n,
                    image: achievementInfo.image,
                    imageBig: achievementInfo.image_big,
                    description: achievementInfo.description,
                    condition: achievementInfo.condition,
                  } as PlayerAchievement);
                }
              }

              const epic = result
                .filter(a => a.section === 'epic')
                .sort((a, b) => a.order - b.order);
              const battle = result
                .filter(a => a.section === 'battle')
                .sort((a, b) => a.order - b.order);
              const group = result
                .filter(a => a.section === 'group')
                .sort((a, b) => a.order - b.order);
              const special = result
                .filter(a => a.section === 'special')
                .sort((a, b) => a.order - b.order);

              return [...epic, ...battle, ...group, ...special];
            }),
            tapResponse({
              next: wotPlayerAchievements => patchState(store, () => ({ wotPlayerAchievements })),
              error: err => {
                patchState(store, () => ({ wotPlayerAchievements: [] }));
                console.error(err);
              },
            }),
          );
        }),
      ),
    ),
  })),
);
