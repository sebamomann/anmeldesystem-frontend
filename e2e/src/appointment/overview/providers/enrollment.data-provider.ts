import {IEnrollmentDataProviderModel} from '../../../IEnrollmentDataProviderModel';

export class EnrollmentDataProvider {
  private static ENROLLMENTS = {
    '0614b2e5-d283-41fe-bc54-ce2527bfd308': {
      id: '0614b2e5-d283-41fe-bc54-ce2527bfd308',
      name: null,
      comment: 'test-protractor-appointment-comment-creator-1',
      creatorId: 'bcf27563-e7b0-4334-ab91-d35bbb5e63f2',
      iat: '2021-01-01 05:01:23',
      lud: '2021-03-01 05:05:23',
    } as IEnrollmentDataProviderModel,
    'c36b8c96-db97-4869-8bd6-35f0acbd96f1': {
      id: 'c36b8c96-db97-4869-8bd6-35f0acbd96f1',
      name: 'test-protractor-appointment-name-1',
      comment: 'test-protractor-appointment-comment-1',
      creatorId: null,
      iat: '2021-01-01 05:04:23',
      lud: '2021-03-01 05:05:23',
    } as IEnrollmentDataProviderModel,
    '624ddcfb-5f59-4a10-b5c5-1664e20e917e': {
      id: '624ddcfb-5f59-4a10-b5c5-1664e20e917e',
      name: null,
      comment: 'test-protractor-appointment-regularuser-comment',
      creatorId: 'bcf27563-e7b0-4334-ab91-d35bbb5e63f2',
      iat: '2021-01-01 05:04:23',
      lud: '2021-03-01 05:05:23',
    } as IEnrollmentDataProviderModel,
    '055981d2-c49a-4070-9bcc-1a8688e2b381': {
      id: '055981d2-c49a-4070-9bcc-1a8688e2b381',
      name: 'test-protractor-appointment-unknown-name',
      comment: 'test-protractor-appointment-unknown-comment',
      creatorId: null,
      iat: '2021-01-01 05:04:23',
      lud: '2021-03-01 05:05:23',
    } as IEnrollmentDataProviderModel
  };

  constructor() {
  }

  public static getEnrollment(identifier: string): IEnrollmentDataProviderModel {
    return this.ENROLLMENTS[identifier];
  }
}
