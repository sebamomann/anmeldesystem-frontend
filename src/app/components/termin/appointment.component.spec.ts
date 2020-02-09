import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AppointmentComponent} from './appointment.component';
import {AppointmentDataComponent} from './appointment-data/appointment-data.component';
import {
  MatBadgeModule,
  MatCardModule,
  MatDialogModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatProgressBarModule,
  MatSnackBarModule
} from '@angular/material';
import {RouterTestingModule} from '@angular/router/testing';
import {FormsModule} from '@angular/forms';
import {WINDOW_PROVIDERS} from '../../provider/window.provider';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {EnrollmentListComponent} from './enrollment/enrollment-list/enrollment-list.component';
import {Globals} from '../../globals';

describe('AppointmentComponent', () => {
  let component: AppointmentComponent;
  let fixture: ComponentFixture<AppointmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MatIconModule, MatBadgeModule,
        MatExpansionModule, RouterTestingModule,
        MatCardModule, FormsModule,
        MatFormFieldModule, MatDialogModule,
        MatSnackBarModule, BrowserAnimationsModule,
        MatInputModule, MatProgressBarModule,
        HttpClientTestingModule],
      declarations: [AppointmentComponent, AppointmentDataComponent, EnrollmentListComponent],
      providers: [WINDOW_PROVIDERS, Globals]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppointmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
