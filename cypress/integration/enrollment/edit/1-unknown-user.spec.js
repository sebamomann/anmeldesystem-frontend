/// <reference types="cypress" />

import "cypress-localstorage-commands";

const link = "valid-enrollments-edit";

const enrollment = {
  id: "1ff2e7e7-9048-46b2-b02b-fe95b874ef6d",
  name: "Unknown Enrollment One",
  comment: "Comment One"
};

describe('Enrollment - Edit - Unknown User', () => {
  describe(' * ', () => {
    before(() => {
      const fixture = 'appointment/' + link + '.json';
      cy.enrollment_create_intercept_appointment(200, link, fixture);
      cy.navigate_to_enrollment_edit(link, enrollment.id);
    });

    it(' ~ should have title "Bearbeiten"', () => {
      cy.enrollment_create_title()
        .should("have.text", "Bearbeiten");
    });
  });

  describe(' * main form', () => {
    before(() => {
      const fixture = 'appointment/' + link + '.json';
      cy.enrollment_create_intercept_appointment(200, link, fixture);
      cy.navigate_to_enrollment_edit(link, enrollment.id);
    });

    it(' ~ should exist and be visible', () => {
      cy.enrollment_create_main_form()
        .should("exist")
        .should("be.visible");
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

    describe('* submit without name', () => {
      before(() => {
        cy.enrollment_create_main_form_cause_empty_name();
        cy.enrollment_create_main_form_submit()
          .click();
      });

      it(' ~ should show correct error message', () => {
        cy.enrollment_create_main_form_name_field_error()
          .should('have.text', "Bitte gebe einen Namen an");
      });
    });
  });

  describe(" * edit name", () => {
    const nameToSet = `${enrollment.name} - Updated`;

    before(() => {
      const fixture = 'appointment/' + link + '.json';
      cy.enrollment_create_intercept_appointment(200, link, fixture);
      cy.navigate_to_enrollment_edit(link, enrollment.id);
      cy.enrollment_create_fill_forms({ name: nameToSet });
    });

    it(' ~ should redirect to appointment overview page', () => {
      const fixture = 'appointment/' + link + '.json';
      cy.enrollment_edit_intercept_appointment(200, link, fixture);
      const enrollment_edit_fixture = 'enrollment/edit/unknown-enrollment-one-updated.json';
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

  describe(" * edit name - invalid token", () => {
    const nameToSet = `${enrollment.name} - Updated`;

    before(() => {
      const fixture = 'appointment/' + link + '.json';
      cy.enrollment_create_intercept_appointment(200, link, fixture);
      cy.navigate_to_enrollment_edit(link, enrollment.id);
      cy.enrollment_create_fill_forms({ name: nameToSet });
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
