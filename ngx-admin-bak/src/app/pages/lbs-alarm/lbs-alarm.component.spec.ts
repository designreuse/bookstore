import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LbsAlarmComponent } from './lbs-alarm.component';

describe('LbsAlarmComponent', () => {
  let component: LbsAlarmComponent;
  let fixture: ComponentFixture<LbsAlarmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LbsAlarmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LbsAlarmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
