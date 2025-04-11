import { Component, effect, inject, OnDestroy } from '@angular/core';
import { AccountStore } from '../../store/account.store';
import { Subject, takeUntil, tap } from 'rxjs';
import { WargamingApiService } from '../../services/wargaming-api.service';
import { WotPlayerPersonalData } from '../../model/wargaming/wotPlayerPersonalData';
import { DatePipe, DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-wot-account-overview',
  imports: [DatePipe, DecimalPipe],
  templateUrl: './wot-account-overview.component.html',
  styleUrl: './wot-account-overview.component.css',
})
export class WotAccountOverviewComponent implements OnDestroy {
  private readonly destroy$ = new Subject<void>();
  readonly accountStore = inject(AccountStore);
  readonly wargamingApi = inject(WargamingApiService);
  wotPlayerPersonalData?: WotPlayerPersonalData;

  constructor() {
    effect(() => {
      const applicationId = this.accountStore.applicationId();
      const accountId = this.accountStore.accountId();
      const accessToken = this.accountStore.accessToken
        ? this.accountStore.accessToken()
        : undefined;

      if (applicationId && accountId && accessToken) {
        this.wargamingApi
          .getPlayerPersonalData(applicationId, accountId, accessToken)
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
