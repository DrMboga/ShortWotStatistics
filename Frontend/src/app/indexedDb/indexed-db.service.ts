import { Injectable } from '@angular/core';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { catchError, map, Observable, of, switchMap } from 'rxjs';
import { AccountAuthenticationInfo } from '../model/account-authentication-info';
import {
  BLITZ_PLAYER_HISTORY_COLLECTION_NAME,
  WG_ACCOUNT_AUTH_COLLECTION_NAME,
  WOT_PLAYER_HISTORY_COLLECTION_NAME,
} from './db-config';
import { PlayerHistory } from '../model/player-history';

@Injectable({
  providedIn: 'root',
})
export class IndexedDBService {
  constructor(private readonly dbService: NgxIndexedDBService) {}

  public getAccountsAuthInfo(): Observable<AccountAuthenticationInfo[]> {
    return this.dbService.getAll(WG_ACCOUNT_AUTH_COLLECTION_NAME).pipe(
      map((authInfo: any[]) => {
        return authInfo.map(authInfoItem => ({
          applicationId: authInfoItem.applicationId,
          accountId: authInfoItem.accountId,
          accountNickName: authInfoItem.nickname,
          accessToken: authInfoItem.accessToken,
          accessTokenExpires: +authInfoItem?.expires,
          games: authInfoItem.games,
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

  public saveGamesInfo(accountId: string, games: string[]): Observable<void> {
    return this.dbService.getAll(WG_ACCOUNT_AUTH_COLLECTION_NAME).pipe(
      switchMap((authInfo: any[]) => {
        const authInfoItem = authInfo.find(a => a.accountId === accountId);
        if (authInfoItem) {
          authInfoItem.games = games;
          return this.dbService.update(WG_ACCOUNT_AUTH_COLLECTION_NAME, authInfoItem);
        }
        return of();
      }),
    );
  }

  public getWotPlayerHistory(accountId: number): Observable<PlayerHistory[]> {
    return this.dbService
      .getAllByIndex(WOT_PLAYER_HISTORY_COLLECTION_NAME, 'accountId', accountId)
      .pipe(
        map((history: any[]) => {
          return history.map(mapDbDataToPlayerHistory);
        }),
      );
  }
  public getBlitzPlayerHistory(accountId: number): Observable<PlayerHistory[]> {
    return this.dbService
      .getAllByIndex(BLITZ_PLAYER_HISTORY_COLLECTION_NAME, 'accountId', accountId)
      .pipe(
        map((history: any[]) => {
          return history.map(mapDbDataToPlayerHistory);
        }),
      );
  }

  public addNewWotHistoryDataRow(historyRow: PlayerHistory): Observable<void> {
    return this.dbService.add(WOT_PLAYER_HISTORY_COLLECTION_NAME, historyRow).pipe(map(() => {}));
  }
  public addNewBlitzHistoryDataRow(historyRow: PlayerHistory): Observable<void> {
    return this.dbService.add(BLITZ_PLAYER_HISTORY_COLLECTION_NAME, historyRow).pipe(map(() => {}));
  }
}

const mapDbDataToPlayerHistory = (historyItem: any) =>
  ({
    accountId: +historyItem.accountId,
    lastBattle: +historyItem.lastBattle,
    gold: +historyItem.gold,
    freeXp: +historyItem.freeXp,
    credits: +historyItem?.credits,
    battles: +historyItem.battles,
    winRate: +historyItem.winRate,
    damage: +historyItem.damage,
    xp: +historyItem.xp,
    survival: +historyItem.survival,
    battleLifeTime: +historyItem.battleLifeTime,
  }) as PlayerHistory;
