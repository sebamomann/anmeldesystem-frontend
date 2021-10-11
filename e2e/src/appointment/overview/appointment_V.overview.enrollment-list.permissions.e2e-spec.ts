import {browser} from 'protractor';
import {AppointmentOverviewPage} from './po/appointment.overview.po';
import {EnrollmentDataProvider} from './providers/enrollment.data-provider';
import {UsersDataProvider} from './po/users.data-provider';
import {LocalStoragePage} from '../../general/localStorage.po';
import {LoginPage} from '../../general/login.po';
import {AppointmentOverviewEnrollmentListPage} from './po/appointment.overview.enrollment-list.po';

let page: AppointmentOverviewPage;
let enrollmentListPage: AppointmentOverviewEnrollmentListPage;
let localStoragePage: LocalStoragePage;
let loginPage: LoginPage;

const appointmentLink = 'valid';

beforeAll(async () => {
  await browser.get('/'); // needed to be able to clear localStorage

  page = new AppointmentOverviewPage();
  enrollmentListPage = new AppointmentOverviewEnrollmentListPage();
  localStoragePage = new LocalStoragePage();
  loginPage = new LoginPage();

  browser.waitForAngularEnabled(false);
});

describe('enrollment list - permission', () => {
  describe('valid permission (as appointment creator)', () => {
    const appointmentCreator = UsersDataProvider.getUser('f67e953d-cb85-4f41-b077-4a0bf8485bc5'); // APPOINTMENT CREATOR

    beforeAll(async () => {
      await localStoragePage.clear();
      await localStoragePage.preventEnrollmentHintForLink(appointmentLink);

      await loginPage.loginViaApi(appointmentCreator);
    });

    beforeEach(async () => {
      await page.navigateToAppointment(appointmentLink);
    });

    describe('enrollment of any user', () => {
      const enrollment = EnrollmentDataProvider.getEnrollment('0614b2e5-d283-41fe-bc54-ce2527bfd308');

      describe('edit', () => {
        beforeEach(() => {
          enrollmentListPage.toggleEnrollmentPanel(enrollment.id);
          enrollmentListPage.clickEnrollmentEditButton(enrollment.id);
        });

        it('should redirect to edit page', () => {
          const url = '/enrollment/edit?a=' + appointmentLink + '&e=' + enrollment.id;
          const pageRedirected = page.pageRedirectedToUrl(url);

          expect(pageRedirected).toBeTruthy('Not redirected to enrollment edit');
        });
      });

      describe('delete', () => {
        beforeEach(() => {
          enrollmentListPage.toggleEnrollmentPanel(enrollment.id);
          enrollmentListPage.clickEnrollmentDeleteButton(enrollment.id);
        });

        it('should prompt delete dialog', () => {
          const isEnrollmentDeletionConfirmationDialogPresent = enrollmentListPage.isEnrollmentDeletionConfirmationDialogPresent();
          expect(isEnrollmentDeletionConfirmationDialogPresent).toBeTruthy('Dialog should be present but isn\'t');
        });

        describe('click cancel', () => {
          beforeEach(() => {
            enrollmentListPage.cancelEnrollmentDeletion();
          });

          it('should hide delete dialog', () => {
            const isEnrollmentDeletionConfirmationDialogPresent = enrollmentListPage.isEnrollmentDeletionConfirmationDialogGone();
            expect(!isEnrollmentDeletionConfirmationDialogPresent).toBeFalsy('Dialog should be not present but is');
          });
        });
      });
    });
  });

  describe('invalid permission (logged in)', () => {
    const anyUser = UsersDataProvider.getUser('daf0610f-f71a-451a-8d2b-a3854f80daba'); // REGULAR USER 1

    beforeAll(async () => {
      await localStoragePage.clear();
      await localStoragePage.preventEnrollmentHintForLink(appointmentLink);

      await loginPage.loginViaApi(anyUser);
    });

    beforeEach(async () => {
      await page.navigateToAppointment(appointmentLink);
    });

    describe('enrollment of any user', () => {
      const enrollment = EnrollmentDataProvider.getEnrollment('4190a4d4-b8a1-4843-9717-a04ffa7b2dbb');

      describe('edit', () => {
        beforeEach(() => {
          enrollmentListPage.toggleEnrollmentPanel(enrollment.id);
          enrollmentListPage.clickEnrollmentEditButton(enrollment.id);
        });

        it('should show missing permission snackbar', () => {
          const isMissingPermissionSnackbarPresent = enrollmentListPage.isMissingPermissionSnackbarPresent();
          expect(isMissingPermissionSnackbarPresent).toBeTruthy('Snackbar should be present but isn\'t');
        });
      });

      describe('delete', () => {
        beforeEach(() => {
          enrollmentListPage.toggleEnrollmentPanel(enrollment.id);
          enrollmentListPage.clickEnrollmentDeleteButton(enrollment.id);
        });

        it('should show missing permission snackbar', () => {
          const isMissingPermissionSnackbarPresent = enrollmentListPage.isMissingPermissionSnackbarPresent();
          expect(isMissingPermissionSnackbarPresent).toBeTruthy('Snackbar should be present but isn\'t');
        });
      });
    });
  });

  describe('invalid permission (not logged in)', () => {
    beforeAll(async () => {
      await localStoragePage.clear();
      await localStoragePage.preventEnrollmentHintForLink(appointmentLink);
    });

    beforeEach(async () => {
      await page.navigateToAppointment(appointmentLink);
    });


    describe('enrollment of any user', () => {
      const enrollment = EnrollmentDataProvider.getEnrollment('4190a4d4-b8a1-4843-9717-a04ffa7b2dbb');

      describe('edit', () => {
        beforeEach(() => {
          enrollmentListPage.toggleEnrollmentPanel(enrollment.id);
          enrollmentListPage.clickEnrollmentEditButton(enrollment.id);
        });

        it('should show missing permission dialog', () => {
          const isMissingPermissionSnackbarPresent = enrollmentListPage.isMissingPermissionDialogPresent();
          expect(isMissingPermissionSnackbarPresent).toBeTruthy('Dialog should be present but isn\'t');
        });
      });

      describe('delete', () => {
        beforeEach(() => {
          enrollmentListPage.toggleEnrollmentPanel(enrollment.id);
          enrollmentListPage.clickEnrollmentDeleteButton(enrollment.id);
        });

        it('should show missing permission dialog', () => {
          const isMissingPermissionSnackbarPresent = enrollmentListPage.isMissingPermissionDialogPresent();
          expect(isMissingPermissionSnackbarPresent).toBeTruthy('Dialog should be present but isn\'t');
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
});
