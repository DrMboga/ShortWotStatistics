import { Injectable } from '@angular/core';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { map, Observable, switchMap } from 'rxjs';
import { AccountAuthenticationInfo } from '../model/account-authentication-info';
import { WG_ACCOUNT_AUTH_COLLECTION_NAME } from './db-config';

@Injectable({
  providedIn: 'root',
})
export class IndexedDBService {
  constructor(private dbService: NgxIndexedDBService) {}

  public getAccountsAuthInfo(): Observable<AccountAuthenticationInfo[]> {
    return this.dbService.getAll(WG_ACCOUNT_AUTH_COLLECTION_NAME).pipe(
      map((authInfo: any[]) => {
        return authInfo.map(authInfoItem => ({
          applicationId: authInfoItem.applicationId,
          accountId: authInfoItem.accountId,
          accountNickName: authInfoItem.nickname,
          accessToken: authInfoItem.accessToken,
          accessTokenExpires: +authInfoItem?.expires,
        }));
      }),
    );
  }

  public saveApplicationId(applicationId: string): Observable<void> {
    return this.dbService.getAll(WG_ACCOUNT_AUTH_COLLECTION_NAME).pipe(
      switchMap((authInfo: any[]) => {
        if (authInfo.length === 0) {
          return this.dbService.add(WG_ACCOUNT_AUTH_COLLECTION_NAME, {
            applicationId,
          });
        } else {
          const authInfoItem = authInfo[0];
          authInfoItem.applicationId = applicationId;
          return this.dbService.update(WG_ACCOUNT_AUTH_COLLECTION_NAME, authInfoItem);
        }
      }),
    );
  }

  public saveAuthenticationInfo(
    accountId?: string,
    accountNickName?: string,
    accessToken?: string,
    accessTokenExpires?: string,
  ): Observable<void> {
    return this.dbService.getAll(WG_ACCOUNT_AUTH_COLLECTION_NAME).pipe(
      switchMap((authInfo: any[]) => {
        if (authInfo.length === 0) {
          return this.dbService.add(WG_ACCOUNT_AUTH_COLLECTION_NAME, {
            accountId,
            accountNickName,
            accessToken,
            accessTokenExpires,
          });
        } else {
          const authInfoItem = authInfo[0];
          authInfoItem.accountId = accountId;
          authInfoItem.nickname = accountNickName;
          authInfoItem.accessToken = accessToken;
          authInfoItem.expires = accessTokenExpires;
          return this.dbService.update(WG_ACCOUNT_AUTH_COLLECTION_NAME, authInfoItem);
        }
      }),
    );
  }
}
