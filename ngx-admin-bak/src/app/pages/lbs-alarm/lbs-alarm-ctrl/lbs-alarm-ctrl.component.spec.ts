import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LbsAlarmCtrlComponent } from './lbs-alarm-ctrl.component';

describe('LbsAlarmCtrlComponent', () => {
  let component: LbsAlarmCtrlComponent;
  let fixture: ComponentFixture<LbsAlarmCtrlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LbsAlarmCtrlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LbsAlarmCtrlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
