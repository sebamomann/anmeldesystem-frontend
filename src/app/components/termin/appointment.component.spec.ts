import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AppointmentComponent} from './appointment.component';
import {AppointmentDataComponent} from './appointment-data/appointment-data.component';
import {
  MatBadgeModule,
  MatCardModule,
  MatDialogModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatIconModule, MatInputModule,
  MatSnackBarModule
} from '@angular/material';
import {RouterTestingModule} from '@angular/router/testing';
import {FormsModule} from '@angular/forms';
import {WINDOW} from '../../provider/window.provider';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

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
        MatInputModule],
      declarations: [AppointmentComponent, AppointmentDataComponent, particlesJS],
      providers: [{provide: WINDOW}]
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
