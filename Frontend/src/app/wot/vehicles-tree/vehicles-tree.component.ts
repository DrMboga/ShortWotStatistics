import { Component, computed, inject, signal } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { NationFlagPipe } from '../../pipes/nation-flag.pipe';
import { AccountStore } from '../../store/account.store';
import { WargamingApiService } from '../../services/wargaming-api.service';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { of, switchMap } from 'rxjs';
import { buildTree } from './helpers/tree-helper';
import { TanksByTierPipe } from './pipes/tanks-by-tier.pipe';
import { VehicleTypePipe } from '../../pipes/vehicle-type.pipe';
import { VehicleLevelPipe } from '../../pipes/vehicle-level.pipe';
import { DecimalPipe } from '@angular/common';
import { MasteryPipe } from '../../pipes/mastery.pipe';
import { ScaleColorPipe } from '../../pipes/scale-color.pipe';

@Component({
  selector: 'app-vehicles-tree',
  imports: [
    MatButton,
    NationFlagPipe,
    TanksByTierPipe,
    VehicleTypePipe,
    VehicleLevelPipe,
    DecimalPipe,
    MasteryPipe,
    ScaleColorPipe,
  ],
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

  readonly tiers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  public readonly cardWidth = 200;
  public readonly cardHeight = 120;
  public readonly leftMargin = 30;
  public readonly frameHeight = 9 * (this.cardHeight + 20) + 20;

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

  readonly tanksTreeItems = computed(() =>
    buildTree(this.tankopedia() ?? [], this.playerTanks() ?? []),
  );
}
