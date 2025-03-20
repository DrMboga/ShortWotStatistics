import { Component, effect, OnDestroy, OnInit, signal, Signal } from '@angular/core';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { IndexedDBService } from '../indexedDb/indexed-db.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { AccountAuthenticationInfo } from '../model/account-authentication-info';
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

  accountsAuthInfo: Signal<AccountAuthenticationInfo[] | undefined>;

  constructor(private indexedDb: IndexedDBService) {
    this.accountsAuthInfo = toSignal(indexedDb.getAccountsAuthInfo());

    effect(() => {
      const refreshed = this.refreshData();
      this.indexedDb
        .getAccountsAuthInfo()
        .pipe(takeUntil(this.destroy$))
        .subscribe(authIno => {
          if (authIno.length > 0) {
            this.wgApplicationId = authIno[0].applicationId;
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

  public logIn() {}
}
