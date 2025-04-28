import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WotPlayerAchievementsComponent } from './wot-player-achievements.component';
import { IndexedDBService } from '../../indexedDb/indexed-db.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { AccountAuthenticationInfo } from '../../model/account-authentication-info';

describe('WotPlayerAchievementsComponent', () => {
  let component: WotPlayerAchievementsComponent;
  let fixture: ComponentFixture<WotPlayerAchievementsComponent>;
  let indexedDbServiceMock: jest.Mocked<Partial<IndexedDBService>> = {
    getAccountsAuthInfo: jest.fn().mockImplementation(() => of([] as AccountAuthenticationInfo[])),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WotPlayerAchievementsComponent],
      providers: [
        { provide: IndexedDBService, useValue: indexedDbServiceMock },
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(WotPlayerAchievementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
