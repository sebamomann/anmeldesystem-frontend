import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AppointmentDataComponent} from './appointment-data.component';
import {MatCardModule, MatFormFieldModule, MatIconModule, MatInputModule, MatSnackBarModule} from '@angular/material';
import {FormsModule} from '@angular/forms';
import {WINDOW_PROVIDERS} from '../../../provider/window.provider';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

describe('AppointmentDataComponent', () => {
  let component: AppointmentDataComponent;
  let fixture: ComponentFixture<AppointmentDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MatCardModule, MatIconModule,
        MatFormFieldModule, FormsModule,
        MatSnackBarModule, MatInputModule,
        BrowserAnimationsModule],
      declarations: [AppointmentDataComponent],
      providers: [WINDOW_PROVIDERS]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppointmentDataComponent);
    component = fixture.componentInstance;
    component.appointment = {
      appointment: {
        location: '',
        date: '',
        title: ''
      }
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
