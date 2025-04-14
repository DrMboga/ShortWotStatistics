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
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { exhaustMap, of, pipe, switchMap } from 'rxjs';
import { tapResponse } from '@ngrx/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { WargamingApiService } from '../services/wargaming-api.service';
import { WotPlayerPersonalData } from '../model/wargaming/wotPlayerPersonalData';

type AccountState = {
  applicationId: string;
  accountId: string;
  accountNickName: string;
  accessToken?: string;
  accessTokenExpires?: number;
  games: string[];
  wotPlayerPrivateInfo?: WotPlayerPersonalData;
  blitzPlayerPrivateInfo?: WotPlayerPersonalData;
};

const initialState: AccountState = {
  applicationId: '',
  accountId: '',
  accountNickName: '',
  accessToken: '',
  accessTokenExpires: 0,
  games: [],
  wotPlayerPrivateInfo: undefined,
  blitzPlayerPrivateInfo: undefined,
};

export const AccountStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withHooks({
    onInit(store, indexedDb = inject(IndexedDBService)) {
      indexedDb
        .getAccountsAuthInfo()
        .pipe(takeUntilDestroyed())
        .subscribe(accountAuthInfo => {
          if (accountAuthInfo.length > 0) {
            patchState(store, () => ({
              applicationId: accountAuthInfo[0].applicationId,
              accountId: accountAuthInfo[0].accountId,
              accountNickName: accountAuthInfo[0].accountNickName,
              accessToken: accountAuthInfo[0].accessToken,
              accessTokenExpires: accountAuthInfo[0].accessTokenExpires,
              games: accountAuthInfo[0].games ?? [],
            }));
          }
        });
    },
  }),
  withComputed(({ accessTokenExpires }) => ({
    loggedIn: computed(() => {
      if (accessTokenExpires) {
        const expiration = +(accessTokenExpires() ?? 0);
        const currentDate = new Date().getTime();
        return expiration * 1000 > currentDate;
      }
      return false;
    }),
  })),
  withMethods(
    (store, indexedDb = inject(IndexedDBService), wargamingApi = inject(WargamingApiService)) => ({
      setApplicationId: rxMethod<string>(
        pipe(
          switchMap(applicationId => {
            return indexedDb.saveApplicationId(applicationId).pipe(
              tapResponse({
                next: () => patchState(store, () => ({ applicationId })),
                error: err => {
                  patchState(store, () => ({ applicationId: '' }));
                  console.error(err);
                },
              }),
            );
          }),
        ),
      ),
      setAuthenticationInfo: rxMethod<{
        accountId?: string;
        accountNickName?: string;
        accessToken?: string;
        accessTokenExpires?: string;
      }>(
        pipe(
          switchMap(({ accountId, accountNickName, accessToken, accessTokenExpires }) => {
            return indexedDb
              .saveAuthenticationInfo(accountId, accountNickName, accessToken, accessTokenExpires)
              .pipe(
                tapResponse({
                  next: () =>
                    patchState(store, () => ({
                      accountId,
                      accountNickName,
                      accessToken,
                      accessTokenExpires: +(accessTokenExpires ?? 0),
                    })),
                  error: err => {
                    patchState(store, () => ({
                      accountId: '',
                      accountNickName: '',
                      accessToken: undefined,
                      accessTokenExpires: undefined,
                    }));
                    console.error(err);
                  },
                }),
              );
          }),
        ),
      ),
      setAccountGamesInfo: rxMethod<string[]>(
        pipe(
          switchMap(games => {
            return indexedDb.saveGamesInfo(store.accountId(), games).pipe(
              tapResponse({
                next: () => patchState(store, () => ({ games })),
                error: err => {
                  patchState(store, () => ({ games: [] }));
                  console.error(err);
                },
              }),
            );
          }),
        ),
      ),
      setWotPlayerPrivateInfo: rxMethod<void>(
        pipe(
          exhaustMap(() => {
            const applicationId = store.applicationId();
            const accountId = store.accountId();
            const accessToken = store.accessToken ? store.accessToken() : undefined;

            if (applicationId && accountId && accessToken) {
              return wargamingApi
                .getPlayerPersonalData(applicationId, accountId, accessToken, false)
                .pipe(
                  tapResponse({
                    next: wotPlayerPrivateInfo =>
                      patchState(store, () => ({ wotPlayerPrivateInfo })),
                    error: err => {
                      patchState(store, () => ({ wotPlayerPrivateInfo: undefined }));
                      console.error(err);
                    },
                  }),
                );
            } else {
              return of(undefined);
            }
          }),
        ),
      ),
      setBlitzPlayerPrivateInfo: rxMethod<void>(
        pipe(
          exhaustMap(() => {
            const applicationId = store.applicationId();
            const accountId = store.accountId();
            const accessToken = store.accessToken ? store.accessToken() : undefined;

            if (applicationId && accountId && accessToken) {
              return wargamingApi
                .getPlayerPersonalData(applicationId, accountId, accessToken, true)
                .pipe(
                  tapResponse({
                    next: blitzPlayerPrivateInfo =>
                      patchState(store, () => ({ blitzPlayerPrivateInfo })),
                    error: err => {
                      patchState(store, () => ({ blitzPlayerPrivateInfo: undefined }));
                      console.error(err);
                    },
                  }),
                );
            } else {
              return of(undefined);
            }
          }),
        ),
      ),
    }),
  ),
);
