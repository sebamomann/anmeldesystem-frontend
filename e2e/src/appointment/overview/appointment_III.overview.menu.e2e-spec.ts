import { browser } from 'protractor';
import { AppointmentOverviewPage } from './po/appointment.overview.po';
import { UsersDataProvider } from './po/users.data-provider';
import { AppointmentOverviewMenuPage } from './po/appointment.overview.menu.po';
import { LocalStoragePage } from '../../general/localStorage.po';
import { AppointmentOverviewPreparationUtil } from './po/appointment.overview.preparation.util';
import { LoginPage } from './../../general/login.po';

const appointmentOverviewPreparationUtil: AppointmentOverviewPreparationUtil = new AppointmentOverviewPreparationUtil();

let appointmentPage: AppointmentOverviewPage;
let appointmentOverviewMenuPage: AppointmentOverviewMenuPage;
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
  localStoragePage = new LocalStoragePage();
  loginPage = new LoginPage();
  appointmentOverviewMenuPage = new AppointmentOverviewMenuPage();

  appointmentOverviewPreparationUtil.appointmentOverviewPage = appointmentPage;
  appointmentOverviewPreparationUtil.localStoragePage = localStoragePage;
  appointmentOverviewPreparationUtil.loginPage = loginPage;

  browser.waitForAngularEnabled(false);
});

const appointmentLink = "valid";

describe('appointment overview - menu', () => {
  describe(' * general', () => {
    beforeAll(async () => {
      await appointmentOverviewPreparationUtil.loadPage(appointmentLink);
    });

    describe(' * click on menu', () => {
      beforeAll(() => {
        appointmentOverviewMenuPage.clickMenuIcon();
      })

      it('~ open menu', () => {
        const isMenuOpened = appointmentOverviewMenuPage.isMenuOpened();
        expect(isMenuOpened).toBeTruthy(`Menu should open but didnt`);
      });
    })
  });

  describe(' * not logged in', () => {
    beforeAll(async () => {
      await appointmentOverviewPreparationUtil.loadPage(appointmentLink);
    });

    describe(' * click on menu', () => {
      beforeAll(() => {
        appointmentOverviewMenuPage.clickMenuIcon();
      })

      it('~ open menu', () => {
        const isMenuOpened = appointmentOverviewMenuPage.isMenuOpened();
        expect(isMenuOpened).toBeTruthy(`Menu should open but didnt`);
      });

      describe(' * menu items', () => {
        it(' ~ should be 3', () => {
          const menuItems = appointmentOverviewMenuPage.getMenuItems();
          const nrOfMenuItems = menuItems.count();

          expect(nrOfMenuItems).toBe(3);
        });

        it(' ~ should have correct values', async () => {
          const items = await appointmentOverviewMenuPage.getMenuItemsNames();

          // actual pin behaviour covered in different test
          const isItemValid = items[1] === 'Anpinnen' || items[1] === 'Entfernen';

          expect(items[0]).toEqual('Teilen');
          expect(isItemValid).toBeTruthy();
          expect(items[2]).toEqual('Benachrichtigungen aktivieren');
        });
      });
    });
  });

  describe(' * logged in', () => {
    const user = UsersDataProvider.getUser('f67e953d-cb85-4f41-b077-4a0bf8485bc5'); // appointment creator (not realy but yeah)

    beforeAll(async () => {
      await appointmentOverviewPreparationUtil.loadPageWithLogin(appointmentLink, user);
    });

    describe(' * click on menu', () => {
      beforeAll(() => {
        appointmentOverviewMenuPage.clickMenuIcon();
      })

      it('~ open menu', () => {
        const isMenuOpened = appointmentOverviewMenuPage.isMenuOpened();
        expect(isMenuOpened).toBeTruthy(`Menu should open but didnt`);
      });

      describe(' * menu items', () => {
        it(' ~ should be 4', () => {
          const menuItems = appointmentOverviewMenuPage.getMenuItems();
          const nrOfMenuItems = menuItems.count();

          expect(nrOfMenuItems).toBe(4);
        });

        it(' ~ should have correct values', async () => {
          const items = await appointmentOverviewMenuPage.getMenuItemsNames();

          // actual pin behaviour covered in different test
          const isItemValid = items[1] === 'Anpinnen' || items[1] === 'Entfernen';

          expect(items[0]).toEqual('Teilen');
          expect(isItemValid).toBeTruthy();
          expect(items[2]).toEqual('Einstellungen');
          expect(items[3]).toEqual('Benachrichtigungen aktivieren');
        });
      });
    });
  });

  describe(' * pin check', () => {
    describe(' * not pinned', () => {
      beforeAll(async () => {
        await appointmentOverviewPreparationUtil.loadPage(appointmentLink);
        await localStoragePage.set("appointment-pins", []);
        await localStoragePage.set("settings", { autoPinAppointment: false });
      });

      describe(' * click on menu', () => {
        beforeAll(() => {
          appointmentOverviewMenuPage.clickMenuIcon();
        })

        describe(' * menu item', () => {
          it(' ~ should have correct value', async () => {
            const value = await appointmentOverviewMenuPage.getMenuItemValueById("appointment-menu-pin");
            expect(value).toEqual('Anpinnen');
          });
        });
      });
    });
  });

  describe('pinned', () => {
    beforeAll(async () => {
      await appointmentOverviewPreparationUtil.loadPage(appointmentLink);
      await localStoragePage.set("appointment-pins", [appointmentLink]);
      await localStoragePage.set("settings", { autoPinAppointment: false });
    });

    describe(' * click on menu', () => {
      beforeAll(async () => {
        await appointmentOverviewMenuPage.clickMenuIcon();
      })

      describe(' * menu item', () => {
        it(' ~ should have correct value', async () => {
          const value = await appointmentOverviewMenuPage.getMenuItemValueById("appointment-menu-pin");
          expect(value).toEqual('Entfernen');
        });
      });
    });
  });
});
