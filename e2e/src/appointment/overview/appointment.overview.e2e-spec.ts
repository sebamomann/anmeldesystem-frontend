import {browser} from 'protractor';
import {AppointmentOverviewPage} from './appointment.overview.po';

const crypto = require('crypto');

const salt = 'mysalt';

beforeAll(async () => {
  await browser.get('/');
});

describe('Appointment Overview Page', () => {
  const appointmentLink = 'protractorAppointmentOverview';

  let page: AppointmentOverviewPage;

  // TODO
  // split into multiple?
  // layout
  // appointment-details

  describe('Faulty navigation', () => {
    it('appointment not found', async () => {
      page = new AppointmentOverviewPage('unknownAppointment');
      browser.ignoreSynchronization = true;

      await page.navigateTo();

      await page.localStorage_clear();
      await page.localStorage_preventEnrollmentHint(appointmentLink);
      await page.localStorage_pinAppointment(appointmentLink);

      expect(await page.appointmentNotFoundCardExists()).toBeTruthy();
    });
  });

  // TODO
  // ANGEPINNT MESSAGE

  describe('Main - Overall Layout', () => {
    beforeEach(async () => {
      page = new AppointmentOverviewPage(appointmentLink);
      browser.ignoreSynchronization = true;

      await page.localStorage_clear();
      await page.localStorage_preventEnrollmentHint(appointmentLink);

      await page.navigateTo();
    });

    describe('Count enrollment list', () => {
      it('should show 8 enrollments', () => {
        expect(page.getEnrollments().count()).toBe(8);
      });

      it('should show 3 creator enrollments', () => {
        const enrollments = page.getEnrollments();
        const creatorEnrollments = enrollments.filter(async (e) =>
          (await e.getAttribute('class')).includes('creator'));
        const nrOfCreatorEnrollments = creatorEnrollments.count();

        expect(nrOfCreatorEnrollments).toBe(3);
      });

      it('should show 5 unknown enrollments', () => {
        const enrollments = page.getEnrollments();
        const unknownEnrollments = enrollments.filter(async (e) =>
          (await e.getAttribute('class')).includes('unknown'));
        const nrOfCreatorEnrollments = unknownEnrollments.count();

        expect(nrOfCreatorEnrollments).toBe(5);
      });
    });

    describe('user enrollment', () => {
      it('should have correct name', async () => {
        const name = await (await page.getEnrollmentName('c3a780d6-dc1b-42b1-87e4-46d133447620')).getText();

        expect(name).toEqual('User Appointment Overview');
      });

      it('should have correct username', async () => {
        const username = await (await page.getEnrollmentUsername('c3a780d6-dc1b-42b1-87e4-46d133447620')).getText();

        expect(username).toEqual('@user_appointment_overview');
      });
    });

    describe('unknown enrollment', () => {
      describe('comment', () => {
        it('should have correct name', async () => {
          const name = await (await page.getEnrollmentName('0363fbc6-88ad-41c7-979b-2fc65c3c1e45')).getText();

          expect(name).toEqual('Unknown Appointment Overview');
        });

        it('should have no username', () => {
          const usernamePresent = page.enrollmentUsernamePresent('0363fbc6-88ad-41c7-979b-2fc65c3c1e45');

          expect(usernamePresent).toBeFalsy();
        });

        it('should have comment', async () => {
          const comment = await (await page.getEnrollmentComment('0363fbc6-88ad-41c7-979b-2fc65c3c1e45')).getText();
          const commentSeparatorPresent = page.enrollmentCommentSeparatorPresent('0363fbc6-88ad-41c7-979b-2fc65c3c1e45');

          expect(comment).toEqual('my comment');
          expect(commentSeparatorPresent).toBeTruthy();
        });
      });

      describe('no comment', () => {
        it('should have no comment', () => {
          const enrollmentCommentPresent = page.enrollmentCommentPresent('09d06299-90b6-4247-8707-49901641ea0c');
          const commentSeparatorPresent = page.enrollmentCommentSeparatorPresent('09d06299-90b6-4247-8707-49901641ea0c');

          expect(enrollmentCommentPresent).toBeFalsy();
          expect(commentSeparatorPresent).toBeFalsy();
        });
      });
    });
  });

  describe('Navigation', () => {
    beforeEach(async () => {
      page = new AppointmentOverviewPage(appointmentLink);
      browser.ignoreSynchronization = true;

      await page.localStorage_clear();
      await page.localStorage_preventEnrollmentHint(appointmentLink);

      await page.navigateTo();
    });

    describe('click enroll navigation', () => {
      beforeEach(() => {
        page.clickEnrollActionButton();
      });

      it('should redirect to edit page', () => {
        const url = '/enrollment/add?a=' + appointmentLink;
        const pageRedirected = page.redirectedToUrl(url);

        expect(pageRedirected).toBeTruthy(`Url match could not succeed`);
      });
    });
  });

  describe('Menu', () => {
    describe('pin appointment local_storage', () => {
      beforeEach(async () => {
        page = new AppointmentOverviewPage(appointmentLink);
        browser.ignoreSynchronization = true;

        await page.localStorage_clear();
        await page.localStorage_pinAppointment(appointmentLink);
        await page.localStorage_preventEnrollmentHint(appointmentLink);

        await page.navigateTo();
      });

      describe('click menu', () => {
        beforeEach(() => {
          page.openAppointmentMenu();
        });

        it('should open menu', () => {
          const menuOpened = page.menuOpened();

          expect(menuOpened).toBeTruthy(`Url match could not succeed`);
        });

        it('should have 3 menu items', () => {
          const items = page.getMenuItems();

          expect(items.count()).toBe(3);
        });

        it('menu items should have properties', () => {
          const items = page.getMenuItemsNames();

          expect(items).toEqual(['Teilen', 'Entfernen', 'Benachrichtigungen aktivieren']);
        });
      });
    });

    describe('no pin appointment local_storage (set auto-pin = false)', () => {
      beforeEach(async () => {
        page = new AppointmentOverviewPage(appointmentLink);
        browser.ignoreSynchronization = true;

        await page.localStorage_clear();
        await page.localStorage_setAutoPin(false);
        await page.localStorage_preventEnrollmentHint(appointmentLink);

        await page.navigateTo();
      });

      describe('click menu', () => {
        beforeEach(() => {
          page.openAppointmentMenu();
        });

        it('should open menu', () => {
          const menuOpened = page.menuOpened();

          expect(menuOpened).toBeTruthy(`Url match could not succeed`);
        });

        it('should have 3 menu items', () => {
          const items = page.getMenuItems();

          expect(items.count()).toBe(3);
        });

        it('menu items should have properties', () => {
          const items = page.getMenuItemsNames();

          expect(items).toEqual(['Teilen', 'Anpinnen', 'Benachrichtigungen aktivieren']);
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
        await page.login(user_appointment_creator.username);

        await page.localStorage_pinAppointment(appointmentLink);
        await page.localStorage_preventEnrollmentHint(appointmentLink);

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
            const enrollmentPanelIsExpanded = page.enrollmentPanelExpanded(user_appointment_overview_creator_enrollment.id);

            expect(enrollmentPanelIsExpanded).toBeTruthy();
          });

          describe('click edit', () => {
            beforeEach(() => {
              page.clickEnrollmentEdit(user_appointment_overview_creator_enrollment.id);
            });

            it('should redirect to edit page', () => {
              const url = '/enrollment/edit'
                + '?a=' + appointmentLink
                + '&e=' + user_appointment_overview_creator_enrollment.id;
              const pageRedirected = page.redirectedToUrl(url);

              expect(pageRedirected).toBeTruthy(`Url match could not succeed`);
            });
          });

          describe('click delete', () => {
            beforeEach(() => {
              page.clickEnrollmentDelete(user_appointment_overview_creator_enrollment.id);
            });

            it('should show confirmation dialog', () => {
              const confirmationDialogOpened = page.confirmationDialogOpened();

              expect(confirmationDialogOpened).toBeTruthy();
            });

            it('should show correct message', async () => {
              const pageDialogText = await page.getConfirmationDialogMessageText();

              const expected = `Bist du sicher, dass du "${user_appointment_overview_creator_enrollment.name}" löschen möchtest?`;

              expect(pageDialogText).toEqual(expected);
            });

            describe('confirm', () => {
              beforeEach(() => {
                page.confirm();
              });

              it('should show correct snackbar', () => {
                const snackBarText = page.getSnackbar().getText();

                const expected = `"${user_appointment_overview_creator_enrollment.name}" gelöscht`;

                expect(snackBarText).toEqual(expected);
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
            const enrollmentPanelExpanded = page.enrollmentPanelExpanded(unknown_appointment_overview_creator_enrollment.id);

            expect(enrollmentPanelExpanded).toBeTruthy();
          });

          describe('click edit', () => {
            beforeEach(() => {
              page.clickEnrollmentEdit(unknown_appointment_overview_creator_enrollment.id);
            });

            it('should redirect to edit page', () => {
              const url = '/enrollment/edit'
                + '?a=' + appointmentLink
                + '&e=' + unknown_appointment_overview_creator_enrollment.id;
              const pageRedirected = page.redirectedToUrl(url);

              expect(pageRedirected).toBeTruthy(`Url match could not succeed`);
            });
          });

          describe('click delete', () => {
            beforeEach(() => {
              page.clickEnrollmentDelete(unknown_appointment_overview_creator_enrollment.id);
            });

            it('should show confirmation dialog', () => {
              const confirmationDialogOpened = page.confirmationDialogOpened();

              expect(confirmationDialogOpened).toBeTruthy();
            });

            it('should show correct message', async () => {
              const confirmationDialogText = await page.getConfirmationDialogMessageText();

              const expected = `Bist du sicher, dass du "${unknown_appointment_overview_creator_enrollment.name}" löschen möchtest?`;

              expect(confirmationDialogText).toEqual(expected);
            });

            describe('confirm', () => {
              beforeEach(() => {
                page.confirm();
              });

              it('should show correct snackbar', () => {
                const snackBarText = page.getSnackbar().getText();

                const expected = `"${unknown_appointment_overview_creator_enrollment.name}" gelöscht`;

                expect(snackBarText).toEqual(expected);
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
          await page.login(user_appointment_overview_self.username);

          await page.localStorage_pinAppointment(appointmentLink);
          await page.localStorage_preventEnrollmentHint(appointmentLink);

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
              const panelExpanded = page.enrollmentPanelExpanded(user_appointment_overview_self_enrollment.id);

              expect(panelExpanded).toBeTruthy();
            });

            describe('click edit', () => {
              beforeEach(() => {
                page.clickEnrollmentEdit(user_appointment_overview_self_enrollment.id);
              });

              it('should redirect to edit page', () => {
                const url = '/enrollment/edit?a=' + appointmentLink + '&e=' + user_appointment_overview_self_enrollment.id;
                const pageRedirected = page.redirectedToUrl(url);

                expect(pageRedirected).toBeTruthy(`Url match could not succeed`);
              });
            });

            describe('click delete', () => {
              beforeEach(() => {
                page.clickEnrollmentDelete(user_appointment_overview_self_enrollment.id);
              });

              it('should show confirmation dialog', () => {
                const confirmationDialogOpened = page.confirmationDialogOpened();

                expect(confirmationDialogOpened).toBeTruthy();
              });

              it('should show correct message', async () => {
                const confirmationDialogText = await page.getConfirmationDialogMessageText();

                const expected = `Bist du sicher, dass du "${user_appointment_overview_self_enrollment.name}" löschen möchtest?`;

                expect(confirmationDialogText).toEqual(expected);
              });

              describe('confirm', () => {
                beforeEach(() => {
                  page.confirm();
                });

                it('should show correct snackbar', () => {
                  const snackbarText = page.getSnackbar().getText();

                  const expected = `"${user_appointment_overview_self_enrollment.name}" gelöscht`;

                  expect(snackbarText).toEqual(expected);
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
              const panelExpanded = page.enrollmentPanelExpanded(unknown_appointment_overview_no_permission.id);

              expect(panelExpanded).toBeTruthy();
            });

            describe('click delete', () => {
              beforeEach(() => {
                page.clickEnrollmentDelete(unknown_appointment_overview_no_permission.id);
              });

              it('should show missing permission snackbar', () => {
                const snackbarText = page.getSnackbar().getText();

                const expected = 'Fehlende Berechtigungen';

                expect(snackbarText).toEqual(expected);
              });
            });

            describe('click edit', () => {
              beforeEach(() => {
                page.clickEnrollmentEdit(unknown_appointment_overview_no_permission.id);
              });

              it('should show missing permission snackbar', () => {
                const snackbarText = page.getSnackbar().getText();

                const expected = 'Fehlende Berechtigungen';

                expect(snackbarText).toEqual(expected);
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

          const token = crypto.createHash('sha256').update(unknown_appointment_overview_self_enrollment.id + salt).digest('hex');
          const permissions = [{link: appointmentLink, enrollments: [{id: unknown_appointment_overview_self_enrollment.id, token}]}];

          await page.localStorage_setPermissions(permissions);
          await page.localStorage_pinAppointment(appointmentLink);
          await page.localStorage_preventEnrollmentHint(appointmentLink);

          await page.navigateTo();
        });

        describe('click enrollment', () => {
          describe('valid', () => {
            beforeEach(() => {
              page.clickEnrollment(unknown_appointment_overview_self_enrollment.id);
            });

            it('should open expansion body', () => {
              const panelExpanded = page.enrollmentPanelExpanded(unknown_appointment_overview_self_enrollment.id);

              expect(panelExpanded).toBeTruthy();
            });

            describe('click delete', () => {
              beforeEach(() => {
                page.clickEnrollmentDelete(unknown_appointment_overview_self_enrollment.id);
              });

              it('should show confirmation dialog', () => {
                const confirmationDialogOpened = page.confirmationDialogOpened();

                expect(confirmationDialogOpened).toBeTruthy();
              });

              it('should show correct message', async () => {
                const confirmationDialogText = await page.getConfirmationDialogMessageText();

                const expected = `Bist du sicher, dass du "${unknown_appointment_overview_self_enrollment.name}" löschen möchtest?`;

                expect(confirmationDialogText).toEqual(expected);
              });

              describe('confirm', () => {
                beforeEach(() => {
                  page.confirm();
                });

                it('should show correct snackbar', () => {
                  const snackbarText = page.getSnackbar().getText();

                  const expected = `"${unknown_appointment_overview_self_enrollment.name}" gelöscht`;

                  expect(snackbarText).toEqual(expected);
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
              const panelExpanded = page.enrollmentPanelExpanded(unknown_appointment_overview_no_permission.id);

              expect(panelExpanded).toBeTruthy();
            });

            describe('click delete', () => {
              beforeEach(() => {
                page.clickEnrollmentDelete(unknown_appointment_overview_no_permission.id);
              });

              it('should show missing permission dialog', () => {
                const missingPermissionDialogOpened = page.missingPermissionDialogOpened();

                expect(missingPermissionDialogOpened).toBeTruthy();
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
