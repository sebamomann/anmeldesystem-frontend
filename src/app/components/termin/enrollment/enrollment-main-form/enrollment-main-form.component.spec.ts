import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {EnrollmentMainFormComponent} from './enrollment-main-form.component';

describe('EnrollmentMainFormComponent', () => {
  let component: EnrollmentMainFormComponent;
  let fixture: ComponentFixture<EnrollmentMainFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EnrollmentMainFormComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnrollmentMainFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
