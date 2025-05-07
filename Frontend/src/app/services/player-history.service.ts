import { inject, Injectable } from '@angular/core';
import { WotPlayerPersonalData } from '../model/wargaming/wotPlayerPersonalData';
import { Observable, of, switchMap } from 'rxjs';
import { IndexedDBService } from '../indexedDb/indexed-db.service';
import { PlayerHistory } from '../model/player-history';

@Injectable({
  providedIn: 'root',
})
export class PlayerHistoryService {
  private readonly db = inject(IndexedDBService);

  public saveNewWotData(playerData: WotPlayerPersonalData): Observable<void> {
    const accountId = playerData.account_id;
    return this.db.getWotPlayerHistory(accountId).pipe(
      switchMap(playerHistory => {
        if (isThereANewData(playerData.last_battle_time, playerHistory)) {
          return this.db.addNewWotHistoryDataRow(convertPlayerDataToHistoryRow(playerData));
        }
        return of(void 0);
      }),
    );
  }

  public saveNewBlitzData(playerData: WotPlayerPersonalData): Observable<void> {
    const accountId = playerData.account_id;
    return this.db.getBlitzPlayerHistory(accountId).pipe(
      switchMap(playerHistory => {
        if (isThereANewData(playerData.last_battle_time, playerHistory)) {
          return this.db.addNewBlitzHistoryDataRow(convertPlayerDataToHistoryRow(playerData));
        }

        return of(void 0);
      }),
    );
  }
}

const isThereANewData = (lastBattleTime: number, playerHistory: PlayerHistory[]): boolean => {
  let newData = playerHistory.length === 0;
  if (!newData) {
    const lastBattle = playerHistory.sort((h1, h2) => h2.lastBattle - h1.lastBattle)[0].lastBattle;
    newData = lastBattle < lastBattleTime;
  }
  return newData;
};

const convertPlayerDataToHistoryRow = (playerData: WotPlayerPersonalData): PlayerHistory => {
  return {
    accountId: playerData.account_id,
    lastBattle: playerData.last_battle_time,
    gold: playerData.private?.gold ?? 0,
    freeXp: playerData.private?.free_xp ?? 0,
    credits: playerData.private?.credits ?? 0,
    battles: playerData.statistics?.all?.battles ?? 0,
    winRate: playerData.statistics?.all?.battles
      ? playerData.statistics?.all?.wins / playerData.statistics.all.battles
      : 0,
    damage: playerData.statistics?.all?.battles
      ? playerData.statistics?.all?.damage_dealt / playerData.statistics.all.battles
      : 0,
    xp: playerData.statistics?.all?.battles
      ? playerData.statistics?.all?.xp / playerData.statistics.all.battles
      : 0,
    survival: playerData.statistics?.all?.battles
      ? playerData.statistics?.all?.survived_battles / playerData.statistics.all.battles
      : 0,
    battleLifeTime:
      playerData.private?.battle_life_time && playerData.statistics?.all?.battles
        ? playerData.private.battle_life_time / playerData.statistics.all.battles
        : 0,
  };
};
