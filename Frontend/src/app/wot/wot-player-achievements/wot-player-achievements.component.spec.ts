import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WotPlayerAchievementsComponent } from './wot-player-achievements.component';

describe('WotPlayerAchievementsComponent', () => {
  let component: WotPlayerAchievementsComponent;
  let fixture: ComponentFixture<WotPlayerAchievementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WotPlayerAchievementsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WotPlayerAchievementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
