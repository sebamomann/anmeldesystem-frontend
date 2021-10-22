import { browser } from 'protractor';
import { AppointmentOverviewPage } from './po/appointment.overview.po';
import { LocalStoragePage } from '../../general/localStorage.po';
import { LoginPage } from '../../general/login.po';
import { UsersDataProvider } from './po/users.data-provider';
import { AppointmentOverviewPreparationUtil } from './po/appointment.overview.preparation.util';

const appointmentOverviewPreparationUtil: AppointmentOverviewPreparationUtil = new AppointmentOverviewPreparationUtil();

let appointmentPage: AppointmentOverviewPage;
let localStoragePage: LocalStoragePage;
let loginPage: LoginPage;

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
  loginPage = new LoginPage();
  localStoragePage = new LocalStoragePage();

  appointmentOverviewPreparationUtil.appointmentOverviewPage = appointmentPage;
  appointmentOverviewPreparationUtil.localStoragePage = localStoragePage;
  appointmentOverviewPreparationUtil.loginPage = loginPage;

  browser.waitForAngularEnabled(false);
});

const appointmentLink = "valid";
const appointmentDriverLink = "valid-driver";

describe('appointment overview - navigations', () => {
  describe(' * enrollment creation button', () => {
    beforeAll(async () => {
      await appointmentOverviewPreparationUtil.loadPage(appointmentLink);
    });

    it(' ~ should be present', () => {
      const enrollmentCreationButtonIsPresent = appointmentPage.isCreationEnrollmentButtonPresent();
      expect(enrollmentCreationButtonIsPresent).toBeTruthy('Enrollment creation button should be present but is not');
    });

    describe(' *  on click', () => {
      beforeAll(() => {
        appointmentPage.clickEnrollmentCreationButton();
      });
      it(' ~ should redirect to enrollment creation page', () => {
        const url = '/enrollment/add?a=' + appointmentLink;
        const pageRedirected = appointmentPage.pageRedirectedToUrl(url);

        expect(pageRedirected).toBeTruthy('Not redirected to enrollment page');
      });
    })
  });

  describe(' * driver overview button', () => {
    describe(' * at appointment with no driver addition', () => {
      beforeAll(async () => {
        await appointmentOverviewPreparationUtil.loadPage(appointmentLink);
      });

      it(' ~ should not be present', () => {
        const enrollmentCreationButtonIsPresent = appointmentPage.isDriverOverviewButtonPresent();
        expect(enrollmentCreationButtonIsPresent).toBeFalsy('Driver overview button should not be present but is');
      });
    });

    describe(' * at appointment with driver addition', () => {
      beforeAll(async () => {
        await appointmentOverviewPreparationUtil.loadPage(appointmentDriverLink);
      });

      it(' ~ should be present', () => {
        const enrollmentCreationButtonIsPresent = appointmentPage.isDriverOverviewButtonPresent();
        expect(enrollmentCreationButtonIsPresent).toBeTruthy('Enrollment creation button should be present but is not');
      });

      it(' ~ should redirect to driver page', () => {
        appointmentPage.clickDriverOverviewButton();

        const url = '/appointment/driver?a=' + appointmentDriverLink;
        const pageRedirected = appointmentPage.pageRedirectedToUrl(url);

        expect(pageRedirected).toBeTruthy('No redirect to driver page');
      });
    });
  });

  describe(' * login hint', () => {
    describe(' * as not logged in user', () => {
      beforeAll(async () => {
        await appointmentOverviewPreparationUtil.loadPage(appointmentLink);
      });

      it(' ~ should be visible', () => {
        const isLoginHintPresent = appointmentPage.isLoginHintPresent();
        expect(isLoginHintPresent).toBe(true, 'Login hint should be present but isn\'t');
      });

      describe(' * on click', async () => {
        /**
         * {@link loginUrl} needs to be read before redirect to keycloak due to window.env
         * @HoursWasted 1
         */
        const loginUrl = await loginPage.getURLOfLogin();

        beforeEach(async () => {
          appointmentPage.clickLoginHintLoginButton();
        });

        it(' ~ should redirect to login page', async () => {
          const validRedirect = appointmentPage.pageRedirectedToUrl(loginUrl);
          expect(validRedirect).toBeTruthy('No redirect to login page');
        });
      });
    });

    describe(' * as logged in user', () => {
      const user = UsersDataProvider.getUser('f67e953d-cb85-4f41-b077-4a0bf8485bc5');

      beforeAll(async () => {
        await appointmentOverviewPreparationUtil.loadPageWithLogin(appointmentLink, user);
      });

      it(' ~ should not be visible', () => {
        const isLoginHintPresent = appointmentPage.isLoginHintPresent();
        expect(isLoginHintPresent).toBe(false, "Login hint should not be visible but is");
      });
    });
  });
});
