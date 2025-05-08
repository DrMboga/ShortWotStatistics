import { Component, computed, input } from '@angular/core';
import { WotPlayerPersonalData } from '../../model/wargaming/wotPlayerPersonalData';
import { MatTableModule } from '@angular/material/table';
import { DatePipe, DecimalPipe } from '@angular/common';
import { ScaleColorPipe } from '../../pipes/scale-color.pipe';
import { AverageBattleLifeTimePipe } from '../../pipes/average-battle-life-time.pipe';
import { PlayerHistory } from '../../model/player-history';
import { HistoryItemSignPipe } from '../../pipes/history-item-sign.pipe';
import { HistoryItemColorPipe } from '../../pipes/history-item-color.pipe';

@Component({
  selector: 'app-statistics-table',
  imports: [
    MatTableModule,
    DatePipe,
    DecimalPipe,
    ScaleColorPipe,
    AverageBattleLifeTimePipe,
    HistoryItemSignPipe,
    HistoryItemColorPipe,
  ],
  templateUrl: './statistics-table.component.html',
  styleUrl: './statistics-table.component.css',
})
export class StatisticsTableComponent {
  playerInfo = input<WotPlayerPersonalData>();
  playerHistory = input<PlayerHistory[]>();

  previousSessionData = computed(() => {
    const history = this.playerHistory();
    if (history?.length === 0) {
      return undefined;
    }
    const lastBattle = this.playerInfo()?.last_battle_time;
    if (!lastBattle) {
      return undefined;
    }
    return history?.find(h => h.lastBattle < lastBattle);
  });

  battlesDiff = computed(() => {
    const previousBattles = this.previousSessionData()?.battles;
    const currentBattles = this.playerInfo()?.statistics?.all?.battles;
    if (previousBattles && currentBattles) {
      return currentBattles - previousBattles;
    }
    return undefined;
  });

  winRateDiff = computed(() => {
    const previousWinRate = this.previousSessionData()?.winRate;
    const currentBattles = this.playerInfo()?.statistics?.all?.battles;
    if (previousWinRate && currentBattles) {
      const currentWinRate =
        (100 * (this.playerInfo()?.statistics?.all?.wins ?? 0)) / currentBattles;
      return currentWinRate - 100 * previousWinRate;
    }
    return undefined;
  });

  survivalDiff = computed(() => {
    const previousSurvival = this.previousSessionData()?.survival;
    const currentBattles = this.playerInfo()?.statistics?.all?.battles;
    if (previousSurvival && currentBattles) {
      const currentSurvival =
        (100 * (this.playerInfo()?.statistics?.all?.survived_battles ?? 0)) / currentBattles;
      return currentSurvival - 100 * previousSurvival;
    }
    return undefined;
  });

  damageDiff = computed(() => {
    const previousDamage = this.previousSessionData()?.damage;
    const currentBattles = this.playerInfo()?.statistics?.all?.battles;
    if (previousDamage && currentBattles) {
      const currentDamage =
        (this.playerInfo()?.statistics?.all?.damage_dealt ?? 0) / currentBattles;
      return currentDamage - previousDamage;
    }
    return undefined;
  });

  xpDiff = computed(() => {
    const previousXp = this.previousSessionData()?.xp;
    const currentBattles = this.playerInfo()?.statistics?.all?.battles;
    if (previousXp && currentBattles) {
      const currentXp = (this.playerInfo()?.statistics?.all?.xp ?? 0) / currentBattles;
      return currentXp - previousXp;
    }
    return undefined;
  });
}
