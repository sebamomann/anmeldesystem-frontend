/// <reference types="cypress" />

import "cypress-localstorage-commands";

const link = "valid-enrollments-edit";
const fixture_user_location = "user/gjm-test-protractor-general-enrollmentcreator-user-1.json";

const enrollment = {
  id: "7af393c1-bdc5-4245-86f0-9fec44133775",
  name: "User Enrollment One",
  comment: "Comment One"
};

describe('Enrollment - Edit - Unknown User - Logged in', () => {
  describe(' * ', () => {
    before(() => {
      const fixture_user_location = "user/gjm-test-protractor-general-enrollmentcreator-user-1.json";
      cy.fixture(fixture_user_location)
        .then(user => {
          cy.keycloack_login_via_api(user.username, user.password);
          cy.saveLocalStorage();

          const fixture = 'appointment/' + link + '.json';
          cy.enrollment_edit_intercept_appointment(200, link, fixture);
          cy.navigate_to_enrollment_edit(link, enrollment.id);
          cy.wait("@enrollment_edit_intercept_appointment");
        });

      cy.saveLocalStorage();
    });

    beforeEach(() => {
      cy.restoreLocalStorage();
    });

    it(' ~ should have title "Bearbeiten"', () => {
      cy.enrollment_create_title()
        .should("have.text", "Bearbeiten");
    });
  });

  describe(' * main form', () => {
    before(() => {
      cy.fixture(fixture_user_location)
        .then(user => {
          cy.keycloack_login_via_api(user.username, user.password);
          cy.saveLocalStorage();

          const fixture = 'appointment/' + link + '.json';
          cy.enrollment_edit_intercept_appointment(200, link, fixture);
          cy.navigate_to_enrollment_edit(link, enrollment.id);
          cy.wait("@enrollment_edit_intercept_appointment");
        });

      cy.saveLocalStorage();
    });

    beforeEach(() => {
      cy.restoreLocalStorage();
    });

    it(' ~ should exist and be visible', () => {
      cy.enrollment_create_main_form()
        .should("exist")
        .should("be.visible");
    });

    describe(' * should have correct attributes', () => {
      it(' ~ disabled name field', () => {
        cy.enrollment_create_main_form_name_field()
          .should("be.disabled");
      });
    });

    describe(' * should have correct values', () => {
      it(' ~ name', () => {
        cy.enrollment_create_main_form_name_field()
          .should("have.value", enrollment.name);
      });

      it(' ~ comment', () => {
        cy.enrollment_create_main_form_comment_field()
          .should("have.value", enrollment.comment);
      });
    });
  });

  // NAME UPDATE NOT POSSIBLE

  describe(" * edit comment", () => {
    const commentToSet = `${enrollment.comment} - Updated`;

    before(() => {
      cy.fixture(fixture_user_location)
        .then(user => {
          cy.keycloack_login_via_api(user.username, user.password);
          cy.saveLocalStorage();

          const fixture = 'appointment/' + link + '.json';
          cy.enrollment_edit_intercept_appointment(200, link, fixture);
          cy.navigate_to_enrollment_edit(link, enrollment.id);
          cy.wait("@enrollment_edit_intercept_appointment");
          cy.enrollment_create_fill_forms({ comment: commentToSet });
        });

      cy.saveLocalStorage();
    });

    beforeEach(() => {
      cy.restoreLocalStorage();
    });

    it(' ~ should redirect to appointment overview page', () => {
      const fixture = 'appointment/' + link + '.json';
      cy.enrollment_edit_intercept_appointment(200, link, fixture);
      const enrollment_edit_fixture = 'enrollment/edit/user-enrollment-one-updated.json';
      cy.enrollment_edit_intercept_submit(204, enrollment_edit_fixture, enrollment.id);
      cy.wait("@enrollment_edit_intercept_submit");

      const url = '/enroll?a=' + link;
      cy.url()
        .should('include', url);
    });

    it(' ~ should show correct snackbar', () => {
      cy.contains("Erfolgreich bearbeitet");
    });
  });

  describe(" * edit comment - invalid token", () => {
    const commentToSet = `${enrollment.comment} - Updated`;

    before(() => {
      cy.fixture(fixture_user_location)
        .then(user => {
          cy.keycloack_login_via_api(user.username, user.password);
          cy.saveLocalStorage();

          const fixture = 'appointment/' + link + '.json';
          cy.enrollment_edit_intercept_appointment(200, link, fixture);
          cy.navigate_to_enrollment_edit(link, enrollment.id);
          cy.wait("@enrollment_edit_intercept_appointment");
          cy.enrollment_create_fill_forms({ comment: commentToSet });
        });
    });

    beforeEach(() => {
      cy.restoreLocalStorage();
    });

    it(' ~ should redirect to appointment overview page', () => {
      const fixture = 'appointment/' + link + '.json';
      cy.enrollment_edit_intercept_appointment(200, link, fixture);
      const enrollment_edit_fixture = 'enrollment/edit/unknown-enrollment-one-updated-invalid-permissions.json';
      cy.enrollment_edit_intercept_submit(403, enrollment_edit_fixture, enrollment.id);
      cy.wait("@enrollment_edit_intercept_submit");

      const url = '/enroll?a=' + link;
      cy.url()
        .should('include', url);
    });

    it(' ~ should show correct snackbar', () => {
      cy.contains("Sorry, du hast keine Berechtigung diesen Teilnehmer zu bearbeiten.");
    });
  });

  // COMMENT CHECK WOULD BE USESLESS I THINK ...
});
