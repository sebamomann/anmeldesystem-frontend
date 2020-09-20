import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {EnrollmentCreateComponent} from './enrollment-create.component';

describe('EnrollmentCreateComponent', () => {
  let component: EnrollmentCreateComponent;
  let fixture: ComponentFixture<EnrollmentCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EnrollmentCreateComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnrollmentCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
