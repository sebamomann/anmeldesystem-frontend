import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {FetchAppointmentComponent} from './fetch-appointment.component';

describe('FetchAppointmentComponent', () => {
  let component: FetchAppointmentComponent;
  let fixture: ComponentFixture<FetchAppointmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FetchAppointmentComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FetchAppointmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
