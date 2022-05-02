Cypress.Commands.add('enrollment_create_fill_main_form', (data) => {
  const nameToSet = data.name;
  const commentToSet = data.comment;

  if (nameToSet) {
    cy.enrollment_create_main_form_name_field()
      .clear()
      .type(nameToSet);
  }

  if (commentToSet) {
    cy.enrollment_create_main_form_comment_field()
      .clear()
      .type(commentToSet);
  }

  cy.enrollment_create_main_form_submit()
    .click();
});

Cypress.Commands.add('enrollment_create_fill_login_and_mail_form', (mail) => {
  if (mail) {
    cy.enrollment_create_login_and_mail_form_mail_field()
      .type(mail);
  }


  cy.enrollment_create_login_and_mail_form_submit()
    .click();
});


Cypress.Commands.add('enrollment_create_main_form_cause_empty_name', _ => {
  cy.enrollment_create_main_form_name_field()
    .type("r{backspace}");
});

Cypress.Commands.add('enrollment_create_fill_additions_form', (args) => {
  for (let i = 0; i < args.length; i++) {
    if (args[i]) {
      cy.enrollment_create_additions_form_addition_field(i)
        .click();
    }
  }

  cy.enrollment_create_additions_form_submit()
    .click();
});

// ELEMENTS
// ELEMENTS

// TODO
// EXTRACT TO UTIL CLASS
Cypress.Commands.add('enrollment_create_appointment_not_found_card', _ => {
  return cy.get('#appointment-not-found');
});

Cypress.Commands.add('enrollment_create_title', _ => {
  return cy.get('#title');
});

Cypress.Commands.add('enrollment_create_main_form', _ => {
  return cy.get('#main-form');
});

Cypress.Commands.add('enrollment_create_main_form_name_field', _ => {
  return cy.get('#name');
});

Cypress.Commands.add('enrollment_create_main_form_name_field_error', _ => {
  return cy.get('#name-error');
});

Cypress.Commands.add('enrollment_create_main_form_creator_error', _ => {
  return cy.get('#creator-error');
});

Cypress.Commands.add('enrollment_create_main_form_comment_field', _ => {
  return cy.get('#comment');
});

Cypress.Commands.add('enrollment_create_main_form_self_enrollment_field', _ => {
  return cy.get('#selfEnrollment-input');
});

Cypress.Commands.add('enrollment_create_main_form_submit', _ => {
  return cy.get('#next_main');
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

Cypress.Commands.add('enrollment_create_login_and_mail_form_back', _ => {
  return cy.get('#back');
});

Cypress.Commands.add('enrollment_create_login_and_mail_form_submit', _ => {
  return cy.get('#submit');
});

Cypress.Commands.add('enrollment_create_login_and_mail_form_mail_field', _ => {
  return cy.get('#mail');
});

Cypress.Commands.add('enrollment_create_login_and_mail_form_mail_field_error', _ => {
  return cy.get('#mail-error');
});

Cypress.Commands.add('enrollment_create_login_and_main_form_login', _ => {
  return cy.get('#login');
});

Cypress.Commands.add('enrollment_create_check_form', _ => {
  return cy.get('#enrollment-check-card');
});

Cypress.Commands.add('enrollment_create_login_and_mail_form', _ => {
  return cy.get('#login-mail-form');
});

Cypress.Commands.add('enrollment_create_login_and_mail_form_login_block', _ => {
  return cy.get('#login-content');
});

Cypress.Commands.add('enrollment_create_login_and_mail_form_login_alternative_block', _ => {
  return cy.get('#login-content-alt');
});

Cypress.Commands.add('enrollment_create_additions_form', (id) => {
  return cy.get(`#additions-form`);
});

Cypress.Commands.add('enrollment_create_additions_form_addition_field', (id) => {
  return cy.get(`#addition-${id}`);
});

Cypress.Commands.add('enrollment_create_additions_form_addition_field_checked', (id, bool) => {
  return cy.get(`#addition-${id}`)
    .should((bool ? "" : "not.") + "have.class", "mat-checkbox-checked");
});

Cypress.Commands.add('enrollment_create_additions_form_submit', _ => {
  return cy.get('#next_additions');
});

