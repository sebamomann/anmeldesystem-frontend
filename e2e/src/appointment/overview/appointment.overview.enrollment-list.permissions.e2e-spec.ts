import {browser} from 'protractor';
import {AppointmentOverviewPage} from './appointment.overview.po';
import {AppointmentDataProvider} from './appointment.data-provider';
import {EnrollmentDataProvider} from './enrollment.data-provider';
import {UsersDataProvider} from './users.data-provider';
import {LocalStoragePage} from '../../general/localStorage.po';
import {LoginPage} from '../../general/login.po';

// const crypto = require('crypto');
//
// const salt = 'mysalt';

let appointmentLink;
let page: AppointmentOverviewPage;
let localStoragePage: LocalStoragePage;
let loginPage: LoginPage;

beforeAll(async () => {
  await browser.get('/'); // needed to be able to clear localStorage

  page = new AppointmentOverviewPage();
  localStoragePage = new LocalStoragePage();
  loginPage = new LoginPage();

  browser.waitForAngularEnabled(false);
});

describe('enrollment list - permission', () => {
  describe('valid permission (as appointment creator)', () => {
    const appointmentCreator = UsersDataProvider.getUser('f67e953d-cb85-4f41-b077-4a0bf8485bc5'); // REGULAR USER 1
    appointmentLink = AppointmentDataProvider.getAppointment('test-protractor-appointment-enrollment-list-title').link;

    let enrollment;

    beforeAll(async () => {
      await localStoragePage.clear();
      await localStoragePage.preventEnrollmentHintForLink(appointmentLink);

      await loginPage.loginViaApi(appointmentCreator);
    });

    beforeEach(async () => {
      await page.navigateToAppointment(appointmentLink);
    });

    describe('enrollment of any user', () => {
      enrollment = EnrollmentDataProvider.getEnrollment('624ddcfb-5f59-4a10-b5c5-1664e20e917e');

      describe('edit', () => {
        beforeEach(() => {
          page.toggleEnrollmentCard(enrollment.id);
          page.clickEnrollmentEditButton(enrollment.id);
        });

        it('should redirect to edit page', () => {
          const url = '/enrollment/edit?a=' + appointmentLink + '&e=' + enrollment.id;
          const pageRedirected = page.pageRedirectedToUrl(url);

          expect(pageRedirected).toBeTruthy('Could not match URL');
        });
      });

      describe('delete', () => {
        beforeEach(() => {
          page.toggleEnrollmentCard(enrollment.id);
          page.clickEnrollmentDeleteButton(enrollment.id);
        });

        it('should prompt delete dialog', () => {
          const isEnrollmentDeletionConfirmationDialogPresent = page.isEnrollmentDeletionConfirmationDialogPresent();
          expect(isEnrollmentDeletionConfirmationDialogPresent).toBeTruthy('Dialog not present');
        });

        describe('click cancel', () => {
          beforeEach(() => {
            page.cancelEnrollmentDeletion();
          });

          it('should hide delete dialog', () => {
            const isEnrollmentDeletionConfirmationDialogPresent = page.isEnrollmentDeletionConfirmationDialogGone();
            expect(!isEnrollmentDeletionConfirmationDialogPresent).toBeFalsy('Dialog is present');
          });
        });
      });
    });
  });

  describe('invalid permission (logged in)', () => {
    const anyUser = UsersDataProvider.getUser('295f2461-5964-4981-bbcd-5e8f667a3b9a'); // REGULAR USER 2 - not enrollment creator
    appointmentLink = AppointmentDataProvider.getAppointment('test-protractor-appointment-enrollment-list-title').link;
    let enrollment;

    beforeAll(async () => {
      await localStoragePage.clear();
      await localStoragePage.preventEnrollmentHintForLink(appointmentLink);

      await loginPage.loginViaApi(anyUser);
    });

    beforeEach(async () => {
      await page.navigateToAppointment(appointmentLink);
    });

    describe('enrollment of any user', () => {
      enrollment = EnrollmentDataProvider.getEnrollment('624ddcfb-5f59-4a10-b5c5-1664e20e917e');

      describe('edit', () => {
        beforeEach(() => {
          page.toggleEnrollmentCard(enrollment.id);
          page.clickEnrollmentEditButton(enrollment.id);
        });

        it('should show missing permission snackbar', () => {
          const isMissingPermissionSnackbarPresent = page.isMissingPermissionSnackbarPresent();
          expect(isMissingPermissionSnackbarPresent).toBeTruthy('Snackbar not present');
        });
      });

      describe('delete', () => {
        beforeEach(() => {
          page.toggleEnrollmentCard(enrollment.id);
          page.clickEnrollmentDeleteButton(enrollment.id);
        });

        it('should show missing permission snackbar', () => {
          const isMissingPermissionSnackbarPresent = page.isMissingPermissionSnackbarPresent();
          expect(isMissingPermissionSnackbarPresent).toBeTruthy('Snackbar not present');
        });
      });
    });
  });

  describe('invalid permission (not logged in)', () => {
    appointmentLink = AppointmentDataProvider.getAppointment('test-protractor-appointment-enrollment-list-title').link;
    let enrollment;

    beforeAll(async () => {
      await localStoragePage.clear();
      await localStoragePage.preventEnrollmentHintForLink(appointmentLink);
    });

    beforeEach(async () => {
      await page.navigateToAppointment(appointmentLink);
    });


    describe('enrollment of any user', () => {
      enrollment = EnrollmentDataProvider.getEnrollment('624ddcfb-5f59-4a10-b5c5-1664e20e917e');

      describe('edit', () => {
        beforeEach(() => {
          page.toggleEnrollmentCard(enrollment.id);
          page.clickEnrollmentEditButton(enrollment.id);
        });

        it('should show missing permission dialog', () => {
          const isMissingPermissionSnackbarPresent = page.isMissingPermissionDialogPresent();
          expect(isMissingPermissionSnackbarPresent).toBeTruthy('Dialog not present');
        });
      });

      describe('delete', () => {
        beforeEach(() => {
          page.toggleEnrollmentCard(enrollment.id);
          page.clickEnrollmentDeleteButton(enrollment.id);
        });

        it('should show missing permission dialog', () => {
          const isMissingPermissionSnackbarPresent = page.isMissingPermissionDialogPresent();
          expect(isMissingPermissionSnackbarPresent).toBeTruthy('Dialog not present');
        });
      });
    });
  });

  afterEach(async () => {
    browser.manage().logs().get('browser').then(browserLogs => {
      // browserLogs is an array of objects with level and message fields
      browserLogs.forEach(log => {
        if (log.level.value > 900) { // it's an error log
          console.log('Browser console error!');
          console.log(log.message);
        }
      });
    });
  });
})
;
