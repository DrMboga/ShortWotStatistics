import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WgLoginLandingComponent } from './wg-login-landing.component';
import { IndexedDBService } from '../indexedDb/indexed-db.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { AccountAuthenticationInfo } from '../model/account-authentication-info';
import { provideRouter } from '@angular/router';
import { routes } from '../app.routes';

describe('WgLoginLandingComponent', () => {
  let component: WgLoginLandingComponent;
  let fixture: ComponentFixture<WgLoginLandingComponent>;
  let indexedDbServiceMock: jest.Mocked<Partial<IndexedDBService>> = {
    getAccountsAuthInfo: jest.fn().mockImplementation(() => of([] as AccountAuthenticationInfo[])),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WgLoginLandingComponent],
      providers: [
        provideRouter(routes),
        { provide: IndexedDBService, useValue: indexedDbServiceMock },
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(WgLoginLandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
