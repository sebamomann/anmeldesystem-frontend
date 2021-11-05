import { browser } from 'protractor';
import { LocalStoragePage } from '../../general/localStorage.po';
import { LoginPage } from '../../general/login.po';
import { EnrollmentEditPage } from '../po/enrollment.edit.po';
import { EnrollmentEditPreparationUtil } from '../utility/enrollment.edit.preparation.util';
import { EnrollmentEditTestUtil } from '../utility/enrollment.edit.test.util';

const enrollmentEditPreparationUtil: EnrollmentEditPreparationUtil = new EnrollmentEditPreparationUtil();
const enrollmentEditTestUtil: EnrollmentEditTestUtil = new EnrollmentEditTestUtil();

let enrollmentEditPage: EnrollmentEditPage;
let localStoragePage: LocalStoragePage;
let loginPage: LoginPage;

beforeAll(async () => {
  await browser.get('/'); // needed to be able to clear localStorage

  const localStorageSetter = () => {
    // @ts-ignore
    console.log(window.env);
    // @ts-ignore
    window.env.API_URL = '';
  };

  browser.executeScript(localStorageSetter);

  enrollmentEditPage = new EnrollmentEditPage();
  localStoragePage = new LocalStoragePage();
  loginPage = new LoginPage();

  enrollmentEditPreparationUtil.enrollmentEditPage = enrollmentEditPage;
  enrollmentEditPreparationUtil.localStoragePage = localStoragePage;
  enrollmentEditPreparationUtil.loginPage = loginPage;

  enrollmentEditTestUtil.enrollmentEditPage = enrollmentEditPage;

  browser.waitForAngularEnabled(false);
});

const appointmentLink = 'valid-enrollments-edit';
const enrollmentId = '1ff2e7e7-9048-46b2-b02b-fe95b874ef6d';
const enrollmentEditTokenValid = 'valid-enrollment-edit-token';

const enrollment = {
  name: 'Unknown Enrollment One',
  comment: 'Comment One'
}

describe(' * enrollment edit page - general', () => {
  describe(' * not found card', () => {
    describe(' * faulty navigation', () => {
      describe(' * invalid appointment', () => {
        beforeAll(async () => {
          await enrollmentEditPage.navigateToEnrollmentEdit('invalid', '00000000-0000-0000-0000-000000000000');
        });

        it(' ~ should show appointment not found card', async () => {
          const isAppointmentNotFoundCardPresent = enrollmentEditPage.isAppointmentNotFoundCardPresent();
          expect(isAppointmentNotFoundCardPresent).toBeTruthy('Appointment not found card should be present but isn\'t');
        });
      });

      describe(' * invalid enrollment', () => {
        beforeAll(async () => {
          await enrollmentEditPage.navigateToEnrollmentEdit(appointmentLink, '00000000-0000-0000-0000-000000000000');
        });

        it(' ~ should show enrollment not found card', async () => {
          const isEnrollmentNotFoundCardPresent = enrollmentEditPage.isEnrollmentNotFoundCardPresent();
          expect(isEnrollmentNotFoundCardPresent).toBeTruthy('Enrollment not found card should be present but isn\'t');
        });
      });
    });

    describe(' * correct navigation', () => {
      beforeAll(async () => {
        await enrollmentEditPage.navigateToEnrollmentEdit(appointmentLink, enrollmentId);
      });

      it(' ~ appointment not found card hidden', () => {
        const isAppointmentNotFoundCardPresent = enrollmentEditPage.isAppointmentNotFoundCardPresent();
        expect(isAppointmentNotFoundCardPresent).toBeFalsy('Appointment not found card should not be present but is');
      });

      it(' ~ enrollment not found card hidden', () => {
        const isEnrollmentNotFoundCardPresent = enrollmentEditPage.isEnrollmentNotFoundCardPresent();
        expect(isEnrollmentNotFoundCardPresent).toBeFalsy('Appointment not found card should not be present but is');
      });
    });
  });

  describe('edit values (form validation) - error', () => {
    beforeAll(async () => {
      await enrollmentEditPreparationUtil.loadPage(appointmentLink, enrollmentId);
    });

    describe('empty name', () => {
      beforeAll(async () => {
        enrollmentEditPage.waitForFormBuild();
        await enrollmentEditPage.causeEmptyErrorName();
      });

      it('should show correct error message', () => {
        expect(enrollmentEditPage.getNameErrorValue()).toBe('Bitte gebe einen Namen an');
      });
    });
  });

  describe('edit values - duplicate name', () => {
    const nameToSet = `${enrollment.name} - Name in use`;

    beforeAll(async () => {
      await enrollmentEditPreparationUtil.loadPageWithPermissionToken(appointmentLink, enrollmentId, enrollmentEditTokenValid);
      await enrollmentEditTestUtil.fillMainForm({ name: nameToSet, comment: undefined });
    });

    it('should show correct error message', () => {
      expect(enrollmentEditPage.getNameErrorValue()).toEqual('Es besteht bereits eine Anmeldung mit diesem Namen');
    });
  });
});
