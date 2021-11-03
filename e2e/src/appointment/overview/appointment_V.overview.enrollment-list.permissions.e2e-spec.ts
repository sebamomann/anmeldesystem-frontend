import { LoginPage } from './../../general/login.po';
import { AppointmentOverviewEnrollmentListPage } from './po/appointment.overview.enrollment-list.po';
import { AppointmentOverviewPreparationUtil } from './po/appointment.overview.preparation.util';
import { browser } from 'protractor';
import { AppointmentOverviewPage } from './po/appointment.overview.po';
import { LocalStoragePage } from '../../general/localStorage.po';
import { EnrollmentDataProvider } from './providers/enrollment.data-provider';
import { UsersDataProvider } from './po/users.data-provider';

const appointmentOverviewPreparationUtil: AppointmentOverviewPreparationUtil = new AppointmentOverviewPreparationUtil();

let appointmentPage: AppointmentOverviewPage;
let localStoragePage: LocalStoragePage;
let appointmentOverviewPage: AppointmentOverviewPage;
let appointmentOverviewEnrollmentListPage: AppointmentOverviewEnrollmentListPage;
let loginPage: LoginPage;

// TODO RECHECK DUE TO NEW MOCK MECHANIC

beforeAll(async () => {
  await browser.get('/'); // needed to be able to clear localStorage

  const localStorageSetter = () => {
    // @ts-ignore
    console.log(window.env);
    // @ts-ignore
    window.env.API_URL = 'http://localhost:3001/';
  };
  browser.executeScript(localStorageSetter);

  appointmentPage = new AppointmentOverviewPage();
  localStoragePage = new LocalStoragePage();
  appointmentOverviewEnrollmentListPage = new AppointmentOverviewEnrollmentListPage();
  appointmentOverviewPage = new AppointmentOverviewPage();
  loginPage = new LoginPage();

  appointmentOverviewPreparationUtil.appointmentOverviewPage = appointmentPage;
  appointmentOverviewPreparationUtil.localStoragePage = localStoragePage;
  appointmentOverviewPreparationUtil.loginPage = loginPage;

  browser.waitForAngularEnabled(false);
});

const appointmentLink = 'valid-enrollment-list-permissions';

