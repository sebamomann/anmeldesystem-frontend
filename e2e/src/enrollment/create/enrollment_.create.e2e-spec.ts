import { browser } from 'protractor';
import { EnrollmentCreatePage } from '../po/enrollment.create.po';
import { LocalStoragePage } from '../../general/localStorage.po';
import { EnrollmentCreatePreparationUtil } from '../utility/enrollment.create.preparation.util';

const enrollmentCreatePreparationUtil: EnrollmentCreatePreparationUtil = new EnrollmentCreatePreparationUtil();

let enrollmentCreatePage: EnrollmentCreatePage;
let localStoragePage: LocalStoragePage;

beforeAll(async () => {
  await browser.get('/'); // needed to be able to clear localStorage

  const localStorageSetter = () => {
    // @ts-ignore
    console.log(window.env);
    // @ts-ignore
    window.env.API_URL = '';
  };

  browser.executeScript(localStorageSetter);

  enrollmentCreatePage = new EnrollmentCreatePage();
  localStoragePage = new LocalStoragePage();

  enrollmentCreatePreparationUtil.enrollmentCreatePage = enrollmentCreatePage;
  enrollmentCreatePreparationUtil.localStoragePage = localStoragePage;

  browser.waitForAngularEnabled(false);
});

const appointmentLink = "valid";

describe('enrollment creation page - general', () => {
  describe(' * not found card', () => {
    describe(' * faulty navigation', () => {
      beforeAll(async () => {
        await enrollmentCreatePage.navigateToEnrollmentCreation('invalid');
      });

      it(' ~ should show appointment not found card', async () => {
        const isAppointmentNotFoundCardPresent = enrollmentCreatePage.isAppointmentNotFoundCardPresent();
        expect(isAppointmentNotFoundCardPresent).toBeTruthy('Appointment not found card should be present but isn\'t');
      });
    });

    describe(' * correct navigation', () => {
      beforeAll(async () => {
        await enrollmentCreatePage.navigateToEnrollmentCreation(appointmentLink);
      });

      it(' ~ appointment not found card hidden', () => {
        const isAppointmentNotFoundCardPresent = enrollmentCreatePage.isAppointmentNotFoundCardPresent();
        expect(isAppointmentNotFoundCardPresent).toBeFalsy('Appointment not found card should not be present but is');
      });
    });
  });

  describe(' * create values (form validation) - error', () => {
    beforeAll(async () => {
      await enrollmentCreatePreparationUtil.loadPage(appointmentLink);
    });

    describe(' * empty name', () => {
      beforeAll(async () => {
        enrollmentCreatePage.waitForFormBuild();
        await enrollmentCreatePage.causeEmptyErrorName();
      });

      it(' ~ should show correct error message', () => {
        expect(enrollmentCreatePage.getNameErrorValue()).toBe('Bitte gebe einen Namen an');
      });
    });
  });
});
