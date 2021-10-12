import { browser } from "protractor";
import { LocalStoragePage } from "../../general/localStorage.po";
// import { AppointmentOverviewPage } from "../../appointment/overview/po/appointment.overview.po";
// import { LoginPage } from "../../general/login.po";
import { EnrollmentEditPage } from "../po/enrollment.edit.po";

let page: EnrollmentEditPage;
// let appointmentPage: AppointmentOverviewPage;
let localStoragePage: LocalStoragePage;
// let loginPage: LoginPage;

beforeAll(async () => {
  await browser.get("/"); // needed to be able to clear localStorage

  const localStorageSetter = () => {
    // @ts-ignore
    console.log(window.env);
    // @ts-ignore
    window.env.API_URL = "";
  };

  browser.executeScript(localStorageSetter);

  page = new EnrollmentEditPage();
  localStoragePage = new LocalStoragePage();
  // appointmentPage = new AppointmentOverviewPage();
  // loginPage = new LoginPage();

  browser.waitForAngularEnabled(false);
});

const setPermissionTokenForEnrollment = async (appointmentLink: string, enrollmentId: string, enrollmentEditToken: string) => {
  const permissions = [
    {
      link: appointmentLink,
      enrollments: [
        {
          'id': enrollmentId,
          'token': enrollmentEditToken
        }
      ]
    }
  ];

  await localStoragePage.set("permissions", permissions);
}

const fillMainForm = async (data) => {
  const nameToSet = data.name;
  const commentToSet = data.comment;

  page.waitForFormBuild();

  await page.setName(nameToSet);

  if (commentToSet) {
    await page.setComment(commentToSet);
  }

  page.nextMain();
};

