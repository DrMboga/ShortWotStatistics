import { Routes } from '@angular/router';
import { AccountComponent } from './account/account.component';
import { WgLoginLandingComponent } from './wg-login-landing/wg-login-landing.component';

export const routes: Routes = [
  { path: 'account', component: AccountComponent },
  { path: 'login', component: WgLoginLandingComponent },
  { path: '', redirectTo: '/account', pathMatch: 'full' },
];
