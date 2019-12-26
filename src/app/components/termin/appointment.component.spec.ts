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
  MatSnackBarModule
} from '@angular/material';
import {RouterTestingModule} from '@angular/router/testing';
import {FormsModule} from '@angular/forms';
import {WINDOW_PROVIDERS} from '../../provider/window.provider';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

describe('AppointmentComponent', () => {
  let component: AppointmentComponent;
  let fixture: ComponentFixture<AppointmentComponent>;
  const DriverMc = {
    name: 'Driver',
    comment: 'This is my cool comment',
    comments: [],
    driver: {seats: 3, requirement: 1},
    passenger: null,
    additions: ['id1'],
    iat: '01-01-2019 00:00:00',
  };
  const DriverMcBk = {
    name: 'Driver',
    comment: 'This is my cool comment',
    comments: [],
    driver: {seats: 4, requirement: 1},
    passenger: null,
    additions: ['id1', 'id2'],
    iat: '01-01-2019 00:00:00',
  };
  const DriverSubwayDiner = {
    name: 'Driver',
    comment: 'This is my cool comment',
    comments: [],
    driver: {seats: 4, requirement: 1},
    passenger: null,
    additions: ['id3', 'id4'],
    iat: '01-01-2019 00:00:00',
  };
  const DriverSubwayDiner2 = {
    name: 'Driver',
    comment: 'This is my cool comment',
    comments: [],
    driver: {seats: 4, requirement: 1},
    passenger: null,
    additions: ['id3', 'id4'],
    iat: '01-01-2019 00:00:00',
  };
  const DriverSubwayDiner3 = {
    name: 'Driver',
    comment: 'This is my cool comment',
    comments: [],
    driver: {seats: 4, requirement: 1},
    passenger: null,
    additions: ['id3', 'id4'],
    iat: '01-01-2019 00:00:00',
  };
  const DriverMcBkSubway = {
    name: 'Driver',
    comment: 'This is my cool comment',
    comments: [],
    driver: {seats: 4, requirement: 1},
    passenger: null,
    additions: ['id1', 'id2', 'id3'],
    iat: '01-01-2019 00:00:00',
  };
  const DriverBkSubwayDiner = {
    name: 'Driver',
    comment: 'This is my cool comment',
    comments: [],
    driver: {seats: 4, requirement: 1},
    passenger: null,
    additions: ['id2', 'id3', 'id4'],
    iat: '01-01-2019 00:00:00',
  };
  const DriverMcBkSubwayDiner = {
    name: 'Driver',
    comment: 'This is my cool comment',
    comments: [],
    driver: {seats: 4, requirement: 1},
    passenger: null,
    additions: ['id1', 'id2', 'id3', 'id4'],
    iat: '01-01-2019 00:00:00',
  };
  const DriverMcBkSubwayDiner2 = {
    name: 'Driver',
    comment: 'This is my cool comment',
    comments: [],
    driver: {seats: 4, requirement: 1},
    passenger: null,
    additions: ['id1', 'id2', 'id3', 'id4'],
    iat: '01-01-2019 00:00:00',
  };
  const PassengerMc = {
    name: 'Passenger',
    comment: 'This is my cool comment',
    comments: [],
    driver: null,
    passenger: {requirement: 1},
    additions: ['id1'],
    iat: '01-01-2019 00:00:00',
  };
  const PassengerDiner = {
    name: 'Passenger',
    comment: 'This is my cool comment',
    comments: [],
    driver: null,
    passenger: {requirement: 1},
    additions: ['id4'],
    iat: '01-01-2019 00:00:00',
  };
  const PassengerMcBk = {
    name: 'Passenger',
    comment: 'This is my cool comment',
    comments: [],
    driver: null,
    passenger: {requirement: 1},
    additions: ['id1', 'id2'],
    iat: '01-01-2019 00:00:00',
  };
  const PassengerMcBk2 = {
    name: 'Passenger',
    comment: 'This is my cool comment',
    comments: [],
    driver: null,
    passenger: {requirement: 1},
    additions: ['id1', 'id2'],
    iat: '01-01-2019 00:00:00',
  };
  const PassengerMcSubway = {
    name: 'Passenger',
    comment: 'This is my cool comment',
    comments: [],
    driver: null,
    passenger: {requirement: 1},
    additions: ['id1', 'id4'],
    iat: '01-01-2019 00:00:00',
  };
  const PassengerBkDiner = {
    name: 'Passenger',
    comment: 'This is my cool comment',
    comments: [],
    driver: null,
    passenger: {requirement: 1},
    additions: ['id2', 'id4'],
    iat: '01-01-2019 00:00:00',
  };
  const PassengerBkSubwayDiner = {
    name: 'Passenger',
    comment: 'This is my cool comment',
    comments: [],
    driver: null,
    passenger: {requirement: 1},
    additions: ['id2', 'id3', 'id4'],
    iat: '01-01-2019 00:00:00',
  };
  const PassengerMcBkSubwayDiner = {
    name: 'Passenger',
    comment: 'This is my cool comment',
    comments: [],
    driver: null,
    passenger: {requirement: 1},
    additions: ['id1', 'id2', 'id3', 'id4'],
    iat: '01-01-2019 00:00:00',
  };
  const PassengerMcBkSubwayDiner2 = {
    name: 'Passenger',
    comment: 'This is my cool comment',
    comments: [],
    driver: null,
    passenger: {requirement: 1},
    additions: ['id1', 'id2', 'id3', 'id4'],
    iat: '01-01-2019 00:00:00',
  };


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MatIconModule, MatBadgeModule,
        MatExpansionModule, RouterTestingModule,
        MatCardModule, FormsModule,
        MatFormFieldModule, MatDialogModule,
        MatSnackBarModule, BrowserAnimationsModule,
        MatInputModule],
      declarations: [AppointmentComponent, AppointmentDataComponent],
      providers: [WINDOW_PROVIDERS]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppointmentComponent);
    component = fixture.componentInstance;
    component.appointment = {
      title: 'Test Termin',
      description: 'This is a very very cool date because I created it lol',
      location: 'Hier lol',
      creator: 'TestCreator',
      date: '01-01-2020 00:00:00',
      deadline: '01-01-2019 00:00:00',
      link: 'ABCDE',
      maxEnrollments: 10,
      additions: [
        {
          id: 'id1',
          name: 'Megges'
        },
        {
          id: 'id2',
          name: 'BK'
        },
        {
          id: 'id3',
          name: 'Subway'
        },
        {
          id: 'id4',
          name: 'Diner'
        }
      ],
      driverAddition: true,
      enrollments: [DriverMc, DriverMcBk,
        DriverSubwayDiner, DriverSubwayDiner2, DriverSubwayDiner3,
        DriverMcBkSubway, DriverBkSubwayDiner,
        DriverMcBkSubwayDiner, DriverMcBkSubwayDiner2,
        PassengerMc, PassengerDiner,
        PassengerMcBk, PassengerMcBk2, PassengerMcSubway,
        PassengerBkDiner, PassengerBkSubwayDiner,
        PassengerMcBkSubwayDiner, PassengerMcBkSubwayDiner2]
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('correct filter: mc, explicit', () => {
    component.filter = {
      additions: [
        {id: 'id1', active: true},
        {id: 'id2', active: false},
        {id: 'id3', active: false},
        {id: 'id4', active: false}
      ],
      driverPassenger: '',
      explicitly: 'explicit'
    };
    const filtered = component.filterEnrollments();
    expect(filtered).toEqual([DriverMc, PassengerMc]);
  });

  it('correct filter: diner, explicit, passenger', () => {
    component.filter = {
      additions: [
        {id: 'id1', active: false},
        {id: 'id2', active: false},
        {id: 'id3', active: false},
        {id: 'id4', active: true}
      ],
      driverPassenger: 'passenger',
      explicitly: 'explicit'
    };
    const filtered = component.filterEnrollments();
    expect(filtered).toEqual([PassengerDiner]);
  });

  it('correct filter: two (mc, bk), explicit', () => {
    component.filter = {
      additions: [
        {id: 'id1', active: true},
        {id: 'id2', active: true},
        {id: 'id3', active: false},
        {id: 'id4', active: false}
      ],
      driverPassenger: '',
      explicitly: 'explicit'
    };
    const filtered = component.filterEnrollments();
    expect(filtered).toEqual([DriverMcBk, PassengerMcBk, PassengerMcBk2]);
  });

  it('correct filter: two (subway, diner), explicit, driver', () => {
    component.filter = {
      additions: [
        {id: 'id1', active: false},
        {id: 'id2', active: false},
        {id: 'id3', active: true},
        {id: 'id4', active: true}
      ],
      driverPassenger: 'driver',
      explicitly: 'explicit'
    };
    const filtered = component.filterEnrollments();
    expect(filtered).toEqual([DriverSubwayDiner, DriverSubwayDiner2, DriverSubwayDiner3]);
  });

  it('correct filter: three, explicit', () => {
    component.filter = {
      additions: [
        {id: 'id1', active: false},
        {id: 'id2', active: true},
        {id: 'id3', active: true},
        {id: 'id4', active: true}
      ],
      driverPassenger: '',
      explicitly: 'explicit'
    };
    const filtered = component.filterEnrollments();
    expect(filtered).toEqual([DriverBkSubwayDiner, PassengerBkSubwayDiner]);
  });

  it('correct filter: three (bk, subway, diner), explicit, passenger', () => {
    component.filter = {
      additions: [
        {id: 'id1', active: false},
        {id: 'id2', active: true},
        {id: 'id3', active: true},
        {id: 'id4', active: true}
      ],
      driverPassenger: 'passenger',
      explicitly: 'explicit'
    };
    const filtered = component.filterEnrollments();
    expect(filtered).toEqual([PassengerBkSubwayDiner]);
  });

  it('correct filter: all, explicit', () => {
    component.filter = {
      additions: [
        {id: 'id1', active: true},
        {id: 'id2', active: true},
        {id: 'id3', active: true},
        {id: 'id4', active: true}
      ],
      driverPassenger: '',
      explicitly: 'explicit'
    };
    const filtered = component.filterEnrollments();
    expect(filtered).toEqual([DriverMcBkSubwayDiner, DriverMcBkSubwayDiner2, PassengerMcBkSubwayDiner, PassengerMcBkSubwayDiner]);
  });

  it('correct filter: all, explicit, driver', () => {
    component.filter = {
      additions: [
        {id: 'id1', active: true},
        {id: 'id2', active: true},
        {id: 'id3', active: true},
        {id: 'id4', active: true}
      ],
      driverPassenger: 'driver',
      explicitly: 'explicit'
    };
    const filtered = component.filterEnrollments();
    expect(filtered).toEqual([DriverMcBkSubwayDiner, DriverMcBkSubwayDiner2]);
  });
});
