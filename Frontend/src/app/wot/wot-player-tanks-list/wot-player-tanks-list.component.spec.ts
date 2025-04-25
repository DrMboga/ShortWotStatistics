import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WotPlayerTanksListComponent } from './wot-player-tanks-list.component';

describe('WotPlayerTanksListComponent', () => {
  let component: WotPlayerTanksListComponent;
  let fixture: ComponentFixture<WotPlayerTanksListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WotPlayerTanksListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WotPlayerTanksListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
