import { AppointmentOverviewEnrollmentListPage } from './po/appointment.overview.enrollment-list.po';
import { AppointmentOverviewPreparationUtil } from './po/appointment.overview.preparation.util';
import { browser } from 'protractor';
import { AppointmentOverviewPage } from './po/appointment.overview.po';
import { LocalStoragePage } from '../../general/localStorage.po';
import { EnrollmentDataProvider } from './providers/enrollment.data-provider';

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

const appointmentLink = 'valid-enrollment-list';

describe('enrollment list', () => {
  describe(' * empty', () => {
    const appointmentLink = 'valid-enrollment-list-empty';

    beforeAll(async () => {
      await appointmentOverviewPreparationUtil.loadPage(appointmentLink);
    });

    it(' ~ should not show any enrollments', () => {
      const enrollments = appointmentOverviewEnrollmentListPage.getEnrollmentBlocks();
      const nrOfEnrollments = enrollments.count();
      expect(nrOfEnrollments).toBe(0);
    });

    it('should show empty enrollment hint', () => {
      const isEmptyEnrollmentListHintPresent = appointmentOverviewEnrollmentListPage.isEmptyEnrollmentListHintPresent();
      expect(isEmptyEnrollmentListHintPresent).toBeTruthy();
    });
  });

  // TODO
  // additions
  // driver
  // hidden

  describe(' * filled list', () => {
    beforeAll(async () => {
      await appointmentOverviewPreparationUtil.loadPage(appointmentLink);
    });

    describe(' * count', () => {
      it(' ~ should show 3 enrollments in total', () => {
        const enrollments = appointmentOverviewEnrollmentListPage.getEnrollmentBlocks();
        const nrOfEnrollments = enrollments.count();

        expect(nrOfEnrollments).toBe(3);
      });

      it(' ~ should show 1 creator enrollment', () => {
        const enrollments = appointmentOverviewEnrollmentListPage.getEnrollmentBlocksCreatedByUser();
        const nrOfEnrollments = enrollments.count();

        expect(nrOfEnrollments).toBe(1);
      });

      it(' ~ should show 2 unknown enrollments', () => {
        const enrollments = appointmentOverviewEnrollmentListPage.getEnrollmentBlocksCreatedByUnknown();
        const nrOfEnrollments = enrollments.count();

        expect(nrOfEnrollments).toBe(2);
      });
    });
  });

  describe(' * filled list - user enrollment', () => {
    const enrollment = EnrollmentDataProvider.getEnrollment('c17701cb-3efd-4824-b516-6763f9c60795');

    beforeAll(async () => {
      await appointmentOverviewPreparationUtil.loadPage(appointmentLink);
    });

    it(' ~ should have correct name', () => {
      const actual_name = appointmentOverviewEnrollmentListPage.getEnrollmentNameById(enrollment.id);
      expect(actual_name).toEqual(enrollment.creator.name);
    });

    it(' ~ should have correct username', () => {
      const actual_username = appointmentOverviewEnrollmentListPage.getEnrollmentUsernameById(enrollment.id);
      expect(actual_username).toEqual("@" + enrollment.creator.username);
    });
  });

  describe(' * filled list - unknown enrollment', () => {
    const enrollment = EnrollmentDataProvider.getEnrollment('3cb062fa-9fac-4836-8160-d0af1603dcaa');

    beforeAll(async () => {
      await appointmentOverviewPreparationUtil.loadPage(appointmentLink);
    });

    it(' ~ should have correct name', () => {
      const name = appointmentOverviewEnrollmentListPage.getEnrollmentNameById(enrollment.id);
      expect(name).toEqual(enrollment.name);
    });

    it('should have no username', () => {
      const usernameIsPresent = appointmentOverviewEnrollmentListPage.isEnrollmentUsernamePresent(enrollment.id);
      expect(usernameIsPresent).toBeFalsy();
    });

    describe(' * with comment', () => {
      const enrollment = EnrollmentDataProvider.getEnrollment('3cb062fa-9fac-4836-8160-d0af1603dcaa');

      it(' ~ should show comment seperator', () => {
        const commentSeparatorPresent = appointmentOverviewEnrollmentListPage.isEnrollmentCommentSeparatorPresent(enrollment.id);
        expect(commentSeparatorPresent).toBeTruthy('Comment separator should be present but isn\'t');
      });

      it(' * should have correct value', () => {
        const comment = appointmentOverviewEnrollmentListPage.getEnrollmentComment(enrollment.id);
        expect(comment).toEqual(enrollment.comment);
      })
    });

    describe(' * no comment', () => {
      const enrollment = EnrollmentDataProvider.getEnrollment('3cb062fa-9fac-4836-8160-d0af1603dcaa');

      it(' ~ should show comment seperator', () => {
        const enrollmentIsPresent = appointmentOverviewEnrollmentListPage.isEnrollmentPresent(enrollment.id);
        const enrollmentCommentPresent = appointmentOverviewEnrollmentListPage.isEnrollmentCommentPresent(enrollment.id);
        const commentSeparatorPresent = appointmentOverviewEnrollmentListPage.isEnrollmentCommentSeparatorPresent(enrollment.id);

        expect(enrollmentIsPresent).toBeTruthy('Enrollment should be present but isn\'t');
        expect(enrollmentCommentPresent).toBeFalsy('Enrollment comment should not be present but is');
        expect(commentSeparatorPresent).toBeFalsy('Enrollment comment separator should not be present but is');
      });
    });
  });

  describe(' * click enrollment', () => {
    const enrollment = EnrollmentDataProvider.getEnrollment('c17701cb-3efd-4824-b516-6763f9c60795');

    beforeAll(async () => {
      await appointmentOverviewPreparationUtil.loadPage(appointmentLink);
      appointmentOverviewEnrollmentListPage.toggleEnrollmentPanel(enrollment.id); // expand
    });

    it(' ~ should expand panel', () => {
      const isEnrollmentPanelExpanded = appointmentOverviewEnrollmentListPage.isEnrollmentPanelExpanded(enrollment.id);
      expect(isEnrollmentPanelExpanded).toBeTruthy('Panel should be expanded but isn\'t');
    });
  });

  describe('* click enrollment - twice', () => {
    const enrollment = EnrollmentDataProvider.getEnrollment('c17701cb-3efd-4824-b516-6763f9c60795');

    beforeAll(async () => {
      await appointmentOverviewPreparationUtil.loadPage(appointmentLink);
      appointmentOverviewEnrollmentListPage.toggleEnrollmentPanel(enrollment.id); // expand
      appointmentOverviewEnrollmentListPage.toggleEnrollmentPanel(enrollment.id); // collapse
    });


    it('~ should collapse panel', () => {
      const isEnrollmentPanelCollapsed = appointmentOverviewEnrollmentListPage.isEnrollmentPanelCollapsed(enrollment.id);
      expect(isEnrollmentPanelCollapsed).toBeTruthy('Panel should be collapsed but isn\'t');
    });
  });
});
