import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { IndexedDBService } from './indexedDb/indexed-db.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { AccountAuthenticationInfo } from './model/account-authentication-info';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

describe('AppComponent', () => {
  let indexedDbServiceMock: jest.Mocked<Partial<IndexedDBService>> = {
    getAccountsAuthInfo: jest.fn().mockImplementation(() => of([] as AccountAuthenticationInfo[])),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        provideRouter(routes),
        { provide: IndexedDBService, useValue: indexedDbServiceMock },
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
