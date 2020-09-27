import {browser, protractor} from 'protractor';
import {EnrollmentPage} from './enrollment.po';

beforeAll(async () => {
  await browser.get('/');
});

describe('Enrollment Page - Unknown user', () => {
  const appointmentLink = 'protractorEnroll';

  let page: EnrollmentPage;

  describe('Faulty navigation', () => {
    it('Should display message on appointment not found', async () => {
      page = new EnrollmentPage('unknownAppointment');
      browser.ignoreSynchronization = true;

      await browser.get('/enroll/add?a=unknownAppointment');
      await browser.executeScript('window.localStorage.clear();');
      page.spinnerGone();

      expect(await page.appointmentNotFoundCardExists()).toBeTruthy();
    });
  });

  describe('Main', () => {
    const user = {
      name: 'User Enroll Mid Login',
      username: 'user_enroll_mid_login'
    };

    beforeEach(async () => {
      page = new EnrollmentPage(appointmentLink);
      browser.ignoreSynchronization = true;

      await page.logout();

      browser.executeScript('return window.localStorage.setItem(\'appointment-pins\', \'' + JSON.stringify([appointmentLink]) + '\');');

      await page.navigateTo();
    });

    it('Should display form with title "Anmelden"', async () => {
      expect(page.getMatCardTitle().getText()).toEqual('Anmelden');
    });

    describe('unknown user', () => {
      const __name = 'Unknown Enroll';
      const __comment = 'unknown enroll comment';

      describe('fill form', () => {
        beforeEach(() => {
          page.setName(__name);
          page.setComment(__comment);
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

              it('login and mail form exists with login part', () => {
                expect(page.loginAndMailFormExists()).toBeTruthy();
                expect(page.loginAndMailFormLoginContentExists()).toBeTruthy();
                expect(page.loginAndMailFormLoginContentAltExists()).toBeFalsy();
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
                });
              });

              describe('fill form', () => {
                beforeEach(() => {
                  page.setEmail('mail@example.com');
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

              describe('login', () => {
                beforeEach(() => {
                  page.clickLogin();
                  page.fillLoginData(user.username);
                  browser.driver.wait(() =>
                    browser.driver.getCurrentUrl().then(url => /enroll\/add\?a=url/.test(url.replace(appointmentLink, 'url'))), 10000);
                  page.closeLoginSnackbar();
                });

                it('should complete enrollment (automatic send)', () => {
                  expect(
                    browser.wait(protractor.ExpectedConditions.urlContains('/enroll?a=' + appointmentLink), 5000)
                      .catch(() => {
                        return false;
                      })
                  ).toBeTruthy(`Url match could not succeed`);
                  expect(page.getSnackbar().getText()).toEqual('Erfolgreich angemeldet');
                });

                afterEach(() => {
                  page.logout();
                });
              });

              describe('login - already enrolled', () => {
                const user_existing = {
                  name: 'User Enroll Existing Enrollment',
                  username: 'user_enroll_existing_enrollment'
                };

                beforeEach(() => {
                  page.clickLogin();
                  page.fillLoginData(user_existing.username);
                  browser.driver.wait(() =>
                    browser.driver.getCurrentUrl().then(url => /enroll\/add\?a=url/.test(url.replace(appointmentLink, 'url'))), 10000);
                  page.closeLoginSnackbar();
                });

                it('correct main form values', () => {
                  expect(page.getName().getAttribute('value')).toBe(user_existing.name);
                  expect(page.getComment().getAttribute('value')).toBe(__comment);
                });

                it('correct main form attributes', async () => {
                  // expect to be self enrollment
                  await expect(page.getName().isEnabled()).toBe(false);
                  await expect(page.getSelfEnrollment().isSelected()).toBe(true);

                  await expect(page.getNextMain().isEnabled()).toBe(false);
                  await expect((await page.getCreatorError()).getText()).toEqual('Du bist bereits angemeldet');
                });

                afterEach(() => {
                  page.logout();
                });
              });
            });
          });
        });

        describe('next main name in use', () => {
          beforeEach(() => {
            page.setName('Unknown Enroll Existing');

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

        describe('missing name', () => {
          beforeEach(() => {
            page.clearName();
          });

          describe('send', () => {
            beforeEach(() => {
              page.nextMain();
            });

            it('correct error message', async () => {
              await expect((await page.getNameError()).getText()).toEqual('Bitte gebe einen Namen an');
            });
          });
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

