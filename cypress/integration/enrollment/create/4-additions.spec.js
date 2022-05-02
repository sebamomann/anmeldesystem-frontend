/// <reference types="cypress" />

import "cypress-localstorage-commands";

const link = "valid-enrollments-create-additions";

const enrollmentInput = {
  name: 'Unknown Enrollment - Additions',
  comment: 'Unknown Enrollment Comment'
};

describe('Enrollment - Create - Additions', () => {
  before(() => {
    cy.visit('http://localhost:4200');
  });

  describe(' * additions form', () => {
    before(() => {
      const fixture = 'appointment/' + link + '.json';
      cy.enrollment_create_intercept_appointment(200, link, fixture);
      cy.navigate_to_enrollment_creation(link);
      cy.enrollment_create_fill_main_form(enrollmentInput);
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
      cy.enrollment_create_additions_form_addition_field(0)
        .should("contain", "addition-1");
      cy.enrollment_create_additions_form_addition_field(1)
        .should("contain", "addition-2");
      cy.enrollment_create_additions_form_addition_field(2)
        .should("contain", "addition-3");
      cy.enrollment_create_additions_form_addition_field(3)
        .should("contain", "addition-4");
    });

    it(' ~ should have correct attributes', () => {
      cy.enrollment_create_additions_form_addition_field_checked(0, false)
        .should("not.be.checked");
      cy.enrollment_create_additions_form_addition_field_checked(1, false)
        .should("not.be.checked");
      cy.enrollment_create_additions_form_addition_field_checked(2, false)
        .should("not.be.checked");
      cy.enrollment_create_additions_form_addition_field_checked(3, false)
        .should("not.be.checked");
    });
  });

  describe(' * go back to check card', () => {
    before(() => {
      const fixture = 'appointment/' + link + '.json';
      cy.enrollment_create_intercept_appointment(200, link, fixture);
      cy.navigate_to_enrollment_creation(link);
      cy.enrollment_create_fill_main_form(enrollmentInput);
      cy.enrollment_create_fill_additions_form([true, false, true, false]);
      cy.enrollment_create_check_form_submit()
        .click();
      cy.enrollment_create_login_and_mail_form_back()
        .click();
    });

    it(' ~ should be present and be visible', () => {
      cy.enrollment_create_check_form()
        .should("exist")
        .should("be.visible");
    });

    it(' ~ should have correct attributes', () => {
      cy.enrollment_create_check_form_addition_field_checked(0, true);
      cy.enrollment_create_check_form_addition_field_checked(1, false);
      cy.enrollment_create_check_form_addition_field_checked(2, true);
      cy.enrollment_create_check_form_addition_field_checked(3, false);
    });
  });

  describe(' * go back to additions form', () => {
    before(() => {
      const fixture = 'appointment/' + link + '.json';
      cy.enrollment_create_intercept_appointment(200, link, fixture);
      cy.navigate_to_enrollment_creation(link);
      cy.enrollment_create_fill_main_form(enrollmentInput);
      cy.enrollment_create_fill_additions_form([true, false, true, false]);
      cy.enrollment_create_check_form_submit()
        .click();
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
      cy.enrollment_create_additions_form_addition_field_checked(0, true);
      cy.enrollment_create_additions_form_addition_field_checked(1, false);
      cy.enrollment_create_additions_form_addition_field_checked(2, true);
      cy.enrollment_create_additions_form_addition_field_checked(3, false);
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
      cy.enrollment_create_fill_main_form(enrollmentInput);
      cy.enrollment_create_fill_additions_form([true, false, true, false]);
      cy.enrollment_create_check_form_submit()
        .click();
      cy.enrollment_create_fill_login_and_mail_form("mail@example.com");
      cy.wait("@enrollment_create_intercept_submit");
      cy.enrollment_create_fill_main_form(enrollmentInput);
    });

    it(' ~ should exist and be visible', () => {
      cy.enrollment_create_additions_form()
        .should("exist")
        .should("be.visible");
    });

    it(' ~ should still contain inputted values', () => {
      cy.enrollment_create_additions_form_addition_field_checked(0, true);
      cy.enrollment_create_additions_form_addition_field_checked(1, false);
      cy.enrollment_create_additions_form_addition_field_checked(2, true);
      cy.enrollment_create_additions_form_addition_field_checked(3, false);
    });
  });

  // TODO CHECK API CALL
});
