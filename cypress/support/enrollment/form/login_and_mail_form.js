Cypress.Commands.add('enrollment_create_fill_login_and_mail_form', ({ mail }) => {
  if (mail) {
    cy.enrollment_create_login_and_mail_form_mail_field()
      .type(mail);
  }

  cy.enrollment_create_login_and_mail_form_submit()
    .click();
});



Cypress.Commands.add('enrollment_create_login_and_mail_form', _ => {
  return cy.get('#login-mail-form');
});

Cypress.Commands.add('enrollment_create_login_and_mail_form_mail_field', _ => {
  return cy.get('#mail');
});

Cypress.Commands.add('enrollment_create_login_and_mail_form_mail_field_error', _ => {
  return cy.get('#mail-error');
});

Cypress.Commands.add('enrollment_create_login_and_mail_form_login', _ => {
  return cy.get('#login');
});

Cypress.Commands.add('enrollment_create_login_and_mail_form_login_block', _ => {
  return cy.get('#login-content');
});

Cypress.Commands.add('enrollment_create_login_and_mail_form_login_alternative_block', _ => {
  return cy.get('#login-content-alt');
});

Cypress.Commands.add('enrollment_create_login_and_mail_form_submit', _ => {
  return cy.get('#submit');
});

Cypress.Commands.add('enrollment_create_login_and_mail_form_back', _ => {
  return cy.get('#back');
});

