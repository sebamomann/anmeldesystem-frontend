import { browser } from 'protractor';
import { EnrollmentCreatePage } from '../po/enrollment.create.po';
import { LocalStoragePage } from '../../general/localStorage.po';
import { EnrollmentCreatePreparationUtil } from '../utility/enrollment.create.preparation.util';
import { UsersDataProvider } from '../../appointment/overview/po/users.data-provider';
import { LoginPage } from '../../general/login.po';
import { EnrollmentCreateUserTestUtil } from '../utility/enrollment.create.user.test.util';

const enrollmentCreatePreparationUtil: EnrollmentCreatePreparationUtil = new EnrollmentCreatePreparationUtil();
const enrollmentCreateUserTestUtil: EnrollmentCreateUserTestUtil = new EnrollmentCreateUserTestUtil();

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

  enrollmentCreateUserTestUtil.enrollmentCreatePage = enrollmentCreatePage;

  browser.waitForAngularEnabled(false);
});

const appointmentLink = "valid-enrollments-create-user";
// general enrollment creator 1
const user = UsersDataProvider.getUser('bcf27563-e7b0-4334-ab91-d35bbb5e63f2');

const enrollment = {
  name: 'User Enrollment - Foreign enrollment',
  comment: 'User Enrollment Comment'
}

