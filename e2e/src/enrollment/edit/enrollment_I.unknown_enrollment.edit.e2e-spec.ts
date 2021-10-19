import { UsersDataProvider } from "../../appointment/overview/po/users.data-provider";
import { browser } from "protractor";
import { LocalStoragePage } from "../../general/localStorage.po";
import { LoginPage } from "../../general/login.po";
import { EnrollmentEditPage } from "../po/enrollment.edit.po";
import { EnrollmentEditPreparationUtil } from "../utility/enrollment.edit.preparation.util";
import { EnrollmentEditTestUtil } from "../utility/enrollment.edit.test.util";

const enrollmentEditPreparationUtil: EnrollmentEditPreparationUtil = new EnrollmentEditPreparationUtil();
const enrollmentEditTestUtil: EnrollmentEditTestUtil = new EnrollmentEditTestUtil();

let enrollmentEditPage: EnrollmentEditPage;
let localStoragePage: LocalStoragePage;
let loginPage: LoginPage;

beforeAll(async () => {
  await browser.get("/"); // needed to be able to clear localStorage

  const localStorageSetter = () => {
    // @ts-ignore
    console.log(window.env);
    // @ts-ignore
    window.env.API_URL = "";
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

const appointmentLink = "valid-enrollments-edit";
const enrollmentId = "1ff2e7e7-9048-46b2-b02b-fe95b874ef6d";
const enrollmentEditTokenValid = "valid-enrollment-edit-token";
const enrollmentEditTokenInvalid = "invalid-enrollment-edit-token";
// general enrollment creator 1
const user = UsersDataProvider.getUser('bcf27563-e7b0-4334-ab91-d35bbb5e63f2');

const enrollment = {
  name: "Unknown Enrollment One",
  comment: "Comment One"
}

describe(' * enrollment edit page - edit', () => {
  describe(' * as unknown user', () => {
    describe(' * form', () => {
      beforeAll(async () => {
        await enrollmentEditPreparationUtil.loadPage(appointmentLink, enrollmentId);
      });

      it(' ~ should have title "Bearbeiten"', () => {
        expect(enrollmentEditPage.getMatCardTitle()).toEqual('Bearbeiten');
      });

      describe(' * should have correct values', () => {
        it(' ~ name', async () => {
          expect(await enrollmentEditPage.getNameValue()).toBe(enrollment.name);
        });

        it(' ~ comment', async () => {
          expect(await enrollmentEditPage.getCommentValue()).toBe(enrollment.comment);
        });
      });
    });

    describe(' * edit values', () => {
      describe(' * name', () => {
        const nameToSet = `${enrollment.name} - Updated`;

        beforeAll(async () => {
          await enrollmentEditPreparationUtil.loadPageWithPermissionToken(appointmentLink, enrollmentId, enrollmentEditTokenValid);
          await enrollmentEditTestUtil.fillMainForm({ name: nameToSet, comment: undefined });
        });

        it(' ~ should correctly redirect', () => {
          enrollmentEditPage.pageRedirectedToUrl('/enroll?a=' + appointmentLink);
        });

        it(' ~ should show correct snackbar', () => {
          expect(enrollmentEditPage.getSnackbar().getText()).toEqual('Erfolgreich bearbeitet');
        });
      });

      describe(' * comment', () => {
        const commentToSet = `${enrollment.comment} - Updated`

        beforeAll(async () => {
          await enrollmentEditPreparationUtil.loadPageWithPermissionToken(appointmentLink, enrollmentId, enrollmentEditTokenValid);
          await enrollmentEditTestUtil.fillMainForm({ name: undefined, comment: commentToSet });
        });

        it(' ~ should correctly redirect', () => {
          enrollmentEditPage.pageRedirectedToUrl('/enroll?a=' + appointmentLink);
        });

        it(' ~ should show correct snackbar', () => {
          expect(enrollmentEditPage.getSnackbar().getText()).toEqual('Erfolgreich bearbeitet');
        });
      });
    });

    describe(' * edit values - invalid permission token', () => {
      const nameToSet = `${enrollment.name} - Updated`

      beforeAll(async () => {
        await enrollmentEditPreparationUtil.loadPageWithPermissionToken(appointmentLink, enrollmentId, enrollmentEditTokenInvalid);
        await enrollmentEditTestUtil.fillMainForm({ name: nameToSet, comment: undefined });
      });

      it(' ~ should show correct error message', () => {
        expect(enrollmentEditPage.getErrorSnackbar().getText()).toEqual('Sorry, du hast keine Berechtigung diesen Teilnehmer zu bearbeiten.');
      });
    });
  });

  describe(' * as logged in user', () => {
    describe(' * form', () => {
      beforeAll(async () => {
        await enrollmentEditPreparationUtil.loadPageWithLogin(appointmentLink, enrollmentId, user);
      });

      it(' ~ should have title "Bearbeiten"', () => {
        expect(enrollmentEditPage.getMatCardTitle()).toEqual('Bearbeiten');
      });

      describe(' * should have correct form values', () => {
        it(' ~ name', async () => {
          expect(await enrollmentEditPage.getNameValue()).toBe(enrollment.name);
        });

        it(' ~ comment', async () => {
          expect(await enrollmentEditPage.getCommentValue()).toBe(enrollment.comment);
        });
      });
    });

    describe(' * edit values', () => {

      describe(' * update name', () => {
        const nameToSet = `${enrollment.name} - Updated - Logged in`;

        beforeAll(async () => {
          await enrollmentEditPreparationUtil.loadPageWithLogin(appointmentLink, enrollmentId, user);
          await enrollmentEditTestUtil.fillMainForm({ name: nameToSet, comment: undefined });
        });

        it(' ~ should correctly redirect', () => {
          enrollmentEditPage.pageRedirectedToUrl('/enroll?a=' + appointmentLink);
        });

        it(' ~ should show correct snackbar', () => {
          expect(enrollmentEditPage.getSnackbar().getText()).toEqual('Erfolgreich bearbeitet');
        });
      });
    });

    describe(' * edit values - invalid permissions', () => {
      const nameToSet = 'Unknown Enrollment One - Updated - Logged in - Invalid permissions';

      beforeAll(async () => {
        await enrollmentEditPreparationUtil.loadPageWithLogin(appointmentLink, enrollmentId, user);
        await enrollmentEditTestUtil.fillMainForm({ name: nameToSet, comment: undefined });
      });

      it(' ~ should show correct error message', () => {
        expect(enrollmentEditPage.getErrorSnackbar().getText()).toEqual('Sorry, du hast keine Berechtigung diesen Teilnehmer zu bearbeiten.');
      });
    });
  });
});
