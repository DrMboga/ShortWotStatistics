import { Component, computed, effect, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountStore } from '../store/account.store';
import { LoginComponent } from '../components/login/login.component';
import { WotAccountOverviewComponent } from '../components/wot-account-overview/wot-account-overview.component';

@Component({
  selector: 'app-account',
  imports: [FormsModule, LoginComponent, WotAccountOverviewComponent],
  templateUrl: './account.component.html',
  styleUrl: './account.component.css',
})
export class AccountComponent {
  readonly accountStore = inject(AccountStore);
  readonly loggedIn = this.accountStore.loggedIn;

  hasWotAccount = computed(
    () =>
      this.accountStore.loggedIn() &&
      this.accountStore.games().length > 0 &&
      this.accountStore.games().includes('wot'),
  );

  hasBlitzAccount = computed(
    () =>
      this.accountStore.loggedIn() &&
      this.accountStore.games().length > 0 &&
      this.accountStore.games().includes('wotb'),
  );
}