describe("enrollment edit page - unknown user", () => {
  describe("not found card", () => {
    describe("faulty navigation", () => {
      describe("invalid appointment", () => {
        beforeAll(async () => {
          await page.navigateToEnrollmentEdit("invalid", "00000000-0000-0000-0000-000000000000");
        });

        it("should show appointment not found card", async () => {
          const isAppointmentNotFoundCardPresent = page.isAppointmentNotFoundCardPresent();
          expect(isAppointmentNotFoundCardPresent).toBeTruthy("Appointment not found card should be present but isn't");
        });
      });

      describe("invalid enrollment", () => {
        beforeAll(async () => {
          await page.navigateToEnrollmentEdit("valid-enrollments-edit", "00000000-0000-0000-0000-000000000000");
        });

        it("should show enrollment not found card", async () => {
          const isEnrollmentNotFoundCardPresent = page.isEnrollmentNotFoundCardPresent();
          expect(isEnrollmentNotFoundCardPresent).toBeTruthy("Enrollment not found card should be present but isn't");
        });
      });
    });

    describe("correct navigation", () => {
      beforeAll(async () => {
        await page.navigateToEnrollmentEdit("valid-enrollments-edit", "1ff2e7e7-9048-46b2-b02b-fe95b874ef6d");
      });

      it("appointment not found card hidden", () => {
        const isAppointmentNotFoundCardPresent = page.isAppointmentNotFoundCardPresent();
        expect(isAppointmentNotFoundCardPresent).toBeFalsy("Appointment not found card should not be present but is");
      });

      it("enrollment not found card hidden", () => {
        const isEnrollmentNotFoundCardPresent = page.isEnrollmentNotFoundCardPresent();
        expect(isEnrollmentNotFoundCardPresent).toBeFalsy("Appointment not found card should not be present but is");
      });
    });
  });

  describe('edit', () => {
    describe('correct form', () => {
      beforeAll(async () => {
        const appointmentLink = "valid-enrollments-edit";
        const enrollmentId = "1ff2e7e7-9048-46b2-b02b-fe95b874ef6d";

        await localStoragePage.clear();
        await localStoragePage.preventEnrollmentHintForLink(appointmentLink);
        await localStoragePage.pinAppointment(appointmentLink);

        await page.navigateToEnrollmentEdit(appointmentLink, enrollmentId);
      });

      it('should display form with title "Bearbeiten"', () => {
        expect(page.getMatCardTitle()).toEqual('Bearbeiten');
      });

      describe('correct form values', () => {
        it('correct name', async () => {
          expect(await page.getNameValue()).toBe('Unknown Enrollment One');
        });

        it('correct comment', async () => {
          expect(await page.getCommentValue()).toBe('Comment One');
        });
      });
    });

    describe('edit values - default', () => {
      const appointmentLink = 'valid-enrollments-edit';
      const enrollmentId = "1ff2e7e7-9048-46b2-b02b-fe95b874ef6d";
      const enrollmentEditToken = "valid-enrollment-edit-token";

      describe('update name', () => {
        beforeAll(async () => {
          await localStoragePage.clear();
          await localStoragePage.preventEnrollmentHintForLink(appointmentLink);
          await localStoragePage.pinAppointment(appointmentLink);
          await setPermissionTokenForEnrollment(appointmentLink, enrollmentId, enrollmentEditToken);

          await page.navigateToEnrollmentEdit(appointmentLink, enrollmentId);
        });

        const nameToSet = 'Unknown Enrollment One - Updated';

        beforeAll(async () => {
          page.waitForFormBuild();

          await page.setName(nameToSet);
        });

        describe('submit', () => {
          beforeAll(() => {
            page.nextMain();
          });

          it('should correctly redirect', () => {
            page.pageRedirectedToUrl('/enroll?a=' + appointmentLink);
          });

          it('should show correct snackbar', () => {
            expect(page.getSnackbar().getText()).toEqual('Erfolgreich bearbeitet');
          });
        });
      });

      describe('update comment', () => {
        beforeAll(async () => {
          await localStoragePage.clear();
          await localStoragePage.preventEnrollmentHintForLink(appointmentLink);
          await localStoragePage.pinAppointment(appointmentLink);
          await setPermissionTokenForEnrollment(appointmentLink, enrollmentId, enrollmentEditToken);

          await page.navigateToEnrollmentEdit(appointmentLink, enrollmentId);
        });

        const commentToSet = 'Comment One - Updated';

        beforeAll(async () => {
          page.waitForFormBuild();

          await page.setComment(commentToSet);
        });

        describe('submit', () => {
          beforeAll(() => {
            page.nextMain();
          });

          it('should correctly redirect', () => {
            page.pageRedirectedToUrl('/enroll?a=' + appointmentLink);
          });

          it('should show correct snackbar', () => {
            expect(page.getSnackbar().getText()).toEqual('Erfolgreich bearbeitet');
          });
        });
      });
    });

    describe('edit values (form vlaidation) - error', () => {
      const appointmentLink = 'valid-enrollments-edit';
      const enrollmentId = "1ff2e7e7-9048-46b2-b02b-fe95b874ef6d";

      beforeAll(async () => {
        await localStoragePage.clear();
        await localStoragePage.preventEnrollmentHintForLink(appointmentLink);
        await localStoragePage.pinAppointment(appointmentLink);

        await page.navigateToEnrollmentEdit(appointmentLink, enrollmentId);
      });

      describe('empty name', () => {
        beforeAll(async () => {
          page.waitForFormBuild();

          await page.causeEmptyErrorName();
        });

        it('should show correct error message', () => {
          expect(page.getNameErrorValue()).toBe("Bitte gebe einen Namen an");
        });
      });
    });

    describe('edit values - duplicate name', () => {
      const appointmentLink = 'valid-enrollments-edit';
      const enrollmentId = "1ff2e7e7-9048-46b2-b02b-fe95b874ef6d";
      const enrollmentEditToken = "valid-enrollment-edit-token";
      const nameToSet = 'Unknown Enrollment One - Name in use';

      beforeAll(async () => {
        await localStoragePage.clear();
        await localStoragePage.preventEnrollmentHintForLink(appointmentLink);
        await localStoragePage.pinAppointment(appointmentLink);
        await setPermissionTokenForEnrollment(appointmentLink, enrollmentId, enrollmentEditToken);

        await page.navigateToEnrollmentEdit(appointmentLink, enrollmentId);
        await fillMainForm({ name: nameToSet, comment: undefined });
      });

      it('should show correct error message', () => {
        expect(page.getNameErrorValue()).toEqual('Es besteht bereits eine Anmeldung mit diesem Namen');
      });
    });

    describe('edit values - invalid permission token', () => {
      const appointmentLink = 'valid-enrollments-edit';
      const enrollmentId = "1ff2e7e7-9048-46b2-b02b-fe95b874ef6d";
      const enrollmentEditToken = "invalid-enrollment-edit-token";
      const nameToSet = 'Unknown Enrollment One - Updated';

      beforeAll(async () => {
        await localStoragePage.clear();
        await localStoragePage.preventEnrollmentHintForLink(appointmentLink);
        await localStoragePage.pinAppointment(appointmentLink);
        await setPermissionTokenForEnrollment(appointmentLink, enrollmentId, enrollmentEditToken);

        await page.navigateToEnrollmentEdit(appointmentLink, enrollmentId);
        await fillMainForm({ name: nameToSet, comment: undefined });
      });

      it('should show correct error message', () => {
        expect(page.getErrorSnackbar().getText()).toEqual('Sorry, du hast keine Berechtigung diesen Teilnehmer zu bearbeiten.');
      });
    });
  });
});