describe('enrollment list - permissions', () => {
  describe(' * as logged in user', () => {
    const user = UsersDataProvider.getUser('f67e953d-cb85-4f41-b077-4a0bf8485bc5'); // APPOINTMENT CREATOR

    // TODO EXTRACT?
    describe(' * edit enrollment', () => {
      const enrollment = EnrollmentDataProvider.getEnrollment('fa33ed23-e8f5-46f4-a734-dbff28372810');

      beforeAll(async () => {
        await appointmentOverviewPreparationUtil.loadPageWithLogin(appointmentLink, user);
        appointmentOverviewEnrollmentListPage.toggleEnrollmentPanel(enrollment.id);
        appointmentOverviewEnrollmentListPage.clickEnrollmentEditButton(enrollment.id);
      });

      it(' ~ should redirect to edit page', () => {
        const url = '/enrollment/edit?a=' + appointmentLink + '&e=' + enrollment.id;
        const pageRedirected = appointmentOverviewPage.pageRedirectedToUrl(url);

        expect(pageRedirected).toBeTruthy('Not redirected to enrollment edit');
      });
    });

    describe(' * edit enrollment - invalid permissions', () => {
      const enrollment = EnrollmentDataProvider.getEnrollment('775d5788-ebc9-4ab5-ada3-a30b9b02ac4a');

      beforeAll(async () => {
        await appointmentOverviewPreparationUtil.loadPageWithLogin(appointmentLink, user);
        appointmentOverviewEnrollmentListPage.toggleEnrollmentPanel(enrollment.id);
        appointmentOverviewEnrollmentListPage.clickEnrollmentEditButton(enrollment.id);
      });

      it(' ~ should show missing permission snackbar', () => {
        const isMissingPermissionSnackbarPresent = appointmentOverviewEnrollmentListPage.isMissingPermissionSnackbarPresent();
        expect(isMissingPermissionSnackbarPresent).toBeTruthy('Snackbar should be present but isn\'t');
      });
    });

    describe(' * delete enrollment', () => {
      const enrollment = EnrollmentDataProvider.getEnrollment('fa33ed23-e8f5-46f4-a734-dbff28372810');

      beforeAll(async () => {
        await appointmentOverviewPreparationUtil.loadPageWithLogin(appointmentLink, user);
        appointmentOverviewEnrollmentListPage.toggleEnrollmentPanel(enrollment.id);
        appointmentOverviewEnrollmentListPage.clickEnrollmentDeleteButton(enrollment.id);
      });

      it(' ~ should prompt delete dialog', () => {
        const isEnrollmentDeletionConfirmationDialogPresent = appointmentOverviewEnrollmentListPage.isEnrollmentDeletionConfirmationDialogPresent();
        expect(isEnrollmentDeletionConfirmationDialogPresent).toBeTruthy('Dialog should be present but isn\'t');
      });

      describe(' * click cancel', () => {
        beforeAll(() => {
          appointmentOverviewEnrollmentListPage.cancelEnrollmentDeletion();
        });

        it(' ~ should hide delete dialog', () => {
          const isEnrollmentDeletionConfirmationDialogPresent = appointmentOverviewEnrollmentListPage.isEnrollmentDeletionConfirmationDialogGone();
          expect(!isEnrollmentDeletionConfirmationDialogPresent).toBeFalsy('Dialog should be not present but is');
        });
      });
    });

    describe(' * delete enrollment - invalid permissions', () => {
      const enrollment = EnrollmentDataProvider.getEnrollment('775d5788-ebc9-4ab5-ada3-a30b9b02ac4a');

      beforeAll(async () => {
        await appointmentOverviewPreparationUtil.loadPageWithLogin(appointmentLink, user);
        appointmentOverviewEnrollmentListPage.toggleEnrollmentPanel(enrollment.id);
        appointmentOverviewEnrollmentListPage.clickEnrollmentDeleteButton(enrollment.id);
      });

      it(' ~ should show missing permission snackbar', () => {
        const isMissingPermissionSnackbarPresent = appointmentOverviewEnrollmentListPage.isMissingPermissionSnackbarPresent();
        expect(isMissingPermissionSnackbarPresent).toBeTruthy('Snackbar should be present but isn\'t');
      });
    });
  });
});
// describe('invalid permission (not logged in)', () => {
//   beforeAll(async () => {
//     await localStoragePage.clear();
//     await localStoragePage.preventEnrollmentHintForLink(appointmentLink);
//   });

//   beforeAll(async () => {
//     await page.navigateToAppointment(appointmentLink);
//   });


//   describe('enrollment of any user', () => {
//     const enrollment = EnrollmentDataProvider.getEnrollment('4190a4d4-b8a1-4843-9717-a04ffa7b2dbb');

//     describe('edit', () => {
//       beforeAll(() => {
//         enrollmentListPage.toggleEnrollmentPanel(enrollment.id);
//         enrollmentListPage.clickEnrollmentEditButton(enrollment.id);
//       });

//       it('should show missing permission dialog', () => {
//         const isMissingPermissionSnackbarPresent = enrollmentListPage.isMissingPermissionDialogPresent();
//         expect(isMissingPermissionSnackbarPresent).toBeTruthy('Dialog should be present but isn\'t');
//       });
//     });

//     describe('delete', () => {
//       beforeAll(() => {
//         enrollmentListPage.toggleEnrollmentPanel(enrollment.id);
//         enrollmentListPage.clickEnrollmentDeleteButton(enrollment.id);
//       });

//       it('should show missing permission dialog', () => {
//         const isMissingPermissionSnackbarPresent = enrollmentListPage.isMissingPermissionDialogPresent();
//         expect(isMissingPermissionSnackbarPresent).toBeTruthy('Dialog should be present but isn\'t');
//       });
//     });
//   });
// });

// afterAll(async () => {
//   browser.manage().logs().get('browser').then(browserLogs => {
//     // browserLogs is an array of objects with level and message fields
//     browserLogs.forAll(log => {
//       if (log.level.value > 900) { // it's an error log
//         console.log('Browser console error!');
//         console.log(log.message);
//       }
//     });
//   });
// });
//   });
