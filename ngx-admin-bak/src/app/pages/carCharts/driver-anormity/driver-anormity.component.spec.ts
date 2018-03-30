import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverAnormityComponent } from './driver-anormity.component';

describe('DriverAnormityComponent', () => {
  let component: DriverAnormityComponent;
  let fixture: ComponentFixture<DriverAnormityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DriverAnormityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DriverAnormityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
