import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlitzAccountComponent } from './blitz-account.component';

describe('BlitzAccountComponent', () => {
  let component: BlitzAccountComponent;
  let fixture: ComponentFixture<BlitzAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlitzAccountComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlitzAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
