/// <reference types="cypress" />

describe('Appointment - Overview - General', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200');
  });

  describe('* navigate to non-existing appointment', () => {
    const link = "invalid";

    beforeEach(() => {
      const fixture = 'appointment/' + link + '.json';
      cy.appointment_overview_intercept_appointment(404, link, fixture);
      cy.navigate_to_appointment(link);
    });

    it(' ~ should show appointment not found card', () => {
      cy.appointment_overview_appointment_not_found_card().should("exist");
    });
  });

  describe('* navigate to existing appointment', () => {
    const link = "valid";

    beforeEach(() => {
      const fixture = 'appointment/' + link + '.json';
      cy.appointment_overview_intercept_appointment(200, link, fixture);
      cy.navigate_to_appointment(link);
    });

    it(' ~ should not show appointment not found card', () => {
      cy.appointment_overview_appointment_not_found_card().should("not.exist");
    });
  });
});