// import {browser, protractor} from 'protractor';
// import {EnrollmentEditPage} from './enrollment.edit.po';
//
// const crypto = require('crypto');
//
// const salt = 'mysalt';
//
// beforeAll(async () => {
//   await browser.get('/');
// });
//
// describe('Enrollment Edit Page', () => {
//   const appointmentLink = 'protractorEnrollEdit';
//
//   let page: EnrollmentEditPage;
//
//   describe('Faulty navigation', () => { // TODO extract in own test file
//     it('appointment not found', async () => {
//       page = new EnrollmentEditPage('unknownAppointment', 'any');
//       browser.ignoreSynchronization = true;
//
//       await browser.get('/enrollment/edit?a=unknownAppointment');
//       browser.executeScript('window.localStorage.clear();');
//       page.spinnerGone();
//
//       expect(await page.appointmentNotFoundCardExists()).toBeTruthy();
//     });
//
//     it('enrolment not found', async () => {
//       page = new EnrollmentEditPage('protractorEnrollEdit', 'any');
//       browser.ignoreSynchronization = true;
//       await browser.get('/enrollment/edit?a=protractorEnrollEdit&e=any').then(() => {
//       }).catch(() => {
//       });
//       page.spinnerGone();
//
//       expect(await page.enrollmentNotFoundCardExists()).toBeTruthy();
//     });
//   });
//
//   describe('Main', () => {
//     describe('user Enrollment', () => {
//       describe('as enrollment creator', () => {
//         const enrollmentIdUser = 'bfd95241-8b2e-4b43-b3b4-bd1e39f925c1';
//
//         const user_enroll_edit = {
//           name: 'User Enroll Edit',
//           username: 'user_enroll_edit'
//         };
//
//         const userEnrollmentValues = {
//           name: user_enroll_edit.name,
//           comment: 'my comment',
//         };
//
//         beforeEach(async () => {
//           page = new EnrollmentEditPage(appointmentLink, enrollmentIdUser);
//           browser.ignoreSynchronization = true;
//
//           // USER MANAGEMENT
//           await page.logout();
//           await page.login(user_enroll_edit.username);
//
//           browser.executeScript('return window.localStorage.setItem(\'appointment-pins\', \'' + JSON.stringify([appointmentLink]) + '\');');
//
//           await page.navigateTo();
//         });
//
//         describe('form', () => {
//           it('correct attributes', async () => {
//             await expect(page.getName().isEnabled()).toBe(false);
//             await expect(page.getNextMain().isEnabled()).toBe(true);
//             await expect((await page.creatorErrorExists())).toBeFalsy();
//           });
//
//           it('valid values', async () => {
//             expect(await page.getName().getAttribute('value')).toEqual(userEnrollmentValues.name);
//             expect(await page.getComment().getAttribute('value')).toEqual(userEnrollmentValues.comment);
//           });
//
//           describe('edit comment - send', () => {
//             beforeEach(async () => {
//               await page.setComment(userEnrollmentValues.comment + ' edited by enrollment creator');
//               page.nextMain();
//             });
//
//             it('should complete edit', async () => {
//               expect(
//                 browser.wait(protractor.ExpectedConditions.urlContains('/enroll?a=' + appointmentLink), 5000)
//                   .catch(() => {
//                     return false;
//                   })
//               ).toBeTruthy(`Url match could not succeed`);
//               expect(await page.getSnackbar().getText()).toEqual('Erfolgreich bearbeitet');
//             });
//           });
//         });
//       });
//
//       describe('as different user (appointment creator)', () => {
//         const enrollmentIdUser2 = '3554e58f-5a31-47b7-aa52-378ccdc68537';
//
//         const user_enroll_edit_2 = {
//           name: 'User Enroll Edit 2',
//           username: 'user_enroll_edit_2'
//         };
//
//         const user2EnrollmentValues = {
//           name: user_enroll_edit_2.name,
//           comment: 'my comment',
//         };
//
//         const creator_enroll_edit = {
//           name: 'Creator Enroll Edit',
//           username: 'creator_enroll_edit'
//         };
//
//         beforeEach(async () => {
//           page = new EnrollmentEditPage(appointmentLink, enrollmentIdUser2);
//           browser.ignoreSynchronization = true;
//
//           // USER MANAGEMENT
//           await page.logout();
//           await page.login(creator_enroll_edit.username);
//
//           browser.executeScript('return window.localStorage.setItem(\'appointment-pins\', \'' + JSON.stringify([appointmentLink]) + '\');');
//
//           await page.navigateTo();
//         });
//
//         describe('valid form attributes', () => {
//           beforeEach(async () => {
//             await expect(page.getName().isEnabled()).toBe(false);
//             await expect(page.getNextMain().isEnabled()).toBe(true);
//             await expect((await page.creatorErrorExists())).toBeFalsy();
//           });
//
//           it('valid form values', async () => {
//             expect(await page.getName().getAttribute('value')).toEqual(user2EnrollmentValues.name);
//             expect(await page.getComment().getAttribute('value')).toEqual(user2EnrollmentValues.comment);
//           });
//
//           describe('edit comment - send', () => {
//             beforeEach(async () => {
//               await page.setComment(user2EnrollmentValues.comment + ' edited by different user');
//               page.nextMain();
//             });
//
//             it('should complete edit', async () => {
//               expect(
//                 browser.wait(protractor.ExpectedConditions.urlContains('/enroll?a=' + appointmentLink), 5000)
//                   .catch(() => {
//                     return false;
//                   })
//               ).toBeTruthy(`Url match could not succeed`);
//               expect(await page.getSnackbar().getText()).toEqual('Erfolgreich bearbeitet');
//             });
//           });
//         });
//       });
//     });
//
//     describe('unknown enrollment', () => {
//       describe('as enrollment creator', () => {
//         const enrollmentIdUnknown = '4099f68b-4b0e-4682-8295-d78373cc0669';
//
//         const unknownEnrollmentValues = {
//           name: 'Unknown Enroll Edit',
//           comment: 'my comment',
//         };
//
//         beforeEach(async () => {
//           page = new EnrollmentEditPage(appointmentLink, enrollmentIdUnknown);
//           browser.ignoreSynchronization = true;
//
//           // USER MANAGEMENT
//           await page.logout();
//
//           browser.executeScript('return window.localStorage.setItem(\'appointment-pins\', \'' + JSON.stringify([appointmentLink]) + '\');');
//
//           await page.navigateTo();
//
//           // store enrollment permission in local storage
//           const token = crypto.createHash('sha256').update(enrollmentIdUnknown + salt).digest('hex');
//           const permissions = [{link: appointmentLink, enrollments: [{id: enrollmentIdUnknown, token}]}];
//           browser.executeScript('return window.localStorage.setItem(\'permissions\', \'' + JSON.stringify(permissions) + '\');');
//         });
//
//         describe('valid form attributes', () => {
//           beforeEach(async () => {
//             await expect(page.getName().isEnabled()).toBe(true);
//             await expect(page.getNextMain().isEnabled()).toBe(true);
//             await expect((await page.creatorErrorExists())).toBeFalsy();
//           });
//
//           it('valid form values', async () => {
//             expect(await page.getName().getAttribute('value')).toEqual(unknownEnrollmentValues.name);
//             expect(await page.getComment().getAttribute('value')).toEqual(unknownEnrollmentValues.comment);
//           });
//
//           describe('edit comment and name', () => {
//             beforeEach(async () => {
//               await page.setName(unknownEnrollmentValues.name + ' edited');
//               await page.setComment(unknownEnrollmentValues.comment + ' edited by enrollment creator');
//             });
//
//             describe('send', () => {
//               beforeEach(async () => {
//                 page.nextMain();
//               });
//
//               it('should complete edit', async () => {
//                 expect(
//                   browser.wait(protractor.ExpectedConditions.urlContains('/enroll?a=' + appointmentLink), 5000)
//                     .catch(() => {
//                       return false;
//                     })
//                 ).toBeTruthy(`Url match could not succeed`);
//                 expect(await page.getSnackbar().getText()).toEqual('Erfolgreich bearbeitet');
//               });
//             });
//
//             describe('clear permissions - send', () => {
//               beforeEach(async () => {
//                 browser.executeScript('window.localStorage.removeItem(\'permissions\');');
//
//                 page.nextMain();
//               });
//
//               it('invalid permissions', async () => {
//                 expect(
//                   browser.wait(protractor.ExpectedConditions.urlContains('/enroll?a=' + appointmentLink), 5000)
//                     .catch(() => {
//                       return false;
//                     })
//                 ).toBeTruthy(`Url match could not succeed`);
//                 expect(await page.getSnackbar().getText()).toEqual('Sorry, du hast keine Berechtigung diesen Teilnehmer zu bearbeiten.');
//               });
//             });
//           });
//         });
//       });
//
//       describe('as logged in user', () => {
//         const enrollmentIdUnknown = 'eda3f874-1a1f-4e12-9abf-70493778dade';
//
//         const creator_enroll_edit = {
//           name: 'Creator Enroll Edit',
//           username: 'creator_enroll_edit'
//         };
//
//         const unknownEnrollment2Values = {
//           name: 'Unknown Enroll Edit 2',
//           comment: 'my comment',
//         };
//
//         beforeEach(async () => {
//           page = new EnrollmentEditPage(appointmentLink, enrollmentIdUnknown);
//           browser.ignoreSynchronization = true;
//
//           // USER MANAGEMENT
//           await page.logout();
//           await page.login(creator_enroll_edit.username);
//
//           browser.executeScript('return window.localStorage.setItem(\'appointment-pins\', \'' + JSON.stringify([appointmentLink]) + '\');');
//
//           await page.navigateTo();
//         });
//
//         it('valid form attributes', () => {
//           expect(page.getName().isEnabled()).toBe(true);
//           expect(page.getNextMain().isEnabled()).toBe(true);
//           expect(page.creatorErrorExists()).toBeFalsy();
//         });
//
//         it('valid form values', async () => {
//           expect(await page.getName().getAttribute('value')).toEqual(unknownEnrollment2Values.name);
//           expect(await page.getComment().getAttribute('value')).toEqual(unknownEnrollment2Values.comment);
//         });
//
//         describe('edit comment and name - send', () => {
//           beforeEach(async () => {
//             await page.setName(unknownEnrollment2Values.name + ' edited');
//             await page.setComment(unknownEnrollment2Values.comment + ' edited by different user');
//             page.nextMain();
//           });
//
//           it('should complete edit', async () => {
//             expect(
//               browser.wait(protractor.ExpectedConditions.urlContains('/enroll?a=' + appointmentLink), 5000)
//                 .catch(() => {
//                   return false;
//                 })
//             ).toBeTruthy(`Url match could not succeed`);
//             expect(await page.getSnackbar().getText()).toEqual('Erfolgreich bearbeitet');
//           });
//         });
//       });
//     });
//   });
//
//
//   afterEach(async () => {
//     browser.manage().logs().get('browser').then(browserLogs => {
//       // browserLogs is an array of objects with level and message fields
//       browserLogs.forEach(log => {
//         if (log.level.value > 900) { // it's an error log
//           console.log('Browser console error!');
//           console.log(log.message);
//         }
//       });
//     });
//   });
// });
