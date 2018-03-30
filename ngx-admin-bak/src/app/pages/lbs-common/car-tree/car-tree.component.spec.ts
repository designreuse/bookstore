import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CarTreeComponent } from './car-tree.component';

describe('CarTreeComponent', () => {
  let component: CarTreeComponent;
  let fixture: ComponentFixture<CarTreeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CarTreeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CarTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