describe('enrollment creation page - as logged in user', () => {
  describe(' * foreign enrollment', () => {
    describe(' * form', () => {
      beforeAll(async () => {
        await enrollmentCreatePreparationUtil.loadPageWithLogin(appointmentLink, user);
        await enrollmentCreatePage.deselectSelfEnrollment();
      });

      it(' ~ should have title "Anmelden"', () => {
        expect(enrollmentCreatePage.getMatCardTitle()).toEqual('Anmelden');
      });

      it(' ~ should have correct attributes', () => {
        expect(enrollmentCreatePage.isNameEnabled()).toBe(true);
        expect(enrollmentCreatePage.getSelfEnrollment().isSelected()).toBe(false);
      });

      describe(' * should have correct values', () => {
        it(' ~ name of authorized user', async () => {
          expect(await enrollmentCreatePage.getNameValue()).toBe(user.firstName + " " + user.lastName);
        });

        it(' ~ empty comment', async () => {
          expect(await enrollmentCreatePage.getCommentValue()).toBe('');
        });
      });
    });

    describe(' * form - already enrolled - user already enrolled but then deselects self enrollment', () => {
      // general enrollment creator 1, because there is enrollment that exists for this user
      const user = UsersDataProvider.getUser('0ab80f61-b3c3-49d6-b18f-efdb2723f217');

      beforeAll(async () => {
        await enrollmentCreatePreparationUtil.loadPageWithLogin(appointmentLink, user);
        await enrollmentCreatePage.deselectSelfEnrollment();
      });

      it(' ~ main form should have correct values', () => {
        expect(enrollmentCreatePage.getNameValue()).toBe(user.firstName + ' ' + user.lastName);
        expect(enrollmentCreatePage.getCommentValue()).toBe('');
      });

      it(' ~ main form should have correct attributes', () => {
        expect(enrollmentCreatePage.getSelfEnrollment().isSelected()).toBe(false);
        expect(enrollmentCreatePage.getNextMain().isEnabled()).toBe(true);
      });
    });

    describe(' * fill - check card', () => {
      beforeAll(async () => {
        await enrollmentCreatePreparationUtil.loadPageWithLogin(appointmentLink, user);
        await enrollmentCreateUserTestUtil.fillMainForm(false, enrollment);
      });

      it(' ~ should show enrollment check card', () => {
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
        await enrollmentCreatePreparationUtil.loadPageWithLogin(appointmentLink, user);
        await enrollmentCreateUserTestUtil.fillMainForm(false, enrollment);
        await enrollmentCreatePage.nextCheck();
      });

      it(' ~ should display login and mail form without login part', () => {
        expect(enrollmentCreatePage.loginAndMailFormExists()).toBeTruthy();
        expect(enrollmentCreatePage.loginAndMailFormLoginContentExists()).toBeFalsy();
        expect(enrollmentCreatePage.loginAndMailFormLoginContentAltExists()).toBeTruthy();
      });
    });

    describe(' * fill - login and mail card - go back to check card', () => {
      beforeAll(async () => {
        await enrollmentCreatePreparationUtil.loadPageWithLogin(appointmentLink, user);
        await enrollmentCreateUserTestUtil.fillMainForm(false, enrollment);
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
        await enrollmentCreatePreparationUtil.loadPageWithLogin(appointmentLink, user);
        await enrollmentCreateUserTestUtil.fillMainForm(false, enrollment);
        enrollmentCreatePage.nextCheck();
        enrollmentCreatePage.goBack();
        enrollmentCreatePage.goBackCheck();
      });

      it(' ~ should still have correct attributes', () => {
        expect(enrollmentCreatePage.getSelfEnrollment().isSelected()).toBe(false);
        expect(enrollmentCreatePage.getNextMain().isEnabled()).toBe(true);
      });

      it(' ~ should still contain inputted values', () => {
        expect(enrollmentCreatePage.getNameValue()).toEqual(enrollment.name);
        expect(enrollmentCreatePage.getCommentValue()).toEqual(enrollment.comment);
      });
    });

    describe(' * fill - errors', () => {

      describe(' * empty name - after input', () => {
        beforeAll(async () => {
          await enrollmentCreatePreparationUtil.loadPageWithLogin(appointmentLink, user);
          await enrollmentCreatePage.deselectSelfEnrollment();
          enrollmentCreatePage.causeEmptyErrorName();
          await enrollmentCreatePage.nextMain();
        });

        it(' ~ should show correct error message', () => {
          expect(enrollmentCreatePage.getNameErrorValue()).toEqual('Bitte gebe einen Namen an');
        });
      });


      describe(' * fill form - with invalid mail', () => {
        beforeAll(async () => {
          await enrollmentCreatePreparationUtil.loadPageWithLogin(appointmentLink, user);
          await enrollmentCreateUserTestUtil.fillMainForm(false, enrollment);
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
          await enrollmentCreatePreparationUtil.loadPageWithLogin(appointmentLink, user);
          await enrollmentCreateUserTestUtil.fillMainForm(false, enrollment);
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

        it(' ~ should show correct snackbar', () => {
          expect(enrollmentCreatePage.getSnackbar().getText()).toEqual('Erfolgreich angemeldet');
        });

        it(' ~ should store enrollment information', async () => {
          // fetch stored token to edit enrollment afterwards
          const storedEnrollmentValues = await localStoragePage.getObject('permissions');

          const id = storedEnrollmentValues[0].enrollments[0].id;
          const token = storedEnrollmentValues[0].enrollments[0].token;
          const link = storedEnrollmentValues[0].link;

          expect(id).toEqual('903a9705-3da7-45ef-b062-6fc7292db259');
          expect(token).toEqual('mytoken');
          expect(link).toEqual(appointmentLink);
        });
      });

      describe(' * mail - already enrolled', () => {
        const nameToSet = `${enrollment.name} - Already enrolled`

        beforeAll(async () => {
          await enrollmentCreatePreparationUtil.loadPageWithLogin(appointmentLink, user);
          await enrollmentCreateUserTestUtil.fillMainForm(false, { name: nameToSet, comment: enrollment.comment });
          await enrollmentCreatePage.nextCheck();
          await enrollmentCreatePage.setEmail('mail@example.com');
          await enrollmentCreatePage.submit();
        });

        it(' ~ main form should have correct values', async () => {
          expect(enrollmentCreatePage.getNameValue()).toBe(nameToSet);
          expect(enrollmentCreatePage.getCommentValue()).toBe(enrollment.comment);
        });

        it(' ~ should show correct error message', () => {
          expect(enrollmentCreatePage.getNameErrorValue()).toEqual('Es besteht bereits eine Anmeldung mit diesem Namen');
        });
      });
    });
  });
});
