/// <reference types="cypress" />
// TODO
// REMOVE ANPINNEN DIALOG
describe('Appointment - Overview - Enrollment List - Permissions', () => {
  const link = "valid-enrollment-list-permissions";
  describe(' * as logged in user', () => {
    beforeEach(() => {
      const fixture_user_location = "user/gjm-test-protractor-appointment-creator-user.json";
      cy.fixture(fixture_user_location)
        .then(user => {
          cy.keycloack_login_via_api(user.username, user.password);
        });
    });

    describe(' * edit enrollment', () => {
      beforeEach(() => {
        const fixture = 'appointment/' + link + '.json';
        cy.appointment_overview_intercept_appointment(200, link, fixture);
        cy.navigate_to_appointment(link);
      });

      describe(' * valid permissions', () => {
        const enrollment_id = "fa33ed23-e8f5-46f4-a734-dbff28372810";
        beforeEach(() => {
          cy.intercept(`/enrollments/${enrollment_id}/check-permission`, {
            statusCode: 200
          });
          cy.appointment_overview_enrollment_list_enrollment(enrollment_id)
            .click();
          cy.appointment_overview_enrollment_list_enrollment_additions_edit(enrollment_id)
            .click();
        });

        it(' ~ should redirect to edit page', () => {
          const url = '/enrollment/edit?a=' + link + '&e=' + enrollment_id;
          cy.url()
            .should('include', url);
        });
      });

      describe(' * invalid permissions', () => {
        const enrollment_id = "775d5788-ebc9-4ab5-ada3-a30b9b02ac4a";
        beforeEach(() => {
          cy.intercept(`/enrollments/${enrollment_id}/check-permission`, {
            statusCode: 403
          });
          cy.appointment_overview_enrollment_list_enrollment(enrollment_id)
            .click();
          cy.appointment_overview_enrollment_list_enrollment_additions_edit(enrollment_id)
            .click();
        });

        it(' ~ should show missing permissions snackbar', () => {
          cy.contains("Fehlende Berechtigungen");
        });
      });
    });

    describe(' * delete enrollment', () => {
      describe(' * valid permissions', () => {
        const enrollment_id = "fa33ed23-e8f5-46f4-a734-dbff28372810";

        before(() => {
          cy.intercept(`/enrollments/${enrollment_id}/check-permission`, {
            statusCode: 200
          });
          cy.appointment_overview_enrollment_list_enrollment(enrollment_id)
            .click();
          cy.appointment_overview_enrollment_list_enrollment_additions_delete(enrollment_id)
            .click();
        });

        it(' ~ should prompt delete dialog', () => {
          cy.appointment_overview_enrollment_list_enrollment_deletion_confirmation_dialog()
            .should("exist");
        });

        describe(' * cancel dialog', () => {
          beforeEach(() => {
            cy.appointment_overview_enrollment_list_enrollment_deletion_confirmation_dialog_cancel()
              .click();
          });
          it(' ~ should hide dialog', () => {
            cy.appointment_overview_enrollment_list_enrollment_deletion_confirmation_dialog()
              .should("not.exist");
          });
        });
      });

      describe(' * invalid permissions', () => {
        const enrollment_id = "775d5788-ebc9-4ab5-ada3-a30b9b02ac4a";
        beforeEach(() => {
          cy.intercept(`/enrollments/${enrollment_id}/check-permission`, {
            statusCode: 403
          });
          cy.appointment_overview_enrollment_list_enrollment(enrollment_id)
            .click();
          cy.appointment_overview_enrollment_list_enrollment_additions_delete(enrollment_id)
            .click();
        });

        it(' ~ should show missing permissions snackbar', () => {
          cy.contains("Fehlende Berechtigungen");
        });
      });
    });
  });

  describe(' * as unknown user', () => {
    describe(' * edit enrollment', () => {
      beforeEach(() => {
        const fixture = 'appointment/' + link + '.json';
        cy.appointment_overview_intercept_appointment(200, link, fixture);
        cy.navigate_to_appointment(link);
      });

      describe(' * valid permissions', () => {
        const enrollment_id = "fa33ed23-e8f5-46f4-a734-dbff28372810";
        beforeEach(() => {
          cy.intercept(`/enrollments/${enrollment_id}/check-permission`, {
            statusCode: 200
          });
          cy.appointment_overview_enrollment_list_enrollment(enrollment_id)
            .click();
          cy.appointment_overview_enrollment_list_enrollment_additions_edit(enrollment_id)
            .click();
        });

        it(' ~ should redirect to edit page', () => {
          const url = '/enrollment/edit?a=' + link + '&e=' + enrollment_id;
          cy.url()
            .should('include', url);
        });
      });

      describe(' * invalid permissions', () => {
        const enrollment_id = "775d5788-ebc9-4ab5-ada3-a30b9b02ac4a";
        beforeEach(() => {
          cy.intercept(`/enrollments/${enrollment_id}/check-permission`, {
            statusCode: 403
          });
          cy.appointment_overview_enrollment_list_enrollment(enrollment_id)
            .click();
          cy.appointment_overview_enrollment_list_enrollment_additions_edit(enrollment_id)
            .click();
        });

        it(' ~ should show missing permissions dialog', () => {
          cy.appointment_overview_enrollment_list_enrollment_missing_permissions_dialog()
            .should("exist");
        });
      });
    });

    describe(' * delete enrollment', () => {
      before(() => {
        const fixture = 'appointment/' + link + '.json';
        cy.appointment_overview_intercept_appointment(200, link, fixture);
        cy.navigate_to_appointment(link);
      });

      describe(' * valid permissions', () => {
        const enrollment_id = "fa33ed23-e8f5-46f4-a734-dbff28372810";

        before(() => {
          cy.intercept(`/enrollments/${enrollment_id}/check-permission`, {
            statusCode: 200
          });
          cy.appointment_overview_enrollment_list_enrollment(enrollment_id)
            .click();
          cy.appointment_overview_enrollment_list_enrollment_additions_delete(enrollment_id)
            .click();
        });

        it(' ~ should prompt delete dialog', () => {
          cy.appointment_overview_enrollment_list_enrollment_deletion_confirmation_dialog()
            .should("exist");
        });

        describe(' * cancel dialog', () => {
          beforeEach(() => {
            cy.appointment_overview_enrollment_list_enrollment_deletion_confirmation_dialog_cancel()
              .click();
          });
          it(' ~ should hide dialog', () => {
            cy.appointment_overview_enrollment_list_enrollment_deletion_confirmation_dialog()
              .should("not.exist");
          });
        });
      });

      describe(' * invalid permissions', () => {
        const enrollment_id = "775d5788-ebc9-4ab5-ada3-a30b9b02ac4a";
        beforeEach(() => {
          cy.intercept(`/enrollments/${enrollment_id}/check-permission`, {
            statusCode: 403
          });
          cy.appointment_overview_enrollment_list_enrollment(enrollment_id)
            .click();
          cy.appointment_overview_enrollment_list_enrollment_additions_delete(enrollment_id)
            .click();
        });

        it(' ~ should show missing permissions dialog', () => {
          cy.appointment_overview_enrollment_list_enrollment_missing_permissions_dialog()
            .should("exist");
        });
      });
    });
  });
});
