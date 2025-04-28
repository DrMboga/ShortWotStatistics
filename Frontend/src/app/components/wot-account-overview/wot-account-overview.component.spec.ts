import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WotAccountOverviewComponent } from './wot-account-overview.component';
import { IndexedDBService } from '../../indexedDb/indexed-db.service';
import { of } from 'rxjs';
import { AccountAuthenticationInfo } from '../../model/account-authentication-info';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('WotAccountOverviewComponent', () => {
  let component: WotAccountOverviewComponent;
  let fixture: ComponentFixture<WotAccountOverviewComponent>;
  let indexedDbServiceMock: jest.Mocked<Partial<IndexedDBService>> = {
    getAccountsAuthInfo: jest.fn().mockImplementation(() => of([] as AccountAuthenticationInfo[])),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WotAccountOverviewComponent],
      providers: [
        { provide: IndexedDBService, useValue: indexedDbServiceMock },
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(WotAccountOverviewComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('isBlitz', false);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
