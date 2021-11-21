import { EnrollmentEditTestUtil } from '../utility/enrollment.edit.test.util';
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

const appointmentLink = "valid-enrollments-edit-driverandpassenger";
const enrollmentId = "cabd942e-d21e-4b98-89d5-c9aeea1334f7";

describe('enrollment edit page - edit - driver and passenger - passenger', () => {
  describe(' * form', () => {
    beforeAll(async () => {
      await enrollmentEditPreparationUtil.loadPage(appointmentLink, enrollmentId);
      await enrollmentEditPage.navigateToDriverTab();
    });

    it(' ~ should have correct values', () => {
      expect(enrollmentEditPage.getRequirementSelectValue()).toEqual("Nur Hin");
    });

    it(' ~ should have correct attributes', () => {
      expect(enrollmentEditPage.isDriverCheckboxSelected()).toBeFalsy();
    });
  });

  describe(' * change values', () => {
    describe(' * requirement', () => {
      beforeAll(async () => {
        await enrollmentEditPreparationUtil.loadPage(appointmentLink, enrollmentId);
        await enrollmentEditPage.navigateToDriverTab();
        await enrollmentEditTestUtil.fillPassengerForm("Nur Zurück");
      });

      it(' ~ should correctly redirect', () => {
        enrollmentEditPage.currentUrlContains('/enroll?a=' + appointmentLink);
      });

      it(' ~ should show correct snackbar', () => {
        expect(enrollmentEditPage.getSnackbar().getText()).toEqual('Erfolgreich bearbeitet');
      });
    });

    describe(' * to driver', () => {
      beforeAll(async () => {
        await enrollmentEditPreparationUtil.loadPage(appointmentLink, enrollmentId);
        await enrollmentEditPage.navigateToDriverTab();
        await enrollmentEditTestUtil.fillDriverForm("Hin und Zurück", 1);
      });

      it(' ~ should correctly redirect', () => {
        enrollmentEditPage.currentUrlContains('/enroll?a=' + appointmentLink);
      });

      it(' ~ should show correct snackbar', () => {
        expect(enrollmentEditPage.getSnackbar().getText()).toEqual('Erfolgreich bearbeitet');
      });
    });
  });
});
