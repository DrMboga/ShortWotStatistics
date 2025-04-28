import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavButtonComponent } from './nav-button.component';
import { provideRouter } from '@angular/router';
import { routes } from '../../app.routes';

describe('NavButtonComponent', () => {
  let component: NavButtonComponent;
  let fixture: ComponentFixture<NavButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideRouter(routes)],
      imports: [NavButtonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NavButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
