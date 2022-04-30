/// <reference types="cypress" />

describe('Appointment - Overview - Enrollment List - Hidden', () => {
  before(() => {
    cy.visit('http://localhost:4200');
  });

  describe(' * appointment with no enrollments', () => {
    const link = "valid-enrollment-list-hidden";

    before(() => {
      const fixture = 'appointment/' + link + '.json';
      cy.appointment_overview_intercept_appointment(200, link, fixture);
      cy.navigate_to_appointment(link);
    });

    it(' ~ should not show any enrollments', () => {
      cy.appointment_overview_enrollment_list_enrollments()
        .should('have.length', 0);
    });

    it(' ~ should show hidden enrollment hint', () => {
      cy.appointment_overview_enrollment_list_hidden_list_hint()
        .should('exist');
    });
  });

  describe(' * with no returned enrollments', () => {
    const link = "valid-enrollment-list-hidden-enrollments";

    before(() => {
      const fixture = 'appointment/' + link + '.json';
      cy.appointment_overview_intercept_appointment(200, link, fixture);
      cy.navigate_to_appointment(link);
    });

    it(' ~ should show 5 enrollments', () => {
      cy.appointment_overview_enrollment_list_enrollments()
        .should('have.length', 5);
    });

    it(' ~ should show hidden enrollment hint', () => {
      cy.appointment_overview_enrollment_list_hidden_list_hint()
        .should('exist');
    });
  });
});
