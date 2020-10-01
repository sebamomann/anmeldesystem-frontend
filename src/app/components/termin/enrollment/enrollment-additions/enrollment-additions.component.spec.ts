import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {EnrollmentAdditionsComponent} from './enrollment-additions.component';

describe('EnrollmentAdditionsComponent', () => {
  let component: EnrollmentAdditionsComponent;
  let fixture: ComponentFixture<EnrollmentAdditionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EnrollmentAdditionsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnrollmentAdditionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
