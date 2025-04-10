import { Component, effect, inject } from '@angular/core';
import { AccountStore } from '../../store/account.store';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [MatFormField, MatLabel, MatInput, MatButton, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  readonly accountStore = inject(AccountStore);
  applicationId?: string;

  constructor() {
    effect(() => {
      this.applicationId = this.accountStore.applicationId();
    });
  }

  public saveApplicationId() {
    if (this.applicationId) {
      this.accountStore.setApplicationId(this.applicationId);
    }
  }

  public logIn() {
    if (this.applicationId) {
      const baseUri = window.location.origin;
      // Redirect to Wargaming login page
      window.location.href = `https://api.worldoftanks.eu/wot/auth/login/?application_id=${this.applicationId}&redirect_uri=${baseUri}/login`;
    }
  }
}
