import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {EnrollmentComponent} from './enrollment.component';
import {
  MatCardModule,
  MatCheckboxModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatOptionModule,
  MatProgressBarModule,
  MatSelectModule
} from '@angular/material';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Location} from '@angular/common';
import {SpyLocation} from '@angular/common/testing';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {RouterTestingModule} from '@angular/router/testing';

describe('EnrollmentComponent', () => {
  let component: EnrollmentComponent;
  let fixture: ComponentFixture<EnrollmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MatIconModule, MatCardModule,
        MatFormFieldModule, MatCheckboxModule,
        ReactiveFormsModule, FormsModule,
        MatOptionModule, MatSelectModule,
        BrowserAnimationsModule, MatInputModule,
        MatProgressBarModule, HttpClientTestingModule,
        RouterTestingModule, BrowserAnimationsModule],
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
