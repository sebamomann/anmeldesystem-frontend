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

const appointmentLink = "valid-enrollments-create-additions";

const enrollment = {
  name: 'Unknown Enrollment - Additions',
  comment: 'Unknown Enrollment Comment'
}

describe('enrollment creation page - additions', () => {
  describe(' * form', () => {
    beforeAll(async () => {
      await enrollmentCreatePreparationUtil.loadPage(appointmentLink);
      await enrollmentCreateTestUtil.fillMainForm(enrollment);
    });

    it(' * should have correct values', () => {
      expect(enrollmentCreatePage.getAdditionValue('0')).toBe("addition-1");
      expect(enrollmentCreatePage.getAdditionValue('1')).toBe("addition-2");
      expect(enrollmentCreatePage.getAdditionValue('2')).toBe("addition-3");
      expect(enrollmentCreatePage.getAdditionValue('3')).toBe("addition-4");
    });

    it('should have correct attributes', () => {
      expect(enrollmentCreatePage.isAdditionSelected('0')).toBeFalsy("Addition (index) 0 is selected but should not be");
      expect(enrollmentCreatePage.isAdditionSelected('1')).toBeFalsy("Addition (index) 1 is selected but should not be");
      expect(enrollmentCreatePage.isAdditionSelected('2')).toBeFalsy("Addition (index) 2 is selected but should not be");
      expect(enrollmentCreatePage.isAdditionSelected('3')).toBeFalsy("Addition (index) 3 is selected but should not be");
    })
  });

  describe(' * fill - check card', () => {
    beforeAll(async () => {
      await enrollmentCreatePreparationUtil.loadPage(appointmentLink);
      await enrollmentCreateTestUtil.fillMainForm(enrollment);
      await enrollmentCreateTestUtil.fillAdditionForm([true, false, true, false]);
    });

    it(' ~ should show enrollment check card', () => {
      const isEnrollmentCheckCardPreset = enrollmentCreatePage.isEnrollmentCheckCardPreset();
      expect(isEnrollmentCheckCardPreset).toBeTruthy('Enrollment check card should be present but isn\'t');
    });

    describe(' * should contain correct data', () => {
      it(' ~ main values', () => {
        expect(enrollmentCreatePage.getCheckNameValue()).toEqual(enrollment.name);
        expect(enrollmentCreatePage.getCheckCommentValue()).toEqual(enrollment.comment);
      });

      it(' * additions', () => {
        expect(enrollmentCreatePage.getAdditionCheckSelected('0')).toBeTruthy();
        expect(enrollmentCreatePage.getAdditionCheckSelected('1')).toBeFalsy();
        expect(enrollmentCreatePage.getAdditionCheckSelected('2')).toBeTruthy();
        expect(enrollmentCreatePage.getAdditionCheckSelected('3')).toBeFalsy();
      });
    });
  });

  describe(' * fill - login and mail card - go back to check card', () => {
    beforeAll(async () => {
      await enrollmentCreatePreparationUtil.loadPage(appointmentLink);
      await enrollmentCreateTestUtil.fillMainForm(enrollment);
      await enrollmentCreateTestUtil.fillAdditionForm([true, false, true, false]);
      enrollmentCreatePage.nextCheck();
      enrollmentCreatePage.goBack();
    });

    describe(' * should contain correct data', () => {
      it(' ~ main values', () => {
        expect(enrollmentCreatePage.getCheckNameValue()).toEqual(enrollment.name);
        expect(enrollmentCreatePage.getCheckCommentValue()).toEqual(enrollment.comment);
      });

      it(' * additions', () => {
        expect(enrollmentCreatePage.getAdditionCheckSelected('0')).toBeTruthy();
        expect(enrollmentCreatePage.getAdditionCheckSelected('1')).toBeFalsy();
        expect(enrollmentCreatePage.getAdditionCheckSelected('2')).toBeTruthy();
        expect(enrollmentCreatePage.getAdditionCheckSelected('3')).toBeFalsy();
      });
    });
  });

  describe(' * fill - login and mail card - go back to form', () => {
    beforeAll(async () => {
      await enrollmentCreatePreparationUtil.loadPage(appointmentLink);
      await enrollmentCreateTestUtil.fillMainForm(enrollment);
      await enrollmentCreateTestUtil.fillAdditionForm([true, false, true, false]);
      enrollmentCreatePage.nextCheck();
      enrollmentCreatePage.goBack();
      enrollmentCreatePage.goBackCheck()
    });

    it(' ~ should still contain inputted values', () => {
      expect(enrollmentCreatePage.isAdditionSelected('0')).toBeTruthy("Addition (index) 0 is not selected but should be");
      expect(enrollmentCreatePage.isAdditionSelected('1')).toBeFalsy("Addition (index) 1 is selected but should not be");
      expect(enrollmentCreatePage.isAdditionSelected('2')).toBeTruthy("Addition (index) 2 is not selected but should be");
      expect(enrollmentCreatePage.isAdditionSelected('3')).toBeFalsy("Addition (index) 3 is selected but should not be");
    });
  });

  describe(' * fill - complete', () => {

    describe(' * mail', () => {
      beforeAll(async () => {
        await enrollmentCreatePreparationUtil.loadPage(appointmentLink);
        await enrollmentCreateTestUtil.fillMainForm(enrollment);
        await enrollmentCreateTestUtil.fillAdditionForm([true, false, true, false]);
        await enrollmentCreatePage.nextCheck();
        await enrollmentCreatePage.setEmail('mail@example.com');
        await enrollmentCreatePage.submit();
      });

      // TODO
      // TOO FAST I GUESS
      // it(' ~ should swap to start', () => {
      //   const isMainFormPresent = page.isMainFormPresent();
      //   expect(isMainFormPresent).toBeTruthy('Main form should be present but isn\'t');
      // });

      it(' ~ should correctly redirect', () => {
        enrollmentCreatePage.pageRedirectedToUrl('/enroll?a=' + appointmentLink);
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

        expect(id).toEqual('64c3ead0-4d12-452b-94b7-20e0ec064e17');
        expect(token).toEqual('mytoken');
        expect(link).toEqual(appointmentLink);
      });
    });

    describe(' * mail - already enrolled', () => {
      const nameToSet = `${enrollment.name} - Already enrolled`

      beforeAll(async () => {
        await enrollmentCreatePreparationUtil.loadPage(appointmentLink);
        await enrollmentCreateTestUtil.fillMainForm({ name: nameToSet, comment: enrollment.comment });
        await enrollmentCreateTestUtil.fillAdditionForm([true, false, true, false]);
        await enrollmentCreatePage.nextCheck();
        await enrollmentCreatePage.setEmail('mail@example.com');
        await enrollmentCreatePage.submit();
        await enrollmentCreatePage.setName(nameToSet);
        await enrollmentCreatePage.nextMain();
      });

      it(' ~ additions form should still have correct attributes', () => {
        expect(enrollmentCreatePage.isAdditionSelected('0')).toBeTruthy("Addition (index) 0 is not selected but should be");
        expect(enrollmentCreatePage.isAdditionSelected('1')).toBeFalsy("Addition (index) 1 is selected but should not be");
        expect(enrollmentCreatePage.isAdditionSelected('2')).toBeTruthy("Addition (index) 2 is not selected but should be");
        expect(enrollmentCreatePage.isAdditionSelected('3')).toBeFalsy("Addition (index) 3 is selected but should not be");
      });
    });
  });
});
