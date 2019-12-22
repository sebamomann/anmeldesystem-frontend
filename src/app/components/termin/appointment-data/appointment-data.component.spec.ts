import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentDataComponent } from './appointment-data.component';

describe('TerminDataComponent', () => {
  let component: AppointmentDataComponent;
  let fixture: ComponentFixture<AppointmentDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppointmentDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppointmentDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
