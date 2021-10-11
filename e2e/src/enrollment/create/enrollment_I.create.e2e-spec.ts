import { browser } from 'protractor';
import { EnrollmentCreationPage } from '../po/enrollment.po';
import { LocalStoragePage } from '../../general/localStorage.po';
import { AppointmentOverviewPage } from '../../appointment/overview/po/appointment.overview.po';
import { LoginPage } from '../../general/login.po';
import { UsersDataProvider } from '../../appointment/overview/po/users.data-provider';

let page: EnrollmentCreationPage;
let appointmentPage: AppointmentOverviewPage;
let localStoragePage: LocalStoragePage;
let loginPage: LoginPage;

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
  loginPage = new LoginPage();

  browser.waitForAngularEnabled(false);
});

const fillForm = async (data) => {
  const nameToSet = data.name;
  const commentToSet = data.comment;

  page.waitForFormBuild();

  await page.setName(nameToSet);
  await page.setComment(commentToSet);

  page.nextMain();
  page.nextCheck();
};

describe('enrollment creation page - unknown user', () => {
  describe('not found card', () => {
    describe('faulty navigation', () => {
      beforeAll(async () => {
        await page.navigateToEnrollmentCreation('invalid');
      });

      it('should show not found card', async () => {
        const isAppointmentNotFoundCardPresent = page.isEnrollmentNotFoundCardPresent();
        expect(isAppointmentNotFoundCardPresent).toBeTruthy('Appointment not found card should be present but isn\'t');
      });
    });

    describe('correct navigation', () => {
      beforeAll(async () => {
        await page.navigateToEnrollmentCreation('valid');
      });

      it('not found card hidden', () => {
        const isAppointmentNotFoundCardPresent = page.isEnrollmentNotFoundCardPresent();
        expect(isAppointmentNotFoundCardPresent).toBeFalsy('Appointment not found card should not be present but is');
      });
    });
  });

  describe('enroll', () => {
    describe('correct form', () => {
      beforeAll(async () => {
        const appointmentLink = 'valid';

        await localStoragePage.clear();
        await localStoragePage.preventEnrollmentHintForLink(appointmentLink);
        await localStoragePage.pinAppointment(appointmentLink);

        await page.navigateToEnrollmentCreation(appointmentLink);
      });

      it('should display form with title "Anmelden"', () => {
        expect(page.getMatCardTitle()).toEqual('Anmelden');
      });

      describe('correct form values', () => {
        it('empty name', async () => {
          expect(await page.getNameValue()).toBe('');
        });

        it('empty comment', async () => {
          expect(await page.getCommentValue()).toBe('');
        });
      });
    });

    describe('fill form - default', () => {
      beforeAll(async () => {
        const appointmentLink = 'valid';

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

            describe('enrollment check overview', () => {
              it('should display check overview', () => {
                const isEnrollmentCheckCardPreset = page.isEnrollmentCheckCardPreset();
                expect(isEnrollmentCheckCardPreset).toBeTruthy('Enrollment check card should be present but isn\'t');
              });

              it('correct data in check form', () => {
                expect(page.getCheckNameValue()).toEqual(nameToSet);
                expect(page.getCheckCommentValue()).toEqual(commentToSet);
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
                  });

                  describe('go back to main form', () => {
                    beforeAll(() => {
                      page.goBackCheck();
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

    describe('fill form - errors', () => {
      beforeAll(async () => {
        const appointmentLink = 'valid';

        await localStoragePage.clear();
        await localStoragePage.preventEnrollmentHintForLink(appointmentLink);
        await localStoragePage.pinAppointment(appointmentLink);

        await page.navigateToEnrollmentCreation(appointmentLink);
      });

      describe('empty name', () => {

        describe('fill form', () => {
          beforeAll(async () => {
            page.waitForFormBuild();
          });

          describe('next main', () => {
            beforeAll(() => {
              page.nextMain();
            });

            it('correct error message', async () => {
              await expect((await page.getNameError()).getText()).toEqual('Bitte gebe einen Namen an');
            });
          });
        });
      });

      describe('empty name after input', () => {
        describe('fill form', () => {
          beforeAll(async () => {
            page.waitForFormBuild();

            await page.causeEmptyErrorName();
          });

          describe('next main', () => {
            beforeAll(() => {
              page.nextMain();
            });

            it('correct error message', async () => {
              await expect((await page.getNameError()).getText()).toEqual('Bitte gebe einen Namen an');
            });
          });
        });
      });
    });

    describe('fill form - with mail', () => {
      const appointmentLink = 'valid';

      beforeAll(async () => {
        await localStoragePage.clear();
        await localStoragePage.preventEnrollmentHintForLink(appointmentLink);
        await localStoragePage.pinAppointment(appointmentLink);

        await page.navigateToEnrollmentCreation(appointmentLink);

        await fillForm({ name: 'Unknown Enrollment', comment: 'unknown enrollment comment' });
      });

      describe('insert mail', () => {
        describe('invalid', () => {
          beforeAll(() => {
            page.setEmail('mail');
          });

          describe('send', () => {
            beforeAll(() => {
              page.submit();
            });

            it('should show mail error', async () => {
              await expect((await page.getMailError()).getText()).toEqual('Bitte gebe eine gültige E-Mail Adresse an');
            });
          });
        });

        describe('valid', () => {
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

              expect(id).toEqual('38d6773b-9ce9-4e4a-87fe-bf9719c455ad');
              expect(token).toEqual('mytoken');
              expect(link).toEqual(appointmentLink);
            });
          });
        });
      });
    });

    describe('fill form - do login', () => {
      const appointmentLink = 'valid';

      describe('login', () => {
        beforeAll(async () => {
          await loginPage.logout();
          await localStoragePage.clear();
          await localStoragePage.preventEnrollmentHintForLink(appointmentLink);
          await localStoragePage.pinAppointment(appointmentLink);

          await page.navigateToEnrollmentCreation(appointmentLink);

          await fillForm({ name: 'Unknown Enrollment', comment: 'unknown enrollment comment' });

          page.clickLogin();
          loginPage.waitForFormBuild();
          await loginPage.loginViaUI(UsersDataProvider.getUser('f67e953d-cb85-4f41-b077-4a0bf8485bc5'));
        });

        // TODO
        // Test fails due to redirect after login
        // html is not build, but redirect is happening???
        // it('should swap to start', () => {
        //   const isMainFormPresent = page.isMainFormPresent();
        //   expect(isMainFormPresent).toBeTruthy('Main form should be present but isn\'t');
        // });

        it('should complete enrollment (automatic send)', () => {
          // browser.sleep(100000);
          appointmentPage.pageRedirectedToUrl('/enroll?a=' + appointmentLink);
          expect(page.getSnackbar().getText()).toEqual('Erfolgreich angemeldet');
        });

        it('should store enrollment information', async () => {
          const storedEnrollmentValues = await localStoragePage.getObject('permissions');

          const id = storedEnrollmentValues[0].enrollments[0].id;
          const token = storedEnrollmentValues[0].enrollments[0].token;
          const link = storedEnrollmentValues[0].link;

          expect(id).toEqual('8482e122-bfa0-49ba-b473-2c1b4ebbc73e');
          expect(token).toEqual('mytoken-creator');
          expect(link).toEqual(appointmentLink);
        });
      });

      describe('login - already enrolled', () => {
        const comment = 'Already Enrolled';

        const user = UsersDataProvider.getUser('bcf27563-e7b0-4334-ab91-d35bbb5e63f2');

        beforeAll(async () => {
          await loginPage.logout();
          await localStoragePage.clear();
          await localStoragePage.preventEnrollmentHintForLink(appointmentLink);
          await localStoragePage.pinAppointment(appointmentLink);

          await page.navigateToEnrollmentCreation(appointmentLink);

          await fillForm({ name: 'Unknown Enrollment', comment });

          page.clickLogin();
          loginPage.waitForFormBuild();
          await loginPage.loginViaUI(user);
        });

        it('correct main form values', () => {
          expect(page.getNameValue()).toBe(user.firstName + ' ' + user.lastName);
          expect(page.getCommentValue()).toBe(comment);
        });

        it('correct main form attributes', async () => {
          await expect(page.getSelfEnrollment().isSelected()).toBe(true);

          await expect(page.getNextMain().isEnabled()).toBe(false);
          await expect((await page.getCreatorError()).getText()).toEqual('Du bist bereits angemeldet');
        });
      });
    });

    describe('fill form - duplicate name', () => {
      const appointmentLink = 'valid';
      const name = 'Unknown Enrollment';
      const comment = 'unknown enrollment comment - already enrolled';

      beforeAll(async () => {
        await loginPage.logout();
        await localStoragePage.clear();
        await localStoragePage.preventEnrollmentHintForLink(appointmentLink);
        await localStoragePage.pinAppointment(appointmentLink);

        await page.navigateToEnrollmentCreation(appointmentLink);

        await fillForm({ name, comment });
        await page.setEmail('mail@example.com');
        page.submit();
      });

      it('correct main form values', () => {
        expect(page.getNameValue()).toBe(name);
        expect(page.getCommentValue()).toBe(comment);
      });

      it('name already in use', () => {
        expect(page.getNameErrorValue()).toEqual('Es besteht bereits eine Anmeldung mit diesem Namen');
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
