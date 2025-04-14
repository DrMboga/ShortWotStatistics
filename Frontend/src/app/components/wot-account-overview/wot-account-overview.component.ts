import { Component, computed, inject, input } from '@angular/core';
import { AccountStore } from '../../store/account.store';
import { DatePipe, DecimalPipe } from '@angular/common';
import { AverageBattleLifeTimePipe } from '../../pipes/average-battle-life-time.pipe';

@Component({
  selector: 'app-wot-account-overview',
  imports: [DatePipe, DecimalPipe, AverageBattleLifeTimePipe],
  templateUrl: './wot-account-overview.component.html',
  styleUrl: './wot-account-overview.component.css',
})
export class WotAccountOverviewComponent {
  readonly accountStore = inject(AccountStore);

  isBlitz = input.required<boolean>();
  wotPlayerPersonalData = computed(() => {
    if (!this.accountStore.blitzPlayerPrivateInfo && !this.accountStore.wotPlayerPrivateInfo) {
      return undefined;
    }
    return this.isBlitz()
      ? this.accountStore.blitzPlayerPrivateInfo!()
      : this.accountStore.wotPlayerPrivateInfo!();
  });
}
