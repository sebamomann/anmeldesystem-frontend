// TODO
// EXTRACT TO UTIL CLASS
Cypress.Commands.add('enrollment_edit_appointment_not_found_card', _ => {
  return cy.get('#appointment-not-found');
});

Cypress.Commands.add('enrollment_edit_enrollment_not_found_card', _ => {
  return cy.get('#enrollment-not-found');
});

Cypress.Commands.add('enrollment_edit_title', _ => {
  return cy.get('#title');
});


