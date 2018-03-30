import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LbsAlarmSearchComponent } from './lbs-alarm-search.component';

describe('LbsAlarmSearchComponent', () => {
  let component: LbsAlarmSearchComponent;
  let fixture: ComponentFixture<LbsAlarmSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LbsAlarmSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LbsAlarmSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
