import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {EnrollmentComponent} from './enrollment.component';
import {
  MatCardModule,
  MatCheckboxModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatOptionModule,
  MatSelectModule
} from '@angular/material';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Location} from '@angular/common';
import {SpyLocation} from '@angular/common/testing';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

describe('EnrollmentComponent', () => {
  let component: EnrollmentComponent;
  let fixture: ComponentFixture<EnrollmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MatIconModule, MatCardModule,
        MatFormFieldModule, MatCheckboxModule,
        ReactiveFormsModule, FormsModule,
        MatOptionModule, MatSelectModule,
        BrowserAnimationsModule, MatInputModule],
      declarations: [EnrollmentComponent],
      providers: [{provide: Location, useClass: SpyLocation}],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnrollmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
