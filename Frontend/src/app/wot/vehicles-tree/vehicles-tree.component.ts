import { Component, computed, effect, inject, signal } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { NationFlagPipe } from '../../pipes/nation-flag.pipe';
import { AccountStore } from '../../store/account.store';
import { WargamingApiService } from '../../services/wargaming-api.service';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { of, switchMap } from 'rxjs';

@Component({
  selector: 'app-vehicles-tree',
  imports: [MatButton, NationFlagPipe],
  templateUrl: './vehicles-tree.component.html',
  styleUrl: './vehicles-tree.component.css',
})
export class VehiclesTreeComponent {
  readonly nations = [
    'italy',
    'usa',
    'czech',
    'poland',
    'france',
    'sweden',
    'ussr',
    'china',
    'uk',
    'japan',
    'germany',
  ];

  readonly accountStore = inject(AccountStore);
  readonly wotApi = inject(WargamingApiService);

  currentNation = signal<string>(this.nations[0]);

  private readonly accountLoginInfo = computed<{
    applicationId: string;
    accountId: string;
    accessToken: string;
  }>(() => {
    if (
      this.accountStore.applicationId() &&
      this.accountStore.accountId() &&
      this.accountStore.accessToken &&
      this.accountStore.accessToken()
    ) {
      return {
        applicationId: this.accountStore.applicationId(),
        accountId: this.accountStore.accountId(),
        accessToken: this.accountStore.accessToken() ?? '',
      };
    }
    return {
      applicationId: '',
      accountId: '',
      accessToken: '',
    };
  });

  readonly playerTanks = toSignal(
    toObservable(this.accountLoginInfo).pipe(
      switchMap(loginInfo => {
        if (loginInfo.applicationId && loginInfo.accountId && loginInfo.accessToken) {
          return this.wotApi.getTanksStatistics(
            loginInfo.applicationId,
            loginInfo.accountId,
            loginInfo.accessToken,
          );
        }
        return of([]);
      }),
    ),
  );

  private readonly tankopediaRequestParameters = computed(() => ({
    applicationId: this.accountLoginInfo().applicationId,
    nation: this.currentNation(),
  }));

  readonly tankopedia = toSignal(
    toObservable(this.tankopediaRequestParameters).pipe(
      switchMap(params => {
        if (!params.applicationId) {
          return of([]);
        }
        return this.wotApi.getTreeTanksInfo(params.applicationId, params.nation);
      }),
    ),
  );
}
