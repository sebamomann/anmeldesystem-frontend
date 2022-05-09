Cypress.Commands.add('enrollment_create_check_form_check_additions', (additions) => {
  for (let i = 0; i < additions.length; i++) {
    cy.enrollment_create_check_form_addition_field_checked(i, additions[i]);
  }
});

Cypress.Commands.add('enrollment_create_check_form', _ => {
  return cy.get('#enrollment-check-card');
});

Cypress.Commands.add('enrollment_create_check_form_name', _ => {
  return cy.get('.enrollment .user-information .name');
});

Cypress.Commands.add('enrollment_create_check_form_username', _ => {
  return cy.get('.enrollment .user-information .username');
});

Cypress.Commands.add('enrollment_create_check_form_comment', _ => {
  return cy.get('.enrollment .comment');
});

Cypress.Commands.add('enrollment_create_check_form_addition_field_checked', (id, bool) => {
  return cy.get(`.addition-list .addition-index-${id}`)
    .children("mat-icon")
    .should((bool ? "" : "not.") + "have.class", "checkbox_selected");
});

Cypress.Commands.add('enrollment_create_check_form_submit', _ => {
  return cy.get('#next_check');
});

Cypress.Commands.add('enrollment_create_check_form_back', _ => {
  return cy.get('#back_check');
});
