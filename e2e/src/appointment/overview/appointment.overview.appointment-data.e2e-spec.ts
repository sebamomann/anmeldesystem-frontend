import {browser} from 'protractor';
import {AppointmentOverviewPage} from './appointment.overview.po';
import {LocalStoragePage} from '../../general/localStorage.po';
// import {LoginPage} from '../../general/login.po';
// import {EnvironmentPage} from '../../general/environment.po';
import {AppointmentDataProvider} from './appointment.data-provider';
import {UsersDataProvider} from './users.data-provider';

// const crypto = require('crypto');
//
// const salt = 'mysalt';

let appointmentLink;
let appointmentPage: AppointmentOverviewPage;
let localStoragePage: LocalStoragePage;
// let loginPage: LoginPage;
// let environmentPage: EnvironmentPage;

beforeAll(async () => {
  await browser.get('/'); // needed to be able to clear localStorage

  appointmentPage = new AppointmentOverviewPage();
  // loginPage = new LoginPage();
  localStoragePage = new LocalStoragePage();
  // environmentPage = new EnvironmentPage();

  browser.waitForAngularEnabled(false);
});

describe('Appointment Data', () => {

  /**
   * TODO with files
   */

  describe('with deadline', () => {
    let appointment;

    beforeAll(async () => {
      appointmentLink = AppointmentDataProvider.getAppointment('test-protractor-appointment-title').link;

      await localStoragePage.clear();
      await localStoragePage.preventEnrollmentHintForLink(appointmentLink);
      await localStoragePage.pinAppointment(appointmentLink);

      await appointmentPage.navigateToAppointment(appointmentLink);

      appointment = AppointmentDataProvider.getAppointment('test-protractor-appointment-title');
    });

    it('location should be correct', () => {
      const location = appointmentPage.getAppointmentDataLocation();
      expect(location).toBe(appointment.location);
    });

    // it('date should be correct', () => {
    //   const date = appointmentPage.getAppointmentDataDate();
    //
    //   const expected = this.convertDateSimilarToDatePipe(date);
    //
    //   expect(date).toBe(date);
    // });
    //
    // it('deadline should be correct', () => {
    //   const location = appointmentPage.getAppointmentDataDeadline();
    //
    //   expect(location).toBe(appointment.deadline);
    // });

    it('creator name should be correct', () => {
      const creatorName = appointmentPage.getAppointmentDataCreatorName();

      const creator = UsersDataProvider.getUser(appointment.creatorId);

      expect(creatorName).toBe(creator.firstName + ' ' + creator.lastName);
    });

    it('creator username should be present', () => {
      const creatorUsername = appointmentPage.getAppointmentDataCreatorUsername();

      const creator = UsersDataProvider.getUser(appointment.creatorId);

      expect(creatorUsername).toBe('@' + creator.username);
    });
  });

  describe('without deadline', () => {
    beforeAll(async () => {
      appointmentLink = AppointmentDataProvider.getAppointment('test-protractor-appointment-no_deadline-title').link;

      await localStoragePage.clear();
      await localStoragePage.preventEnrollmentHintForLink(appointmentLink);
      await localStoragePage.pinAppointment(appointmentLink);

      await appointmentPage.navigateToAppointment(appointmentLink);
    });

    it('deadline should not be present', () => {
      const isDeadlinePresent = appointmentPage.isAppointmentDataDeadlinePresent();
      expect(isDeadlinePresent).toBeFalsy('Deadline is present');
    });
  });

  describe('without description', () => {
    beforeAll(async () => {
      appointmentLink = AppointmentDataProvider.getAppointment('test-protractor-appointment-no_description-title').link;

      await localStoragePage.clear();
      await localStoragePage.preventEnrollmentHintForLink(appointmentLink);
      await localStoragePage.pinAppointment(appointmentLink);

      await appointmentPage.navigateToAppointment(appointmentLink);
    });

    it('description should not be present', () => {
      const isCommentPresent = appointmentPage.isAppointmentDataDescriptionPresent();
      expect(isCommentPresent).toBeFalsy('Description is present');
    });

    it('description separator should not be present', () => {
      const isDescriptionSeparatorPresent = appointmentPage.isAppointmentDataDescriptionSeparatorPresent();
      expect(isDescriptionSeparatorPresent).toBeFalsy('Description is present');
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
