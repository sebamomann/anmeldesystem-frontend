import {IAppointmentDataProviderModel} from '../../../IAppointmentDataProviderModel';

export class AppointmentDataProvider {
  private static APPOINTMENTS = {
    valid: {
      id: '5163f213-c168-408c-ad63-4faa7ec61ae5',
      title: 'Appointment',
      description: 'My cool description',
      link: 'valid',
      location: 'My Location',
      date: '2021-03-01T09:05:23.000Z',
      deadline: '2021-01-01T19:05:23.000Z',
      hidden: false,
      driverAddition: false,
      iat: '2021-03-14T19:05:23.000Z',
      lud: '2021-03-14T19:05:23.000Z',
      creator: {
        name: 'User Name',
        username: 'username'
      }
    } as IAppointmentDataProviderModel,
    // 'test-protractor-appointment-title': {
    //   id: '167c7f28-8028-4c48-bc1e-8b1f2c885d7d',
    //   title: 'test-protractor-appointment-title',
    //   description: 'test-protractor-appointment-description',
    //   link: 'test-protractor-appointment-link',
    //   location: 'test-protractor-appointment-location',
    //   date: '2021-03-01 10:05:29',
    //   deadline: '2021-01-01 20:05:23',
    //   maxEnrollments: null,
    //   hidden: false,
    //   driverAddition: false,
    //   creatorId: 'f67e953d-cb85-4f41-b077-4a0bf8485bc5',
    //   iat: '2021-03-14 20:05:28.000000',
    //   lud: '2021-03-14 20:05:23.000000'
    // } as IAppointmentDataProviderModel,
    // 'test-protractor-appointment-driver-title': {
    //   id: '3b47df3e-9e2d-4516-a895-5c6aa6811fb7',
    //   title: 'test-protractor-appointment-driver-title',
    //   description: 'test-protractor-appointment-driver-description',
    //   link: 'test-protractor-appointment-driver-link',
    //   location: 'test-protractor-appointment-driver-location',
    //   date: '2021-03-01 10:05:29',
    //   deadline: '2021-01-01 20:05:23',
    //   maxEnrollments: null,
    //   hidden: false,
    //   driverAddition: true,
    //   creatorId: 'f67e953d-cb85-4f41-b077-4a0bf8485bc5',
    //   iat: '2021-03-14 20:05:28.000000',
    //   lud: '2021-03-14 20:05:23.000000'
    // } as IAppointmentDataProviderModel,
    // 'test-protractor-appointment-no_deadline-title': {
    //   id: 'b63114c9-563e-4571-b909-de109e084753',
    //   title: 'test-protractor-appointment-no_deadline-title',
    //   description: 'test-protractor-appointment-no_deadline-description',
    //   link: 'test-protractor-appointment-no_deadline-link',
    //   location: 'test-protractor-appointment-no_deadline-location',
    //   date: '2021-03-01 10:05:29',
    //   deadline: null,
    //   maxEnrollments: null,
    //   hidden: false,
    //   driverAddition: true,
    //   creatorId: 'f67e953d-cb85-4f41-b077-4a0bf8485bc5',
    //   iat: '2021-03-14 20:05:28.000000',
    //   lud: '2021-03-14 20:05:23.000000'
    // } as IAppointmentDataProviderModel,
    // 'test-protractor-appointment-file-title': {
    //   id: '0569af4b-3947-4eb7-b16d-5ffa1a5a137e',
    //   title: 'test-protractor-appointment-file-title',
    //   description: 'test-protractor-appointment-file-description',
    //   link: 'test-protractor-appointment-file-link',
    //   location: 'test-protractor-appointment-file-location',
    //   date: '2021-03-01 10:05:29',
    //   deadline: '2021-01-01 20:05:23',
    //   maxEnrollments: null,
    //   hidden: false,
    //   driverAddition: true,
    //   creatorId: 'f67e953d-cb85-4f41-b077-4a0bf8485bc5',
    //   iat: '2021-03-14 20:05:28.000000',
    //   lud: '2021-03-14 20:05:23.000000',
    //   files: [
    //     {name: 'testfile-1.pdf'}
    //   ]
    // } as IAppointmentDataProviderModel,
    // 'test-protractor-appointment-enrollment-list-title': {
    //   id: '282a5305-07f0-4c75-b870-1e6ddf8e72c0',
    //   title: 'test-protractor-appointment-enrollment-list-title',
    //   description: 'test-protractor-appointment-enrollment-list-description',
    //   link: 'test-protractor-appointment-enrollment-list-link',
    //   location: 'test-protractor-appointment-enrollment-list-location',
    //   date: '2021-03-01 10:05:29',
    //   deadline: '2021-01-01 20:05:23',
    //   maxEnrollments: null,
    //   hidden: false,
    //   driverAddition: true,
    //   creatorId: 'f67e953d-cb85-4f41-b077-4a0bf8485bc5',
    //   iat: '2021-03-14 20:05:28.000000',
    //   lud: '2021-03-14 20:05:23.000000',
    // } as IAppointmentDataProviderModel
  };

  constructor() {
  }

  public static getAppointmentByLink(identifier: string): IAppointmentDataProviderModel {
    return this.APPOINTMENTS[identifier];
  }
}
