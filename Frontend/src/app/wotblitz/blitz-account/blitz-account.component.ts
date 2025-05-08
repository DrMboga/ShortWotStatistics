import { Component, computed, inject } from '@angular/core';
import { AccountStore } from '../../store/account.store';
import { StatisticsTableComponent } from '../../components/statistics-table/statistics-table.component';

@Component({
  selector: 'app-blitz-account',
  imports: [StatisticsTableComponent],
  templateUrl: './blitz-account.component.html',
  styleUrl: './blitz-account.component.css',
})
export class BlitzAccountComponent {
  readonly accountStore = inject(AccountStore);
  blitzPlayerPrivateInfo = computed(() => {
    if (!this.accountStore.blitzPlayerPrivateInfo) {
      return undefined;
    }
    return this.accountStore.blitzPlayerPrivateInfo()!;
  });

  blitzPlayerHistory = computed(() => {
    if (!this.accountStore.blitzPlayerHistoryLastRow) {
      return [];
    }
    return this.accountStore.blitzPlayerHistoryLastRow()!;
  });
}
