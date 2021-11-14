import { EnrollmentEditTestUtil } from './../utility/enrollment.edit.test.util';
import { browser } from "protractor";
import { LocalStoragePage } from "../../general/localStorage.po";
import { LoginPage } from "../../general/login.po";
import { EnrollmentEditPage } from "../po/enrollment.edit.po";
import { EnrollmentEditPreparationUtil } from "../utility/enrollment.edit.preparation.util";

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

const appointmentLink = "valid-enrollments-edit-additions";
const enrollmentId = "c9cecfdd-0b3c-48b5-9371-000500def265";
const enrollmentEditTokenValid = "valid-enrollment-edit-token"

describe('enrollment edit page - edit - additions', () => {
  describe(' * form', () => {
    beforeAll(async () => {
      await enrollmentEditPreparationUtil.loadPage(appointmentLink, enrollmentId);
      enrollmentEditPage.navigateToAdditionsTab();
    });

    it(' ~ should have correct values', () => {
      expect(enrollmentEditPage.getAdditionValue('0')).toBe("addition-1");
      expect(enrollmentEditPage.getAdditionValue('1')).toBe("addition-2");
      expect(enrollmentEditPage.getAdditionValue('2')).toBe("addition-3");
      expect(enrollmentEditPage.getAdditionValue('3')).toBe("addition-4");
    });

    it(' ~ should have correct attributes', () => {
      expect(enrollmentEditPage.isAdditionSelected('0')).toBeTruthy("Addition (index) 0 is not selected but should be");
      expect(enrollmentEditPage.isAdditionSelected('1')).toBeFalsy("Addition (index) 1 is selected but should not be");
      expect(enrollmentEditPage.isAdditionSelected('2')).toBeTruthy("Addition (index) 0 is not selected but should be");
      expect(enrollmentEditPage.isAdditionSelected('3')).toBeFalsy("Addition (index) 3 is selected but should not be");
    });
  });

  describe(' * edit values', () => {
    describe(' * additions', () => {
      beforeAll(async () => {
        await enrollmentEditPreparationUtil.loadPageWithPermissionToken(appointmentLink, enrollmentId, enrollmentEditTokenValid);
        enrollmentEditPage.navigateToAdditionsTab();
        enrollmentEditTestUtil.fillAdditionForm([false, false, true, false])
      });

      it(' ~ should correctly redirect', () => {
        enrollmentEditPage.pageRedirectedToUrl('/enroll?a=' + appointmentLink);
      });

      it(' ~ should show correct snackbar', () => {
        expect(enrollmentEditPage.getSnackbar().getText()).toEqual('Erfolgreich bearbeitet');
      });
    });
  });
});
