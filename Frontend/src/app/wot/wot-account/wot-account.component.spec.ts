import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WotAccountComponent } from './wot-account.component';

describe('WotAccountComponent', () => {
  let component: WotAccountComponent;
  let fixture: ComponentFixture<WotAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WotAccountComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WotAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
