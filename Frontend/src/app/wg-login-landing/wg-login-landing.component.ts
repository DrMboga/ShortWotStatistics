import { Component, Signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, Observable } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-wg-login-landing',
  imports: [JsonPipe],
  templateUrl: './wg-login-landing.component.html',
  styleUrl: './wg-login-landing.component.css',
})
export class WgLoginLandingComponent {
  private readonly loginParams$: Observable<{
    status: string;
    accessToken: string;
    nickname: string;
    accountId: number;
    expiresAt: number;
  }>;

  public loginParams: Signal<
    | {
        status: string;
        accessToken: string;
        nickname: string;
        accountId: number;
        expiresAt: number;
      }
    | undefined
  >;

  constructor(private readonly route: ActivatedRoute) {
    this.loginParams$ = this.route.queryParams.pipe(
      map(params => ({
        status: params['status'] as string,
        accessToken: params['access_token'] as string,
        nickname: params['nickname'] as string,
        accountId: +params['account_id'],
        expiresAt: +params['expires_at'],
      })),
    );

    this.loginParams = toSignal(this.loginParams$);
  }
}
