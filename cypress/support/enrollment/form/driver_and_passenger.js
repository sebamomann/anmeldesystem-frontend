Cypress.Commands.add('enrollment_create_fill_driver_and_passenger_form', ({ driver, passenger }) => {
  if (driver) {
    cy.enrollment_create_driver_and_passenger_form_is_driver_field()
      .click({ force: true });
    cy.enrollment_create_fill_driver_and_passenger_driver_form(driver);
  }
  else if (passenger)
    cy.enrollment_create_fill_driver_and_passenger_passenger_form(passenger);
});

Cypress.Commands.add('enrollment_create_driver_and_passenger_form_is_driver_field', _ => {
  return cy.get(`#driver-input`);
});

Cypress.Commands.add('enrollment_create_driver_and_passenger_form_service_select_field', _ => {
  return cy.get(`#service-select`);
});

Cypress.Commands.add('enrollment_create_driver_and_passenger_form_service_select_field_selected_element', _ => {
  return cy.get(`.mat-select-value-text span`);
});

Cypress.Commands.add('enrollment_create_driver_and_passenger_form', _ => {
  return cy.get(`#driver-and-passenger-form`);
});

Cypress.Commands.add('enrollment_create_driver_and_passenger_form_submit', _ => {
  return cy.get('#next_driver');
});

// DRIVER //
// DRIVER //
// DRIVER //

Cypress.Commands.add('enrollment_create_fill_driver_and_passenger_driver_form', (driver) => {
  let { selection, seats } = driver;

  if (selection) {
    cy.get('.mat-select')
      .first()
      .click();

    cy.get('.mat-option-text')
      .contains(selection)
      .then(option => {
        option[0].click();
      });
  }

  if (seats) {
    cy.enrollment_create_driver_and_passenger_form_seat_field()
      .type(seats);
  }

  cy.enrollment_create_driver_and_passenger_form_submit()
    .click();
});

Cypress.Commands.add('enrollment_create_driver_and_passenger_driver_form', _ => {
  return cy.get(`#driver-form-wrapper`);
});

Cypress.Commands.add('enrollment_create_driver_and_passenger_form_seat_field', _ => {
  return cy.get(`#seats`);
});

// PASSENGER //
// PASSENGER //
// PASSENGER //

Cypress.Commands.add('enrollment_create_fill_driver_and_passenger_passenger_form', (passenger) => {
  let { selection } = passenger;

  cy.get('.mat-select')
    .first()
    .click();

  cy.get('.mat-option-text')
    .contains(selection)
    .then(option => {
      option[0].click();
    });

  cy.enrollment_create_driver_and_passenger_form_submit()
    .click();
});

Cypress.Commands.add('enrollment_create_driver_and_passenger_form_check_passenger_form', (passenger) => {
    it(' ~ should be present and be visible', () => {
      cy.enrollment_create_driver_and_passenger_form()
        .should("exist")
        .should("be.visible");
    });

    it(' ~ should be present and be visible', () => {
      cy.enrollment_create_driver_and_passenger_passenger_form()
        .should("exist")
        .should("be.visible");
    });

    it(' ~ should have correct values', () => {
      cy.enrollment_create_driver_and_passenger_form_service_select_field_selected_element()
        .should("have.text", passenger.selection);
    });

    it(' ~ should have correct attributes', () => {
      cy.enrollment_create_driver_and_passenger_form_is_driver_field()
        .should("not.be.checked");
    });
});

Cypress.Commands.add('enrollment_create_driver_and_passenger_passenger_form', _ => {
  return cy.get(`#passenger-form-wrapper`);
});
