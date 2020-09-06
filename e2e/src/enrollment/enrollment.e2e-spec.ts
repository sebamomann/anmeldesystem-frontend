import {browser} from 'protractor';
import {EnrollmentPage} from './enrollment.po';

describe('Enrollment Page', () => {
  let page: EnrollmentPage;

  beforeEach(() => {
    page = new EnrollmentPage();
  });

  it('Should display form with title "Anmelden"', async () => {
    browser.ignoreSynchronization = true;
    page.navigateTo();
    page.spinnerGone();

    expect(await page.getMatCardTitle()).toEqual('Anmelden');
  });

  describe('enroll', () => {
    describe('unknown user', () => {
      describe('fill form - send', () => {
        describe('valid', () => {
          it('should show loginAndMailForm', async () => {
            browser.ignoreSynchronization = true;
            page.navigateTo();
            page.spinnerGone();

            // enroll
            await page.setName('unknown');
            await page.setComment('my cool comment');
            // submit
            page.submit();

            expect(page.loginAndMailFormExists()).toBeTruthy();
          });

          describe('insert mail', () => {
            it('should complete enrollment', async () => {
              browser.ignoreSynchronization = true;
              page.navigateTo();
              page.spinnerGone();

              // enroll
              await page.setName('unknown');
              await page.setComment('my cool comment');
              // submit
              page.submit();

              // email and login form
              expect(page.loginAndMailFormExists()).toBeTruthy();
              await page.setEmail('mail@example.com');
              page.submit();

              expect(await page.getUrl()).toEqual('http://localhost:4200/enroll/add?a=protractor');
              expect(await page.getSnackbar().getText()).toEqual('Erfolgreich angemeldet');
            });
          });
        });

        describe('invalid', () => {
          it('name missing', async () => {
            browser.ignoreSynchronization = true;
            page.navigateTo();
            page.spinnerGone();

            // enroll
            await page.setName('');
            await page.setComment('');
            // submit
            page.submit();

            expect(await page.getNameError().getText()).toEqual('Bitte gebe einen Namen an');
          });

          describe('insert mail', () => {
            it('name already in use', async () => {
              browser.ignoreSynchronization = true;
              page.navigateTo();
              page.spinnerGone();

              // enroll
              await page.setName('unknown');
              await page.setComment('my cool comment');
              // submit
              page.submit();

              expect(page.loginAndMailFormExists()).toBeTruthy();
              await page.setEmail('mail@example.com');
              page.submit();

              expect(await page.getNameError().getText()).toEqual('Es besteht bereits eine Anmeldung mit diesem Namen');
            });
          });
        });
      });
    });

    describe('logged in user', () => {
      describe('self enrollment', () => {
        it('name field disabled', async () => {
          browser.ignoreSynchronization = true;
          await page.login('user_2');

          page.navigateTo();
          page.spinnerGone();

          await expect(page.getName().isEnabled()).toBe(false);
          await expect(page.getSelfEnrollment().isSelected()).toBe(true);
        });

        describe('fill form - send', () => {
          it('valid', async () => {
            browser.ignoreSynchronization = true;
            await page.login('user_2');

            page.navigateTo();
            page.spinnerGone();

            // enroll
            await page.setComment('my cool comment');
            // submit
            page.submit();

            expect(await page.getUrl()).toEqual('http://localhost:4200/enroll/add?a=protractor');
            expect(await page.getSnackbar().getText()).toEqual('Erfolgreich angemeldet');
          });
        });

        it('invalid - already enrolled', async () => {
          browser.ignoreSynchronization = true;
          await page.login('user_2');

          page.navigateTo();
          page.spinnerGone();

          await expect(page.getName().isEnabled()).toBe(false);
          await expect(page.getSubmit().isEnabled()).toBe(false);
          await expect(page.getCreatorError().getText()).toEqual('Du bist bereits angemeldet');
          await expect(page.getSelfEnrollment().isSelected()).toBe(true);
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
