import { Component, inject, input } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { map, mergeMap, of } from 'rxjs';
import { IndexedDBService } from '../../indexedDb/indexed-db.service';
import { PlayerHistory } from '../../model/player-history';
import { DatePipe } from '@angular/common';

const MAX_HISTORY_LENGTH = 10;

const historyMap = map((history: PlayerHistory[]) =>
  history.sort((a, b) => b.lastBattle - a.lastBattle).slice(0, MAX_HISTORY_LENGTH),
);

@Component({
  selector: 'app-player-history',
  imports: [DatePipe],
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
}
