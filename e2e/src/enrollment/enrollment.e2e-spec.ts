import {browser, protractor} from 'protractor';
import {EnrollmentPage} from './enrollment.po';

describe('Enrollment Page - Unknown user', () => {
  const user = {
    name: 'User Enroll Foreign',
    username: 'user_enroll_foreign'
  };
  const appointmentLink = 'protractorEnroll';
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

  // TODO
  // ACTUALLY VALIDATE DATA TO BE THERE -> WAIT FOR CALL TO BE MADE !!! maybe at the end of all?
  // - ADDITIONS
  // - DRIVER ADDITION
  // - BOTH?

  describe('unknown user', () => {
    const __name = 'unknown user';
    const __comment = 'unknown user comment';

    describe('fill form', () => {
      beforeEach(async () => {
        await page.setName(__name);
        await page.setComment(__comment);
      });

      it('missing name - send', async () => {
        await page.clearName();

        page.submit();

        await expect((await page.getNameError()).getText()).toEqual('Bitte gebe einen Namen an');
      });

      describe('send', () => {
        beforeEach(() => {
          page.submit();
        });

        describe('loginAndMailForm', () => {
          beforeEach(() => {
            expect(page.loginAndMailFormExists()).toBeTruthy();
          });

          it('go back to form data still inside', async () => {
            page.goBack();

            const name = await page.getName().getAttribute('value');
            const comment = await page.getComment().getAttribute('value');

            expect(name).toEqual(__name);
            expect(comment).toEqual(__comment);
          });

          describe('fill form', () => {
            beforeEach(async () => {
              await page.setEmail('mail@example.com');
            });

            // TODO NEED CORRECT MAIL

            describe('send', () => {
              beforeEach(() => {
                page.submit();
              });

              it('should complete enrollment', async () => {
                expect(
                  browser.wait(protractor.ExpectedConditions.urlContains('/enroll?a=' + appointmentLink), 5000)
                    .catch(() => {
                      return false;
                    })
                ).toBeTruthy(`Url match could not succeed`);
                expect(await page.getSnackbar().getText()).toEqual('Erfolgreich angemeldet');
              });

              it('name already in use', async () => {
                await expect((await page.getNameError()).getText()).toEqual('Es besteht bereits eine Anmeldung mit diesem Namen');
              });
            });
          });
        });

        describe('login', () => {
          beforeEach(async () => {
            page.clickLogin();
            await page.fillLoginData(user.username);
            browser.driver.wait(() =>
              browser.driver.getCurrentUrl().then(url => /enroll\/add\?a=url/.test(url.replace(appointmentLink, 'url'))), 10000);
            await page.closeLoginSnackbar();
          });

          it('should complete enrollment (autosend)', async () => {
            expect(
              browser.wait(protractor.ExpectedConditions.urlContains('/enroll?a=' + appointmentLink), 5000)
                .catch(() => {
                  return false;
                })
            ).toBeTruthy(`Url match could not succeed`);
            await expect(page.getSnackbar().getText()).toEqual('Erfolgreich angemeldet');
          });

          it('already enrolled - valid props', async () => {
            // expect to be self enrollment
            await expect(page.getName().isEnabled()).toBe(false);
            await expect(page.getSelfEnrollment().isSelected()).toBe(true);
            // expect name and old comment to be set correctly
            await expect(page.getName().getAttribute('value')).toBe(user.name);
            await expect(page.getComment().getAttribute('value')).toBe(__comment);

            await expect(page.getSubmit().isEnabled()).toBe(false);
            await expect((await page.getCreatorError()).getText()).toEqual('Du bist bereits angemeldet');
          });

          afterEach(() => {
            page.logout();
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
