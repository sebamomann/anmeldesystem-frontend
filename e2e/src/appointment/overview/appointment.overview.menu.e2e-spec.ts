import {browser} from 'protractor';
import {AppointmentOverviewPage} from './po/appointment.overview.po';
import {AppointmentDataProvider} from './providers/appointment.data-provider';
import {UsersDataProvider} from './po/users.data-provider';
import {AppointmentOverviewMenuPage} from './po/appointment.overview.menu.po';
import {LocalStoragePage} from '../../general/localStorage.po';
import {LoginPage} from '../../general/login.po';
import {AppointmentOverviewDataPage} from './po/appointment.overview.data.po';

// const crypto = require('crypto');
//
// const salt = 'mysalt';

let appointmentLink;
let appointmentPage: AppointmentOverviewPage;
let appointmentDataPage: AppointmentOverviewDataPage;
let menuPage: AppointmentOverviewMenuPage;
let localStoragePage: LocalStoragePage;
let loginPage: LoginPage;

beforeAll(async () => {
  await browser.get('/');

  appointmentPage = new AppointmentOverviewPage();
  appointmentDataPage = new AppointmentOverviewDataPage();
  menuPage = new AppointmentOverviewMenuPage();
  localStoragePage = new LocalStoragePage();
  loginPage = new LoginPage();

  browser.waitForAngularEnabled(false);
});

describe('Appointment Overview Menu Page', () => {
  describe('Menu', () => {
    describe('general', () => {
      beforeAll(async () => {
        appointmentLink = AppointmentDataProvider.getAppointment('test-protractor-appointment-title').link;

        await localStoragePage.clear();
        await localStoragePage.preventEnrollmentHintForLink(appointmentLink);
        await localStoragePage.pinAppointment(appointmentLink);

        await appointmentPage.navigateToAppointment(appointmentLink);
      });

      it('click menu should open menu', () => {
        appointmentDataPage.openAppointmentMenu();
        const isMenuOpened = appointmentDataPage.isMenuOpened();

        expect(isMenuOpened).toBeTruthy(`Menu did not open`);
      });
    });

    describe('not logged in', () => {
      beforeAll(async () => {
        appointmentLink = AppointmentDataProvider.getAppointment('test-protractor-appointment-title').link;

        await localStoragePage.clear();
        await localStoragePage.preventEnrollmentHintForLink(appointmentLink);
        await localStoragePage.setSettingsObject({});

        await appointmentPage.navigateToAppointment(appointmentLink);
      });

      describe('click menu', () => {
        beforeAll(() => {
          menuPage.openAppointmentMenu();
        });

        it('should have 3 menu items', () => {
          const menuItems = menuPage.getMenuItems();
          const nrOfMenuItems = menuItems.count();

          expect(nrOfMenuItems).toBe(3);
        });

        it('menu items should have correct names', async () => {
          const items = await menuPage.getMenuItemsNames();

          const isItemValid = items[1] === 'Anpinnen' || items[1] === 'Entfernen';

          expect(items[0]).toEqual('Teilen');
          expect(isItemValid).toBeTruthy();
          expect(items[2]).toEqual('Benachrichtigungen aktivieren');
        });
      });
    });

    describe('logged In', () => {
      beforeAll(async () => {
        appointmentLink = AppointmentDataProvider.getAppointment('test-protractor-appointment-title').link;

        await localStoragePage.clear();
        await localStoragePage.preventEnrollmentHintForLink(appointmentLink);
        await localStoragePage.pinAppointment(appointmentLink);

        await loginPage.loginViaApi(UsersDataProvider.getUser('f67e953d-cb85-4f41-b077-4a0bf8485bc5'));

        await appointmentPage.navigateToAppointment(appointmentLink);
      });

      describe('click menu', () => {
        beforeAll(() => {
          menuPage.openAppointmentMenu();
        });

        it('should open menu', () => {
          const isMenuOpened = menuPage.isMenuOpened();

          expect(isMenuOpened).toBe(true);
        });

        it('should have 4 menu items', () => {
          const menuItems = menuPage.getMenuItems();
          const nrOfMenuItems = menuItems.count();

          expect(nrOfMenuItems).toBe(4);
        });

        it('menu items should have correct name', async () => {
          const items = await menuPage.getMenuItemsNames();

          const isItemValid = items[1] === 'Anpinnen' || items[1] === 'Entfernen';

          expect(items[0]).toEqual('Teilen');
          expect(isItemValid).toBeTruthy();
          expect(items[2]).toEqual('Einstellungen');
          expect(items[3]).toEqual('Benachrichtigungen aktivieren');
        });
      });
    });

    describe('pin check', () => {
      describe('not pinned', () => {
        beforeAll(async () => {
          appointmentLink = AppointmentDataProvider.getAppointment('test-protractor-appointment-title').link;

          await localStoragePage.clear();
          await localStoragePage.preventEnrollmentHintForLink(appointmentLink);
          await localStoragePage.setSettingsObject({autoPinAppointment: false}); // make sure autopin is disabled

          await appointmentPage.navigateToAppointment(appointmentLink);
        });

        describe('click menu', () => {
          beforeAll(() => {
            menuPage.openAppointmentMenu();
          });

          it('menu items should have correct name', async () => {
            const items = await menuPage.getMenuItemsNames();

            expect(items[1]).toEqual('Anpinnen');
          });
        });
      });

      describe('pinned', () => {
        beforeAll(async () => {
          appointmentLink = AppointmentDataProvider.getAppointment('test-protractor-appointment-title').link;

          await localStoragePage.clear();
          await localStoragePage.preventEnrollmentHintForLink(appointmentLink);
          await localStoragePage.setSettingsObject({autoPinAppointment: false}); // make sure autopin is disabled
          await localStoragePage.pinAppointment(appointmentLink);

          await appointmentPage.navigateToAppointment(appointmentLink);
        });

        describe('click menu', () => {
          beforeAll(() => {
            menuPage.openAppointmentMenu();
          });

          it('menu items should have correct name', async () => {
            const items = await menuPage.getMenuItemsNames();

            expect(items[1]).toEqual('Entfernen');
          });
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
