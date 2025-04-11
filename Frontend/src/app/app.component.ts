import { Component, computed, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MatToolbar } from '@angular/material/toolbar';
import { NavButtonComponent } from './components/nav-button/nav-button.component';
import { AccountStore } from './store/account.store';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatToolbar, NavButtonComponent, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  public readonly accountStore = inject(AccountStore);

  title = computed(() =>
    this.accountStore.loggedIn() && this.accountStore.accountNickName()
      ? this.accountStore.accountNickName()
      : 'WoT statistics',
  );

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
