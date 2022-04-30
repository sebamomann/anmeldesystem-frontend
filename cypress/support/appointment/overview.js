Cypress.Commands.add('appointment_overview_appointment_not_found_card', _ => {
  return cy.get('#appointment-not-found');
});

Cypress.Commands.add('appointment_overview_enrollment_creation_button', _ => {
  return cy.get('#enroll_action_button');
});

Cypress.Commands.add('appointment_overview_driver_overview_button', _ => {
  return cy.get('#driver_overview_action_button');
});

Cypress.Commands.add('appointment_overview_login_hint', _ => {
  return cy.get('#login_hint');
});


