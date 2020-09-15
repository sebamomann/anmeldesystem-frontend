import {browser, protractor} from 'protractor';
import {EnrollmentEditPage} from './enrollment.edit.po';
import {EnrollmentPage} from '../enrollment.po';

describe('Enrollment Edit Page', () => {
  describe('Faulty navigation', () => {
    it('appointment not found', async () => {
      const page = new EnrollmentEditPage('unknownAppointment', 'any');
      browser.ignoreSynchronization = true;
      await browser.get('/enrollment?a=unknownAppointment').then(() => {
      }).catch(() => {
      });
      page.spinnerGone();

      expect(await page.appointmentNotFoundCardExists()).toBeTruthy();
    });

    it('enrolment not found', async () => {
      const page = new EnrollmentEditPage('protractorEnrollEdit', 'any');
      browser.ignoreSynchronization = true;
      await browser.get('/enrollment?a=protractorEnrollEdit&e=any').then(() => {
      }).catch(() => {
      });
      page.spinnerGone();

      expect(await page.enrollmentNotFoundCardExists()).toBeTruthy();
    });
  });

  describe('Main - User Enrollment', () => {
    const appointmentLink = 'protractorEnrollEdit';

    let page: EnrollmentEditPage;

    describe('As enrollment creator', () => {
      const enrollmentIdUser = 'bfd95241-8b2e-4b43-b3b4-bd1e39f925c1';

      const user_enroll_edit = {
        name: 'User Enroll Edit',
        username: 'user_enroll_edit'
      };

      beforeEach(async () => {
        page = new EnrollmentEditPage(appointmentLink, enrollmentIdUser);
        browser.ignoreSynchronization = true;

        // USER MANAGEMENT
        await page.logout();
        await page.login(user_enroll_edit.username);

        // APPOINTMENT PREPARATION
        await browser.get('/enroll?a=' + appointmentLink); // NEEDED TO REMOVE "PINNED" Snackbar
        page.spinnerGone();

        await page.navigateTo();
      });

      describe('valid form attributes', () => {
        beforeEach(async () => {
          await expect(page.getName().isEnabled()).toBe(false);
          await expect(page.getSubmit().isEnabled()).toBe(true);
          await expect((await page.creatorErrorExists())).toBeFalsy();
        });

        it('valid form values', async () => {
          expect(await page.getName().getAttribute('value')).toEqual(user_enroll_edit.name);
          expect(await page.getComment().getAttribute('value')).toEqual('my comment');
        });

        describe('edit comment - send', () => {
          beforeEach(async () => {
            await page.setComment('edited comment by enrollment creator');
            page.submit();
          });

          it('should complete edit', async () => {
            expect(
              browser.wait(protractor.ExpectedConditions.urlContains('/enroll?a=' + appointmentLink), 5000)
                .catch(() => {
                  return false;
                })
            ).toBeTruthy(`Url match could not succeed`);
            expect(await page.getSnackbar().getText()).toEqual('Erfolgreich bearbeitet');
          });
        });
      });
    });

    describe('As different user', () => {
      const enrollmentIdUser2 = '3554e58f-5a31-47b7-aa52-378ccdc68537';

      const user_enroll_edit_2 = {
        name: 'User Enroll Edit 2',
        username: 'user_enroll_edit2'
      };

      const creator_enroll_edit = {
        name: 'Creator Enroll Edit',
        username: 'creator_enroll_edit'
      };

      beforeEach(async () => {
        page = new EnrollmentEditPage(appointmentLink, enrollmentIdUser2);
        browser.ignoreSynchronization = true;

        // USER MANAGEMENT
        await page.logout();
        await page.login(creator_enroll_edit.username);

        // APPOINTMENT PREPARATION
        await browser.get('/enroll?a=' + appointmentLink); // NEEDED TO REMOVE "PINNED" Snackbar
        page.spinnerGone();

        await page.navigateTo();
      });

      describe('valid form attributes', () => {
        beforeEach(async () => {
          await expect(page.getName().isEnabled()).toBe(false);
          await expect(page.getSubmit().isEnabled()).toBe(true);
          await expect((await page.creatorErrorExists())).toBeFalsy();
        });

        it('valid form values', async () => {
          expect(await page.getName().getAttribute('value')).toEqual(user_enroll_edit_2.name);
          expect(await page.getComment().getAttribute('value')).toEqual('my comment');
        });

        describe('edit comment - send', () => {
          beforeEach(async () => {
            await page.setComment('edited comment by appointment creator');
            page.submit();
          });

          it('should complete edit', async () => {
            expect(
              browser.wait(protractor.ExpectedConditions.urlContains('/enroll?a=' + appointmentLink), 5000)
                .catch(() => {
                  return false;
                })
            ).toBeTruthy(`Url match could not succeed`);
            expect(await page.getSnackbar().getText()).toEqual('Erfolgreich bearbeitet');
          });
        });
      });
    });
  });

  describe('Main - Unknown Enrollment', () => {
    // const user = {
    //   name: 'User Enroll Edit',
    //   username: 'user_enroll_edit'
    // };
    const appointmentLink = 'protractorEnrollEdit';
    // const enrollmentIdUser = 'bfd95241-8b2e-4b43-b3b4-bd1e39f925c1';
    // const enrollmentIdUnknown = '4099f68b-4b0e-4682-8295-d78373cc0669';

    let page = new EnrollmentPage(appointmentLink);

    beforeAll(() => {
      page.logout();
    });

    beforeEach(async () => {
      page = new EnrollmentPage(appointmentLink);
      browser.ignoreSynchronization = true;

      // USER MANAGEMENT
      // await page.logout();

      // APPOINTMENT PREPARATION
      await browser.get('/enroll?a=' + appointmentLink); // NEEDED TO REMOVE "PINNED" Snackbar
      page.spinnerGone();

      await page.navigateTo();
    });

    it('Should display form with title "Anmelden"', async () => {
      expect(await page.getMatCardTitle()).toEqual('Anmelden');
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
