import {browser} from 'protractor';
import {EnrollmentPage} from './enrollment.po';

describe('Enrollment Page', () => {
  let page: EnrollmentPage;

  beforeAll(async () => {
    page = new EnrollmentPage();
    await page.logout();
  });

  beforeEach(async () => {
    page = new EnrollmentPage();
    browser.ignoreSynchronization = true;
    await browser.get('/enroll?a=protractor'); // NEEDED TO REMOVE "PINNED" Snackbar
    page.spinnerGone();
    await page.navigateTo();
  });

  it('Should display form with title "Anmelden"', async () => {
    expect(await page.getMatCardTitle()).toEqual('Anmelden');
  });

  // TODO
  // ACTUALLY VALIDATE DATA TO BE THERE -> WAIT FOR CALL TO BE MADE !!! maybe at the end of all?
  // - ADDITIONS
  // - DRIVER ADDITION
  // - BOTH?

  describe('enroll', () => {
    describe('unknown user', () => {
      beforeEach(async () => {
        page = new EnrollmentPage();
        browser.ignoreSynchronization = true;
        await browser.get('/enroll?a=protractor'); // NEEDED TO REMOVE "PINNED" Snackbar
        page.spinnerGone();
        await page.navigateTo();
      });

      describe('fill form - send', () => {
        describe('valid', () => {
          describe('loginAndMailForm', () => {
            it('should show', async () => {
              // enroll
              await page.setName('unknown');
              await page.setComment('my cool comment');
              // submit
              page.submit();

              expect(page.loginAndMailFormExists()).toBeTruthy();
            });

            it('should show - go back to form data still inside', async () => {
              const __orig_name = 'unknown';
              const __orig_comment = 'my cool comment';
              // enroll
              await page.setName(__orig_name);
              await page.setComment(__orig_comment);
              // submit
              page.submit();

              expect(page.loginAndMailFormExists()).toBeTruthy();

              page.goBack();

              const name = await page.getName().getAttribute('value');
              const comment = await page.getComment().getAttribute('value');

              expect(name).toEqual(__orig_name);
              expect(comment).toEqual(__orig_comment);
            });

            describe('insert mail', () => {
              it('should complete enrollment', async () => {
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

            describe('login', () => {
              it('autosend', async () => {
                const __name = 'user_2';
                const __comment = 'my cool comment';

                // enroll
                await page.setName('unknown');
                await page.setComment(__comment);

                // submit
                page.submit();

                page.clickLogin();
                await page.fillLoginData(__name);
                browser.driver.wait(() => browser.driver.getCurrentUrl().then(url => /enroll\/add\?a=protractor/.test(url)), 10000);

                await expect(page.getUrl()).toContain('http://localhost:4200/enroll/add?a=protractor');
                await expect(page.getSnackbar().getText()).toEqual('Erfolgreich angemeldet');

                await page.logout();
              });

              it('invalid - already enrolled - valid props', async () => {
                const __name = 'user_2';
                const __comment = 'my cool comment';

                // enroll
                await page.setName('unknown');
                await page.setComment(__comment);

                // submit
                page.submit();

                page.clickLogin();
                await page.fillLoginData(__name);
                browser.driver.wait(() => browser.driver.getCurrentUrl().then(url => /enroll\/add\?a=protractor/.test(url)), 10000);
                page.waitForFormBuild();

                // expect to be self enrollment
                await expect(page.getName().isEnabled()).toBe(false);
                await expect(page.getSelfEnrollment().isSelected()).toBe(true);
                // expect name and old comment to be set correctly
                await expect(page.getName().getAttribute('value')).toBe('User 2');
                await expect(page.getComment().getAttribute('value')).toBe(__comment);

                await expect(page.getSubmit().isEnabled()).toBe(false);
                await expect((await page.getCreatorError()).getText()).toEqual('Du bist bereits angemeldet');

                await page.logout();
              });
            });
          });
        });

        describe('invalid', () => {
          it('name missing', async () => {
            await page.clearName();
            await page.setComment('my cool comment');

            // submit
            page.submit();

            await expect((await page.getNameError()).getText()).toEqual('Bitte gebe einen Namen an');
          });

          describe('insert mail', () => {
            it('name already in use', async () => {
              // enroll
              await page.setName('unknown');
              await page.setComment('my cool comment');
              // submit
              page.submit();

              expect(page.loginAndMailFormExists()).toBeTruthy();
              await page.setEmail('mail@example.com');
              page.submit();

              await expect((await page.getNameError()).getText()).toEqual('Es besteht bereits eine Anmeldung mit diesem Namen');
            });
          });
        });
      });
    });

    describe('logged in user', async () => { // NEEDS TO BE DIFFERENT USER THAN USED BEFORE!!!!!
      beforeEach(async () => {
        page = new EnrollmentPage();
        browser.ignoreSynchronization = true;
        await page.login('user_3');
        await browser.get('/enroll?a=protractor'); // NEEDED TO REMOVE "PINNED" Snackbar
        page.spinnerGone();
        await page.navigateTo();
      });

      describe('self enrollment', () => {
        it('name field disabled', async () => {
          await expect(page.getName().isEnabled()).toBe(false);
          await expect(page.getSelfEnrollment().isSelected()).toBe(true);
        });

        describe('fill form - send', () => {
          it('valid', async () => {
            // enroll
            await page.setComment('my cool comment');
            // submit
            page.submit();

            expect(await page.getUrl()).toEqual('http://localhost:4200/enroll/add?a=protractor');
            expect(await page.getSnackbar().getText()).toEqual('Erfolgreich angemeldet');
          });
        });

        it('invalid - already enrolled', async () => {
          await expect(page.getSubmit().isEnabled()).toBe(false);
          await expect((await page.getCreatorError()).getText()).toEqual('Du bist bereits angemeldet');
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
