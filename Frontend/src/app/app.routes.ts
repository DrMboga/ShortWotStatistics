import { Routes } from '@angular/router';
import { AccountComponent } from './account/account.component';
import { WgLoginLandingComponent } from './wg-login-landing/wg-login-landing.component';
import { WotAccountComponent } from './wot/wot-account/wot-account.component';
import { BlitzAccountComponent } from './wotblitz/blitz-account/blitz-account.component';

export const routes: Routes = [
  { path: 'account', component: AccountComponent },
  { path: 'login', component: WgLoginLandingComponent },
  { path: 'wot-account', component: WotAccountComponent },
  { path: 'blitz-account', component: BlitzAccountComponent },
  { path: '', redirectTo: '/account', pathMatch: 'full' },
];
