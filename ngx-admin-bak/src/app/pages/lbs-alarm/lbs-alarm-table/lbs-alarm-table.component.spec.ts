import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LbsAlarmTableComponent } from './lbs-alarm-table.component';

describe('LbsAlarmTableComponent', () => {
  let component: LbsAlarmTableComponent;
  let fixture: ComponentFixture<LbsAlarmTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LbsAlarmTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LbsAlarmTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
