/// <reference types="cypress" />

describe('Appointment - Overview - Enrollment List', () => {
  describe(' * appointment with no enrollments', () => {
    const link = "valid-enrollment-list-empty";

    before(() => {
      const fixture = 'appointment/' + link + '.json';
      cy.appointment_overview_intercept_appointment(200, link, fixture);
      cy.navigate_to_appointment(link);
    });

    it(' ~ should not show any enrollments', () => {
      cy.appointment_overview_enrollment_list_enrollments()
        .should('have.length', 0);
    });

    it(' ~ should show empty enrollment hint', () => {
      cy.appointment_overview_enrollment_list_empty_list_hint()
        .should('exist');
    });
  });

  // TODO
  // CHECK DRIVER ICONS

  describe(' * appointment with enrollments', () => {
    const link = "valid-enrollment-list";

    before(() => {
      const fixture = 'appointment/' + link + '.json';
      cy.appointment_overview_intercept_appointment(200, link, fixture);
      cy.navigate_to_appointment(link);
    });

    describe(' * count', () => {
      it(' ~ should show 3 enrollments', () => {
        cy.appointment_overview_enrollment_list_enrollments()
          .should('have.length', 3);
      });

      it(' ~ should show 1 creator enrollment', () => {
        cy.appointment_overview_enrollment_list_enrollments_creator()
          .should('have.length', 1);
      });

      it(' ~ should show 2 unknown enrollments', () => {
        cy.appointment_overview_enrollment_list_enrollments_unknown()
          .should('have.length', 2);
      });
    });

    describe(' * user enrollment', () => {
      const enrollment_id = "c17701cb-3efd-4824-b516-6763f9c60795";
      let fixture_enrollment = undefined;

      before(() => {
        const fixture_enrollment_location = `enrollment/${enrollment_id}.json`;
        cy.fixture(fixture_enrollment_location).then((enrollment) => {
          fixture_enrollment = enrollment;
        });
      });

      it(' ~ should have correct creator values', () => {
        cy.appointment_overview_enrollment_list_enrollment_name(fixture_enrollment.id)
          .should('have.text', fixture_enrollment.creator.name);

        cy.appointment_overview_enrollment_list_enrollment_username(fixture_enrollment.id)
          .should('have.text', "@" + fixture_enrollment.creator.username);
      });
    });

    describe(' * unknown enrollment', () => {
      describe(' * general', () => {
        const enrollment_id = "93d7dffd-2e35-4419-880b-9a36c8ca8306";
        let fixture_enrollment = undefined;

        before(() => {
          const fixture_enrollment_location = `enrollment/${enrollment_id}.json`;
          cy.fixture(fixture_enrollment_location).then((enrollment) => {
            fixture_enrollment = enrollment;
          });
        });

        it(' ~ should have correct name', () => {
          cy.appointment_overview_enrollment_list_enrollment_name(fixture_enrollment.id)
            .should('have.text', fixture_enrollment.name);
        });

        it(' ~ should have no username', () => {
          cy.appointment_overview_enrollment_list_enrollment_username(fixture_enrollment.id)
            .should('not.exist');
        });
      });

      describe(' * with comment', () => {
        const enrollment_id = "3cb062fa-9fac-4836-8160-d0af1603dcaa";
        let fixture_enrollment = undefined;

        before(() => {
          const fixture_enrollment_location = `enrollment/${enrollment_id}.json`;
          cy.fixture(fixture_enrollment_location).then((enrollment) => {
            fixture_enrollment = enrollment;
          });
        });

        it(' ~ should show comment seperator', () => {
          cy.appointment_overview_enrollment_list_enrollment_comment_separator(fixture_enrollment.id)
            .should('exist');
        });

        it(' ~ should have correct value', () => {
          cy.appointment_overview_enrollment_list_enrollment_comment(fixture_enrollment.id)
            .should('have.text', fixture_enrollment.comment);
        });
      });

      describe(' * without comment', () => {
        const enrollment_id = "93d7dffd-2e35-4419-880b-9a36c8ca8306";
        let fixture_enrollment = undefined;

        before(() => {
          const fixture_enrollment_location = `enrollment/${enrollment_id}.json`;
          cy.fixture(fixture_enrollment_location).then((enrollment) => {
            fixture_enrollment = enrollment;
          });
        });

        it(' ~ enrollment should exist', () => {
          cy.appointment_overview_enrollment_list_enrollment(fixture_enrollment.id)
            .should('exist');
        });

        it(' ~ should not show comment', () => {
          cy.appointment_overview_enrollment_list_enrollment_comment(fixture_enrollment.id)
            .should('not.exist');
        });

        it(' ~ should not show comment seperator', () => {
          cy.appointment_overview_enrollment_list_enrollment_comment_separator(fixture_enrollment.id)
            .should('not.exist');
        });
      });
    });
  });
});
