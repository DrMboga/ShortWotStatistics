import { Component, effect, OnDestroy, OnInit, signal, Signal } from '@angular/core';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { IndexedDBService } from '../indexedDb/indexed-db.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-account',
  imports: [MatFormField, MatLabel, MatInput, MatButton, FormsModule],
  templateUrl: './account.component.html',
  styleUrl: './account.component.css',
})
export class AccountComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private refreshData = signal<boolean>(false);

  wgApplicationId: string | undefined = undefined;
  nickName: string | undefined = undefined;
  accountId: string | undefined = undefined;
  token: string | undefined = undefined;
  expiration: number | undefined = undefined;
  tokenExpired: boolean = true;

  constructor(private indexedDb: IndexedDBService) {
    effect(() => {
      const refreshed = this.refreshData();
      this.indexedDb
        .getAccountsAuthInfo()
        .pipe(takeUntil(this.destroy$))
        .subscribe(authIno => {
          if (authIno.length > 0) {
            this.wgApplicationId = authIno[0].applicationId;
            this.nickName = authIno[0].accountNickName;
            this.accountId = authIno[0].accountId;
            this.token = authIno[0].accessToken;
            this.expiration = +(authIno[0].accessTokenExpires ?? 0);
            if (this.expiration) {
              const currentDate = new Date().getTime();
              this.tokenExpired = this.expiration * 1000 <= currentDate;
            }
          }
        });
    });
  }

  ngOnInit(): void {
    this.refreshData.set(!this.refreshData());
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public saveApplicationId() {
    if (this.wgApplicationId) {
      this.indexedDb
        .saveApplicationId(this.wgApplicationId)
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => this.refreshData.set(!this.refreshData()));
    }
  }

  public logIn() {
    const baseUri = window.location.origin;
    // Redirect to Wargaming login page
    const url = `https://api.worldoftanks.eu/wot/auth/login/?application_id=${this.wgApplicationId}&redirect_uri=${baseUri}/login`;
    // http://localhost:4200/login?status=ok&access_token=6d5a9176ea46f4419c2f29ff5e0bea8107e00bda&nickname=mboga&account_id=571050560&expires_at=1743691243
    window.location.href = url;
  }
}
