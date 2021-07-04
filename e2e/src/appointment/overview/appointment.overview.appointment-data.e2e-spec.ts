import {browser, by} from 'protractor';
import {AppointmentOverviewPage} from './po/appointment.overview.po';
import {LocalStoragePage} from '../../general/localStorage.po';
import {AppointmentDataProvider} from './providers/appointment.data-provider';
import {AppointmentOverviewDataPage} from './po/appointment.overview.data.po';

let appointmentLink;
let appointmentPage: AppointmentOverviewPage;
let appointmentDataPage: AppointmentOverviewDataPage;
let localStoragePage: LocalStoragePage;

beforeAll(async () => {
  await browser.get('/'); // needed to be able to clear localStorage

  appointmentPage = new AppointmentOverviewPage();
  appointmentDataPage = new AppointmentOverviewDataPage();
  localStoragePage = new LocalStoragePage();

  browser.waitForAngularEnabled(false);
});

describe('appointment overview appointment data', () => {
  describe('default', () => {
    let appointment;

    beforeAll(async () => {
      appointmentLink = 'valid';

      await localStoragePage.clear();
      await localStoragePage.preventEnrollmentHintForLink(appointmentLink);
      await localStoragePage.pinAppointment(appointmentLink);

      await appointmentPage.navigateToAppointment(appointmentLink);

      appointment = AppointmentDataProvider.getAppointment(appointmentLink);
    });

    it('location should be correct', () => {
      const location = appointmentDataPage.getAppointmentDataLocation();
      expect(location).toBe(appointment.location);
    });

    // TOODO
    // PARSING
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
      const creatorName = appointmentDataPage.getAppointmentDataCreatorName();
      expect(creatorName).toBe(appointment.creator.name);
    });

    it('creator username should be correct', () => {
      const creatorUsername = appointmentDataPage.getAppointmentDataCreatorUsername();
      expect(creatorUsername).toBe('@' + appointment.creator.username);
    });
  });

  describe('without deadline', () => {
    beforeAll(async () => {
      appointmentLink = 'no-deadline';

      await localStoragePage.clear();
      await localStoragePage.preventEnrollmentHintForLink(appointmentLink);
      await localStoragePage.pinAppointment(appointmentLink);

      await appointmentPage.navigateToAppointment(appointmentLink);
    });

    it('deadline should not be present', () => {
      const isDeadlinePresent = appointmentDataPage.isAppointmentDataDeadlinePresent();
      expect(isDeadlinePresent).toBeFalsy('Deadline should not be present but is');
    });
  });

  describe('with files', () => {
    beforeAll(async () => {
      appointmentLink = 'with-files';

      await localStoragePage.clear();
      await localStoragePage.preventEnrollmentHintForLink(appointmentLink);
      await localStoragePage.pinAppointment(appointmentLink);

      await appointmentPage.navigateToAppointment(appointmentLink);
    });

    it('should show 1 file', () => {
      const getFilesElements = appointmentDataPage.getFileBlocks();
      const numberOfFiles = getFilesElements.count();

      expect(numberOfFiles).toBe(1);
    });

    it('correct file name', () => {
      const filesElements = appointmentDataPage.getFileBlocks();
      const fileElement = filesElements.first().element(by.css('a'));
      const fileName = fileElement.getText();

      expect(fileName).toBe('testfile-1.pdf');
    });

    describe('click', () => {
      it('correct file name', () => {
        appointmentDataPage.clickFirstFile();

        const url = 'https://localhost:3000/files/2e57b350-78fa-472b-b42f-b1de84dac157';
        const pageRedirected = appointmentPage.pageRedirectedToUrl(url);

        expect(pageRedirected).toBeTruthy('Not redirected to file download');
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
