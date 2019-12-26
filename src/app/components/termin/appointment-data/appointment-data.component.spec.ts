import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AppointmentDataComponent} from './appointment-data.component';
import {MatCardModule, MatFormFieldModule, MatIconModule, MatSnackBarModule} from '@angular/material';
import {FormsModule} from '@angular/forms';
import {WINDOW_PROVIDERS} from '../../../provider/window.provider';

describe('AppointmentDataComponent', () => {
  let component: AppointmentDataComponent;
  let fixture: ComponentFixture<AppointmentDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MatCardModule, MatIconModule,
        MatFormFieldModule, FormsModule,
        MatSnackBarModule],
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
