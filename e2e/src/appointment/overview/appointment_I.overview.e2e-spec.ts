import {browser} from 'protractor';
import {AppointmentOverviewPage} from './po/appointment.overview.po';
import {LocalStoragePage} from '../../general/localStorage.po';
import {LoginPage} from '../../general/login.po';
import {EnvironmentPage} from '../../general/environment.po';
import {UsersDataProvider} from './po/users.data-provider';

let page: AppointmentOverviewPage;
let localStoragePage: LocalStoragePage;
let loginPage: LoginPage;
let environmentPage: EnvironmentPage;

beforeAll(async () => {
  await browser.get('/'); // needed to be able to clear localStorage

  const localStorageSetter = () => {
    // @ts-ignore
    console.log(window.env);
    // @ts-ignore
    window.env.API_URL = 'http://localhost:3001/';
  };
  browser.executeScript(localStorageSetter);

  page = new AppointmentOverviewPage();
  loginPage = new LoginPage();
  localStoragePage = new LocalStoragePage();
  environmentPage = new EnvironmentPage();

  browser.waitForAngularEnabled(false);
});

describe('appointment overview', () => {
  describe('not found card', () => {
    describe('faulty navigation', () => {
      beforeAll(async () => {
        await page.navigateToAppointment('invalid');
      });

      it('appointment not found', () => {
        const isAppointmentNotFoundCardPresent = page.isAppointmentNotFoundCardPresent();
        expect(isAppointmentNotFoundCardPresent).toBeTruthy('Appointment not found card should be present but isn\'t');
      });
    });

    describe('correct navigation', () => {
      beforeAll(async () => {
        await page.navigateToAppointment('valid');
      });

      it('not found card hidden', () => {
        const isAppointmentNotFoundCardPresent = page.isAppointmentNotFoundCardPresent();
        expect(isAppointmentNotFoundCardPresent).toBeFalsy('Appointment not found card should not be present but is');
      });
    });
  });

  describe('navigations', () => {
    describe('enrollment creation button', () => {
      const appointmentLink = 'valid';

      beforeAll(async () => {
        await localStoragePage.clear();
        await localStoragePage.preventEnrollmentHintForLink(appointmentLink);
        await localStoragePage.pinAppointment(appointmentLink);

        await page.navigateToAppointment(appointmentLink);
      });

      it('should be present', () => {
        const enrollmentCreationButtonIsPresent = page.isCreationEnrollmentButtonPresent();

        expect(enrollmentCreationButtonIsPresent).toBeTruthy('Enrollment creation button should be present but is not');
      });

      it('should redirect to enrollment creation page', () => {
        page.clickEnrollmentCreationButton();

        const url = '/enrollment/add?a=' + appointmentLink;
        const pageRedirected = page.pageRedirectedToUrl(url);

        expect(pageRedirected).toBeTruthy('Not redirected to enrollment page');
      });
    });

    describe('driver overview button', () => {
      describe('at appointment with no driver addition', () => {
        const appointmentLink = 'valid';

        beforeAll(async () => {
          await localStoragePage.clear();
          await localStoragePage.preventEnrollmentHintForLink(appointmentLink);
          await localStoragePage.pinAppointment(appointmentLink);

          await page.navigateToAppointment(appointmentLink);
        });

        it('should not be present', () => {
          const enrollmentCreationButtonIsPresent = page.isDriverOverviewButtonPresent();

          expect(enrollmentCreationButtonIsPresent).toBeFalsy('Driver overview button should not be present but is');
        });
      });

      describe('at appointment with driver addition', () => {
        const appointmentLink = 'valid-driver';

        beforeAll(async () => {
          await localStoragePage.clear();
          await localStoragePage.preventEnrollmentHintForLink(appointmentLink);
          await localStoragePage.pinAppointment(appointmentLink);

          await page.navigateToAppointment(appointmentLink);
        });

        it('should be present', () => {
          const enrollmentCreationButtonIsPresent = page.isDriverOverviewButtonPresent();

          expect(enrollmentCreationButtonIsPresent).toBeTruthy('Enrollment creation button should be present but is not');
        });

        it('should redirect to enrollment creation page', () => {
          page.clickDriverOverviewButton();

          const url = '/appointment/driver?a=' + appointmentLink;
          const pageRedirected = page.pageRedirectedToUrl(url);

          expect(pageRedirected).toBeTruthy('Could not match URL');
        });
      });
    });
  });

  describe('login hint', () => {
    describe('not logged in', () => {
      beforeAll(async () => {
        const appointmentLink = 'valid';

        await localStoragePage.clear();
        await localStoragePage.preventEnrollmentHintForLink(appointmentLink);
        await localStoragePage.pinAppointment(appointmentLink);

        await page.navigateToAppointment(appointmentLink);
      });

      it('should be visible', () => {
        const isLoginHintPresent = page.isLoginHintPresent();

        expect(isLoginHintPresent).toBe(true, 'Login hint should be present but isn\'t');
      });

      describe('click login button', async () => {
        let url;
        let realm;

        beforeEach(async () => {
          url = await environmentPage.getEnvironmentVariable('keycloak_url');
          realm = await environmentPage.getEnvironmentVariable('keycloak_realm');

          page.clickLoginHintLoginButton();
        });

        it('should redirect to login page', async () => {
          const validRedirect = page.pageRedirectedToUrl(`${url}realms/${realm}/protocol/openid-connect/auth`);

          expect(validRedirect).toBeTruthy('Could not match URL');
        });

        afterEach(async () => {
          await browser.get('/');
        });
      });
    });

    describe('logged in', () => {
      beforeAll(async () => {
        const appointmentLink = 'valid';

        await localStoragePage.clear();
        await localStoragePage.preventEnrollmentHintForLink(appointmentLink);
        await localStoragePage.pinAppointment(appointmentLink);

        await loginPage.loginViaApi(UsersDataProvider.getUser('f67e953d-cb85-4f41-b077-4a0bf8485bc5'));

        await page.navigateToAppointment(appointmentLink);
      });

      it('should not be visible', () => {
        const isLoginHintPresent = page.isLoginHintPresent();

        expect(isLoginHintPresent).toBe(false);
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
