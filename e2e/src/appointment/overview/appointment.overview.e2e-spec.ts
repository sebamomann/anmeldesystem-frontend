import {browser} from 'protractor';
import {AppointmentOverviewPage} from './appointment.overview.po';
import {AppointmentDataProvider} from './appointment.data-provider';
import {UsersDataProvider} from './users.data-provider';
import {LocalStoragePage} from '../../general/localStorage.po';
import {LoginPage} from '../../general/login.po';
import {EnvironmentPage} from '../../general/environment.po';

// const crypto = require('crypto');
//
// const salt = 'mysalt';

let appointmentLink;
let page: AppointmentOverviewPage;
let localStoragePage: LocalStoragePage;
let loginPage: LoginPage;
let environmentPage: EnvironmentPage;

beforeAll(async () => {
  await browser.get('/'); // needed to be able to clear localStorage

  page = new AppointmentOverviewPage();
  loginPage = new LoginPage();
  localStoragePage = new LocalStoragePage();
  environmentPage = new EnvironmentPage();

  browser.waitForAngularEnabled(false);
});

describe('Appointment Overview Page', () => {
  describe('not found card', () => {
    describe('faulty navigation', () => {
      beforeAll(async () => {
        await page.navigateToAppointment('INVALID_APPOINTMENT');
      });

      it('appointment not found', () => {
        const isAppointmentNotFoundCardPresent = page.isAppointmentNotFoundCardPresent();
        expect(isAppointmentNotFoundCardPresent).toBeTruthy('Appointment not found card not present');
      });
    });

    describe('correct navigation', () => {
      beforeAll(async () => {
        appointmentLink = AppointmentDataProvider.getAppointment('test-protractor-appointment-title').link;
        await page.navigateToAppointment(appointmentLink);
      });

      it('not found card hidden', () => {
        const isAppointmentNotFoundCardPresent = page.isAppointmentNotFoundCardPresent();
        expect(isAppointmentNotFoundCardPresent).toBeFalsy('Appointment not found card is present');
      });
    });
  });

  describe('navigations', () => {
    describe('enrollment creation button', () => {
      beforeAll(async () => {
        appointmentLink = AppointmentDataProvider.getAppointment('test-protractor-appointment-title').link;

        await localStoragePage.clear();
        await localStoragePage.preventEnrollmentHintForLink(appointmentLink);
        await localStoragePage.pinAppointment(appointmentLink);

        await page.navigateToAppointment(appointmentLink);
      });

      it('should be present', () => {
        const enrollmentCreationButtonIsPresent = page.isCreationEnrollmentButtonPresent();

        expect(enrollmentCreationButtonIsPresent).toBeTruthy('Enrollment creation button is not present');
      });

      it('should redirect to enrollment creation page', () => {
        page.clickEnrollCreationButton();

        const url = '/enrollment/add?a=' + appointmentLink;
        const pageRedirected = page.pageRedirectedToUrl(url);

        expect(pageRedirected).toBeTruthy('Could not match URL');
      });
    });

    describe('driver overview button', () => {
      describe('at no driver addition appointment', () => {
        beforeAll(async () => {
          appointmentLink = AppointmentDataProvider.getAppointment('test-protractor-appointment-title').link;

          await localStoragePage.clear();
          await localStoragePage.preventEnrollmentHintForLink(appointmentLink);
          await localStoragePage.pinAppointment(appointmentLink);

          await page.navigateToAppointment(appointmentLink);
        });

        it('should not be present', () => {
          const enrollmentCreationButtonIsPresent = page.isDriverOverviewButtonPresent();

          expect(enrollmentCreationButtonIsPresent).toBeFalsy('Enrollment creation button is present');
        });
      });

      describe('at driver addition appointment', () => {
        beforeAll(async () => {
          appointmentLink = AppointmentDataProvider.getAppointment('test-protractor-appointment-driver-title').link;

          await localStoragePage.clear();
          await localStoragePage.preventEnrollmentHintForLink(appointmentLink);
          await localStoragePage.pinAppointment(appointmentLink);

          await page.navigateToAppointment(appointmentLink);
        });

        it('should be present', () => {
          const enrollmentCreationButtonIsPresent = page.isDriverOverviewButtonPresent();

          expect(enrollmentCreationButtonIsPresent).toBeTruthy('Enrollment creation button is not present');
        });

        it('should redirect to enrollment creation page', () => {
          page.clickDriverOverviewButton();

          const url = '/appointment/driver?a=' + appointmentLink;
          const pageRedirected = page.pageRedirectedToUrl(url);

          expect(pageRedirected).toBeTruthy('Could not match URL');
        });
      });
    });
  });

  describe('login hint', () => {
    describe('not logged in', () => {
      beforeAll(async () => {
        appointmentLink = AppointmentDataProvider.getAppointment('test-protractor-appointment-title').link;

        await localStoragePage.clear();
        await localStoragePage.preventEnrollmentHintForLink(appointmentLink);
        await localStoragePage.pinAppointment(appointmentLink);

        await page.navigateToAppointment(appointmentLink);
      });

      it('should be visible', () => {
        const isLoginHintPresent = page.isLoginHintPresent();

        expect(isLoginHintPresent).toBe(true);
      });

      describe('click login button', async () => {
        let url;
        let realm;

        beforeEach(async () => {
          url = await environmentPage.getEnvironmentVariable('keycloak_url');
          realm = await environmentPage.getEnvironmentVariable('keycloak_realm');

          page.clickLoginHintLoginButton();
        });

        it('should redirect to login page', async () => {
          const validRedirect = page.pageRedirectedToUrl(`${url}realms/${realm}/protocol/openid-connect/auth`);

          expect(validRedirect).toBeTruthy('Could not match URL');
        });

        afterEach(async () => {
          await browser.get('/');
        });
      });
    });

    describe('not logged in', () => {
      beforeAll(async () => {
        appointmentLink = AppointmentDataProvider.getAppointment('test-protractor-appointment-title').link;

        await localStoragePage.clear();
        await localStoragePage.preventEnrollmentHintForLink(appointmentLink);
        await localStoragePage.pinAppointment(appointmentLink);

        await loginPage.loginViaApi(UsersDataProvider.getUser('f67e953d-cb85-4f41-b077-4a0bf8485bc5'));

        await page.navigateToAppointment(appointmentLink);
      });

      it('should not be visible', () => {
        const isLoginHintPresent = page.isLoginHintPresent();

        expect(isLoginHintPresent).toBe(false);
      });
    });
  });

// describe('Manipulate Enrollment', () => {
//   describe('as appointment creator', () => {
//     const user_appointment_creator = {
//       name: 'Creator Appointment Overview',
//       username: 'creator_appointment_overview'
//     };
//
//     beforeEach(async () => {
//       page = new AppointmentOverviewPage(appointmentLink);
//       browser.ignoreSynchronization = true;
//
//       await page.logout();
//       await page.login(user_appointment_creator.username);
//
//       await page.localStorage_pinAppointment(appointmentLink);
//       await page.localStorage_preventEnrollmentHint(appointmentLink);
//
//       await page.navigateTo();
//     });
//
//     describe('click enrollment', () => {
//       describe('user enrollment', () => {
//         const user_appointment_overview_creator_enrollment = {
//           id: 'ef935fb7-a4d0-43d6-a8c6-9f8c0e05e833',
//           name: 'User Appointment Overview Creator',
//           comment: 'my comment'
//         };
//
//         beforeEach(() => {
//           page.clickEnrollment(user_appointment_overview_creator_enrollment.id);
//         });
//
//         it('should open expansion body', () => {
//           const enrollmentPanelIsExpanded = page.enrollmentPanelExpanded(user_appointment_overview_creator_enrollment.id);
//
//           expect(enrollmentPanelIsExpanded).toBeTruthy();
//         });
//
//         describe('click edit', () => {
//           beforeEach(() => {
//             page.clickEnrollmentEdit(user_appointment_overview_creator_enrollment.id);
//           });
//
//           it('should redirect to edit page', () => {
//             const url = '/enrollment/edit'
//               + '?a=' + appointmentLink
//               + '&e=' + user_appointment_overview_creator_enrollment.id;
//             const pageRedirected = page.redirectedToUrl(url);
//
//             expect(pageRedirected).toBeTruthy(`Url match could not succeed`);
//           });
//         });
//
//         describe('click delete', () => {
//           beforeEach(() => {
//             page.clickEnrollmentDelete(user_appointment_overview_creator_enrollment.id);
//           });
//
//           it('should show confirmation dialog', () => {
//             const confirmationDialogOpened = page.confirmationDialogOpened();
//
//             expect(confirmationDialogOpened).toBeTruthy();
//           });
//
//           it('should show correct message', async () => {
//             const pageDialogText = await page.getConfirmationDialogMessageText();
//
//             const expected = `Bist du sicher, dass du "${user_appointment_overview_creator_enrollment.name}" löschen möchtest?`;
//
//             expect(pageDialogText).toEqual(expected);
//           });
//
//           describe('confirm', () => {
//             beforeEach(() => {
//               page.confirm();
//             });
//
//             it('should show correct snackbar', () => {
//               const snackBarText = page.getSnackbar().getText();
//
//               const expected = `"${user_appointment_overview_creator_enrollment.name}" gelöscht`;
//
//               expect(snackBarText).toEqual(expected);
//             });
//           });
//         });
//       });
//
//       describe('unknown enrollment', () => {
//         const unknown_appointment_overview_creator_enrollment = {
//           id: '2cf704cf-2ceb-466e-a9dd-e340564ce00a',
//           name: 'Unknown Appointment Overview Creator',
//           comment: 'my comment'
//         };
//
//         beforeEach(() => {
//           page.clickEnrollment(unknown_appointment_overview_creator_enrollment.id);
//         });
//
//         it('should open expansion body', () => {
//           const enrollmentPanelExpanded = page.enrollmentPanelExpanded(unknown_appointment_overview_creator_enrollment.id);
//
//           expect(enrollmentPanelExpanded).toBeTruthy();
//         });
//
//         describe('click edit', () => {
//           beforeEach(() => {
//             page.clickEnrollmentEdit(unknown_appointment_overview_creator_enrollment.id);
//           });
//
//           it('should redirect to edit page', () => {
//             const url = '/enrollment/edit'
//               + '?a=' + appointmentLink
//               + '&e=' + unknown_appointment_overview_creator_enrollment.id;
//             const pageRedirected = page.redirectedToUrl(url);
//
//             expect(pageRedirected).toBeTruthy(`Url match could not succeed`);
//           });
//         });
//
//         describe('click delete', () => {
//           beforeEach(() => {
//             page.clickEnrollmentDelete(unknown_appointment_overview_creator_enrollment.id);
//           });
//
//           it('should show confirmation dialog', () => {
//             const confirmationDialogOpened = page.confirmationDialogOpened();
//
//             expect(confirmationDialogOpened).toBeTruthy();
//           });
//
//           it('should show correct message', async () => {
//             const confirmationDialogText = await page.getConfirmationDialogMessageText();
//
//             const expected = `Bist du sicher, dass du "${unknown_appointment_overview_creator_enrollment.name}" löschen möchtest?`;
//
//             expect(confirmationDialogText).toEqual(expected);
//           });
//
//           describe('confirm', () => {
//             beforeEach(() => {
//               page.confirm();
//             });
//
//             it('should show correct snackbar', () => {
//               const snackBarText = page.getSnackbar().getText();
//
//               const expected = `"${unknown_appointment_overview_creator_enrollment.name}" gelöscht`;
//
//               expect(snackBarText).toEqual(expected);
//             });
//           });
//         });
//       });
//     });
//   });
//
//   describe('as enrollment creator', () => {
//     describe('user enrollment', () => {
//       const user_appointment_overview_self = {
//         name: 'User Appointment Overview Self',
//         username: 'user_appointment_overview_self'
//       };
//
//       beforeEach(async () => {
//         page = new AppointmentOverviewPage(appointmentLink);
//         browser.ignoreSynchronization = true;
//
//         await page.logout();
//         await page.login(user_appointment_overview_self.username);
//
//         await page.localStorage_pinAppointment(appointmentLink);
//         await page.localStorage_preventEnrollmentHint(appointmentLink);
//
//         await page.navigateTo();
//       });
//
//       describe('click enrollment - valid', () => {
//         describe('valid', () => {
//           const user_appointment_overview_self_enrollment = {
//             id: 'cb5fb484-f6b0-4280-a5cd-479793b352fc',
//             name: user_appointment_overview_self.name,
//             comment: 'my comment'
//           };
//
//           beforeEach(() => {
//             page.clickEnrollment(user_appointment_overview_self_enrollment.id);
//           });
//
//           it('should open expansion body', () => {
//             const panelExpanded = page.enrollmentPanelExpanded(user_appointment_overview_self_enrollment.id);
//
//             expect(panelExpanded).toBeTruthy();
//           });
//
//           describe('click edit', () => {
//             beforeEach(() => {
//               page.clickEnrollmentEdit(user_appointment_overview_self_enrollment.id);
//             });
//
//             it('should redirect to edit page', () => {
//               const url = '/enrollment/edit?a=' + appointmentLink + '&e=' + user_appointment_overview_self_enrollment.id;
//               const pageRedirected = page.redirectedToUrl(url);
//
//               expect(pageRedirected).toBeTruthy(`Url match could not succeed`);
//             });
//           });
//
//           describe('click delete', () => {
//             beforeEach(() => {
//               page.clickEnrollmentDelete(user_appointment_overview_self_enrollment.id);
//             });
//
//             it('should show confirmation dialog', () => {
//               const confirmationDialogOpened = page.confirmationDialogOpened();
//
//               expect(confirmationDialogOpened).toBeTruthy();
//             });
//
//             it('should show correct message', async () => {
//               const confirmationDialogText = await page.getConfirmationDialogMessageText();
//
//               const expected = `Bist du sicher, dass du "${user_appointment_overview_self_enrollment.name}" löschen möchtest?`;
//
//               expect(confirmationDialogText).toEqual(expected);
//             });
//
//             describe('confirm', () => {
//               beforeEach(() => {
//                 page.confirm();
//               });
//
//               it('should show correct snackbar', () => {
//                 const snackbarText = page.getSnackbar().getText();
//
//                 const expected = `"${user_appointment_overview_self_enrollment.name}" gelöscht`;
//
//                 expect(snackbarText).toEqual(expected);
//               });
//             });
//           });
//         });
//
//         describe('invalid', () => {
//           const unknown_appointment_overview_no_permission = {
//             id: '3c38f1cd-a740-4d26-b5d6-0cea92bb97dd',
//             name: 'Unknown Appointment Overview No Permission',
//             comment: 'my comment'
//           };
//
//           beforeEach(() => {
//             page.clickEnrollment(unknown_appointment_overview_no_permission.id);
//           });
//
//           it('should open expansion body', () => {
//             const panelExpanded = page.enrollmentPanelExpanded(unknown_appointment_overview_no_permission.id);
//
//             expect(panelExpanded).toBeTruthy();
//           });
//
//           describe('click delete', () => {
//             beforeEach(() => {
//               page.clickEnrollmentDelete(unknown_appointment_overview_no_permission.id);
//             });
//
//             it('should show missing permission snackbar', () => {
//               const snackbarText = page.getSnackbar().getText();
//
//               const expected = 'Fehlende Berechtigungen';
//
//               expect(snackbarText).toEqual(expected);
//             });
//           });
//
//           describe('click edit', () => {
//             beforeEach(() => {
//               page.clickEnrollmentEdit(unknown_appointment_overview_no_permission.id);
//             });
//
//             it('should show missing permission snackbar', () => {
//               const snackbarText = page.getSnackbar().getText();
//
//               const expected = 'Fehlende Berechtigungen';
//
//               expect(snackbarText).toEqual(expected);
//             });
//           });
//         });
//       });
//     });
//
//     describe('unknown enrollment', () => {
//       const unknown_appointment_overview_self_enrollment = {
//         id: 'abeb4b4a-fb5b-4d3b-95be-16f264ac32ad',
//         name: 'Unknown Appointment Overview Self',
//         comment: 'my comment'
//       };
//
//       beforeEach(async () => {
//         page = new AppointmentOverviewPage(appointmentLink);
//         browser.ignoreSynchronization = true;
//
//         await page.logout();
//
//         const token = crypto.createHash('sha256').update(unknown_appointment_overview_self_enrollment.id + salt).digest('hex');
//         const permissions = [{link: appointmentLink, enrollments: [{id: unknown_appointment_overview_self_enrollment.id, token}]}];
//
//         await page.localStorage_setPermissions(permissions);
//         await page.localStorage_pinAppointment(appointmentLink);
//         await page.localStorage_preventEnrollmentHint(appointmentLink);
//
//         await page.navigateTo();
//       });
//
//       describe('click enrollment', () => {
//         describe('valid', () => {
//           beforeEach(() => {
//             page.clickEnrollment(unknown_appointment_overview_self_enrollment.id);
//           });
//
//           it('should open expansion body', () => {
//             const panelExpanded = page.enrollmentPanelExpanded(unknown_appointment_overview_self_enrollment.id);
//
//             expect(panelExpanded).toBeTruthy();
//           });
//
//           describe('click delete', () => {
//             beforeEach(() => {
//               page.clickEnrollmentDelete(unknown_appointment_overview_self_enrollment.id);
//             });
//
//             it('should show confirmation dialog', () => {
//               const confirmationDialogOpened = page.confirmationDialogOpened();
//
//               expect(confirmationDialogOpened).toBeTruthy();
//             });
//
//             it('should show correct message', async () => {
//               const confirmationDialogText = await page.getConfirmationDialogMessageText();
//
//               const expected = `Bist du sicher, dass du "${unknown_appointment_overview_self_enrollment.name}" löschen möchtest?`;
//
//               expect(confirmationDialogText).toEqual(expected);
//             });
//
//             describe('confirm', () => {
//               beforeEach(() => {
//                 page.confirm();
//               });
//
//               it('should show correct snackbar', () => {
//                 const snackbarText = page.getSnackbar().getText();
//
//                 const expected = `"${unknown_appointment_overview_self_enrollment.name}" gelöscht`;
//
//                 expect(snackbarText).toEqual(expected);
//               });
//             });
//           });
//         });
//
//         describe('invalid', () => {
//           const unknown_appointment_overview_no_permission = {
//             id: '3c38f1cd-a740-4d26-b5d6-0cea92bb97dd',
//             name: 'Unknown Appointment Overview No Permission',
//             comment: 'my comment'
//           };
//
//           beforeEach(() => {
//             page.clickEnrollment(unknown_appointment_overview_no_permission.id);
//           });
//
//           it('should open expansion body', () => {
//             const panelExpanded = page.enrollmentPanelExpanded(unknown_appointment_overview_no_permission.id);
//
//             expect(panelExpanded).toBeTruthy();
//           });
//
//           describe('click delete', () => {
//             beforeEach(() => {
//               page.clickEnrollmentDelete(unknown_appointment_overview_no_permission.id);
//             });
//
//             it('should show missing permission dialog', () => {
//               const missingPermissionDialogOpened = page.missingPermissionDialogOpened();
//
//               expect(missingPermissionDialogOpened).toBeTruthy();
//             });
//           });
//         });
//       });
//     });
//   });
// });

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
})
;
