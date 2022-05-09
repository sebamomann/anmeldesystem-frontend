Cypress.Commands.add('enrollment_create_fill_forms', ({ isSelf, name, comment, additions, driver, passenger, check, mail }) => {
  if (isSelf === false)
    cy.enrollment_create_main_form_self_enrollment_field().
      uncheck({ force: true }); // otherwise error that element is covered

  if (name || comment)
    cy.enrollment_create_fill_main_form({ name, comment });

  if (additions)
    cy.enrollment_create_fill_additions_form({ additions });

  if (driver || passenger)
    cy.enrollment_create_fill_driver_and_passenger_form({ driver, passenger });

  if (check === true)
    cy.enrollment_create_check_form_submit()
      .click();

  if (mail)
    cy.enrollment_create_fill_login_and_mail_form({ mail });

});

// TODO
// EXTRACT TO UTIL CLASS
Cypress.Commands.add('enrollment_create_appointment_not_found_card', _ => {
  return cy.get('#appointment-not-found');
});

Cypress.Commands.add('enrollment_create_title', _ => {
  return cy.get('#title');
});


