import { Component, computed, inject } from '@angular/core';
import { AccountStore } from '../../store/account.store';
import { StatisticsTableComponent } from '../../components/statistics-table/statistics-table.component';
import { WotPlayerAchievementsComponent } from '../wot-player-achievements/wot-player-achievements.component';

@Component({
  selector: 'app-wot-account',
  imports: [StatisticsTableComponent, WotPlayerAchievementsComponent],
  templateUrl: './wot-account.component.html',
  styleUrl: './wot-account.component.css',
})
export class WotAccountComponent {
  readonly accountStore = inject(AccountStore);
  wotPlayerPrivateInfo = computed(() => {
    if (!this.accountStore.wotPlayerPrivateInfo) {
      return undefined;
    }
    return this.accountStore.wotPlayerPrivateInfo()!;
  });
}
