import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WgLoginLandingComponent } from './wg-login-landing.component';

describe('WgLoginLandingComponent', () => {
  let component: WgLoginLandingComponent;
  let fixture: ComponentFixture<WgLoginLandingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WgLoginLandingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WgLoginLandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
