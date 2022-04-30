Cypress.Commands.add('appointment_data_location', _ => {
  return cy.get('.appointment_location span');
});

Cypress.Commands.add('appointment_data_description', _ => {
  return cy.get('.appointment_description');
});

Cypress.Commands.add('appointment_data_creator_name', _ => {
  return cy.get('.appointment_creator .name');
});

Cypress.Commands.add('appointment_data_creator_username', _ => {
  return cy.get('.appointment_creator .username');
});

Cypress.Commands.add('appointment_data_deadline', _ => {
  return cy.get('.appointment_deadline span');
});

Cypress.Commands.add('appointment_data_files', _ => {
  return cy.get('.file');
});

Cypress.Commands.add('appointment_data_menu_button', _ => {
  return cy.get('#appointment_menu');
});

Cypress.Commands.add('appointment_data_menu_content', _ => {
  return cy.get('.mat-menu-content');
});

Cypress.Commands.add('appointment_data_menu_items', _ => {
  return cy.get('.mat-menu-item');
});

Cypress.Commands.add('appointment_data_menu_item_names', _ => {
  return cy.get('.mat-menu-item span');
});

Cypress.Commands.add('appointment_data_menu_item_by_id', (id) => {
  return cy.get('#' + id);
});
