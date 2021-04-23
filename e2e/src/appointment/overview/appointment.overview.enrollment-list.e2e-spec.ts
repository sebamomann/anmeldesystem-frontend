import {browser} from 'protractor';
import {AppointmentOverviewPage} from './appointment.overview.po';
import {AppointmentDataProvider} from './appointment.data-provider';
import {EnrollmentDataProvider} from './enrollment.data-provider';
import {UsersDataProvider} from './users.data-provider';
import {LocalStoragePage} from '../../general/localStorage.po';

// const crypto = require('crypto');
//
// const salt = 'mysalt';

let appointmentLink;
let page: AppointmentOverviewPage;
let localStoragePage: LocalStoragePage;

beforeAll(async () => {
  await browser.get('/'); // needed to be able to clear localStorage

  page = new AppointmentOverviewPage();
  localStoragePage = new LocalStoragePage();

  browser.waitForAngularEnabled(false);
});

describe('enrollment list', () => {

  /**
   * TODO empty list
   */

  beforeAll(async () => {
    appointmentLink = AppointmentDataProvider.getAppointment('test-protractor-appointment-title').link;

    await localStoragePage.clear();
    await localStoragePage.preventEnrollmentHintForLink(appointmentLink);

    await page.navigateToAppointment(appointmentLink);
  });

  describe('correctly display enrollments', () => {
    describe('correct number of Enrollments', () => {
      it('should show 8 in total enrollments', () => {
        const enrollments = page.getEnrollmentBlocks();
        const nrOfEnrollments = enrollments.count();

        expect(nrOfEnrollments).toBe(8);
      });

      it('should show 3 creator enrollments', () => {
        const enrollments = page.getEnrollmentBlocksCreatedByUser();
        const nrOfEnrollments = enrollments.count();

        expect(nrOfEnrollments).toBe(3);
      });

      it('should show 5 unknown enrollments', () => {
        const enrollments = page.getEnrollmentBlocksCreatedByUnknown();
        const nrOfEnrollments = enrollments.count();

        expect(nrOfEnrollments).toBe(5);
      });
    });

    describe('user enrollment', () => {
      const enrollment = EnrollmentDataProvider.getEnrollment('0614b2e5-d283-41fe-bc54-ce2527bfd308');

      it('should have correct name', () => {
        const actual_name = page.getEnrollmentNameById(enrollment.id);

        const user = UsersDataProvider.getUser(enrollment.creatorId);

        expect(actual_name).toEqual(`${user.firstName} ${user.lastName}`);
      });

      it('should have correct username', () => {
        const actual_username = page.getEnrollmentUsernameById(enrollment.id);

        const user = UsersDataProvider.getUser(enrollment.creatorId);

        expect(actual_username).toEqual(`@${user.username}`);
      });
    });

    describe('unknown enrollment', () => {
      const enrollment = EnrollmentDataProvider.getEnrollment('c36b8c96-db97-4869-8bd6-35f0acbd96f1');

      describe('comment', () => {
        it('should have correct name', () => {
          const name = page.getEnrollmentNameById(enrollment.id);

          expect(name).toEqual(enrollment.name);
        });

        it('should have no username', () => {
          const usernameIsPresent = page.isEnrollmentUsernamePresent(enrollment.id);

          expect(usernameIsPresent).toBeFalsy();
        });

        it('should have correct comment with separator', () => {
          const commentSeparatorPresent = page.isEnrollmentCommentSeparatorPresent(enrollment.id);
          const comment = page.getEnrollmentComment(enrollment.id);

          expect(comment).toEqual(enrollment.comment);
          expect(commentSeparatorPresent).toBeTruthy('Comment separator not present');
        });
      });

      describe('no comment', () => {
        const enrollmentId = 'ead32e43-f6f2-4a23-b6c1-f73b49ccf348';

        it('should have no comment', () => {
          const enrollmentIsPresent = page.isEnrollmentPresent(enrollmentId);
          const enrollmentCommentPresent = page.isEnrollmentCommentPresent(enrollmentId);
          const commentSeparatorPresent = page.isEnrollmentCommentSeparatorPresent(enrollmentId);

          expect(enrollmentIsPresent).toBeTruthy('Enrollment is not present');
          expect(enrollmentCommentPresent).toBeFalsy('Enrollment comment is present');
          expect(commentSeparatorPresent).toBeFalsy('Enrollment comment separator is present');
        });
      });
    });
  });

  describe('click enrollment', () => {
    const enrollmentId = '0614b2e5-d283-41fe-bc54-ce2527bfd308';

    beforeEach(() => {
      page.clickEnrollment(enrollmentId);
    });

    it('should expand panel', () => {
      const isEnrollmentPanelExpanded = page.isEnrollmentPanelExpanded(enrollmentId);
      expect(isEnrollmentPanelExpanded).toBeTruthy('Panel not expanded');
    });

    describe('click enrollment again', () => {
      beforeEach(() => {
        page.clickEnrollment(enrollmentId);
      });

      it('should collapse panel', () => {
        const isEnrollmentPanelCollapsed = page.isEnrollmentPanelCollapsed(enrollmentId);
        expect(isEnrollmentPanelCollapsed).toBeTruthy('Panel not collapsed');
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
})
;
