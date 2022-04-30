/// <reference types="cypress" />

import "cypress-localstorage-commands";

const link = "valid-enrollments-create-user";

const enrollmentInput = {
  comment: 'User Enrollment Comment - Self enrollment'
};

describe('Enrollment - Create - Self Enrollment', () => {
  before(() => {
    cy.visit('http://localhost:4200');
  });

  describe(' * main form', () => {
    describe(' * ', () => {

      let fixture_user;

      before(() => {
        const fixture = 'appointment/' + link + '.json';
        cy.enrollment_create_intercept_appointment(200, link, fixture);
        const fixture_user_location = "user/gjm-test-protractor-general-enrollmentcreator-user-1.json";
        cy.fixture(fixture_user_location)
          .then(user => {
            fixture_user = user;
            cy.keycloack_login_via_api(user.username, user.password);
            cy.navigate_to_enrollment_creation(link, user);
            cy.saveLocalStorage();
          });
      });

      beforeEach(() => {
        cy.restoreLocalStorage();
      });

      it(' ~ should exist and be visible', () => {
        cy.enrollment_create_main_form()
          .should("exist")
          .should("be.visible");
      });

      describe(' * should have correct attributes', () => {
        it(' ~ disabled name field', () => {
          cy.enrollment_create_main_form_name_field()
            .should("be.disabled");
        });

        it(' ~ checked self enrollment', () => {
          cy.enrollment_create_main_form_self_enrollment_field()
            .should("be.checked");
        });
      });

      describe(' * should have correct values', () => {
        it(' ~ name of authorized user', () => {
          cy.enrollment_create_main_form_name_field()
            .should("have.value", fixture_user.firstName + " " + fixture_user.lastName);
        });

        it(' ~ empty comment', () => {
          cy.enrollment_create_main_form_comment_field()
            .should("have.value", "");
        });
      });
    });

    describe(' * already enrolled', () => {
      let fixture_user;

      before(() => {
        const fixture = 'appointment/' + link + '.json';
        cy.enrollment_create_intercept_appointment(200, link, fixture);
        // user already is enrolled in appointment
        const fixture_user_location = "user/gjm-test-protractor-general-enrollmentcreator-user-3.json";
        cy.fixture(fixture_user_location)
          .then(user => {
            fixture_user = user;
            cy.keycloack_login_via_api(user.username, user.password);
            cy.navigate_to_enrollment_creation(link, user);
            cy.saveLocalStorage();
          });
      });

      beforeEach(() => {
        cy.restoreLocalStorage();
      });

      it(' ~ should exist and be visible', () => {
        cy.enrollment_create_main_form()
          .should("exist")
          .should("be.visible");
      });

      it(' ~ should show correct error message', () => {
        cy.enrollment_create_main_form_creator_error()
          .should('have.text', "Du bist bereits angemeldet");
      });

      describe(' * should have correct attributes', () => {
        it(' ~ disabled name field', () => {
          cy.enrollment_create_main_form_name_field()
            .should("be.disabled");
        });

        it(' ~ checked self enrollment', () => {
          cy.enrollment_create_main_form_self_enrollment_field()
            .should("be.checked");
        });

        it(' ~ siabled submit button', () => {
          cy.enrollment_create_main_form_submit()
            .should("be.disabled");
        });
      });

      describe(' * should have correct values', () => {
        it(' ~ name of authorized user', () => {
          cy.enrollment_create_main_form_name_field()
            .should("have.value", fixture_user.firstName + " " + fixture_user.lastName);
        });

        it(' ~ empty comment', () => {
          cy.enrollment_create_main_form_comment_field()
            .should("have.value", "");
        });
      });
    });
  });

  describe(' * check card', () => {
    let fixture_user;

    before(() => {
      const fixture = 'appointment/' + link + '.json';
      cy.enrollment_create_intercept_appointment(200, link, fixture);
      const fixture_user_location = "user/gjm-test-protractor-general-enrollmentcreator-user-1.json";
      cy.fixture(fixture_user_location)
        .then(user => {
          fixture_user = user;
          cy.keycloack_login_via_api(user.username, user.password);
          cy.navigate_to_enrollment_creation(link, user);
          cy.enrollment_create_fill_main_form(enrollmentInput);
          cy.saveLocalStorage();
        });
    });

    it(' ~ should be present and be visible', () => {
      cy.enrollment_create_check_card()
        .should("exist")
        .should("be.visible");
    });

    describe(' * should contain correct values', () => {
      it(' ~ name', () => {
        cy.enrollment_create_check_form_name()
          .should("have.text", fixture_user.firstName + " " + fixture_user.lastName);
      });

      it(' ~ username', () => {
        cy.enrollment_create_check_form_username()
          .should("have.text", "@" + fixture_user.username);
      });

      it(' ~ comment', () => {
        cy.enrollment_create_check_form_comment()
          .should("have.text", enrollmentInput.comment);
      });
    });
  });

  describe(' * go back to main form', () => {
    let fixture_user;

    before(() => {
      const fixture = 'appointment/' + link + '.json';
      cy.enrollment_create_intercept_appointment(200, link, fixture);
      const fixture_user_location = "user/gjm-test-protractor-general-enrollmentcreator-user-1.json";
      cy.fixture(fixture_user_location)
        .then(user => {
          fixture_user = user;
          cy.keycloack_login_via_api(user.username, user.password);
          cy.navigate_to_enrollment_creation(link, user);
          cy.enrollment_create_fill_main_form(enrollmentInput);
          cy.enrollment_create_check_form_back()
            .click();
          cy.saveLocalStorage();
        });
    });

    it(' ~ should exist and be visible', () => {
      cy.enrollment_create_main_form()
        .should("exist")
        .should("be.visible");
    });

    describe(' * should have correct attributes', () => {
      it(' ~ disabled name field', () => {
        cy.enrollment_create_main_form_name_field()
          .should("be.disabled");
      });

      it(' ~ checked self enrollment', () => {
        cy.enrollment_create_main_form_self_enrollment_field()
          .should("be.checked");
      });
    });

    describe(' * should have correct values', () => {
      it(' ~ name of authorized user', () => {
        cy.enrollment_create_main_form_name_field()
          .should("have.value", fixture_user.firstName + " " + fixture_user.lastName);
      });

      it(' ~ empty comment', () => {
        cy.enrollment_create_main_form_comment_field()
          .should("have.value", enrollmentInput.comment);
      });
    });
  });

  describe(' * complete', () => {
    describe(' *', () => {
      let fixture_user;

      before(() => {
        const enrollment_create_fixture = 'enrollment/create/7980bede-58bf-4f0e-960c-125c48563e5a.json';
        cy.enrollment_create_intercept_submit(201, enrollment_create_fixture);
        const fixture = 'appointment/' + link + '.json';
        cy.enrollment_create_intercept_appointment(200, link, fixture);
        const fixture_user_location = "user/gjm-test-protractor-general-enrollmentcreator-user-1.json";
        cy.fixture(fixture_user_location)
          .then(user => {
            fixture_user = user;
            cy.keycloack_login_via_api(user.username, user.password);
            cy.navigate_to_enrollment_creation(link, user);
            cy.enrollment_create_fill_main_form(enrollmentInput);
            cy.enrollment_create_check_form_submit()
              .click();
            cy.wait("@enrollment_create_intercept_submit");
            cy.saveLocalStorage();
          });
      });

      it(" ~ should swap to main form", () => {
        cy.enrollment_create_main_form()
          .should("exist")
          .should("be.visible");
      });

      it(' ~ should redirect to appointment overview page', () => {
        const fixture = 'appointment/' + link + '.json';
        cy.enrollment_create_intercept_appointment(200, link, fixture);
        cy.wait("@enrollment_create_intercept_appointment");

        const url = '/enroll?a=' + link;
        cy.url()
          .should('include', url);
      });

      // TODO
      // NOT A ERROR SNACKBAR
      it(' ~ should show correct snackbar', () => {
        cy.contains("Erfolgreich angemeldet");
      });
    });
  });

  // test needed if user enrolls himself on one device, while enrolling from another device
  describe(' * already enrolled', () => {
    let fixture_user;

    before(() => {
      const enrollment_create_fixture = 'enrollment/create/self-enrollment-already-enrolled.json';
      cy.enrollment_create_intercept_submit(409, enrollment_create_fixture);
      const fixture = 'appointment/' + link + '.json';
      cy.enrollment_create_intercept_appointment(200, link, fixture);
      const fixture_user_location = "user/gjm-test-protractor-general-enrollmentcreator-user-1.json";
      cy.fixture(fixture_user_location)
        .then(user => {
          fixture_user = user;
          cy.keycloack_login_via_api(user.username, user.password);
          cy.navigate_to_enrollment_creation(link, user);
          cy.enrollment_create_fill_main_form(enrollmentInput);
          cy.enrollment_create_check_form_submit()
            .click();
          cy.wait("@enrollment_create_intercept_submit");
          cy.saveLocalStorage();
        });
    });

    it(" ~ should swap to main form", () => {
      cy.enrollment_create_main_form()
        .should("exist")
        .should("be.visible");
    });

    it(' ~ should show correct error message', () => {
      cy.enrollment_create_main_form_creator_error()
        .should('have.text', "Du bist bereits angemeldet");
    });
  });
});
