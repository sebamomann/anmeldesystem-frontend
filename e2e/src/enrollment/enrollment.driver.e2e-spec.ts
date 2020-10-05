import {browser, protractor} from 'protractor';
import {EnrollmentPage} from './enrollment.po';

beforeAll(async () => {
  await browser.get('/');
});

describe('Enrollment Page - Driver', () => {
  const appointmentLink = 'protractorEnrollDriver';

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

    describe('unknown user as driver', () => {
      const __name = 'Unknown Enroll Driver';
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

          describe('driver form', () => {
            it('correct attributes', () => {
              expect(page.getDriverCheckbox().isSelected()).toBeFalsy();
            });

            it('should display passenger form', () => {
              expect(page.passengerFormExists());
            });

            describe('enroll as driver', () => {
              beforeEach(() => {
                page.selectDriver();
              });

              it('should display driver form', () => {
                expect(page.driverFormExists());
              });

              describe('fill form', () => {
                beforeEach(() => {
                  page.selectDriverValue('Nur Hin');
                  page.setSeats(4);
                });

                describe('next driver', () => {
                  beforeEach(() => {
                    page.nextDriver();
                  });

                  describe('enrollment check overview', () => {
                    it('correct data in check form - driver', async () => {
                      expect(page.driverIconExists()).toBeTruthy();
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
                          expect(page.driverIconExists()).toBeTruthy();
                        });

                        describe('go back to driver form', () => {
                          beforeEach(async () => {
                            await page.goBackCheck(); // go back to additions
                          });

                          it('correct form values', () => {
                            expect(page.getDriverCheckbox().isSelected()).toBeTruthy();
                            expect(page.getDriverService().getText()).toBe('Nur Hin');
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
                    });
                  });
                });
              });
            });
          });
        });
      });
    });

    describe('unknown user as passenger', () => {
      const __name = 'Unknown Enroll Passenger';
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

          describe('driver form', () => {
            it('correct attributes', () => {
              expect(page.getDriverCheckbox().isSelected()).toBeFalsy();
            });

            it('should display passenger form', () => {
              expect(page.passengerFormExists());
            });

            describe('enroll as passenger', () => {
              describe('select "Nur Hin" option', () => {
                beforeEach(() => {
                  page.selectPassengerValue('Nur Hin');
                });

                describe('next driver', () => {
                  beforeEach(() => {
                    page.nextDriver();
                  });

                  describe('enrollment check overview', () => {
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

                        describe('go back to driver form', () => {
                          beforeEach(async () => {
                            await page.goBackCheck(); // go back to additions
                          });

                          it('correct addition form values', () => {
                            expect(page.getDriverCheckbox().isSelected()).toBeFalsy();
                            expect(page.getPassengerRequirement().getText()).toBe('Nur Hin');
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

