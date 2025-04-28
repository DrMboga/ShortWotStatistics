import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlitzAccountComponent } from './blitz-account.component';
import { IndexedDBService } from '../../indexedDb/indexed-db.service';
import { of } from 'rxjs';
import { AccountAuthenticationInfo } from '../../model/account-authentication-info';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('BlitzAccountComponent', () => {
  let component: BlitzAccountComponent;
  let fixture: ComponentFixture<BlitzAccountComponent>;
  let indexedDbServiceMock: jest.Mocked<Partial<IndexedDBService>> = {
    getAccountsAuthInfo: jest.fn().mockImplementation(() => of([] as AccountAuthenticationInfo[])),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlitzAccountComponent],
      providers: [
        { provide: IndexedDBService, useValue: indexedDbServiceMock },
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BlitzAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
