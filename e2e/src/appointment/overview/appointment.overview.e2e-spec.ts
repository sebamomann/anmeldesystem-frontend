import {browser} from 'protractor';
import {AppointmentOverviewPage} from './appointment.overview.po';

const crypto = require('crypto');

const salt = 'mysalt';

describe('Appointment Overview Page', () => {
  const appointmentLink = 'protractorAppointmentOverview';

  let page: AppointmentOverviewPage;

  // TODO
  // split into multiple?
  // layout
  // edit
  // delete
  // appointment-details


  describe('Faulty navigation', () => {
    it('appointment not found', async () => {
      page = new AppointmentOverviewPage('unknownAppointment');
      browser.ignoreSynchronization = true;

      await page.navigateTo();

      expect(await page.appointmentNotFoundCardExists()).toBeTruthy();
    });
  });

  // TODO
  // ANGEPINNT MESSAGE

  describe('Main - Overall Layout', () => {
    beforeAll(() => {
      page = new AppointmentOverviewPage('unknownAppointment');
      page.logout();
    });

    beforeEach(async () => {
      page = new AppointmentOverviewPage(appointmentLink);
      browser.ignoreSynchronization = true;

      browser.executeScript('window.localStorage.clear();');
      await page.navigateTo();
    });

    describe('Count enrollment list', () => {
      it('should show 7 enrollments', () => {
        expect(page.getEnrollments().count()).toBe(7);
      });

      it('should show 3 creator enrollments', () => {
        expect(page.getEnrollments()
          .filter(async (e) => (await e.getAttribute('class')).includes('creator')).count()).toBe(3);
      });

      it('should show 4 unknown enrollments', () => {
        expect(page.getEnrollments()
          .filter(async (e) => (await e.getAttribute('class')).includes('unknown')).count()).toBe(4);
      });
    });

    describe('user enrollment', () => {
      it('should have correct name', async () => {
        await expect((await page.getEnrollmentName('c3a780d6-dc1b-42b1-87e4-46d133447620')).getText())
          .toEqual('User Appointment Overview');
      });

      it('should have correct username', async () => {
        await expect((await page.getEnrollmentUsername('c3a780d6-dc1b-42b1-87e4-46d133447620')).getText())
          .toEqual('@user_appointment_overview');
      });
    });

    describe('unknown enrollment', () => {
      describe('comment', () => {
        it('should have correct name', async () => {
          await expect((await page.getEnrollmentName('0363fbc6-88ad-41c7-979b-2fc65c3c1e45')).getText())
            .toEqual('Unknown Appointment Overview');
        });

        it('should have no username', () => {
          expect(page.enrollmentUsernamePresent('0363fbc6-88ad-41c7-979b-2fc65c3c1e45')).toBeFalsy();
        });

        it('should have comment', async () => {
          await expect((await page.getEnrollmentComment('0363fbc6-88ad-41c7-979b-2fc65c3c1e45')).getText())
            .toEqual('my comment');
          expect(page.enrollmentCommentSeparatorPresent('0363fbc6-88ad-41c7-979b-2fc65c3c1e45')).toBeTruthy();
        });
      });

      describe('no comment', () => {
        it('should have no comment', () => {
          expect(page.enrollmentCommentSeparatorPresent('09d06299-90b6-4247-8707-49901641ea0c')).toBeFalsy();
          expect(page.enrollmentCommentPresent('09d06299-90b6-4247-8707-49901641ea0c')).toBeFalsy();
        });
      });
    });
  });


  describe('Manipulate Enrollment', () => {
    describe('as appointment creator', () => {
      const user_appointment_creator = {
        name: 'Creator Appointment Overview',
        username: 'creator_appointment_overview'
      };

      beforeEach(async () => {
        page = new AppointmentOverviewPage(appointmentLink);
        browser.ignoreSynchronization = true;

        await page.logout();
        browser.executeScript('window.localStorage.clear();');
        await page.login(user_appointment_creator.username);
        browser.executeScript('return window.localStorage.setItem(\'appointment-pins\', \'' + JSON.stringify([appointmentLink]) + '\');');

        await page.navigateTo();
      });

      describe('click enrollment', () => {
        describe('user enrollment', () => {
          const user_appointment_overview_creator_enrollment = {
            id: 'ef935fb7-a4d0-43d6-a8c6-9f8c0e05e833',
            name: 'User Appointment Overview Creator',
            comment: 'my comment'
          };

          beforeEach(() => {
            page.clickEnrollment(user_appointment_overview_creator_enrollment.id);
          });

          it('should open expansion body', () => {
            expect(page.enrollmentExpanded(user_appointment_overview_creator_enrollment.id)).toBeTruthy();
          });

          describe('click delete', () => {
            beforeEach(() => {
              page.clickEnrollmentDelete(user_appointment_overview_creator_enrollment.id);
            });

            it('should show confirmation dialog', () => {
              expect(page.confirmationDialogOpened()).toBeTruthy();
            });

            it('should show correct message', () => {
              expect(page.getConfirmationDialogMessage().getText())
                .toEqual(`Bist du sicher, dass du "${user_appointment_overview_creator_enrollment.name}" löschen möchtest?`);
            });

            describe('confirm', () => {
              beforeEach(() => {
                page.confirm();
              });

              it('should show correct snackbar', () => {
                expect(page.getSnackbar().getText())
                  .toEqual(`"${user_appointment_overview_creator_enrollment.name}" gelöscht`);
              });
            });
          });
        });

        describe('unknown enrollment', () => {
          const unknown_appointment_overview_creator_enrollment = {
            id: '2cf704cf-2ceb-466e-a9dd-e340564ce00a',
            name: 'Unknown Appointment Overview Creator',
            comment: 'my comment'
          };
          beforeEach(() => {
            page.clickEnrollment(unknown_appointment_overview_creator_enrollment.id);
          });

          it('should open expansion body', () => {
            expect(page.enrollmentExpanded(unknown_appointment_overview_creator_enrollment.id)).toBeTruthy();
          });

          describe('click delete', () => {
            beforeEach(() => {
              page.clickEnrollmentDelete(unknown_appointment_overview_creator_enrollment.id);
            });

            it('should show confirmation dialog', () => {
              expect(page.confirmationDialogOpened()).toBeTruthy();
            });

            it('should show correct message', () => {
              expect(page.getConfirmationDialogMessage().getText())
                .toEqual(`Bist du sicher, dass du "${unknown_appointment_overview_creator_enrollment.name}" löschen möchtest?`);
            });

            describe('confirm', () => {
              beforeEach(() => {
                page.confirm();
              });

              it('should show correct snackbar', () => {
                expect(page.getSnackbar().getText())
                  .toEqual(`"${unknown_appointment_overview_creator_enrollment.name}" gelöscht`);
              });
            });
          });
        });
      });
    });

    describe('as enrollment creator', () => {
      describe('user enrollment', () => {
        const user_appointment_overview_self = {
          name: 'User Appointment Overview Self',
          username: 'user_appointment_overview_self'
        };

        beforeEach(async () => {
          page = new AppointmentOverviewPage(appointmentLink);
          browser.ignoreSynchronization = true;

          await page.logout();
          browser.executeScript('window.localStorage.clear();');
          await page.login(user_appointment_overview_self.username);
          browser.executeScript('return window.localStorage.setItem(\'appointment-pins\', \'' + JSON.stringify([appointmentLink]) + '\');');

          await page.navigateTo();
        });

        describe('click enrollment - valid', () => {
          describe('valid', () => {
            const user_appointment_overview_self_enrollment = {
              id: 'cb5fb484-f6b0-4280-a5cd-479793b352fc',
              name: user_appointment_overview_self.name,
              comment: 'my comment'
            };

            beforeEach(() => {
              page.clickEnrollment(user_appointment_overview_self_enrollment.id);
            });

            it('should open expansion body', () => {
              expect(page.enrollmentExpanded(user_appointment_overview_self_enrollment.id)).toBeTruthy();
            });

            describe('click delete', () => {
              beforeEach(() => {
                page.clickEnrollmentDelete(user_appointment_overview_self_enrollment.id);
              });

              it('should show confirmation dialog', () => {
                expect(page.confirmationDialogOpened()).toBeTruthy();
              });

              it('should show correct message', () => {
                expect(page.getConfirmationDialogMessage().getText())
                  .toEqual(`Bist du sicher, dass du "${user_appointment_overview_self_enrollment.name}" löschen möchtest?`);
              });

              describe('confirm', () => {
                beforeEach(() => {
                  page.confirm();
                });

                it('should show correct snackbar', () => {
                  expect(page.getSnackbar().getText())
                    .toEqual(`"${user_appointment_overview_self_enrollment.name}" gelöscht`);
                });
              });
            });
          });

          describe('invalid', () => {
            const unknown_appointment_overview_no_permission = {
              id: '3c38f1cd-a740-4d26-b5d6-0cea92bb97dd',
              name: 'Unknown Appointment Overview No Permission',
              comment: 'my comment'
            };

            beforeEach(() => {
              page.clickEnrollment(unknown_appointment_overview_no_permission.id);
            });

            it('should open expansion body', () => {
              expect(page.enrollmentExpanded(unknown_appointment_overview_no_permission.id)).toBeTruthy();
            });

            describe('click delete', () => {
              beforeEach(() => {
                page.clickEnrollmentDelete(unknown_appointment_overview_no_permission.id);
              });

              it('should show missing permission snackbar', () => {
                expect(page.getSnackbar().getText()).toEqual('Fehlende Berechtigungen');
              });
            });
          });
        });
      });

      describe('unknown enrollment', () => {
        const unknown_appointment_overview_self_enrollment = {
          id: 'abeb4b4a-fb5b-4d3b-95be-16f264ac32ad',
          name: 'Unknown Appointment Overview Self',
          comment: 'my comment'
        };

        beforeEach(async () => {
          page = new AppointmentOverviewPage(appointmentLink);
          browser.ignoreSynchronization = true;

          await page.logout();
          browser.executeScript('window.localStorage.clear();');
          const token = crypto.createHash('sha256').update(unknown_appointment_overview_self_enrollment.id + salt).digest('hex');
          const permissions = [{link: appointmentLink, enrollments: [{id: unknown_appointment_overview_self_enrollment.id, token}]}];
          browser.executeScript('return window.localStorage.setItem(\'permissions\', \'' + JSON.stringify(permissions) + '\');');
          browser.executeScript('return window.localStorage.setItem(\'appointment-pins\', \'' + JSON.stringify([appointmentLink]) + '\');');

          await page.navigateTo();
        });

        describe('click enrollment', () => {
          describe('valid', () => {
            beforeEach(() => {
              page.clickEnrollment(unknown_appointment_overview_self_enrollment.id);
            });

            it('should open expansion body', () => {
              expect(page.enrollmentExpanded(unknown_appointment_overview_self_enrollment.id)).toBeTruthy();
            });

            describe('click delete', () => {
              beforeEach(() => {
                page.clickEnrollmentDelete(unknown_appointment_overview_self_enrollment.id);
              });

              it('should show confirmation dialog', () => {
                expect(page.confirmationDialogOpened()).toBeTruthy();
              });

              it('should show correct message', () => {
                expect(page.getConfirmationDialogMessage().getText())
                  .toEqual(`Bist du sicher, dass du "${unknown_appointment_overview_self_enrollment.name}" löschen möchtest?`);
              });

              describe('confirm', () => {
                beforeEach(() => {
                  page.confirm();
                });

                it('should show correct snackbar', () => {
                  expect(page.getSnackbar().getText())
                    .toEqual(`"${unknown_appointment_overview_self_enrollment.name}" gelöscht`);
                });
              });
            });
          });

          describe('invalid', () => {
            const unknown_appointment_overview_no_permission = {
              id: '3c38f1cd-a740-4d26-b5d6-0cea92bb97dd',
              name: 'Unknown Appointment Overview No Permission',
              comment: 'my comment'
            };

            beforeEach(() => {
              page.clickEnrollment(unknown_appointment_overview_no_permission.id);
            });

            it('should open expansion body', () => {
              expect(page.enrollmentExpanded(unknown_appointment_overview_no_permission.id)).toBeTruthy();
            });

            describe('click delete', () => {
              beforeEach(() => {
                page.clickEnrollmentDelete(unknown_appointment_overview_no_permission.id);
              });

              it('should show missing permission dialog', () => {
                expect(page.missingPermissionDialogOpened()).toBeTruthy();
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
