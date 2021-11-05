import { browser } from 'protractor';
import { AppointmentOverviewPage } from './po/appointment.overview.po';

let appointmentPage: AppointmentOverviewPage;

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

  browser.waitForAngularEnabled(false);
});

const appointmentLink = "valid";

/**
 * TODO
 * what about hidden appointments ?
 */

describe('appointment overview - general', () => {
  describe(' * not found card', () => {
    describe(' * faulty navigation', () => {
      beforeAll(async () => {
        await appointmentPage.navigateToAppointment('invalid');
      });

      it(' ~ should show appointment not found card', async () => {
        const isAppointmentNotFoundCardPresent = appointmentPage.isAppointmentNotFoundCardPresent();
        expect(isAppointmentNotFoundCardPresent).toBeTruthy('Appointment not found card should be present but isn\'t');
      });
    });

    describe('* correct navigation', () => {
      beforeAll(async () => {
        await appointmentPage.navigateToAppointment(appointmentLink);
      });

      it(' ~ appointment not found card should be hidden', () => {
        const isAppointmentNotFoundCardPresent = appointmentPage.isAppointmentNotFoundCardPresent();
        expect(isAppointmentNotFoundCardPresent).toBeFalsy('Appointment not found card should not be present but is');
      });
    });
  });
});
