import { Component, computed, effect, inject } from '@angular/core';
import { AccountStore } from '../../store/account.store';
import { StatisticsTableComponent } from '../../components/statistics-table/statistics-table.component';
import { WotPlayerAchievementsComponent } from '../wot-player-achievements/wot-player-achievements.component';
import { TanksStore } from '../../store/tanks.store';

@Component({
  selector: 'app-wot-account',
  imports: [StatisticsTableComponent, WotPlayerAchievementsComponent],
  templateUrl: './wot-account.component.html',
  styleUrl: './wot-account.component.css',
})
export class WotAccountComponent {
  readonly accountStore = inject(AccountStore);
  readonly tanksStore = inject(TanksStore);

  wotPlayerPrivateInfo = computed(() => {
    if (!this.accountStore.wotPlayerPrivateInfo) {
      return undefined;
    }
    return this.accountStore.wotPlayerPrivateInfo()!;
  });

  constructor() {
    effect(() => {
      if (
        this.accountStore.applicationId() &&
        this.accountStore.accountId() &&
        this.accountStore.accessToken &&
        this.accountStore.accessToken()
      ) {
        this.tanksStore.readPlayerTanks({
          accountId: this.accountStore.accountId(),
          accessToken: this.accountStore.accessToken() ?? '',
        });
      }
    });
  }
}
