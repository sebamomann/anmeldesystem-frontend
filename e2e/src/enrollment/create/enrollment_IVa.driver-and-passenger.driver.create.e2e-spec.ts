import { EnrollmentCreateTestUtil } from '../utility/enrollment.create.test.util';
import { browser } from 'protractor';
import { EnrollmentCreatePage } from '../po/enrollment.create.po';
import { LocalStoragePage } from '../../general/localStorage.po';
import { EnrollmentCreatePreparationUtil } from '../utility/enrollment.create.preparation.util';
import { LoginPage } from '../../general/login.po';

const enrollmentCreatePreparationUtil: EnrollmentCreatePreparationUtil = new EnrollmentCreatePreparationUtil();
const enrollmentCreateTestUtil: EnrollmentCreateTestUtil = new EnrollmentCreateTestUtil();

let enrollmentCreatePage: EnrollmentCreatePage;
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

  enrollmentCreatePage = new EnrollmentCreatePage();
  localStoragePage = new LocalStoragePage();
  loginPage = new LoginPage();

  enrollmentCreatePreparationUtil.enrollmentCreatePage = enrollmentCreatePage;
  enrollmentCreatePreparationUtil.localStoragePage = localStoragePage;
  enrollmentCreatePreparationUtil.loginPage = loginPage;

  enrollmentCreateTestUtil.enrollmentCreatePage = enrollmentCreatePage;

  browser.waitForAngularEnabled(false);
});

const appointmentLink = "valid-enrollments-create-driverandpassenger";

const enrollment = {
  name: 'Unknown Enrollment - Driver and Passenger - Driver',
  comment: 'Unknown Enrollment Comment'
}

const service = "Hin und Zurück";
const seats = 4;

describe('enrollment creation page - driver and passenger - driver', () => {
  describe(' * form', () => {
    beforeAll(async () => {
      await enrollmentCreatePreparationUtil.loadPage(appointmentLink);
      await enrollmentCreateTestUtil.fillMainForm(enrollment);
      await enrollmentCreatePage.selectDriver();
    });

    it(' ~ should have correct values', () => {
      expect(enrollmentCreatePage.isServiceSelectEmpty()).toBeTruthy("Service select should be emtpy but is not");
      expect(enrollmentCreatePage.getSeatsValue()).toBe('');
    });

    it(' ~ should have correct attributes', () => {
      expect(enrollmentCreatePage.isDriverCheckboxSelected()).toBeTruthy();
    });
  })


  /**
   * TODO
   * NOT YET IMPLEMENTED
   * NOTHING VISIBLE IN CHECK CARD
   * DRIVER ICON?
   */
  // describe(' * fill - check card', () => {
  //   beforeAll(async () => {
  //     await enrollmentCreatePreparationUtil.loadPage(appointmentLink);
  //     await enrollmentCreateTestUtil.fillMainForm(enrollment);
  //     await enrollmentCreateTestUtil.fillAdditionForm([true, false, true, false]);
  //   });

  //   it(' ~ should show enrollment check card', () => {
  //     const isEnrollmentCheckCardPreset = enrollmentCreatePage.isEnrollmentCheckCardPreset();
  //     expect(isEnrollmentCheckCardPreset).toBeTruthy('Enrollment check card should be present but isn\'t');
  //   });

  //   describe(' * should contain correct data', () => {
  //     it(' ~ values', () => {
  //       expect(enrollmentCreatePage.getCheckNameValue()).toEqual(enrollment.name);
  //       expect(enrollmentCreatePage.getCheckCommentValue()).toEqual(enrollment.comment);
  //     });

  //     it(' ~ driver/passenger', () => {

  //     });
  //   });
  // });

  describe(' * fill - login and mail card - go back to form', () => {

    beforeAll(async () => {
      await enrollmentCreatePreparationUtil.loadPage(appointmentLink);
      await enrollmentCreateTestUtil.fillMainForm(enrollment);
      await enrollmentCreateTestUtil.fillDriverFormDriver(service, seats);
      enrollmentCreatePage.nextCheck();
      enrollmentCreatePage.goBack();
      enrollmentCreatePage.goBackCheck()
    });

    it(' ~ should still contain inputted values', () => {
      expect(enrollmentCreatePage.isDriverCheckboxSelected()).toBeTruthy("Driver checkbox is not selected but should be");
      expect(enrollmentCreatePage.getServiceSelectValue()).toBe(service);
      expect(enrollmentCreatePage.getSeatsValue()).toBe(String(seats));
    });
  });

  describe(' * fill - complete', () => {

    describe(' * mail', () => {
      beforeAll(async () => {
        await enrollmentCreatePreparationUtil.loadPage(appointmentLink);
        await enrollmentCreateTestUtil.fillMainForm(enrollment);
        await enrollmentCreateTestUtil.fillDriverFormDriver(service, seats);
        enrollmentCreatePage.nextCheck();
        await enrollmentCreatePage.setEmail('mail@example.com');
        await enrollmentCreatePage.submit();
      });

      it(' ~ should swap to start', () => {
        const isMainFormPresent = enrollmentCreatePage.isMainFormPresent();
        expect(isMainFormPresent).toBeTruthy('Main form should be present but isn\'t');
      });

      it(' ~ should correctly redirect', () => {
        enrollmentCreatePage.currentUrlContains('/enroll?a=' + appointmentLink);
      });

      it(' ~ should show correct snackbar', () => {
        expect(enrollmentCreatePage.getSnackbar().getText()).toEqual('Erfolgreich angemeldet');
      });

      it(' ~ should store enrollment information', async () => {
        // fetch stored token to edit enrollment afterwards
        const storedEnrollmentValues = await localStoragePage.getObject('permissions');

        const id = storedEnrollmentValues[0].enrollments[0].id;
        const token = storedEnrollmentValues[0].enrollments[0].token;
        const link = storedEnrollmentValues[0].link;

        expect(id).toEqual('8ef1512c-ae8a-4b0c-9b4e-7b5819a1906c');
        expect(token).toEqual('mytoken');
        expect(link).toEqual(appointmentLink);
      });
    });

    describe(' * mail - already enrolled', () => {
      const nameToSet = `${enrollment.name} - Already enrolled`

      beforeAll(async () => {
        await enrollmentCreatePreparationUtil.loadPage(appointmentLink);
        await enrollmentCreateTestUtil.fillMainForm({ name: nameToSet, comment: enrollment.comment });
        await enrollmentCreateTestUtil.fillDriverFormDriver(service, seats);
        enrollmentCreatePage.nextCheck();
        await enrollmentCreatePage.setEmail('mail@example.com');
        await enrollmentCreatePage.submit();
        await enrollmentCreatePage.setName(nameToSet);
        await enrollmentCreatePage.nextMain();
      });

      it(' ~ should still contain inputted values', () => {
        expect(enrollmentCreatePage.isDriverCheckboxSelected()).toBeTruthy("Driver checkbox is not selected but should be");
        expect(enrollmentCreatePage.getServiceSelectValue()).toBe(service);
        expect(enrollmentCreatePage.getSeatsValue()).toBe(String(seats));
      });
    });
  });
});
