import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehiclesTreeComponent } from './vehicles-tree.component';

describe('VehiclesTreeComponent', () => {
  let component: VehiclesTreeComponent;
  let fixture: ComponentFixture<VehiclesTreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehiclesTreeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehiclesTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
