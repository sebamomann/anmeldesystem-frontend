Cypress.Commands.add('appointment_overview_enrollment_list_enrollments', _ => {
  return cy.get('.enrollment');
});

Cypress.Commands.add('appointment_overview_enrollment_list_enrollments_creator', _ => {
  return cy.get('.enrollment.creator');
});

Cypress.Commands.add('appointment_overview_enrollment_list_enrollments_unknown', _ => {
  return cy.get('.enrollment.unknown');
});

Cypress.Commands.add('appointment_overview_enrollment_list_empty_list_hint', _ => {
  return cy.get('#empty-enrollment-list-hint');
});

Cypress.Commands.add('appointment_overview_enrollment_list_hidden_list_hint', _ => {
  return cy.get('#hidden-enrollment-hint');
});

Cypress.Commands.add('appointment_overview_enrollment_list_enrollment', (id) => {
  return cy.get('[enrollment-id="' + id + '"].enrollment');
});

Cypress.Commands.add('appointment_overview_enrollment_list_enrollment_additions', (id) => {
  return cy.get('[enrollment-id="' + id + '"].enrollment-additions');
});

Cypress.Commands.add('appointment_overview_enrollment_list_enrollment_additions_edit', (id) => {
  return cy.appointment_overview_enrollment_list_enrollment_additions(id)
    .find('.edit');
});

Cypress.Commands.add('appointment_overview_enrollment_list_enrollment_additions_delete', (id) => {
  return cy.appointment_overview_enrollment_list_enrollment_additions(id)
    .find('.delete');
});

Cypress.Commands.add('appointment_overview_enrollment_list_enrollment_deletion_confirmation_dialog', _ => {
  return cy.get('#enrollment-deletion-confirmation-dialog');
});

Cypress.Commands.add('appointment_overview_enrollment_list_enrollment_deletion_confirmation_dialog_cancel', _ => {
  return cy.appointment_overview_enrollment_list_enrollment_deletion_confirmation_dialog()
    .find("#cancel");
});

Cypress.Commands.add('appointment_overview_enrollment_list_enrollment_missing_permissions_dialog', _ => {
  return cy.get('#missing-permissions-dialog');
});

Cypress.Commands.add('appointment_overview_enrollment_list_enrollment_name', (id) => {
  return cy.appointment_overview_enrollment_list_enrollment(id)
    .find('.user-information .name');
});

Cypress.Commands.add('appointment_overview_enrollment_list_enrollment_username', (id) => {
  return cy.appointment_overview_enrollment_list_enrollment(id)
    .find('.user-information .username');
});

Cypress.Commands.add('appointment_overview_enrollment_list_enrollment_comment', (id) => {
  return cy.appointment_overview_enrollment_list_enrollment(id)
    .find('.comment');
});

Cypress.Commands.add('appointment_overview_enrollment_list_enrollment_comment_separator', (id) => {
  return cy.appointment_overview_enrollment_list_enrollment(id)
    .find('.comment-separator');
});




