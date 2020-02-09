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
import {IEnrollmentModel} from '../../models/IEnrollment.model';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {EnrollmentListComponent} from './enrollment/enrollment-list/enrollment-list.component';

function createEnrollment(id1: boolean, id2: boolean, id3: boolean, id4: boolean, driver: boolean, passenger: boolean): IEnrollmentModel {
  const obj: IEnrollmentModel = {
    name: (driver ? 'Driver' : 'Passenger') + Math.random(),
    comment: 'This is my cool comment',
    comments: [],
    driver: (driver ? {seats: 3, service: 1} : null),
    passenger: (passenger ? {requirement: 1} : null),
    additions: [],
    editKey: '',
    iat: '01-01-2019 00:00:00',
  };
  if (id1) {
    obj.additions.push({id: 'id1', name: 'Megges'});
  }
  if (id2) {
    obj.additions.push({id: 'id2', name: 'Bk'});
  }
  if (id3) {
    obj.additions.push({id: 'id3', name: 'Subway'});
  }
  if (id4) {
    obj.additions.push({id: 'id4', name: 'Diner'});
  }
  return obj;
}

function createFilter(b1: boolean, b2: boolean, b3: boolean, b4: boolean, explicitly: string, driverPassenger: string) {
  return {
    additions: [
      {id: 'id1', active: b1},
      {id: 'id2', active: b2},
      {id: 'id3', active: b3},
      {id: 'id4', active: b4}
    ],
    driverPassenger,
    explicitly,
  };
}

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
      providers: [WINDOW_PROVIDERS]
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
