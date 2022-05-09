/// <reference types="cypress" />

import "cypress-localstorage-commands";

const link = "valid-enrollments-create-driverandpassenger";

const enrollmentInput = {
  name: 'Unknown Enrollment - Driver and Passenger - Driver',
  comment: 'Unknown Enrollment Comment'
};

describe('Enrollment - Create - Driver and Passenger - Driver', () => {
  describe(' * driver and passenger form', () => {
    before(() => {
      const fixture = 'appointment/' + link + '.json';
      cy.enrollment_create_intercept_appointment(200, link, fixture);
      cy.navigate_to_enrollment_creation(link);
      cy.enrollment_create_fill_forms({ ...enrollmentInput, driver: {} }); // empty driver to select checkbox
    });

    it(' ~ should be present and be visible', () => {
      cy.enrollment_create_driver_and_passenger_form()
        .should("exist")
        .should("be.visible");
    });

    it(' ~ should be present and be visible', () => {
      cy.enrollment_create_driver_and_passenger_driver_form()
        .should("exist")
        .should("be.visible");
    });

    it(' ~ should have correct values', () => {
      // cant be checked ....
      // cy.enrollment_create_driver_and_passenger_form_service_select_field_selected_element()
      //   .should("have.value", "");

      cy.enrollment_create_driver_and_passenger_form_seat_field()
        .should("have.value", "");
    });

    it(' ~ should have correct attributes', () => {
      cy.enrollment_create_driver_and_passenger_form_is_driver_field()
        .should("be.checked");
    });
  });

  describe(' * go back to form', () => {
    before(() => {
      const fixture = 'appointment/' + link + '.json';
      cy.enrollment_create_intercept_appointment(200, link, fixture);
      cy.navigate_to_enrollment_creation(link);
      cy.enrollment_create_fill_forms({ ...enrollmentInput, driver: { selection: "Nur Zurück", seats: 2 }, check: true });
      cy.enrollment_create_login_and_mail_form_back()
        .click();
      cy.enrollment_create_check_form_back()
        .click();
    });

    it(' ~ should be present and be visible', () => {
      cy.enrollment_create_driver_and_passenger_form()
        .should("exist")
        .should("be.visible");
    });

    it(' ~ should be present and be visible', () => {
      cy.enrollment_create_driver_and_passenger_driver_form()
        .should("exist")
        .should("be.visible");
    });

    it(' ~ should have correct values', () => {
      cy.enrollment_create_driver_and_passenger_form_service_select_field_selected_element()
        .should("have.text", "Nur Zurück");
      cy.enrollment_create_driver_and_passenger_form_seat_field()
        .should("have.value", 2);
    });

    it(' ~ should have correct attributes', () => {
      cy.enrollment_create_driver_and_passenger_form_is_driver_field()
        .should("be.checked");
    });
  });


  //

  describe(' * complete - already enrolled', () => {
    before(() => {
      const enrollment_create_fixture = 'enrollment/create/driver-and-passenger-driver-already-enrolled.json';
      cy.enrollment_create_intercept_submit(409, enrollment_create_fixture);
      const fixture = 'appointment/' + link + '.json';
      cy.enrollment_create_intercept_appointment(200, link, fixture);
      cy.navigate_to_enrollment_creation(link);
      cy.enrollment_create_fill_forms({ ...enrollmentInput, driver: { selection: "Nur Zurück", seats: 2 }, check: true, mail: "mail@example.com" });
      cy.wait("@enrollment_create_intercept_submit");
      cy.enrollment_create_fill_forms(enrollmentInput);
    });

    it(' ~ should be present and be visible', () => {
      cy.enrollment_create_driver_and_passenger_form()
        .should("exist")
        .should("be.visible");
    });

    it(' ~ should be present and be visible', () => {
      cy.enrollment_create_driver_and_passenger_driver_form()
        .should("exist")
        .should("be.visible");
    });

    it(' ~ should have correct values', () => {
      cy.enrollment_create_driver_and_passenger_form_service_select_field_selected_element()
        .should("have.text", "Nur Zurück");
      cy.enrollment_create_driver_and_passenger_form_seat_field()
        .should("have.value", 2);
    });

    it(' ~ should have correct attributes', () => {
      cy.enrollment_create_driver_and_passenger_form_is_driver_field()
        .should("be.checked");
    });
  });

  // TODO CHECK API CALL
});
