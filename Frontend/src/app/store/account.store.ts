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
import { pipe, switchMap } from 'rxjs';
import { tapResponse } from '@ngrx/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

type AccountState = {
  applicationId: string;
  accountId: string;
  accountNickName: string;
  accessToken?: string;
  accessTokenExpires?: number;
};

const initialState: AccountState = {
  applicationId: '',
  accountId: '',
  accountNickName: '',
  accessTokenExpires: 0,
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
  withMethods((store, indexedDb = inject(IndexedDBService)) => ({
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
  })),
);
