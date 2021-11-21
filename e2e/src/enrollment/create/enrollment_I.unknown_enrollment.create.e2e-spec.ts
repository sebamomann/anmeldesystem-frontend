import { EnrollmentCreateTestUtil } from '../utility/enrollment.create.test.util';
import { browser } from 'protractor';
import { EnrollmentCreatePage } from '../po/enrollment.create.po';
import { LocalStoragePage } from '../../general/localStorage.po';
import { EnrollmentCreatePreparationUtil } from '../utility/enrollment.create.preparation.util';
import { UsersDataProvider } from '../../appointment/overview/po/users.data-provider';
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

const appointmentLink = "valid-enrollments-create-unknown";
// general enrollment creator 1
const user = UsersDataProvider.getUser('bcf27563-e7b0-4334-ab91-d35bbb5e63f2');

const enrollment = {
  name: 'Unknown Enrollment',
  comment: 'Unknown Enrollment Comment'
}

describe('enrollment creation page - create - as unknown user', () => {
  describe(' * form', () => {
    beforeAll(async () => {
      await enrollmentCreatePreparationUtil.loadPage(appointmentLink);
    });

    it(' ~ should should have title "Anmelden"', () => {
      expect(enrollmentCreatePage.getMatCardTitle()).toEqual('Anmelden');
    });

    describe(' * should have correct values', () => {
      it(' ~ empty name', async () => {
        expect(await enrollmentCreatePage.getNameValue()).toBe('');
      });

      it(' ~ empty comment', async () => {
        expect(await enrollmentCreatePage.getCommentValue()).toBe('');
      });
    });
  });

  describe(' * fill - check card', () => {
    beforeAll(async () => {
      await enrollmentCreatePreparationUtil.loadPage(appointmentLink);
      await enrollmentCreateTestUtil.fillMainForm(enrollment);
    });

    it(' ~ should be present', () => {
      const isEnrollmentCheckCardPreset = enrollmentCreatePage.isEnrollmentCheckCardPreset();
      expect(isEnrollmentCheckCardPreset).toBeTruthy('Enrollment check card should be present but isn\'t');
    });

    it(' ~ should contain correct data', () => {
      expect(enrollmentCreatePage.getCheckNameValue()).toEqual(enrollment.name);
      expect(enrollmentCreatePage.getCheckCommentValue()).toEqual(enrollment.comment);
    });
  });

  describe(' * fill - login and mail card', () => {
    beforeAll(async () => {
      await enrollmentCreatePreparationUtil.loadPage(appointmentLink);
      await enrollmentCreateTestUtil.fillMainForm(enrollment);
      await enrollmentCreatePage.nextCheck();
    });

    it(' ~ should display login and mail form with login part', () => {
      expect(enrollmentCreatePage.loginAndMailFormExists()).toBeTruthy();
      expect(enrollmentCreatePage.loginAndMailFormLoginContentExists()).toBeTruthy();
      expect(enrollmentCreatePage.loginAndMailFormLoginContentAltExists()).toBeFalsy();
    });
  });

  describe(' * fill - login and mail card - go back to check card', () => {
    beforeAll(async () => {
      await enrollmentCreatePreparationUtil.loadPage(appointmentLink);
      await enrollmentCreateTestUtil.fillMainForm(enrollment);
      enrollmentCreatePage.nextCheck();
      enrollmentCreatePage.goBack();
    });

    it(' ~ should contain correct data', () => {
      expect(enrollmentCreatePage.getCheckNameValue()).toEqual(enrollment.name);
      expect(enrollmentCreatePage.getCheckCommentValue()).toEqual(enrollment.comment);
    });
  });

  describe(' * fill - login and mail card - go back to form', () => {
    beforeAll(async () => {
      await enrollmentCreatePreparationUtil.loadPage(appointmentLink);
      await enrollmentCreateTestUtil.fillMainForm(enrollment);
      enrollmentCreatePage.nextCheck();
      enrollmentCreatePage.goBack();
      enrollmentCreatePage.goBackCheck();
    });

    it(' ~ should still contain inputted values', () => {
      expect(enrollmentCreatePage.getNameValue()).toEqual(enrollment.name);
      expect(enrollmentCreatePage.getCommentValue()).toEqual(enrollment.comment);
    });
  });

  describe(' * fill - errors', () => {
    beforeAll(async () => {
      await enrollmentCreatePreparationUtil.loadPage(appointmentLink);
    });

    describe(' * empty name', () => {
      beforeAll(async () => {
        enrollmentCreatePage.waitForFormBuild();
        await enrollmentCreatePage.nextMain();
      });

      it(' ~ should show correct error message', () => {
        expect(enrollmentCreatePage.getNameErrorValue()).toEqual('Bitte gebe einen Namen an');
      });
    });

    describe(' * empty name - after input', () => {
      beforeAll(async () => {
        enrollmentCreatePage.waitForFormBuild();
        enrollmentCreatePage.causeEmptyErrorName();
        await enrollmentCreatePage.nextMain();
      });

      it(' ~ should show correct error message', () => {
        expect(enrollmentCreatePage.getNameErrorValue()).toEqual('Bitte gebe einen Namen an');
      });
    });

    describe(' * fill form - with invalid mail', () => {
      beforeAll(async () => {
        await enrollmentCreatePreparationUtil.loadPage(appointmentLink);
        await enrollmentCreateTestUtil.fillMainForm(enrollment);
        enrollmentCreatePage.nextCheck();
        await enrollmentCreatePage.setEmail('mail');
        enrollmentCreatePage.submit();
      });

      it(' ~ should show correct error message', async () => {
        expect(enrollmentCreatePage.getMailErrorValue()).toEqual('Bitte gebe eine gültige E-Mail Adresse an');
      });
    });
  });

  describe(' * fill - complete', () => {

    describe(' * mail', () => {
      beforeAll(async () => {
        await enrollmentCreatePreparationUtil.loadPage(appointmentLink);
        await enrollmentCreateTestUtil.fillMainForm(enrollment);
        await enrollmentCreatePage.nextCheck();
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

      it(' ~ should show correct snackbar', async () => {
        await enrollmentCreatePage.currentUrlContains('/enroll?a=' + appointmentLink);
        expect(enrollmentCreatePage.getSnackbar().getText()).toEqual('Erfolgreich angemeldet');
      });

      it(' ~ should store enrollment information', async () => {
        // fetch stored token to edit enrollment afterwards
        const storedEnrollmentValues = await localStoragePage.getObject('permissions');

        const id = storedEnrollmentValues[0].enrollments[0].id;
        const token = storedEnrollmentValues[0].enrollments[0].token;
        const link = storedEnrollmentValues[0].link;

        expect(id).toEqual('38d6773b-9ce9-4e4a-87fe-bf9719c455ad');
        expect(token).toEqual('mytoken');
        expect(link).toEqual(appointmentLink);
      });
    });

    describe(' * mail - already enrolled', () => {
      const commentToSet = `${enrollment.comment} - Mail - Already enrolled`

      beforeAll(async () => {
        await enrollmentCreatePreparationUtil.loadPage(appointmentLink);
        await enrollmentCreateTestUtil.fillMainForm({ name: enrollment.name, comment: commentToSet });
        await enrollmentCreatePage.nextCheck();
        await enrollmentCreatePage.setEmail('mail@example.com');
        await enrollmentCreatePage.submit();
      });

      it(' ~ main form should still have correct values', async () => {
        expect(enrollmentCreatePage.getNameValue()).toBe(enrollment.name);
        expect(enrollmentCreatePage.getCommentValue()).toBe(commentToSet);
      });

      it(' ~ should show correct error message', () => {
        expect(enrollmentCreatePage.getNameErrorValue()).toEqual('Es besteht bereits eine Anmeldung mit diesem Namen');
      });
    });

    describe(' * login', () => {
      const commentToSet = `${enrollment.comment} - Login`;

      beforeAll(async () => {
        await enrollmentCreatePreparationUtil.loadPage(appointmentLink);
        await enrollmentCreateTestUtil.fillMainForm({ name: enrollment.name, comment: commentToSet });
        await enrollmentCreatePage.nextCheck();
        await enrollmentCreatePage.clickLogin();
        await loginPage.loginViaUI(user);
      });

      it(' ~ should swap to start', () => {
        const isMainFormPresent = page.isMainFormPresent();
        expect(isMainFormPresent).toBeTruthy('Main form should be present but isn\'t');
      });

      it(' ~ should correctly redirect', () => {
        enrollmentCreatePage.currentUrlContains('/enroll?a=' + appointmentLink);
      });

      it(' ~ should show correct snackbar', () => {
        expect(enrollmentCreatePage.getSnackbar().getText()).toEqual('Erfolgreich angemeldet');
      });
    });

    describe(' * login - already enrolled', () => {
      const commentToSet = `${enrollment.comment} - Login - Already enrolled`

      // use general enrollment creator 3, because he already has made a enrollment
      var user = UsersDataProvider.getUser('0ab80f61-b3c3-49d6-b18f-efdb2723f217');

      beforeAll(async () => {
        await enrollmentCreatePreparationUtil.loadPage(appointmentLink);
        await enrollmentCreateTestUtil.fillMainForm({ name: enrollment.name, comment: commentToSet });
        await enrollmentCreatePage.nextCheck();
        await enrollmentCreatePage.clickLogin();
        await loginPage.loginViaUI(user);
      });

      it(' ~ main form should have correct values', () => {
        expect(enrollmentCreatePage.getNameValue()).toBe(user.firstName + ' ' + user.lastName);
        expect(enrollmentCreatePage.getCommentValue()).toBe(commentToSet);
      });

      it(' ~ main form should have correct attributes', () => {
        expect(enrollmentCreatePage.getSelfEnrollment().isSelected()).toBe(true);
        expect(enrollmentCreatePage.getNextMain().isEnabled()).toBe(false);
      });

      it(' ~ should show correct error message', () => {
        expect(enrollmentCreatePage.getCreatorErrorValue()).toEqual('Du bist bereits angemeldet');
      });
    });
  });
});
