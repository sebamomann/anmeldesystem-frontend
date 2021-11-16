import { AppointmentOverviewPreparationUtil } from './po/appointment.overview.preparation.util';
import { browser, by } from 'protractor';
import { AppointmentOverviewPage } from './po/appointment.overview.po';
import { LocalStoragePage } from '../../general/localStorage.po';
import { AppointmentDataProvider } from './providers/appointment.data-provider';
import { AppointmentOverviewDataPage } from './po/appointment.overview.data.po';

const appointmentOverviewPreparationUtil: AppointmentOverviewPreparationUtil = new AppointmentOverviewPreparationUtil();

let appointmentPage: AppointmentOverviewPage;
let appointmentDataPage: AppointmentOverviewDataPage;
let localStoragePage: LocalStoragePage;

beforeAll(async () => {
  await browser.get('/'); // needed to be able to clear localStorage

  const localStorageSetter = () => {
    // @ts-ignore
    console.log(window.env);
    // @ts-ignore
    window.env.API_URL = 'http://localhost:3001/';
  };
  browser.executeScript(localStorageSetter);

  appointmentPage = new AppointmentOverviewPage();
  appointmentDataPage = new AppointmentOverviewDataPage();
  localStoragePage = new LocalStoragePage();

  appointmentOverviewPreparationUtil.appointmentOverviewPage = appointmentPage;
  appointmentOverviewPreparationUtil.localStoragePage = localStoragePage;

  browser.waitForAngularEnabled(false);
});

const appointmentLink = "valid";

describe('appointment overview - data', () => {
  describe(' * default', () => {
    const appointment = AppointmentDataProvider.getAppointmentByLink(appointmentLink);

    beforeAll(async () => {
      await appointmentOverviewPreparationUtil.loadPage(appointmentLink);
    });

    it(' ~ should show location', () => {
      const location = appointmentDataPage.getAppointmentDataLocation();
      expect(location).toBe(appointment.location);
    });

    it(' ~ should show description', () => {
      const description = appointmentDataPage.getAppointmentDataDescription();
      expect(description).toBe(appointment.description);
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

    it(' ~ should show creator name', () => {
      const creatorName = appointmentDataPage.getAppointmentDataCreatorName();
      expect(creatorName).toBe(appointment.creator.name);
    });

    it(' ~ should show creator username', () => {
      const creatorUsername = appointmentDataPage.getAppointmentDataCreatorUsername();
      expect(creatorUsername).toBe('@' + appointment.creator.username);
    });
  });

  describe(' * appointment without deadline', () => {
    const appointmentLink = "valid-no-deadline";

    beforeAll(async () => {
      await appointmentOverviewPreparationUtil.loadPage(appointmentLink);
    });

    it(' ~ deadline should not be present', () => {
      const isDeadlinePresent = appointmentDataPage.isAppointmentDataDeadlinePresent();
      expect(isDeadlinePresent).toBeFalsy('Deadline should not be present but is');
    });
  });

  describe(' * appointment with file', () => {
    const appointmentLink = "valid-file";

    beforeAll(async () => {
      await appointmentOverviewPreparationUtil.loadPage(appointmentLink);
    });

    it(' ~ should show one file (block)', () => {
      const getFilesElements = appointmentDataPage.getFileBlocks();
      const numberOfFiles = getFilesElements.count();

      expect(numberOfFiles).toBe(1);
    });

    it(' ~ should have correct filename', () => {
      const filesElements = appointmentDataPage.getFileBlocks();
      const fileElement = filesElements.first().element(by.css('a'));
      const fileName = fileElement.getText();

      expect(fileName).toBe('testfile-1.pdf');
    });

    describe(' * click', () => {
      it(' ~ should correctly redirect', () => {
        appointmentDataPage.clickFirstFile();

        const url = 'https://localhost:3000/files/2e57b350-78fa-472b-b42f-b1de84dac157';
        const pageRedirected = appointmentPage.pageRedirectedToUrl(url);

        expect(pageRedirected).toBeTruthy('Not redirected to file download');
      });
    });
  });
});
