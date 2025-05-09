import { Component, effect, inject, input } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { map, mergeMap, of } from 'rxjs';
import { IndexedDBService } from '../../indexedDb/indexed-db.service';
import { PlayerHistory } from '../../model/player-history';
import { BaseChartDirective } from 'ng2-charts';
import { chartOptions } from '../../helpers/chart-helper';

const MAX_HISTORY_LENGTH = 10;

const historyMap = map((history: PlayerHistory[]) =>
  history.sort((a, b) => b.lastBattle - a.lastBattle).slice(0, MAX_HISTORY_LENGTH),
);

const dateString = (date: number): string => {
  const dateDate = new Date(date);
  return `${dateDate.getDate().toString().padStart(2, '0')}.${dateDate.getMonth().toString().padStart(2, '0')}.${dateDate.getFullYear()}`;
};

@Component({
  selector: 'app-player-history',
  imports: [BaseChartDirective],
  templateUrl: './player-history.component.html',
  styleUrl: './player-history.component.css',
})
export class PlayerHistoryComponent {
  accountId = input<number>();
  isBlitz = input<boolean>();

  private readonly db = inject(IndexedDBService);

  private readonly history$ = toObservable(this.accountId).pipe(
    mergeMap(accountId => {
      if (accountId && this.isBlitz() !== undefined) {
        if (this.isBlitz()) {
          return this.db.getBlitzPlayerHistory(accountId).pipe(historyMap);
        }
        return this.db.getWotPlayerHistory(accountId).pipe(historyMap);
      }
      return of([]);
    }),
  );

  history = toSignal(this.history$);

  winRateData: any = undefined;
  winRateOptions = chartOptions('Winrate');

  damageData: any = undefined;
  damageOptions = chartOptions('Damage');

  xpData: any = undefined;
  xpOptions = chartOptions('XP');

  constructor() {
    effect(() => {
      const historyData = this.history()?.sort((a, b) => a.lastBattle - b.lastBattle);
      const labels = historyData?.map(h => dateString(h.lastBattle * 1000)) ?? [];

      const winRates = historyData?.map(h => 100 * h.winRate) ?? [];
      this.winRateData = {
        datasets: [
          {
            data: winRates,
            backgroundColor: '#36a2eb',
            borderColor: '#36a2eb',
            tension: 0.3,
          },
        ],
        labels,
      };

      const damage = historyData?.map(h => h.damage) ?? [];
      this.damageData = {
        datasets: [
          {
            data: damage,
            backgroundColor: '#468c48',
            borderColor: '#468c48',
            tension: 0.3,
          },
        ],
        labels,
      };

      const xp = historyData?.map(h => h.xp) ?? [];
      this.xpData = {
        datasets: [
          {
            data: xp,
            backgroundColor: 'rgb(204, 207, 62)',
            borderColor: 'rgb(204, 207, 62)',
            tension: 0.3,
          },
        ],
        labels,
      };
    });
  }
}
