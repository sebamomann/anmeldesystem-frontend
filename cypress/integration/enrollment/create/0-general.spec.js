/// <reference types="cypress" />

// TODO
// back of main form should rediredct to enrollment

describe('Enrollment - Create - General', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200');
  });

  describe('* navigate to non-existing appointment', () => {
    const link = "invalid";

    beforeEach(() => {
      const fixture = 'appointment/' + link + '.json';
      cy.enrollment_create_intercept_appointment(404, link, fixture);
      cy.navigate_to_enrollment_creation(link);
    });

    it(' ~ should show appointment not found card', () => {
      cy.enrollment_create_appointment_not_found_card().should("exist");
    });
  });

  describe('* navigate to existing appointment', () => {
    const link = "valid";

    beforeEach(() => {
      const fixture = 'appointment/' + link + '.json';
      cy.enrollment_create_intercept_appointment(200, link, fixture);
      cy.navigate_to_enrollment_creation(link);
    });

    it(' ~ should not show appointment not found card', () => {
      cy.enrollment_create_appointment_not_found_card().should("not.exist");
    });
  });
});
