import {browser} from 'protractor';
import {EnrollmentCreationPage} from '../po/enrollment.po';
import {LocalStoragePage} from '../../general/localStorage.po';
import {UsersDataProvider} from '../../appointment/overview/po/users.data-provider';
import {LoginPage} from '../../general/login.po';
import {AppointmentOverviewPage} from '../../appointment/overview/po/appointment.overview.po';

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

  await page.deselectSelfEnrollment();

  await page.setName(nameToSet);
  await page.setComment(commentToSet);

  page.nextMain();
  page.nextCheck();
};

describe('enrollment creation page - logged in', () => {
  describe('self enrollment', () => {
    const appointmentLink = 'valid';
    const user = UsersDataProvider.getUser('bcf27563-e7b0-4334-ab91-d35bbb5e63f2');

    beforeAll(async () => {
      await localStoragePage.clear();
      await localStoragePage.preventEnrollmentHintForLink(appointmentLink);
      await localStoragePage.pinAppointment(appointmentLink);

      await loginPage.loginViaApi(user);

      await page.navigateToEnrollmentCreation(appointmentLink);
    });

    describe('correct form', () => {
      it('should display form with title "Anmelden"', () => {
        expect(page.getMatCardTitle()).toEqual('Anmelden');
      });

      it('correct form attributes', () => {
        expect(page.isNameEnabled()).toBe(false);
        expect(page.getSelfEnrollment().isSelected()).toBe(true);
      });

      it('correct form values', () => {
        expect(page.getNameValue()).toBe(user.firstName + ' ' + user.lastName);
      });
    });

    describe('fill form', () => {
      const __comment = 'self enrollment comment';

      beforeAll(async () => {
        page.waitForFormBuild();

        await page.setComment(__comment);
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
            expect(page.getCheckNameValue()).toEqual(user.firstName + ' ' + user.lastName);
            expect(page.getCheckUsername()).toEqual('@' + user.username);
            expect(page.getCheckCommentValue()).toEqual(__comment);
          });

          describe('next check', () => {
            beforeAll(() => {
              page.nextCheck();
            });

            // TODO
            // SHOULD REDIRECT TO START

            it('should not show login and mail form', () => {
              expect(page.loginAndMailFormExists()).toBeFalsy('Login and mail form is present but should not be');
            });

            it('should complete enrollment', () => {
              appointmentPage.pageRedirectedToUrl('/enroll?a=' + appointmentLink);
              expect(page.getSnackbar().getText()).toEqual('Erfolgreich angemeldet');
            });
          });
        });
      });
    });
  });

  describe('self enrollment - validate go back', () => {
    const appointmentLink = 'valid';
    const user = UsersDataProvider.getUser('bcf27563-e7b0-4334-ab91-d35bbb5e63f2');

    beforeAll(async () => {
      await localStoragePage.clear();
      await localStoragePage.preventEnrollmentHintForLink(appointmentLink);
      await localStoragePage.pinAppointment(appointmentLink);

      await loginPage.loginViaApi(user);

      await page.navigateToEnrollmentCreation(appointmentLink);
    });

    describe('fill form', () => {
      const __comment = 'self enrollment comment';

      beforeAll(async () => {
        page.waitForFormBuild();

        await page.setComment(__comment);
      });

      describe('next main', () => {
        beforeAll(() => {
          page.nextMain();
        });

        describe('enrollment check overview', () => {
          describe('back check', () => {
            beforeAll(() => {
              page.goBackCheck();
            });

            describe('correct form', () => {
              it('should display form with title "Anmelden"', () => {
                expect(page.getMatCardTitle()).toEqual('Anmelden');
              });

              it('correct form attributes', () => {
                expect(page.isNameEnabled()).toBe(false);
                expect(page.getSelfEnrollment().isSelected()).toBe(true);
              });

              it('correct form values', () => {
                expect(page.getNameValue()).toBe(user.firstName + ' ' + user.lastName);
              });
            });
          });
        });
      });
    });
  });

  describe('self enrollment - already enrolled', () => {
    const appointmentLink = 'valid';
    const user = UsersDataProvider.getUser('0ab80f61-b3c3-49d6-b18f-efdb2723f217');

    beforeAll(async () => {
      await localStoragePage.clear();
      await localStoragePage.preventEnrollmentHintForLink(appointmentLink);
      await localStoragePage.pinAppointment(appointmentLink);

      await loginPage.loginViaApi(user);

      await page.navigateToEnrollmentCreation(appointmentLink);
    });

    it('user already enrolled', async () => {
      await expect(page.getNextMain().isEnabled()).toBe(false);
      await expect((await page.getCreatorError()).getText()).toEqual('Du bist bereits angemeldet');
    });
  });


  describe('foreign enrollment', () => {
    const appointmentLink = 'valid';

    const user = UsersDataProvider.getUser('bcf27563-e7b0-4334-ab91-d35bbb5e63f2');

    const nameToSet = 'Unknown Enroll - No self enrollment';
    const commentToSet = 'unknown enroll comment - no self enrollment';

    beforeAll(async () => {
      await localStoragePage.clear();
      await localStoragePage.preventEnrollmentHintForLink(appointmentLink);
      await localStoragePage.pinAppointment(appointmentLink);

      await loginPage.loginViaApi(user);

      await page.navigateToEnrollmentCreation(appointmentLink);

      await page.deselectSelfEnrollment();
    });

    describe('correct form', () => {
      it('should display form with title "Anmelden"', () => {
        expect(page.getMatCardTitle()).toEqual('Anmelden');
      });

      it('correct form attributes', () => {
        expect(page.isNameEnabled()).toBe(true);
        expect(page.getSelfEnrollment().isSelected()).toBe(false);
      });

      it('correct form values', () => {
        expect(page.getNameValue()).toBe(user.firstName + ' ' + user.lastName);
      });
    });

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

            it('login and mail form exists without login part', () => {
              expect(page.loginAndMailFormExists()).toBeTruthy();
              expect(page.loginAndMailFormLoginContentExists()).toBeFalsy();
              expect(page.loginAndMailFormLoginContentAltExists()).toBeTruthy();
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
                  page.goBackCheck(); // go back to main
                });

                it('correct main form values', () => {
                  expect(page.getNameValue()).toEqual(nameToSet);
                  expect(page.getCommentValue()).toEqual(commentToSet);
                });

                it('correct main form attributes', () => {
                  expect(page.isNameEnabled()).toBe(true);
                  expect(page.getSelfEnrollment().isSelected()).toBe(false);
                });
              });
            });
          });
        });
      });
    });
  });

  describe('foreign enrollment - with mail', () => {
    const appointmentLink = 'valid';

    const user = UsersDataProvider.getUser('bcf27563-e7b0-4334-ab91-d35bbb5e63f2');

    const nameToSet = 'Unknown Enroll - No self enrollment';
    const commentToSet = 'unknown enroll comment - no self enrollment';

    beforeAll(async () => {
      await localStoragePage.clear();
      await localStoragePage.preventEnrollmentHintForLink(appointmentLink);
      await localStoragePage.pinAppointment(appointmentLink);

      await loginPage.loginViaApi(user);

      await page.navigateToEnrollmentCreation(appointmentLink);

      await fillForm({name: nameToSet, comment: commentToSet});
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

          expect(id).toEqual('ad654b76-df9a-4974-bbc4-d8652a9cd403');
          expect(token).toEqual('mytoken');
          expect(link).toEqual(appointmentLink);
        });
      });
    });
  });

  describe('foreign enrollment - already enrolled', () => {
    const appointmentLink = 'valid';

    const user = UsersDataProvider.getUser('bcf27563-e7b0-4334-ab91-d35bbb5e63f2');

    const nameToSet = 'Unknown Enrollment';
    const commentToSet = 'unknown enrollment comment - already enrolled';

    beforeAll(async () => {
      await localStoragePage.clear();
      await localStoragePage.preventEnrollmentHintForLink(appointmentLink);
      await localStoragePage.pinAppointment(appointmentLink);

      await loginPage.loginViaApi(user);

      await page.navigateToEnrollmentCreation(appointmentLink);

      await fillForm({name: nameToSet, comment: commentToSet});
      await page.setEmail('mail@example.com');
      page.submit();
    });

    it('correct main form values', () => {
      expect(page.getNameValue()).toBe(nameToSet);
      expect(page.getCommentValue()).toBe(commentToSet);
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
