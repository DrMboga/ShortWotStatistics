import { Component, computed, inject } from '@angular/core';
import { AccountStore } from '../../store/account.store';
import { StatisticsTableComponent } from '../../components/statistics-table/statistics-table.component';

@Component({
  selector: 'app-wot-account',
  imports: [StatisticsTableComponent],
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
