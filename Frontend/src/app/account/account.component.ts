import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountStore } from '../store/account.store';
import { LoginComponent } from '../components/login/login.component';

@Component({
  selector: 'app-account',
  imports: [FormsModule, LoginComponent],
  templateUrl: './account.component.html',
  styleUrl: './account.component.css',
})
export class AccountComponent {
  readonly accountStore = inject(AccountStore);
  readonly loggedIn = this.accountStore.loggedIn;
}
