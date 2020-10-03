import {browser, protractor} from 'protractor';
import {EnrollmentEditPage} from './enrollment.edit.po';

const crypto = require('crypto');

const salt = 'mysalt';

beforeAll(async () => {
  await browser.get('/');
});

describe('Enrollment Edit Page With Additions', () => {
  const appointmentLink = 'protractorEnrollEditAdditions';

  let page: EnrollmentEditPage;

  describe('Main', () => {
    describe('user Enrollment', () => {
      describe('as enrollment creator', () => {
        const enrollmentIdUser = 'aeddcc8c-14f8-4425-bbff-f61841fed6da';

        const user_enroll_edit_additions = {
          name: 'User Enroll Edit Additions',
          username: 'user_enroll_edit_additions'
        };

        const userEnrollmentValues = {
          name: user_enroll_edit_additions.name,
          comment: 'my comment',
        };

        beforeEach(async () => {
          page = new EnrollmentEditPage(appointmentLink, enrollmentIdUser);
          browser.ignoreSynchronization = true;

          // USER MANAGEMENT
          await page.logout();
          await page.login(user_enroll_edit_additions.username);

          browser.executeScript('return window.localStorage.setItem(\'appointment-pins\', \'' + JSON.stringify([appointmentLink]) + '\');');

          await page.navigateTo();
        });

        describe('navigate to additions tab', () => {
          beforeEach(() => {
            page.gotoAdditionsTab();
          });

          it('should display 4 additions', () => {
            expect(page.getCheckboxes().count()).toEqual(4);
          });

          it('correct checkboxes should be selected', () => {
            expect(page.getAdditionElement('0').isSelected()).toBeTruthy();
            expect(page.getAdditionElement('2').isSelected()).toBeTruthy();
            expect(page.getAdditionElement('1').isSelected()).toBeFalsy();
            expect(page.getAdditionElement('3').isSelected()).toBeFalsy();
          });

          describe('form', () => {
            it('correct attributes', async () => {
              await expect(page.getName().isEnabled()).toBe(false);
              await expect(page.getNextMain().isEnabled()).toBe(true);
              await expect((await page.creatorErrorExists())).toBeFalsy();
            });

            it('valid values', async () => {
              expect(await page.getName().getAttribute('value')).toEqual(userEnrollmentValues.name);
              expect(await page.getComment().getAttribute('value')).toEqual(userEnrollmentValues.comment);
            });

            describe('edit comment - send', () => {
              beforeEach(async () => {
                await page.setComment(userEnrollmentValues.comment + ' edited by enrollment creator');
                page.nextMain();
              });

              it('should complete edit', async () => {
                expect(
                  browser.wait(protractor.ExpectedConditions.urlContains('/enroll?a=' + appointmentLink), 5000)
                    .catch(() => {
                      return false;
                    })
                ).toBeTruthy(`Url match could not succeed`);
                expect(await page.getSnackbar().getText()).toEqual('Erfolgreich bearbeitet');
              });
            });
          });
        });
      });

      describe('as different user (appointment creator)', () => {
        const enrollmentIdUser2 = '3554e58f-5a31-47b7-aa52-378ccdc68537';

        const user_enroll_edit_2 = {
          name: 'User Enroll Edit 2',
          username: 'user_enroll_edit_2'
        };

        const user2EnrollmentValues = {
          name: user_enroll_edit_2.name,
          comment: 'my comment',
        };

        const creator_enroll_edit = {
          name: 'Creator Enroll Edit',
          username: 'creator_enroll_edit'
        };

        beforeEach(async () => {
          page = new EnrollmentEditPage(appointmentLink, enrollmentIdUser2);
          browser.ignoreSynchronization = true;

          // USER MANAGEMENT
          await page.logout();
          await page.login(creator_enroll_edit.username);

          browser.executeScript('return window.localStorage.setItem(\'appointment-pins\', \'' + JSON.stringify([appointmentLink]) + '\');');

          await page.navigateTo();
        });

        describe('valid form attributes', () => {
          beforeEach(async () => {
            await expect(page.getName().isEnabled()).toBe(false);
            await expect(page.getNextMain().isEnabled()).toBe(true);
            await expect((await page.creatorErrorExists())).toBeFalsy();
          });

          it('valid form values', async () => {
            expect(await page.getName().getAttribute('value')).toEqual(user2EnrollmentValues.name);
            expect(await page.getComment().getAttribute('value')).toEqual(user2EnrollmentValues.comment);
          });

          describe('edit comment - send', () => {
            beforeEach(async () => {
              await page.setComment(user2EnrollmentValues.comment + ' edited by different user');
              page.nextMain();
            });

            it('should complete edit', async () => {
              expect(
                browser.wait(protractor.ExpectedConditions.urlContains('/enroll?a=' + appointmentLink), 5000)
                  .catch(() => {
                    return false;
                  })
              ).toBeTruthy(`Url match could not succeed`);
              expect(await page.getSnackbar().getText()).toEqual('Erfolgreich bearbeitet');
            });
          });
        });
      });
    });

    describe('unknown enrollment', () => {
      describe('As enrollment creator', () => {
        const enrollmentIdUnknown = '4099f68b-4b0e-4682-8295-d78373cc0669';

        const unknownEnrollmentValues = {
          name: 'Unknown Enroll Edit',
          comment: 'my comment',
        };

        beforeEach(async () => {
          page = new EnrollmentEditPage(appointmentLink, enrollmentIdUnknown);
          browser.ignoreSynchronization = true;

          // USER MANAGEMENT
          await page.logout();

          browser.executeScript('return window.localStorage.setItem(\'appointment-pins\', \'' + JSON.stringify([appointmentLink]) + '\');');

          await page.navigateTo();

          // store enrollment permission in local storage
          const token = crypto.createHash('sha256').update(enrollmentIdUnknown + salt).digest('hex');
          const permissions = [{link: 'protractorEnrollEdit', enrollments: [{id: enrollmentIdUnknown, token}]}];
          browser.executeScript('return window.localStorage.setItem(\'permissions\', \'' + JSON.stringify(permissions) + '\');');
        });

        describe('valid form attributes', () => {
          beforeEach(async () => {
            await expect(page.getName().isEnabled()).toBe(true);
            await expect(page.getNextMain().isEnabled()).toBe(true);
            await expect((await page.creatorErrorExists())).toBeFalsy();
          });

          it('valid form values', async () => {
            expect(await page.getName().getAttribute('value')).toEqual(unknownEnrollmentValues.name);
            expect(await page.getComment().getAttribute('value')).toEqual(unknownEnrollmentValues.comment);
          });

          describe('edit comment and name', () => {
            beforeEach(async () => {
              await page.setName(unknownEnrollmentValues.name + ' edited');
              await page.setComment(unknownEnrollmentValues.comment + ' edited by enrollment creator');
            });

            describe('send', () => {
              beforeEach(async () => {
                page.nextMain();
              });

              it('should complete edit', async () => {
                expect(
                  browser.wait(protractor.ExpectedConditions.urlContains('/enroll?a=' + appointmentLink), 5000)
                    .catch(() => {
                      return false;
                    })
                ).toBeTruthy(`Url match could not succeed`);
                expect(await page.getSnackbar().getText()).toEqual('Erfolgreich bearbeitet');
              });
            });

            describe('clear permissions - send', () => {
              beforeEach(async () => {
                browser.executeScript('window.localStorage.removeItem(\'permissions\');');

                page.nextMain();
              });

              it('invalid permissions', async () => {
                expect(
                  browser.wait(protractor.ExpectedConditions.urlContains('/enroll?a=' + appointmentLink), 5000)
                    .catch(() => {
                      return false;
                    })
                ).toBeTruthy(`Url match could not succeed`);
                expect(await page.getSnackbar().getText()).toEqual('Sorry, du hast keine Berechtigung diesen Teilnehmer zu bearbeiten.');
              });
            });
          });
        });
      });

      describe('as logged in user', () => {
        const enrollmentIdUnknown = 'eda3f874-1a1f-4e12-9abf-70493778dade';

        const creator_enroll_edit = {
          name: 'Creator Enroll Edit',
          username: 'creator_enroll_edit'
        };

        const unknownEnrollment2Values = {
          name: 'Unknown Enroll Edit 2',
          comment: 'my comment',
        };

        beforeEach(async () => {
          page = new EnrollmentEditPage(appointmentLink, enrollmentIdUnknown);
          browser.ignoreSynchronization = true;

          // USER MANAGEMENT
          await page.logout();
          await page.login(creator_enroll_edit.username);

          browser.executeScript('return window.localStorage.setItem(\'appointment-pins\', \'' + JSON.stringify([appointmentLink]) + '\');');

          await page.navigateTo();
        });

        describe('valid form attributes', () => {
          beforeEach(async () => {
            await expect(page.getName().isEnabled()).toBe(true);
            await expect(page.getNextMain().isEnabled()).toBe(true);
            await expect((await page.creatorErrorExists())).toBeFalsy();
          });

          it('valid form values', async () => {
            expect(await page.getName().getAttribute('value')).toEqual(unknownEnrollment2Values.name);
            expect(await page.getComment().getAttribute('value')).toEqual(unknownEnrollment2Values.comment);
          });

          describe('edit comment and name - send', () => {
            beforeEach(async () => {
              await page.setName(unknownEnrollment2Values.name + ' edited');
              await page.setComment(unknownEnrollment2Values.comment + ' edited by different user');
              page.nextMain();
            });

            it('should complete edit', async () => {
              expect(
                browser.wait(protractor.ExpectedConditions.urlContains('/enroll?a=' + appointmentLink), 5000)
                  .catch(() => {
                    return false;
                  })
              ).toBeTruthy(`Url match could not succeed`);
              expect(await page.getSnackbar().getText()).toEqual('Erfolgreich bearbeitet');
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
