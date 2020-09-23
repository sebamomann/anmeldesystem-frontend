import {browser, protractor} from 'protractor';
import {EnrollmentPage} from './enrollment.po';

describe('Enrollment Page - Logged in', () => {
  let page: EnrollmentPage;

  const appointmentLink = 'protractorEnrollLogin';

  const user = {
    name: 'User Enroll Login',
    username: 'user_enroll_login'
  };

  describe('self enrollment', () => {
    describe('main', () => {
      beforeEach(async () => {
        page = new EnrollmentPage(appointmentLink);
        browser.ignoreSynchronization = true;

        // USER MANAGEMENT
        await page.logout();
        browser.executeScript('window.localStorage.clear();');
        await page.login(user.username);

        browser.executeScript('return window.localStorage.setItem(\'appointment-pins\', \'' + JSON.stringify([appointmentLink]) + '\');');

        await page.navigateTo();
      });

      const __comment = 'my cool comment';

      it('correct form attributes', () => {
        expect(page.getName().isEnabled()).toBe(false);
        expect(page.getSelfEnrollment().isSelected()).toBe(true);
      });

      describe('fill form', () => {
        beforeEach(() => {
          page.setComment(__comment);
        });

        describe('next main', () => {
          beforeEach(() => {
            page.nextMain();
          });

          describe('enrollment check overview', () => {
            it('correct data in check form', async () => {
              await expect((await page.getCheckName()).getText()).toEqual(user.name);
              await expect((await page.getCheckUsername()).getText()).toEqual('@' + user.username);
              await expect((await page.getCheckComment()).getText()).toEqual(__comment);
            });

            describe('next check', () => {
              beforeEach(() => {
                page.nextCheck();
              });

              it('should complete enrollment', () => {
                expect(
                  browser.wait(protractor.ExpectedConditions.urlContains('/enroll?a=' + appointmentLink), 5000)
                    .catch(() => {
                      return false;
                    })
                ).toBeTruthy(`Url match could not succeed`);
                expect(page.getSnackbar().getText()).toEqual('Erfolgreich angemeldet');
              });
            });
          });
        });
      });
    });

    describe('already enrolled', () => {
      const user_existing = {
        name: 'User Enroll Login Existing Enrollment',
        username: 'user_enroll_login_existing_enrollment'
      };

      beforeEach(async () => {
        page = new EnrollmentPage(appointmentLink);
        browser.ignoreSynchronization = true;

        // USER MANAGEMENT
        page.logout();
        browser.executeScript('window.localStorage.clear();');
        await page.login(user_existing.username);

        browser.executeScript('return window.localStorage.setItem(\'appointment-pins\', \'' + JSON.stringify([appointmentLink]) + '\');');

        page.navigateTo();
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

    beforeEach(async () => {
      page = new EnrollmentPage(appointmentLink);
      browser.ignoreSynchronization = true;

      // USER MANAGEMENT
      await page.logout();
      browser.executeScript('window.localStorage.clear();');
      await page.login(user.username);

      browser.executeScript('return window.localStorage.setItem(\'appointment-pins\', \'' + JSON.stringify([appointmentLink]) + '\');');

      await page.navigateTo();
    });

    describe('deselect self enrollment', () => {
      beforeEach(() => {
        page.deselectSelfEnrollment();
      });

      it('name field enabled', () => {
        expect(page.getNextMain().isEnabled()).toBe(true);
      });

      describe('fill form', () => {
        beforeEach(() => {
          page.setName(__name);
          page.setComment(__comment);
        });

        it('name missing - send', async () => {
          page.clearName();

          page.nextMain();

          await expect((await page.getNameError()).getText()).toEqual('Bitte gebe einen Namen an');
        });

        describe('next main', () => {
          beforeEach(() => {
            page.nextMain();
          });

          describe('enrollment check overview', () => {
            it('correct data in check form', async () => {
              await expect((await page.getCheckName()).getText()).toEqual(__name);
              await expect((await page.getCheckComment()).getText()).toEqual(__comment);
            });

            describe('next check', () => {
              beforeEach(() => {
                page.nextCheck();
              });

              it('login and mail form exists without login part', () => {
                expect(page.loginAndMailFormExists()).toBeTruthy();
                expect(page.loginAndMailFormLoginContentExists()).toBeFalsy();
                expect(page.loginAndMailFormLoginContentAltExists()).toBeTruthy();
              });

              describe('go back to check overview', () => {
                beforeEach(async () => {
                  await page.goBack();
                });

                it('correct check form', async () => {
                  await expect((await page.getCheckName()).getText()).toEqual(__name);
                  await expect((await page.getCheckComment()).getText()).toEqual(__comment);
                });

                describe('go back to main form', () => {
                  beforeEach(async () => {
                    await page.goBackCheck(); // go back to main
                  });

                  it('correct main form values', () => {
                    expect(page.getName().getAttribute('value')).toEqual(__name);
                    expect(page.getComment().getAttribute('value')).toEqual(__comment);
                  });

                  it('correct main form attributes', () => {
                    expect(page.getSelfEnrollment().isSelected()).toBeFalsy();
                    expect(page.getName().getAttribute('readonly')).toBeNull();
                  });
                });
              });

              describe('insert mail', () => {
                beforeEach(() => {
                  page.setEmail('mail@example.com');
                });

                describe('send', () => {
                  beforeEach(() => {
                    page.submit();
                  });

                  it('should complete enrollment', () => {
                    expect(
                      browser.wait(protractor.ExpectedConditions.urlContains('/enroll?a=' + appointmentLink), 5000)
                        .catch(() => {
                          return false;
                        })
                    ).toBeTruthy(`Url match could not succeed`);
                    expect(page.getSnackbar().getText()).toEqual('Erfolgreich angemeldet');
                  });
                });
              });
            });
          });
        });

        describe('next main name in use', () => {
          beforeEach(() => {
            page.setName('Unknown Enroll Login Existing');

            page.nextMain();
          });

          describe('next check', () => {
            beforeEach(() => {
              page.nextCheck();
            });

            describe('insert mail', () => {
              beforeEach(() => {
                page.setEmail('mail@example.com');
              });

              describe('send', () => {
                beforeEach(() => {
                  page.submit();
                });

                it('name already in use', async () => {
                  await expect((await page.getNameError()).getText()).toEqual('Es besteht bereits eine Anmeldung mit diesem Namen');
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
