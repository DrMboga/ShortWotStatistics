import { Component, computed, inject } from '@angular/core';
import { AccountStore } from '../../store/account.store';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-blitz-account',
  imports: [DatePipe],
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
}
