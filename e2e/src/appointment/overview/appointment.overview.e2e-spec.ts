import {browser} from 'protractor';
import {AppointmentOverviewPage} from './appointment.overview.po';

describe('Enrollment Edit Page', () => {
  const appointmentLink = 'protractorAppointmentOverview';

  let page: AppointmentOverviewPage;

  describe('Faulty navigation', () => {
    it('appointment not found', async () => {
      page = new AppointmentOverviewPage('unknownAppointment');
      browser.ignoreSynchronization = true;

      await page.navigateTo();

      expect(await page.appointmentNotFoundCardExists()).toBeTruthy();
    });
  });

  // TODO
  // ANGEPINNT MESSAGE

  describe('Main - Overall Layout', () => {
    beforeAll(() => {
      page = new AppointmentOverviewPage('unknownAppointment');
      page.logout();
    });

    beforeEach(async () => {
      page = new AppointmentOverviewPage(appointmentLink);
      browser.ignoreSynchronization = true;

      browser.executeScript('window.localStorage.clear();');
      await page.navigateTo();
    });

    describe('Count enrollment list', () => {
      it('should show 6 enrollments', () => {
        expect(page.getEnrollments().count()).toBe(7);
      });

      it('should show 3 creator enrollments', () => {
        expect(page.getEnrollments()
          .filter(async (e) => (await e.getAttribute('class')).includes('creator')).count()).toBe(3);
      });

      it('should show 3 unknown enrollments', () => {
        expect(page.getEnrollments()
          .filter(async (e) => (await e.getAttribute('class')).includes('unknown')).count()).toBe(4);
      });
    });

    describe('user enrollment', () => {
      it('should have correct name', async () => {
        await expect((await page.getEnrollmentName('c3a780d6-dc1b-42b1-87e4-46d133447620')).getText())
          .toEqual('User Appointment Overview');
      });

      it('should have correct username', async () => {
        await expect((await page.getEnrollmentUsername('c3a780d6-dc1b-42b1-87e4-46d133447620')).getText())
          .toEqual('@user_appointment_overview');
      });
    });

    describe('unknown enrollment', () => {
      describe('comment', () => {
        it('should have correct name', async () => {
          await expect((await page.getEnrollmentName('0363fbc6-88ad-41c7-979b-2fc65c3c1e45')).getText())
            .toEqual('Unknown Appointment Overview');
        });

        it('should have no username', () => {
          expect(page.enrollmentUsernamePresent('0363fbc6-88ad-41c7-979b-2fc65c3c1e45')).toBeFalsy();
        });

        it('should have comment', async () => {
          await expect((await page.getEnrollmentComment('0363fbc6-88ad-41c7-979b-2fc65c3c1e45')).getText())
            .toEqual('my comment');
          expect(page.enrollmentCommentSeparatorPresent('0363fbc6-88ad-41c7-979b-2fc65c3c1e45')).toBeTruthy();
        });
      });

      describe('no comment', () => {
        it('should have no comment', () => {
          expect(page.enrollmentCommentSeparatorPresent('09d06299-90b6-4247-8707-49901641ea0c')).toBeFalsy();
          expect(page.enrollmentCommentPresent('09d06299-90b6-4247-8707-49901641ea0c')).toBeFalsy();
        });
      });
    });
  });

  afterEach(async () => {
    browser.manage().logs().get('browser').then(browserLogs => {
      // browserLogs is an array of objects with level and message fields
      browserLogs.forEach(log => {
        if (log.level.value > 900) { // it's an error log
          console.log('Browser console error!');
          console.log(log.message);
        }
      });
    });
  });
});
