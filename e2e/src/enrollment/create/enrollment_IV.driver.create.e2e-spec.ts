import {browser} from 'protractor';
import {EnrollmentCreationPage} from '../po/enrollment.po';
import {LocalStoragePage} from '../../general/localStorage.po';
import {AppointmentOverviewPage} from '../../appointment/overview/po/appointment.overview.po';

let page: EnrollmentCreationPage;
let appointmentPage: AppointmentOverviewPage;
let localStoragePage: LocalStoragePage;
// let loginPage: LoginPage;

beforeAll(async () => {
  await browser.get('/'); // needed to be able to clear localStorage

  const localStorageSetter = () => {
    // @ts-ignore
    console.log(window.env);
    // @ts-ignore
    window.env.API_URL = '';
  };
  browser.executeScript(localStorageSetter);

  page = new EnrollmentCreationPage();
  localStoragePage = new LocalStoragePage();
  appointmentPage = new AppointmentOverviewPage();
  // loginPage = new LoginPage();

  browser.waitForAngularEnabled(false);
});

const fillForm = async (data) => {
  const nameToSet = data.name;
  const commentToSet = data.comment;

  page.waitForFormBuild();

  await page.setName(nameToSet);
  await page.setComment(commentToSet);

  page.nextMain();

  // await page.selectAddition('0');
  // await page.selectAddition('2');

  page.nextAdditions();
  page.nextCheck();
};

