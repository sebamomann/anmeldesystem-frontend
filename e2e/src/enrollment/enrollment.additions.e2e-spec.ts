import {browser, protractor} from 'protractor';
import {EnrollmentPage} from './enrollment.po';

beforeAll(async () => {
  await browser.get('/');
});

describe('Enrollment Page - Additions', () => {
  const appointmentLink = 'protractorEnrollAdditions';

  let page: EnrollmentPage;

  describe('Main', () => {
    beforeEach(async () => {
      page = new EnrollmentPage(appointmentLink);
      browser.ignoreSynchronization = true;

      await page.logout();

      browser.executeScript('return window.localStorage.setItem(\'enrollmentHintCloses\', \'' + JSON.stringify([appointmentLink]) + '\');');
      browser.executeScript('return window.localStorage.setItem(\'appointment-pins\', \'' + JSON.stringify([appointmentLink]) + '\');');

      await page.navigateTo();
    });

    it('Should display form with title "Anmelden"', async () => {
      expect(page.getMatCardTitle().getText()).toEqual('Anmelden');
    });

    describe('unknown user', () => {
      const __name = 'Unknown Enroll Additions';
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

          describe('additions form', () => {
            it('should show 4 additions', async () => {
              await expect(page.getCheckboxes().count()).toEqual(4);
            });

            describe('select additions', () => {
              beforeEach(async () => {
                await page.selectAddition('0');
                await page.selectAddition('3');
              });

              describe('next additions', () => {
                beforeEach(() => {
                  page.nextAdditions();
                });

                describe('enrollment check overview', () => {
                  it('correct data in check form - additions', async () => {
                    expect(page.getAdditionCheckSelected('0')).toBeTruthy();
                    expect(page.getAdditionCheckSelected('3')).toBeTruthy();
                    expect(page.getAdditionCheckDeselected('1')).toBeTruthy();
                    expect(page.getAdditionCheckDeselected('2')).toBeTruthy();
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
                        expect(page.getAdditionCheckSelected('0')).toBeTruthy();
                        expect(page.getAdditionCheckSelected('3')).toBeTruthy();
                        expect(page.getAdditionCheckDeselected('1')).toBeTruthy();
                        expect(page.getAdditionCheckDeselected('2')).toBeTruthy();
                      });

                      describe('go back to main form', () => {
                        beforeEach(async () => {
                          await page.goBackCheck(); // go back to additions
                        });

                        it('correct addition form values', () => {
                          expect(page.getAddition('0').isSelected).toBeTruthy();
                          expect(page.getAddition('3').isSelected).toBeTruthy();
                        });
                      });
                    });

                    describe('insert mail', () => { // no failed mail test needed, covered in normal test
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

                    describe('login', () => {
                      const user_enroll_additions_mid_login = {
                        username: 'user_enroll_additions_mid_login',
                      };

                      beforeEach(() => {
                        page.clickLogin();
                        page.fillLoginData(user_enroll_additions_mid_login.username);
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
                  });
                });
              });
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

