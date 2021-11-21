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
const enrollmentId = "715d6333-13bd-4b50-9a17-515151845fd5";

describe('enrollment edit page - edit - driver and passenger - driver', () => {
  describe(' * form', () => {
    beforeAll(async () => {
      await enrollmentEditPreparationUtil.loadPage(appointmentLink, enrollmentId);
      await enrollmentEditPage.navigateToDriverTab();
    });

    it(' ~ should have correct values', () => {
      expect(enrollmentEditPage.getServiceSelectValue()).toEqual("Nur Zurück");
      expect(enrollmentEditPage.getSeatsValue()).toBe('4');
    });

    it(' ~ should have correct attributes', () => {
      expect(enrollmentEditPage.isDriverCheckboxSelected()).toBeTruthy();
    });
  });

  describe(' * change values', () => {
    describe(' * service', () => {
      beforeAll(async () => {
        await enrollmentEditPreparationUtil.loadPage(appointmentLink, enrollmentId);
        await enrollmentEditPage.navigateToDriverTab();
        await enrollmentEditTestUtil.fillDriverForm("Nur Zurück", undefined);
      });

      it(' ~ should correctly redirect', () => {
        enrollmentEditPage.currentUrlContains('/enroll?a=' + appointmentLink);
      });

      it(' ~ should show correct snackbar', () => {
        expect(enrollmentEditPage.getSnackbar().getText()).toEqual('Erfolgreich bearbeitet');
      });
    });

    describe(' * seats', () => {
      beforeAll(async () => {
        await enrollmentEditPreparationUtil.loadPage(appointmentLink, enrollmentId);
        await enrollmentEditPage.navigateToDriverTab();
        await enrollmentEditTestUtil.fillDriverForm(undefined, 3);
      });

      it(' ~ should correctly redirect', () => {
        enrollmentEditPage.currentUrlContains('/enroll?a=' + appointmentLink);
      });

      it(' ~ should show correct snackbar', () => {
        expect(enrollmentEditPage.getSnackbar().getText()).toEqual('Erfolgreich bearbeitet');
      });
    });

    describe(' * to passenger', () => {
      beforeAll(async () => {
        await enrollmentEditPreparationUtil.loadPage(appointmentLink, enrollmentId);
        await enrollmentEditPage.navigateToDriverTab();
        await enrollmentEditTestUtil.fillPassengerForm("Hin und Zurück");
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
