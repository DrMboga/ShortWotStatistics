import { Component, computed, effect, inject } from '@angular/core';
import { AccountStore } from '../../store/account.store';
import { StatisticsTableComponent } from '../../components/statistics-table/statistics-table.component';
import { WotPlayerAchievementsComponent } from '../wot-player-achievements/wot-player-achievements.component';
import { TanksStore } from '../../store/tanks.store';
import { WotPlayerTanksListComponent } from '../wot-player-tanks-list/wot-player-tanks-list.component';

@Component({
  selector: 'app-wot-account',
  imports: [StatisticsTableComponent, WotPlayerAchievementsComponent, WotPlayerTanksListComponent],
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

  wotPlayerHistory = computed(() => {
    if (!this.accountStore.wotPlayerHistoryLastRow) {
      return [];
    }
    return this.accountStore.wotPlayerHistoryLastRow()!;
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
