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
  name: undefined,
  comment: 'User Enrollment Comment - Self enrollment'
}

describe(' * enrollment creation page - as logged in user', () => {
  describe(' * self enrollment', () => {
    describe(' * form', () => {
      beforeAll(async () => {
        await enrollmentCreatePreparationUtil.loadPageWithLogin(appointmentLink, user);
      });

      it(' ~ should have title "Anmelden"', () => {
        expect(enrollmentCreatePage.getMatCardTitle()).toEqual('Anmelden');
      });

      it(' ~ should have correct attributes', () => {
        expect(enrollmentCreatePage.isNameEnabled()).toBe(false);
        expect(enrollmentCreatePage.getSelfEnrollment().isSelected()).toBe(true);
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

    describe(' * form - already enrolled', () => {
      // general enrollment creator 1, because there is enrollment that exists for this user
      const user = UsersDataProvider.getUser('0ab80f61-b3c3-49d6-b18f-efdb2723f217');

      beforeAll(async () => {
        await enrollmentCreatePreparationUtil.loadPageWithLogin(appointmentLink, user);
      })
      it(' ~ main form should have correct values', () => {
        expect(enrollmentCreatePage.getNameValue()).toBe(user.firstName + ' ' + user.lastName);
        expect(enrollmentCreatePage.getCommentValue()).toBe('');
      });

      it(' ~ main form should have correct attributes', () => {
        expect(enrollmentCreatePage.getSelfEnrollment().isSelected()).toBe(true);
        expect(enrollmentCreatePage.getNextMain().isEnabled()).toBe(false);
      });

      it(' ~ should show correct error message', () => {
        expect(enrollmentCreatePage.getCreatorErrorValue()).toEqual('Du bist bereits angemeldet');
      });
    });

    describe(' * fill - check card', () => {
      beforeAll(async () => {
        await enrollmentCreatePreparationUtil.loadPageWithLogin(appointmentLink, user);
        await enrollmentCreateUserTestUtil.fillMainForm(true, enrollment);
      });

      it(' ~ should show enrollment check card', () => {
        const isEnrollmentCheckCardPreset = enrollmentCreatePage.isEnrollmentCheckCardPreset();
        expect(isEnrollmentCheckCardPreset).toBeTruthy('Enrollment check card should be present but isn\'t');
      });

      it(' ~ should contain correct data', () => {
        expect(enrollmentCreatePage.getCheckNameValue()).toEqual(user.firstName + ' ' + user.lastName);
        expect(enrollmentCreatePage.getCheckUsername()).toEqual('@' + user.username);
        expect(enrollmentCreatePage.getCheckCommentValue()).toEqual(enrollment.comment);
      });
    });

    describe(' * fill - check card - go back to form', () => {
      beforeAll(async () => {
        await enrollmentCreatePreparationUtil.loadPageWithLogin(appointmentLink, user);
        await enrollmentCreateUserTestUtil.fillMainForm(true, enrollment);
        await enrollmentCreatePage.goBackCheck();
      });

      it(' ~ should still have correct attributes', () => {
        expect(enrollmentCreatePage.isNameEnabled()).toBe(false);
        expect(enrollmentCreatePage.getSelfEnrollment().isSelected()).toBe(true);
      });

      it(' ~ should still contain inputted values', () => {
        expect(enrollmentCreatePage.getNameValue()).toEqual(user.firstName + ' ' + user.lastName);
        expect(enrollmentCreatePage.getCommentValue()).toEqual(enrollment.comment);
      });
    });

    describe(' * fill - complete', () => {
      beforeAll(async () => {
        await enrollmentCreatePreparationUtil.loadPageWithLogin(appointmentLink, user);
        await enrollmentCreateUserTestUtil.fillMainForm(true, enrollment);
        enrollmentCreatePage.nextCheck();
      });

      it(' ~ should correctly redirect', () => {
        enrollmentCreatePage.pageRedirectedToUrl('/enroll?a=' + appointmentLink);
      });

      it(' ~ should show correct snackbar', () => {
        expect(enrollmentCreatePage.getSnackbar().getText()).toEqual('Erfolgreich angemeldet');
      });
    });

    describe(' * fill - complete - already enrolled', () => {
      const commentToSet = `${enrollment.comment} - Already enrolled`

      beforeAll(async () => {
        await enrollmentCreatePreparationUtil.loadPageWithLogin(appointmentLink, user);
        await enrollmentCreateUserTestUtil.fillMainForm(true, { name: enrollment.name, comment: commentToSet });
        await enrollmentCreatePage.nextCheck();
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
    })
  });
});
