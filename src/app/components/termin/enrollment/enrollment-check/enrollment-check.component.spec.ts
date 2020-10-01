import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {EnrollmentCheckComponent} from './enrollment-check.component';

describe('EnrollmentCheckComponent', () => {
  let component: EnrollmentCheckComponent;
  let fixture: ComponentFixture<EnrollmentCheckComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EnrollmentCheckComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnrollmentCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
