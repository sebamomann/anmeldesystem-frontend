import {browser} from 'protractor';
import {EnrollmentPage} from './enrollment.po';

describe('Enrollment Page - Logged in', () => {
  let page: EnrollmentPage;

  // NEEDS TO BE DIFFERENT USER THAN USED BEFORE!!!!!
  beforeEach(async () => {
    page = new EnrollmentPage();
    browser.ignoreSynchronization = true;

    // USER MANAGEMENT
    await page.logout();
    await page.login('user_enroll');

    // APPOINTMENT PREPARATION
    await browser.get('/enroll?a=protractor'); // removes **pinned** snackbar
    page.spinnerGone();

    await page.navigateTo();
  });

  describe('self enrollment', () => {
    const __comment = 'my cool comment';
    beforeEach(async () => {
      await expect(page.getName().isEnabled()).toBe(false);
      await expect(page.getSelfEnrollment().isSelected()).toBe(true);
    });

    describe('fill form', () => {
      beforeEach(async () => {
        await page.setComment(__comment);
      });

      describe('send', () => {
        beforeEach(async () => {
          page.submit();
        });

        it('should complete enrollment', async () => {
          expect(await page.getUrl()).toEqual('http://localhost:4200/enroll/add?a=protractor');
          expect(await page.getSnackbar().getText()).toEqual('Erfolgreich angemeldet');
        });
      });

      it('user already enrolled', async () => {
        await expect(page.getSubmit().isEnabled()).toBe(false);
        await expect((await page.getCreatorError()).getText()).toEqual('Du bist bereits angemeldet');
      });
    });
  });

  describe('foreign enrollment', () => {
    const __name = 'foreign';
    const __comment = 'foreign_comment';

    describe('fill form', () => {
      beforeEach(async () => {
        await page.deselectSelfEnrollment();
        await expect(page.getSubmit().isEnabled()).toBe(true);

        // enroll
        await page.setName(__name);
        await page.setComment(__comment);
      });

      it('name missing - send', async () => {
        await page.clearName();

        // submit
        page.submit();

        await expect((await page.getNameError()).getText()).toEqual('Bitte gebe einen Namen an');
      });

      describe('send', () => {
        beforeEach(async () => {
          // submit
          page.submit();
        });

        describe('valid - login and mail form without login part', () => {
          beforeEach(async () => {
            expect(page.loginAndMailFormExists()).toBeTruthy();
            expect(page.loginAndMailFormLoginContentExists()).toBeFalsy();
            expect(page.loginAndMailFormExists()).toBeTruthy();
          });

          it('go back still having data (false self login)', async () => {
            page.goBack();

            expect(page.getSelfEnrollment().isSelected()).toBeFalsy();
            await expect(await page.getName().getAttribute('value')).toEqual(__name);
            await expect(await page.getComment().getAttribute('value')).toEqual(__comment);

            await expect(await page.getName().getAttribute('readonly')).toBeNull();
          });

          describe('insert mail - submit', () => {
            beforeEach(async () => {
              await page.setEmail('mail@example.com');
              page.submit();
            });

            it('should complete enrollment', async () => {
              expect(await page.getUrl()).toEqual('http://localhost:4200/enroll/add?a=protractor');
              expect(await page.getSnackbar().getText()).toEqual('Erfolgreich angemeldet');
            });

            // send second time
            it('name already in use', async () => {
              await expect(page.getNameError().getText()).toEqual('Es besteht bereits eine Anmeldung mit diesem Namen');
            });
          });
        });
      });
    });
  });

  afterEach(async () => {
    // Assert that there are no errors emitted from the browser
    // const logs = await browser.manage().logs().get(logging.Type.BROWSER);
    // expect(logs).not.toContain(jasmine.objectContaining({
    //   level: logging.Level.SEVERE,
    // } as logging.Entry));
  });
});
