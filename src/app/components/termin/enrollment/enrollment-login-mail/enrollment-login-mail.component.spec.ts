import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {EnrollmentLoginMailComponent} from './enrollment-login-mail.component';

describe('EnrollmentLoginMailComponent', () => {
  let component: EnrollmentLoginMailComponent;
  let fixture: ComponentFixture<EnrollmentLoginMailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EnrollmentLoginMailComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnrollmentLoginMailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
