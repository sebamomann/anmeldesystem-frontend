/// <reference types="cypress" />

import "cypress-localstorage-commands";

const link = "valid-enrollments-create-additions";

const enrollmentInput = {
  name: 'Unknown Enrollment - Additions',
  comment: 'Unknown Enrollment Comment'
};

const additions = [true, false, true, false];

describe('Enrollment - Create - Additions', () => {
  describe(' * additions form', () => {
    before(() => {
      const fixture = 'appointment/' + link + '.json';
      cy.enrollment_create_intercept_appointment(200, link, fixture);
      cy.navigate_to_enrollment_creation(link);
      cy.enrollment_create_fill_forms(enrollmentInput);
    });

    it(' ~ should be present and be visible', () => {
      cy.enrollment_create_additions_form()
        .should("exist")
        .should("be.visible");
    });

    it(' ~ username should not exist', () => {
      cy.enrollment_create_check_form_username()
        .should("not.exist");
    });

    it(' ~ should have correct values', () => {
      cy.enrollment_create_additions_form_check_addition_values(additions);
    });

    it(' ~ should have correct attributes', () => {
      cy.enrollment_create_additions_form_check_additions([false, false, false, false]);
    });
  });

  describe(' * go back to check card', () => {
    before(() => {
      const fixture = 'appointment/' + link + '.json';
      cy.enrollment_create_intercept_appointment(200, link, fixture);
      cy.navigate_to_enrollment_creation(link);
      cy.enrollment_create_fill_forms({ ...enrollmentInput, additions, check: true });
      cy.enrollment_create_login_and_mail_form_back()
        .click();
    });

    it(' ~ should be present and be visible', () => {
      cy.enrollment_create_check_form()
        .should("exist")
        .should("be.visible");
    });

    it(' ~ should have correct attributes', () => {
      cy.enrollment_create_check_form_check_additions(0, additions[0]);
    });
  });

  describe(' * go back to additions form', () => {
    before(() => {
      const fixture = 'appointment/' + link + '.json';
      cy.enrollment_create_intercept_appointment(200, link, fixture);
      cy.navigate_to_enrollment_creation(link);
      cy.enrollment_create_fill_forms({ ...enrollmentInput, additions, check: true });
      cy.enrollment_create_login_and_mail_form_back()
        .click();
      cy.enrollment_create_check_form_back()
        .click();
    });

    it(' ~ should exist and be visible', () => {
      cy.enrollment_create_additions_form()
        .should("exist")
        .should("be.visible");
    });

    it(' ~ should still contain inputted values', () => {
      cy.enrollment_create_additions_form_check_additions(additions);
    });
  });

  // NORMAL COMPLETE NOT NEEDED
  // TODO CHECK API BODY

  describe(' * complete - already enrolled', () => {
    before(() => {
      const enrollment_create_fixture = 'enrollment/create/foreign-enrollment-already-enrolled.json';
      cy.enrollment_create_intercept_submit(409, enrollment_create_fixture);
      const fixture = 'appointment/' + link + '.json';
      cy.enrollment_create_intercept_appointment(200, link, fixture);
      cy.navigate_to_enrollment_creation(link);
      cy.enrollment_create_fill_forms({ ...enrollmentInput, additions, check: true, mail: "mail@example.com" });
      cy.wait("@enrollment_create_intercept_submit");
      cy.enrollment_create_fill_forms(enrollmentInput);
    });

    it(' ~ should exist and be visible', () => {
      cy.enrollment_create_additions_form()
        .should("exist")
        .should("be.visible");
    });

    it(' ~ should still contain inputted values', () => {
      cy.enrollment_create_additions_form_check_additions(additions);
    });
  });

  // TODO CHECK API CALL
});
