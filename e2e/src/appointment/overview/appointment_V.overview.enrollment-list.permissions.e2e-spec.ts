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
        const isMissingPermissionSnackbarPresent = appointmentOverviewEnrollmentListPage.getMissingPermissionSnackbar();
        expect(isMissingPermissionSnackbarPresent.getText()).toEqual('Fehlende Berechtigungen');
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
        const isMissingPermissionSnackbarPresent = appointmentOverviewEnrollmentListPage.getMissingPermissionSnackbar();
        expect(isMissingPermissionSnackbarPresent.getText()).toEqual('Fehlende Berechtigungen');
      });
    });
  });

  describe(' * as unknown user', () => {
    const enrollmentEditTokenValid = 'valid-enrollment-edit-token';
    const enrollmentEditTokenInvalid = 'invalid-enrollment-edit-token';

    describe(' * edit enrollment', () => {
      const enrollment = EnrollmentDataProvider.getEnrollment('49abf491-b8e3-40bf-8e68-b88b06b279ca');

      beforeAll(async () => {
        await appointmentOverviewPreparationUtil.loadPageWithPermissionToken(appointmentLink, enrollment.id, enrollmentEditTokenValid);
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
      const enrollment = EnrollmentDataProvider.getEnrollment('1b1d3fa5-6817-4544-abeb-98fd7da3ffba');

      beforeAll(async () => {
        await appointmentOverviewPreparationUtil.loadPageWithPermissionToken(appointmentLink, enrollment.id, enrollmentEditTokenInvalid);
        appointmentOverviewEnrollmentListPage.toggleEnrollmentPanel(enrollment.id);
        appointmentOverviewEnrollmentListPage.clickEnrollmentEditButton(enrollment.id);
      });

      it(' ~ should show missing permission dialog', () => {
        const isMissingPermissionSnackbarPresent = appointmentOverviewEnrollmentListPage.isMissingPermissionDialogPresent();
        expect(isMissingPermissionSnackbarPresent).toBeTruthy('Dialog should be present but isn\'t');
      });
    });

    describe(' * delete enrollment', () => {
      const enrollment = EnrollmentDataProvider.getEnrollment('49abf491-b8e3-40bf-8e68-b88b06b279ca');

      beforeAll(async () => {
        await appointmentOverviewPreparationUtil.loadPageWithPermissionToken(appointmentLink, enrollment.id, enrollmentEditTokenValid);
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
      const enrollment = EnrollmentDataProvider.getEnrollment('1b1d3fa5-6817-4544-abeb-98fd7da3ffba');

      beforeAll(async () => {
        await appointmentOverviewPreparationUtil.loadPageWithPermissionToken(appointmentLink, enrollment.id, enrollmentEditTokenInvalid);
        appointmentOverviewEnrollmentListPage.toggleEnrollmentPanel(enrollment.id);
        appointmentOverviewEnrollmentListPage.clickEnrollmentDeleteButton(enrollment.id);
      });

      it(' ~ should show missing permission dialog', () => {
        const isMissingPermissionSnackbarPresent = appointmentOverviewEnrollmentListPage.isMissingPermissionDialogPresent();
        expect(isMissingPermissionSnackbarPresent).toBeTruthy('Dialog should be present but isn\'t');
      });
    });
  });
});
