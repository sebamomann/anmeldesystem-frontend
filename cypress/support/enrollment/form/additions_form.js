/// <reference types="cypress" />

Cypress.Commands.add('enrollment_create_fill_additions_form', ({ additions }) => {
  for (let i = 0; i < additions.length; i++) {
    if (additions[i]) {
      cy.enrollment_create_additions_form_addition_field(i)
        .click();
    }
  }

  cy.enrollment_create_additions_form_submit()
    .click();
});

Cypress.Commands.add('enrollment_create_additions_form_check_additions', (additions) => {
  for (let i = 0; i < additions.length; i++) {
    cy.enrollment_create_additions_form_addition_field_checked(i, additions[i]);
  }
});

Cypress.Commands.add('enrollment_create_additions_form_check_addition_values', (additions) => {
  for (let i = 0; i < additions.length; i++) {
    cy.enrollment_create_additions_form_addition_field(i)
      .should("contain", "addition-" + (i + 1));
  }
});


Cypress.Commands.add('enrollment_create_additions_form', _ => {
  return cy.get(`#additions-form`);
});

// FIELDS //
// FIELDS //
// FIELDS //

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
