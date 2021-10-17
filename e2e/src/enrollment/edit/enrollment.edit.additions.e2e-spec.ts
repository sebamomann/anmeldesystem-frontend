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
// describe('Enrollment Edit Page With Additions', () => {
//   const appointmentLink = 'protractorEnrollEditAdditions';
//
//   let page: EnrollmentEditPage;
//
//   describe('Main', () => {
//     describe('user Enrollment', () => {
//       describe('as enrollment creator', () => {
//         const enrollmentIdUser = 'aeddcc8c-14f8-4425-bbff-f61841fed6da';
//
//         const user_enroll_edit_additions = {
//           name: 'User Enroll Edit Additions',
//           username: 'user_enroll_edit_additions'
//         };
//
//         beforeEach(async () => {
//           page = new EnrollmentEditPage(appointmentLink, enrollmentIdUser);
//           browser.ignoreSynchronization = true;
//
//           // USER MANAGEMENT
//           await page.logout();
//           await page.login(user_enroll_edit_additions.username);
//
//           browser.executeScript('return window.localStorage.setItem(\'appointment-pins\', \'' + JSON.stringify([appointmentLink]) + '\');');
//
//           await page.navigateTo();
//         });
//
//         describe('navigate to additions tab', () => {
//           beforeEach(() => {
//             page.gotoAdditionsTab();
//           });
//
//           it('should display 4 additions', () => {
//             expect(page.getCheckboxes().count()).toEqual(4);
//           });
//
//           it('correct checkboxes should be selected', () => {
//             expect(page.getAdditionElement('0').isSelected()).toBeTruthy();
//             expect(page.getAdditionElement('2').isSelected()).toBeTruthy();
//             expect(page.getAdditionElement('1').isSelected()).toBeFalsy();
//             expect(page.getAdditionElement('3').isSelected()).toBeFalsy();
//           });
//
//           describe('select one and deselect one', () => {
//             beforeEach(() => {
//               page.additionDeselect('0');
//               page.additionSelect('1');
//             });
//
//             describe('submit', () => {
//               beforeEach(() => {
//                 page.nextAdditions();
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
//           });
//         });
//       });
//     });
//
//     describe('unknown enrollment', () => {
//       describe('as enrollment creator', () => {
//         const enrollmentIdUnknown = '1a515fc0-5e88-4331-bc44-afeb62a2d195';
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
//         describe('navigate to additions tab', () => {
//           beforeEach(() => {
//             page.gotoAdditionsTab();
//           });
//
//           it('should display 4 additions', () => {
//             expect(page.getCheckboxes().count()).toEqual(4);
//           });
//
//           it('correct checkboxes should be selected', () => {
//             expect(page.getAdditionElement('0').isSelected()).toBeTruthy();
//             expect(page.getAdditionElement('3').isSelected()).toBeTruthy();
//             expect(page.getAdditionElement('1').isSelected()).toBeFalsy();
//             expect(page.getAdditionElement('2').isSelected()).toBeFalsy();
//           });
//
//           describe('select one and deselect one', () => {
//             beforeEach(() => {
//               page.additionDeselect('0');
//               page.additionDeselect('3');
//               page.additionSelect('1');
//             });
//
//             describe('submit', () => {
//               beforeEach(() => {
//                 page.nextAdditions();
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
