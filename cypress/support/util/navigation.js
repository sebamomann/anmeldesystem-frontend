import 'cypress-wait-until';

Cypress.Commands.add('appointment_overview_intercept_appointment', (code, link, fixture) => {
  cy.intercept('GET', 'http://localhost:3000/appointments/' + link, {
    statusCode: code,
    fixture: fixture
  })
    .as("appointment_overview_intercept_appointment");
});

Cypress.Commands.add('enrollment_create_intercept_appointment', (code, link, fixture) => {
  cy.intercept('GET', 'http://localhost:3000/appointments/' + link + "*", {
    statusCode: code,
    fixture: fixture
  })
    .as("enrollment_create_intercept_appointment");
});

Cypress.Commands.add('enrollment_create_intercept_submit', (code, fixture) => {
  cy.intercept({
    method: 'POST',
    url: "http://localhost:3000/enrollments",
  }, {
    statusCode: code,
    fixture: fixture
  }).as("enrollment_create_intercept_submit");
});

Cypress.Commands.add('navigate_to_appointment', (appointmentLink, user) => {
  if (user)
    cy.keycloack_login_via_api(user.username, user.password);

  cy.visit('http://localhost:4200/enroll?a=' + appointmentLink);
  cy.wait_for_loading_spinner_to_be_gone();
  cy.waitUntil(() => cy.get('.mat-card', { timeout: 10000 }).should('be.visible'));
});

Cypress.Commands.add('navigate_to_enrollment_creation', (appointmentLink, user = undefined) => {
  if (user)
    cy.keycloack_login_via_api(user.username, user.password);

  cy.visit('http://localhost:4200/enrollment/add?a=' + appointmentLink);
  cy.wait_for_loading_spinner_to_be_gone();
  cy.waitUntil(() => cy.get('.mat-card', { timeout: 10000 }).should('be.visible'));
});

Cypress.Commands.add('wait_for_loading_spinner_to_be_gone', _ => {
  cy.get('#loading-overlay')
    .should('not.exist');
});
