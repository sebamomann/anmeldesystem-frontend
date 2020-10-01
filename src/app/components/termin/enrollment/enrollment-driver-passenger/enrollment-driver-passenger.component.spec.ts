import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {EnrollmentDriverPassengerComponent} from './enrollment-driver-passenger.component';

describe('EnrollmentDriverPassengerComponent', () => {
  let component: EnrollmentDriverPassengerComponent;
  let fixture: ComponentFixture<EnrollmentDriverPassengerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EnrollmentDriverPassengerComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnrollmentDriverPassengerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
