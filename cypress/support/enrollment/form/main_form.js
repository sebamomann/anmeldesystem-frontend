Cypress.Commands.add('enrollment_create_fill_main_form', ({ name, comment }) => {
  console.log(name, comment);

  if (name) {
    cy.enrollment_create_main_form_name_field()
      .clear()
      .type(name);
  }

  if (comment) {
    cy.enrollment_create_main_form_comment_field()
      .clear()
      .type(comment);
  }

  cy.enrollment_create_main_form_submit()
    .click();
});

Cypress.Commands.add('enrollment_create_main_form_cause_empty_name', _ => {
  cy.enrollment_create_main_form_name_field()
    .type("r{backspace}");
});

Cypress.Commands.add('enrollment_create_main_form', _ => {
  return cy.get('#main-form');
});

// FIELDS //
// FIELDS //
// FIELDS //

Cypress.Commands.add('enrollment_create_main_form_self_enrollment_field', _ => {
  return cy.get('#selfEnrollment-input');
});

Cypress.Commands.add('enrollment_create_main_form_name_field', _ => {
  return cy.get('#name');
});

Cypress.Commands.add('enrollment_create_main_form_name_field_error', _ => {
  return cy.get('#name-error');
});

Cypress.Commands.add('enrollment_create_main_form_comment_field', _ => {
  return cy.get('#comment');
});


Cypress.Commands.add('enrollment_create_main_form_creator_error', _ => {
  return cy.get('#creator-error');
});

Cypress.Commands.add('enrollment_create_main_form_submit', _ => {
  return cy.get('#next_main');
});
