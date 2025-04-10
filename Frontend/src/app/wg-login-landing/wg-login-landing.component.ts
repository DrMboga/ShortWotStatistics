import { Component, effect, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map, of, Subject, switchMap, takeUntil } from 'rxjs';
import { AccountStore } from '../store/account.store';
import { WargamingApiService } from '../services/wargaming-api.service';

@Component({
  selector: 'app-wg-login-landing',
  imports: [],
  templateUrl: './wg-login-landing.component.html',
  styleUrl: './wg-login-landing.component.css',
})
export class WgLoginLandingComponent implements OnDestroy {
  public readonly accountStore = inject(AccountStore);
  private readonly wgApi = inject(WargamingApiService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  private readonly destroy$ = new Subject<void>();
  constructor() {
    effect(() => {
      if (this.accountStore.applicationId()) {
        this.route.queryParams
          .pipe(
            takeUntil(this.destroy$),
            switchMap(params => {
              const status = params['status'] as string;
              const accessToken = params['access_token'] as string;
              const accountNickName = params['nickname'] as string;
              const accountId = params['account_id'] as string;
              const accessTokenExpires = params['expires_at'] as string;
              if (status === 'ok') {
                this.accountStore.setAuthenticationInfo({
                  accountId,
                  accountNickName,
                  accessToken,
                  accessTokenExpires,
                });

                return this.wgApi
                  .getCommonAccountInfo(this.accountStore.applicationId(), accountId, accessToken)
                  .pipe(
                    map(accountInfo => {
                      this.accountStore.setAccountGamesInfo(accountInfo.games);
                    }),
                  );
              } else {
                return of();
              }
            }),
          )
          .subscribe(() => {
            this.router.navigate(['']).then(() => {});
          });
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
