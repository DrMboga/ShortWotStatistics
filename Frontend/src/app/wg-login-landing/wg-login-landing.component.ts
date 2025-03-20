import { Component, OnDestroy, OnInit, Signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, switchMap, takeUntil } from 'rxjs';
import { IndexedDBService } from '../indexedDb/indexed-db.service';

@Component({
  selector: 'app-wg-login-landing',
  imports: [],
  templateUrl: './wg-login-landing.component.html',
  styleUrl: './wg-login-landing.component.css',
})
export class WgLoginLandingComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  constructor(
    private readonly route: ActivatedRoute,
    private readonly indexedDb: IndexedDBService,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    this.route.queryParams
      .pipe(
        takeUntil(this.destroy$),
        switchMap(params => {
          const status = params['status'] as string;
          const accessToken = params['access_token'] as string;
          const nickname = params['nickname'] as string;
          const accountId = params['account_id'] as string;
          const expiresAt = params['expires_at'] as string;
          return this.indexedDb.saveAuthenticationInfo(accountId, nickname, accessToken, expiresAt);
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
