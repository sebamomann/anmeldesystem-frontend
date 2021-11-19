import { AppointmentOverviewEnrollmentListPage } from './po/appointment.overview.enrollment-list.po';
import { AppointmentOverviewPreparationUtil } from './po/appointment.overview.preparation.util';
import { browser } from 'protractor';
import { AppointmentOverviewPage } from './po/appointment.overview.po';
import { LocalStoragePage } from '../../general/localStorage.po';

const appointmentOverviewPreparationUtil: AppointmentOverviewPreparationUtil = new AppointmentOverviewPreparationUtil();

let appointmentPage: AppointmentOverviewPage;
let localStoragePage: LocalStoragePage;
let appointmentOverviewEnrollmentListPage: AppointmentOverviewEnrollmentListPage;

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
  localStoragePage = new LocalStoragePage();
  appointmentOverviewEnrollmentListPage = new AppointmentOverviewEnrollmentListPage();

  appointmentOverviewPreparationUtil.appointmentOverviewPage = appointmentPage;
  appointmentOverviewPreparationUtil.localStoragePage = localStoragePage;

  browser.waitForAngularEnabled(false);
});

const appointmentLink = 'valid-enrollment-list-hidden';

describe('enrollment list - hidden', () => {
  describe(' * with no returned enrollments', () => {
    beforeAll(async () => {
      await appointmentOverviewPreparationUtil.loadPage(appointmentLink);
    });

    it(' ~ should not show any enrollments', () => {
      const enrollments = appointmentOverviewEnrollmentListPage.getEnrollmentBlocks();
      const nrOfEnrollments = enrollments.count();
      expect(nrOfEnrollments).toBe(0);
    });

    it(' ~ should show hidden enrollment hint', () => {
      const isEnrollmentHiddenHintPresent = appointmentOverviewEnrollmentListPage.isHiddenEnrollmentHintPresent();
      expect(isEnrollmentHiddenHintPresent).toBeTruthy();
    });
  });

  describe(' * with no returned enrollments', () => {
    const appointmentLink = 'valid-enrollment-list-hidden-enrollments';

    beforeAll(async () => {
      await appointmentOverviewPreparationUtil.loadPage(appointmentLink);
    });

    it(' ~ should not show any enrollments', () => {
      const enrollments = appointmentOverviewEnrollmentListPage.getEnrollmentBlocks();
      const nrOfEnrollments = enrollments.count();
      expect(nrOfEnrollments).toBe(5);
    });

    it(' ~ should show hidden enrollment hint', () => {
      const isEnrollmentHiddenHintPresent = appointmentOverviewEnrollmentListPage.isHiddenEnrollmentHintPresent();
      expect(isEnrollmentHiddenHintPresent).toBeTruthy();
    });
  });
});
