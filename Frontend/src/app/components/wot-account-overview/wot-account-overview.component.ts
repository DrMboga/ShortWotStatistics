import { Component, effect, inject, input, OnDestroy } from '@angular/core';
import { AccountStore } from '../../store/account.store';
import { Subject, takeUntil, tap } from 'rxjs';
import { WargamingApiService } from '../../services/wargaming-api.service';
import { WotPlayerPersonalData } from '../../model/wargaming/wotPlayerPersonalData';
import { DatePipe, DecimalPipe } from '@angular/common';
import { AverageBattleLifeTimePipe } from '../../pipes/average-battle-life-time.pipe';

@Component({
  selector: 'app-wot-account-overview',
  imports: [DatePipe, DecimalPipe, AverageBattleLifeTimePipe],
  templateUrl: './wot-account-overview.component.html',
  styleUrl: './wot-account-overview.component.css',
})
export class WotAccountOverviewComponent implements OnDestroy {
  private readonly destroy$ = new Subject<void>();
  readonly accountStore = inject(AccountStore);
  readonly wargamingApi = inject(WargamingApiService);
  wotPlayerPersonalData?: WotPlayerPersonalData;

  isBlitz = input.required<boolean>();

  constructor() {
    effect(() => {
      const applicationId = this.accountStore.applicationId();
      const accountId = this.accountStore.accountId();
      const accessToken = this.accountStore.accessToken
        ? this.accountStore.accessToken()
        : undefined;

      if (applicationId && accountId && accessToken) {
        this.wargamingApi
          .getPlayerPersonalData(applicationId, accountId, accessToken, this.isBlitz())
          .pipe(
            takeUntil(this.destroy$),
            tap(playerInfo => {
              this.wotPlayerPersonalData = playerInfo;
            }),
          )
          .subscribe();
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
