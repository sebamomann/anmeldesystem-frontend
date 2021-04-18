import {IAppointmentDataProviderModel} from '../../IAppointmentDataProviderModel';

export class AppointmentDataProvider {
  private static APPOINTMENTS = {
    'test-protractor-appointment-title': {
      id: '167c7f28-8028-4c48-bc1e-8b1f2c885d7d',
      title: 'test-protractor-appointment-title',
      description: 'test-protractor-appointment-description',
      link: 'test-protractor-appointment-link',
      location: 'test-protractor-appointment-location',
      date: '2021-03-01 10:05:29',
      deadline: '2021-01-01 20:05:23',
      maxEnrollments: null,
      hidden: false,
      driverAddition: false,
      creatorId: 'f67e953d-cb85-4f41-b077-4a0bf8485bc5',
      iat: '2021-03-14 20:05:28.000000',
      lud: '2021-03-14 20:05:23.000000'
    } as IAppointmentDataProviderModel,
    'test-protractor-appointment-driver-title': {
      id: '3b47df3e-9e2d-4516-a895-5c6aa6811fb7',
      title: 'test-protractor-appointment-driver-title',
      description: 'test-protractor-appointment-driver-description',
      link: 'test-protractor-appointment-driver-link',
      location: 'test-protractor-appointment-driver-location',
      date: '2021-03-01 10:05:29',
      deadline: '2021-01-01 20:05:23',
      maxEnrollments: null,
      hidden: false,
      driverAddition: true,
      creatorId: 'f67e953d-cb85-4f41-b077-4a0bf8485bc5',
      iat: '2021-03-14 20:05:28.000000',
      lud: '2021-03-14 20:05:23.000000'
    } as IAppointmentDataProviderModel
  };

  constructor() {
  }

  public static getAppointment(identifier: string): IAppointmentDataProviderModel {
    return this.APPOINTMENTS[identifier];
  }
}
