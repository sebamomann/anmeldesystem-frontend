import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AppointmentCreateComponent} from './appointment-create.component';
import {
  MatAutocompleteModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDatepickerModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatNativeDateModule,
  MatOptionModule,
  MatProgressBarModule,
  MatSnackBarModule,
  MatStepperModule,
  MatTooltipModule
} from '@angular/material';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {UrlEncodePipe} from '../../../pipes/url-encode.pipe';
import {WINDOW_PROVIDERS} from '../../../provider/window.provider';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {NgxMatDatetimePickerModule} from 'ngx-mat-datetime-picker';
import {Globals} from '../../../globals';

describe('AppointmentCreateComponent', () => {
  let component: AppointmentCreateComponent;
  let fixture: ComponentFixture<AppointmentCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MatFormFieldModule, MatCardModule,
        MatStepperModule, MatDatepickerModule,
        ReactiveFormsModule, FormsModule,
        MatCheckboxModule, MatIconModule,
        MatChipsModule, MatOptionModule,
        MatAutocompleteModule, MatNativeDateModule,
        MatInputModule, BrowserAnimationsModule,
        MatProgressBarModule, HttpClientTestingModule,
        MatTooltipModule, RouterTestingModule,
        MatSnackBarModule, NgxMatDatetimePickerModule],
      declarations: [AppointmentCreateComponent, UrlEncodePipe],
      providers: [WINDOW_PROVIDERS, Globals]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppointmentCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
