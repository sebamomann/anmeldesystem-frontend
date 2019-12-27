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
  MatStepperModule
} from '@angular/material';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {UrlEncodePipe} from '../../../pipes/url-encode.pipe';
import {WINDOW_PROVIDERS} from '../../../provider/window.provider';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpClientTestingModule} from '@angular/common/http/testing';

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
        MatProgressBarModule, HttpClientTestingModule],
      declarations: [AppointmentCreateComponent, UrlEncodePipe],
      providers: [WINDOW_PROVIDERS]
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