describe('enrollment creation page - with additions', () => {
  describe('enroll', () => {
    describe('correct form - no action', () => {
      beforeAll(async () => {
        const appointmentLink = 'valid-driver';

        await localStoragePage.clear();
        await localStoragePage.preventEnrollmentHintForLink(appointmentLink);
        await localStoragePage.pinAppointment(appointmentLink);

        await page.navigateToEnrollmentCreation(appointmentLink);
      });

      const nameToSet = 'Unknown Enroll';
      const commentToSet = 'unknown enroll comment';

      describe('fill form', () => {
        beforeAll(async () => {
          page.waitForFormBuild();

          await page.setName(nameToSet);
          await page.setComment(commentToSet);
        });

        describe('next main', () => {
          beforeAll(() => {
            page.nextMain();
            page.waitForDriverPassengerFormToBePresent();
          });

          describe('correct form values - driver form', () => {
            it('driver addition is deselected', async () => {
              expect(await page.isDriverCheckboxUnchecked()).toBeTruthy();
            });

            it('empty direction', () => {
              expect(page.isRequirementSelectEmpty()).toBeTruthy();
            });
          });
        });
      });
    });

    describe('correct form - select being a driver', () => {
      beforeAll(async () => {
        const appointmentLink = 'valid-driver';

        await localStoragePage.clear();
        await localStoragePage.preventEnrollmentHintForLink(appointmentLink);
        await localStoragePage.pinAppointment(appointmentLink);

        await page.navigateToEnrollmentCreation(appointmentLink);
      });

      const nameToSet = 'Unknown Enroll';
      const commentToSet = 'unknown enroll comment';

      describe('fill form', () => {
        beforeAll(async () => {
          page.waitForFormBuild();

          await page.setName(nameToSet);
          await page.setComment(commentToSet);
        });

        describe('next main', () => {
          beforeAll(() => {
            page.nextMain();
            page.waitForDriverPassengerFormToBePresent();
          });

          describe('select driver checkbox', () => {
            beforeAll(async () => {
              await page.selectDriverCheckbox();
            });

            describe('correct form values - driver form', () => {
              it('driver addition is selected', async () => {
                expect(await page.isDriverCheckboxChecked()).toBeTruthy();
              });

              it('empty direction', () => {
                expect(page.isServiceSelectEmpty()).toBeTruthy();
              });

              it('empty seats', () => {
                expect(page.getSeatsValue()).toBe('');
              });
            });
          });
        });
      });
    });

    describe('fill form - passenger', () => {
      beforeAll(async () => {
        const appointmentLink = 'valid-additions';

        await localStoragePage.clear();
        await localStoragePage.preventEnrollmentHintForLink(appointmentLink);
        await localStoragePage.pinAppointment(appointmentLink);

        await page.navigateToEnrollmentCreation(appointmentLink);
      });

      describe('unknown user', () => {
        const nameToSet = 'Unknown Enroll';
        const commentToSet = 'unknown enroll comment';

        describe('fill form', () => {
          beforeAll(async () => {
            page.waitForFormBuild();

            await page.setName(nameToSet);
            await page.setComment(commentToSet);
          });

          describe('next main', () => {
            beforeAll(() => {
              page.nextMain();
            });

            describe('select additions', () => {
              beforeAll(async () => {
                await page.selectAddition('0');
                await page.selectAddition('2');
              });

              describe('next additions', () => {
                beforeAll(() => {
                  page.nextAdditions();
                });

                describe('enrollment check overview', () => {
                  it('should display check overview', () => {
                    const isEnrollmentCheckCardPreset = page.isEnrollmentCheckCardPreset();
                    expect(isEnrollmentCheckCardPreset).toBeTruthy('Enrollment check card should be present but isn\'t');
                  });

                  it('correct data in check form', () => {
                    expect(page.getCheckNameValue()).toEqual(nameToSet);
                    expect(page.getCheckCommentValue()).toEqual(commentToSet);

                    expect(page.getAdditionCheckSelected('0')).toBeTruthy();
                    expect(page.getAdditionCheckSelected('1')).toBeFalsy();
                    expect(page.getAdditionCheckSelected('2')).toBeTruthy();
                    expect(page.getAdditionCheckSelected('3')).toBeFalsy();
                  });

                  describe('next check', () => {
                    beforeAll(() => {
                      page.nextCheck();
                    });

                    it('login and mail form exists with login part', () => {
                      expect(page.loginAndMailFormExists()).toBeTruthy();
                      expect(page.loginAndMailFormLoginContentExists()).toBeTruthy();
                      expect(page.loginAndMailFormLoginContentAltExists()).toBeFalsy();
                    });

                    describe('go back to check overview', () => {
                      beforeAll(() => {
                        page.goBack();
                      });

                      it('correct check form', () => {
                        expect(page.getCheckNameValue()).toEqual(nameToSet);
                        expect(page.getCheckCommentValue()).toEqual(commentToSet);

                        expect(page.getAdditionCheckSelected('0')).toBeTruthy();
                        expect(page.getAdditionCheckSelected('1')).toBeFalsy();
                        expect(page.getAdditionCheckSelected('2')).toBeTruthy();
                        expect(page.getAdditionCheckSelected('3')).toBeFalsy();
                      });

                      describe('go back to addition form', () => {
                        beforeAll(() => {
                          page.goBackCheck();
                        });

                        it('correct addition form values', () => {
                          expect(page.isAdditionChecked('0')).toBeTruthy();
                          expect(page.isAdditionUnchecked('1')).toBeTruthy();
                          expect(page.isAdditionChecked('2')).toBeTruthy();
                          expect(page.isAdditionUnchecked('3')).toBeTruthy();
                        });

                        describe('go back to main form', () => {
                          beforeAll(() => {
                            page.goBackAdditions();
                          });

                          it('correct main form values', () => {
                            expect(page.getNameValue()).toEqual(nameToSet);
                            expect(page.getCommentValue()).toEqual(commentToSet);
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

    describe('fill form - driver', () => {
      beforeAll(async () => {
        const appointmentLink = 'valid-additions';

        await localStoragePage.clear();
        await localStoragePage.preventEnrollmentHintForLink(appointmentLink);
        await localStoragePage.pinAppointment(appointmentLink);

        await page.navigateToEnrollmentCreation(appointmentLink);
      });

      describe('unknown user', () => {
        const nameToSet = 'Unknown Enroll';
        const commentToSet = 'unknown enroll comment';

        describe('fill form', () => {
          beforeAll(async () => {
            page.waitForFormBuild();

            await page.setName(nameToSet);
            await page.setComment(commentToSet);
          });

          describe('next main', () => {
            beforeAll(() => {
              page.nextMain();
            });

            describe('select additions', () => {
              beforeAll(async () => {
                await page.selectAddition('0');
                await page.selectAddition('2');
              });

              describe('next additions', () => {
                beforeAll(() => {
                  page.nextAdditions();
                });

                describe('enrollment check overview', () => {
                  it('should display check overview', () => {
                    const isEnrollmentCheckCardPreset = page.isEnrollmentCheckCardPreset();
                    expect(isEnrollmentCheckCardPreset).toBeTruthy('Enrollment check card should be present but isn\'t');
                  });

                  it('correct data in check form', () => {
                    expect(page.getCheckNameValue()).toEqual(nameToSet);
                    expect(page.getCheckCommentValue()).toEqual(commentToSet);

                    expect(page.getAdditionCheckSelected('0')).toBeTruthy();
                    expect(page.getAdditionCheckSelected('1')).toBeFalsy();
                    expect(page.getAdditionCheckSelected('2')).toBeTruthy();
                    expect(page.getAdditionCheckSelected('3')).toBeFalsy();
                  });

                  describe('next check', () => {
                    beforeAll(() => {
                      page.nextCheck();
                    });

                    it('login and mail form exists with login part', () => {
                      expect(page.loginAndMailFormExists()).toBeTruthy();
                      expect(page.loginAndMailFormLoginContentExists()).toBeTruthy();
                      expect(page.loginAndMailFormLoginContentAltExists()).toBeFalsy();
                    });

                    describe('go back to check overview', () => {
                      beforeAll(() => {
                        page.goBack();
                      });

                      it('correct check form', () => {
                        expect(page.getCheckNameValue()).toEqual(nameToSet);
                        expect(page.getCheckCommentValue()).toEqual(commentToSet);

                        expect(page.getAdditionCheckSelected('0')).toBeTruthy();
                        expect(page.getAdditionCheckSelected('1')).toBeFalsy();
                        expect(page.getAdditionCheckSelected('2')).toBeTruthy();
                        expect(page.getAdditionCheckSelected('3')).toBeFalsy();
                      });

                      describe('go back to addition form', () => {
                        beforeAll(() => {
                          page.goBackCheck();
                        });

                        it('correct addition form values', () => {
                          expect(page.isAdditionChecked('0')).toBeTruthy();
                          expect(page.isAdditionUnchecked('1')).toBeTruthy();
                          expect(page.isAdditionChecked('2')).toBeTruthy();
                          expect(page.isAdditionUnchecked('3')).toBeTruthy();
                        });

                        describe('go back to main form', () => {
                          beforeAll(() => {
                            page.goBackAdditions();
                          });

                          it('correct main form values', () => {
                            expect(page.getNameValue()).toEqual(nameToSet);
                            expect(page.getCommentValue()).toEqual(commentToSet);
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

    describe('fill form - with mail', () => {
      const appointmentLink = 'valid-additions';

      beforeAll(async () => {
        await localStoragePage.clear();
        await localStoragePage.preventEnrollmentHintForLink(appointmentLink);
        await localStoragePage.pinAppointment(appointmentLink);

        await page.navigateToEnrollmentCreation(appointmentLink);

        await fillForm({name: 'Unknown Enrollment', comment: 'unknown enrollment comment'});
      });

      describe('insert mail', () => {
        beforeAll(() => {
          page.setEmail('mail@example.com');
        });

        describe('send', () => {
          beforeAll(() => {
            page.submit();
          });

          // TODO
          // TOO FAST I GUESS
          // it('should swap to start', () => {
          //   const isMainFormPresent = page.isMainFormPresent();
          //   expect(isMainFormPresent).toBeTruthy('Main form should be present but isn\'t');
          // });

          it('should complete enrollment', () => {
            appointmentPage.pageRedirectedToUrl('/enroll?a=' + appointmentLink);
            expect(page.getSnackbar().getText()).toEqual('Erfolgreich angemeldet');
          });

          it('should store enrollment information', async () => {
            const storedEnrollmentValues = await localStoragePage.getObject('permissions');

            const id = storedEnrollmentValues[0].enrollments[0].id;
            const token = storedEnrollmentValues[0].enrollments[0].token;
            const link = storedEnrollmentValues[0].link;

            expect(id).toEqual('fabedb04-fabb-4773-8ab6-e47722f6f274');
            expect(token).toEqual('mytoken-additions');
            expect(link).toEqual(appointmentLink);
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
