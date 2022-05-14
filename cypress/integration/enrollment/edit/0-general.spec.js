/// <reference types="cypress" />

describe('Enrollment - Create - General', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200');
  });

  describe('* navigate to non-existing appointment', () => {
    const link = "invalid";
    const enrollmentId = '00000000-0000-0000-0000-000000000000';

    beforeEach(() => {
      const fixture = 'appointment/' + link + '.json';
      cy.enrollment_edit_intercept_appointment(404, link, fixture);
      cy.navigate_to_enrollment_edit(link, enrollmentId);
    });

    it(' ~ should show appointment not found card', () => {
      cy.enrollment_edit_enrollment_not_found_card()
        .should("not.exist");
      cy.enrollment_edit_appointment_not_found_card()
        .should("exist");
    });
  });

  describe('* navigate to non-existing enrollment', () => {
    const link = 'valid-enrollments-edit';
    const enrollmentId = '00000000-0000-0000-0000-000000000000';

    beforeEach(() => {
      const fixture = 'appointment/' + link + '.json';
      cy.enrollment_edit_intercept_appointment(200, link, fixture);
      cy.navigate_to_enrollment_edit(link, enrollmentId);
      cy.wait('@enrollment_edit_intercept_appointment');
    });

    it(' ~ should show enrollment not found card', () => {
      cy.enrollment_edit_enrollment_not_found_card()
        .should("exist");
      cy.enrollment_edit_appointment_not_found_card()
        .should("not.exist");
    });
  });

  describe('* navigate to existing appointment', () => {
    const link = 'valid-enrollments-edit';
    const enrollmentId = '1ff2e7e7-9048-46b2-b02b-fe95b874ef6d';

    beforeEach(() => {
      const fixture = 'appointment/' + link + '.json';
      cy.enrollment_edit_intercept_appointment(200, link, fixture);
      cy.navigate_to_enrollment_edit(link, enrollmentId);
    });

    it(' ~ should not show appointment not found card', () => {
      cy.enrollment_edit_appointment_not_found_card()
        .should("not.exist");
      cy.enrollment_edit_enrollment_not_found_card()
        .should("not.exist");
    });
  });
});
