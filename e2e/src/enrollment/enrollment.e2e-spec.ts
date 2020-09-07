import {browser} from 'protractor';
import {EnrollmentPage} from './enrollment.po';

describe('Enrollment Page', () => {
  let page: EnrollmentPage;

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
              // enroll
              await page.setName('unknown');
              await page.setComment('my cool comment');
              // submit
              page.submit();

              expect(page.loginAndMailFormExists()).toBeTruthy();

              // page.
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

            describe('login - should autosend self enrollment', () => {
              it('valid', async () => {

                // LOGOUT AFTERWARDS
              });

              it('invalid - already enrolled', async () => {

              });
            });
          });
        });

        describe('invalid', () => {
          it('name missing', async () => {
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

    describe('logged in user', async () => {
      beforeAll(async () => {
        await page.login('user_2');
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
        describe('fill form - send', () => {
          describe('valid', () => {
            it('should show loginAndMailForm without login part', async () => {
            });

            it('should show loginAndMailForm without login part go back still having data (false self login)', async () => {
            });

            describe('insert mail', () => {
              it('should complete enrollment', async () => {
              });
            });
          });

          describe('invalid', () => {
            it('name missing', async () => {
            });

            describe('insert mail', () => {
              it('name already in use', async () => {
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
