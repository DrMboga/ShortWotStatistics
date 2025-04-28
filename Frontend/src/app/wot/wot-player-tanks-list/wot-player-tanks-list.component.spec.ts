import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WotPlayerTanksListComponent } from './wot-player-tanks-list.component';
import { IndexedDBService } from '../../indexedDb/indexed-db.service';
import { of } from 'rxjs';
import { AccountAuthenticationInfo } from '../../model/account-authentication-info';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('WotPlayerTanksListComponent', () => {
  let component: WotPlayerTanksListComponent;
  let fixture: ComponentFixture<WotPlayerTanksListComponent>;
  let indexedDbServiceMock: jest.Mocked<Partial<IndexedDBService>> = {
    getAccountsAuthInfo: jest.fn().mockImplementation(() => of([] as AccountAuthenticationInfo[])),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WotPlayerTanksListComponent],
      providers: [
        { provide: IndexedDBService, useValue: indexedDbServiceMock },
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(WotPlayerTanksListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
