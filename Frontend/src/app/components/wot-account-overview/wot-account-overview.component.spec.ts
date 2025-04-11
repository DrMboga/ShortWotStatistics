import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WotAccountOverviewComponent } from './wot-account-overview.component';

describe('WotAccountOverviewComponent', () => {
  let component: WotAccountOverviewComponent;
  let fixture: ComponentFixture<WotAccountOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WotAccountOverviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WotAccountOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
