import {browser} from 'protractor';
import {AppointmentOverviewPage} from './po/appointment.overview.po';
import {EnrollmentDataProvider} from './providers/enrollment.data-provider';
import {LocalStoragePage} from '../../general/localStorage.po';
import {AppointmentOverviewEnrollmentListPage} from './po/appointment.overview.enrollment-list.po';

let appointmentLink;
let page: AppointmentOverviewPage;
let enrollmentListPage: AppointmentOverviewEnrollmentListPage;
let localStoragePage: LocalStoragePage;

beforeAll(async () => {
  await browser.get('/'); // needed to be able to clear localStorage

  page = new AppointmentOverviewPage();
  enrollmentListPage = new AppointmentOverviewEnrollmentListPage();
  localStoragePage = new LocalStoragePage();

  browser.waitForAngularEnabled(false);
});

describe('enrollment list', () => {
  describe('empty list', () => {
    beforeAll(async () => {
      appointmentLink = 'empty';

      await localStoragePage.clear();
      await localStoragePage.preventEnrollmentHintForLink(appointmentLink);

      await page.navigateToAppointment(appointmentLink);
    });

    it('should not show any enrollments', () => {
      const enrollments = enrollmentListPage.getEnrollmentBlocks();
      const nrOfEnrollments = enrollments.count();

      expect(nrOfEnrollments).toBe(0);
    });

    it('should show empty enrollment hint', () => {
      const isEmptyEnrollmentListHintPresent = enrollmentListPage.isEmptyEnrollmentListHintPresent();

      expect(isEmptyEnrollmentListHintPresent).toBeTruthy();
    });
  });

  // TODO
  // additions
  // driver
  // hidden
  describe('correctly display enrollments', () => {
    beforeAll(async () => {
      appointmentLink = 'valid';

      await localStoragePage.clear();
      await localStoragePage.preventEnrollmentHintForLink(appointmentLink);

      await page.navigateToAppointment(appointmentLink);
    });

    describe('correct number of Enrollments', () => {
      it('should show 5 in total enrollments', () => {
        const enrollments = enrollmentListPage.getEnrollmentBlocks();
        const nrOfEnrollments = enrollments.count();

        expect(nrOfEnrollments).toBe(5);
      });

      it('should show 3 creator enrollments', () => {
        const enrollments = enrollmentListPage.getEnrollmentBlocksCreatedByUser();
        const nrOfEnrollments = enrollments.count();

        expect(nrOfEnrollments).toBe(3);
      });

      it('should show 2 unknown enrollments', () => {
        const enrollments = enrollmentListPage.getEnrollmentBlocksCreatedByUnknown();
        const nrOfEnrollments = enrollments.count();

        expect(nrOfEnrollments).toBe(2);
      });
    });

    describe('user enrollment', () => {
      const enrollment = EnrollmentDataProvider.getEnrollment('0614b2e5-d283-41fe-bc54-ce2527bfd308');

      it('should have correct name', () => {
        const actual_name = enrollmentListPage.getEnrollmentNameById(enrollment.id);
        expect(actual_name).toEqual(`User Enrollment One`);
      });

      it('should have correct username', () => {
        const actual_username = enrollmentListPage.getEnrollmentUsernameById(enrollment.id);
        expect(actual_username).toEqual(`@userenrollmentone`);
      });
    });

    describe('unknown enrollment', () => {
      const enrollment = EnrollmentDataProvider.getEnrollment('c7a18228-9dc5-46f0-9366-def497121ddc');

      describe('comment', () => {
        it('should have correct name', () => {
          const name = enrollmentListPage.getEnrollmentNameById(enrollment.id);
          expect(name).toEqual(enrollment.name);
        });

        it('should have no username', () => {
          const usernameIsPresent = enrollmentListPage.isEnrollmentUsernamePresent(enrollment.id);
          expect(usernameIsPresent).toBeFalsy();
        });

        it('should have correct comment with separator', () => {
          const commentSeparatorPresent = enrollmentListPage.isEnrollmentCommentSeparatorPresent(enrollment.id);
          const comment = enrollmentListPage.getEnrollmentComment(enrollment.id);

          expect(comment).toEqual(enrollment.comment);
          expect(commentSeparatorPresent).toBeTruthy('Comment separator should be present but isn\'t');
        });
      });

      describe('no comment', () => {
        const enrollmentId = 'dd5837e5-1f1d-4a2d-85e1-7dcb77e8ab2a';

        it('should have no comment', () => {
          const enrollmentIsPresent = enrollmentListPage.isEnrollmentPresent(enrollmentId);
          const enrollmentCommentPresent = enrollmentListPage.isEnrollmentCommentPresent(enrollmentId);
          const commentSeparatorPresent = enrollmentListPage.isEnrollmentCommentSeparatorPresent(enrollmentId);

          expect(enrollmentIsPresent).toBeTruthy('Enrollment should be present but isn\'t');
          expect(enrollmentCommentPresent).toBeFalsy('Enrollment comment should not be present but is');
          expect(commentSeparatorPresent).toBeFalsy('Enrollment comment separator should not be present but is');
        });
      });
    });

    describe('click enrollment', () => {
      const enrollmentId = '0614b2e5-d283-41fe-bc54-ce2527bfd308';

      beforeAll(() => {
        enrollmentListPage.toggleEnrollmentPanel(enrollmentId); // expand
      });

      it('should expand panel', () => {
        const isEnrollmentPanelExpanded = enrollmentListPage.isEnrollmentPanelExpanded(enrollmentId);
        expect(isEnrollmentPanelExpanded).toBeTruthy('Panel should be expanded but isn\'t');
      });

      describe('click enrollment again', () => {
        beforeAll(async () => {
          enrollmentListPage.toggleEnrollmentPanel(enrollmentId); // collapse
        });

        it('should collapse panel', () => {
          const isEnrollmentPanelCollapsed = enrollmentListPage.isEnrollmentPanelCollapsed(enrollmentId);
          expect(isEnrollmentPanelCollapsed).toBeTruthy('Panel should be collapsed but isn\'t');
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
