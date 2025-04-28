import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WotAccountComponent } from './wot-account.component';
import { IndexedDBService } from '../../indexedDb/indexed-db.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { AccountAuthenticationInfo } from '../../model/account-authentication-info';

describe('WotAccountComponent', () => {
  let component: WotAccountComponent;
  let fixture: ComponentFixture<WotAccountComponent>;

  let indexedDbServiceMock: jest.Mocked<Partial<IndexedDBService>> = {
    getAccountsAuthInfo: jest.fn().mockImplementation(() => of([] as AccountAuthenticationInfo[])),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WotAccountComponent],
      providers: [
        { provide: IndexedDBService, useValue: indexedDbServiceMock },
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(WotAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
