import {IUserDataProviderModel} from '../../../IUserDataProviderModel';

export class UsersDataProvider {
  private static USERS = {
    'f67e953d-cb85-4f41-b077-4a0bf8485bc5': {
      id: 'f67e953d-cb85-4f41-b077-4a0bf8485bc5',
      username: 'gjm-test-protractor-appointment-creator-user',
      mail: 'gjm-test-protractor-appointment-creator-user@testing.go-join.me',
      firstName: 'GJM-TestUser-Protractor',
      lastName: 'Appointment-Creator',
      password: 'KSyuAUdWiOocKtRtctcAUDyVMRBrruwYXqon'
    },
    'bcf27563-e7b0-4334-ab91-d35bbb5e63f2': {
      id: 'bcf27563-e7b0-4334-ab91-d35bbb5e63f2',
      username: 'gjm-test-protractor-general-enrollmentcreator-user-1',
      mail: 'gjm-test-protractor-general-enrollmentcreator-user-1@testing.go-join.me',
      firstName: 'GJM-TestUser-Protractor',
      lastName: 'General-EnrollmentCreator-1',
      password: 'AuAngAQLbuWBZAnAwanruFftYPOcuNOkDHSz',
    },
    '295f2461-5964-4981-bbcd-5e8f667a3b9a': {
      id: '295f2461-5964-4981-bbcd-5e8f667a3b9a',
      username: 'gjm-test-protractor-general-enrollmentcreator-user-2',
      mail: 'gjm-test-protractor-general-enrollmentcreator-user-2@testing.go-join.me',
      firstName: 'GJM-TestUser-Protractor',
      lastName: 'General-EnrollmentCreator-2',
      password: 'mWZWxOaEDFXZNwOzaGhANXjzEhlXZSKsgRLM',
    },
    'daf0610f-f71a-451a-8d2b-a3854f80daba': {
      id: 'daf0610f-f71a-451a-8d2b-a3854f80daba',
      username: 'gjm-test-protractor-general-regularuser-user-1',
      mail: 'gjm-test-protractor-general-regularuser-user-1@testing.go-join.me',
      firstName: 'GJM-TestUser-Protractor',
      lastName: 'General-RegularUser-1',
      password: 'ITDpsInGsubbjUkRFWulKJmVFOCfqWcweqBF',
    }
  };

  constructor() {
  }

  public static getUser(identifier: string): IUserDataProviderModel {
    return this.USERS[identifier];
  }
}
