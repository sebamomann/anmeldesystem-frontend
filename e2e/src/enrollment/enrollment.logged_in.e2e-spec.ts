import {browser, protractor} from 'protractor';
import {EnrollmentPage} from './enrollment.po';

describe('Enrollment Page - Logged in', () => {
  let page: EnrollmentPage;
  const user = {
    name: 'User Enroll',
    username: 'user_enroll'
  };
  const appointmentLink = 'protractorEnroll';

  // NEEDS TO BE DIFFERENT USER THAN USED BEFORE!!!!!
  beforeEach(async () => {
    page = new EnrollmentPage(appointmentLink);
    browser.ignoreSynchronization = true;

    // USER MANAGEMENT
    await page.logout();
    browser.executeScript('window.localStorage.clear();');
    await page.login(user.username);


    // APPOINTMENT PREPARATION
    await browser.get('/enroll?a=' + appointmentLink); // removes **pinned** snackbar
    page.spinnerGone();

    await page.navigateTo();
  });

  it('Should display form with title "Anmelden"', async () => {
    expect(await page.getMatCardTitle()).toEqual('Anmelden');
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
        beforeEach(() => {
          page.nextMain();
          page.nextCheck();
        });

        it('should complete enrollment', async () => {
          expect(
            browser.wait(protractor.ExpectedConditions.urlContains('/enroll?a=' + appointmentLink), 5000)
              .catch(() => {
                return false;
              })
          ).toBeTruthy(`Url match could not succced`);
          expect(await page.getSnackbar().getText()).toEqual('Erfolgreich angemeldet');
        });
      });

      it('user already enrolled', async () => {
        await expect(page.getNextMain().isEnabled()).toBe(false);
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
        await expect(page.getNextMain().isEnabled()).toBe(true);

        // enroll
        await page.setName(__name);
        await page.setComment(__comment);
      });

      it('name missing - send', async () => {
        await page.clearName();

        page.nextMain();

        await expect((await page.getNameError()).getText()).toEqual('Bitte gebe einen Namen an');
      });

      describe('send', () => {
        beforeEach(async () => {
          page.nextMain();
          page.nextCheck();
        });

        describe('valid - login and mail form without login part', () => {
          beforeEach(async () => {
            expect(page.loginAndMailFormExists()).toBeTruthy();
            expect(page.loginAndMailFormLoginContentExists()).toBeFalsy();
            expect(page.loginAndMailFormLoginContentAltExists()).toBeTruthy();
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
              expect(
                browser.wait(protractor.ExpectedConditions.urlContains('/enroll?a=' + appointmentLink), 5000)
                  .catch(() => {
                    return false;
                  })
              ).toBeTruthy(`Url match could not succced`);
              expect(await page.getSnackbar().getText()).toEqual('Erfolgreich angemeldet');
            });

            // send second time
            it('name already in use', async () => {
              await expect((await page.getNameError()).getText()).toEqual('Es besteht bereits eine Anmeldung mit diesem Namen');
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
