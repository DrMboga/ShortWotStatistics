import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil, tap } from 'rxjs';
import { AccountStore } from '../store/account.store';

@Component({
  selector: 'app-wg-login-landing',
  imports: [],
  templateUrl: './wg-login-landing.component.html',
  styleUrl: './wg-login-landing.component.css',
})
export class WgLoginLandingComponent implements OnInit, OnDestroy {
  private readonly accountStore = inject(AccountStore);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  private readonly destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.route.queryParams
      .pipe(
        takeUntil(this.destroy$),
        tap(params => {
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
          }
        }),
      )
      .subscribe(() => {
        this.router.navigate(['']).then(() => {});
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
