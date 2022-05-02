/// <reference types="cypress" />

import "cypress-localstorage-commands";

const link = "valid-enrollments-create-unknown";
const enrollmentInput = {
  name: 'Unknown Enrollment',
  comment: 'Unknown Enrollment Comment'
};

describe('Enrollment - Create - Unknown User', () => {
  before(() => {
    cy.visit('http://localhost:4200');
  });

  describe(' * ', () => {
    before(() => {
      const fixture = 'appointment/' + link + '.json';
      cy.enrollment_create_intercept_appointment(200, link, fixture);
      cy.navigate_to_enrollment_creation(link);
    });
    it(' ~ should have title "Anmelden"', () => {
      cy.enrollment_create_title()
        .should("have.text", "Anmelden");
    });
  });

  describe(' * main form', () => {
    before(() => {
      const fixture = 'appointment/' + link + '.json';
      cy.enrollment_create_intercept_appointment(200, link, fixture);
      cy.navigate_to_enrollment_creation(link);
    });

    it(' ~ should exist and be visible', () => {
      cy.enrollment_create_main_form()
        .should("exist")
        .should("be.visible");
    });

    describe(' * should have correct values', () => {
      it(' ~ empty name', () => {
        cy.enrollment_create_main_form_name_field()
          .should("have.value", "");
      });

      it(' ~ empty comment', () => {
        cy.enrollment_create_main_form_comment_field()
          .should("have.value", "");
      });
    });

    describe('* submit without name', () => {
      before(() => {
        cy.enrollment_create_main_form_submit()
          .click();
      });

      it(' ~ should show correct error message', () => {
        cy.enrollment_create_main_form_name_field_error()
          .should('have.text', "Bitte gebe einen Namen an");
      });
    });

    describe(' * cause empty name error', () => {
      before(() => {
        cy.enrollment_create_main_form_cause_empty_name();
        cy.enrollment_create_main_form_submit()
          .click();
      });

      it(' ~ should show correct error message', () => {
        cy.enrollment_create_main_form_name_field_error()
          .should('have.text', "Bitte gebe einen Namen an");
      });
    });
  });

  describe(' * check card', () => {
    before(() => {
      const fixture = 'appointment/' + link + '.json';
      cy.enrollment_create_intercept_appointment(200, link, fixture);
      cy.navigate_to_enrollment_creation(link);
      cy.enrollment_create_fill_main_form(enrollmentInput);
    });

    it(' ~ should be present and be visible', () => {
      cy.enrollment_create_check_form()
        .should("exist")
        .should("be.visible");
    });

    it(' ~ username should not exist', () => {
      cy.enrollment_create_check_form_username()
        .should("not.exist");
    });

    describe(' * should contain correct values', () => {
      it(' ~ name', () => {
        cy.enrollment_create_check_form_name()
          .should("have.text", enrollmentInput.name);
      });

      it(' ~ comment', () => {
        cy.enrollment_create_check_form_comment()
          .should("have.text", enrollmentInput.comment);
      });
    });
  });

  describe(' * login and mail form', () => {
    before(() => {
      const fixture = 'appointment/' + link + '.json';
      cy.enrollment_create_intercept_appointment(200, link, fixture);
      cy.navigate_to_enrollment_creation(link);
      cy.enrollment_create_fill_main_form(enrollmentInput);
      cy.enrollment_create_check_form_submit()
        .click();
    });

    it(" ~ should exist and be visible", () => {
      cy.enrollment_create_login_and_mail_form()
        .should("exist")
        .should("be.visible");
    });

    it(" ~ should contain login button", () => {
      cy.enrollment_create_login_and_mail_form_login_block()
        .should("exist")
        .should("be.visible");
    });

    it(" ~ should not contain alternative text", () => {
      cy.enrollment_create_login_and_mail_form_login_alternative_block()
        .should("not.exist");
    });
  });

  describe(' * go back to check card', () => {
    before(() => {
      const fixture = 'appointment/' + link + '.json';
      cy.enrollment_create_intercept_appointment(200, link, fixture);
      cy.navigate_to_enrollment_creation(link);
      cy.enrollment_create_fill_main_form(enrollmentInput);
      cy.enrollment_create_check_form_submit()
        .click();
      cy.enrollment_create_login_and_mail_form_back()
        .click();
    });

    it(' ~ should be present and be visible', () => {
      cy.enrollment_create_check_form()
        .should("exist")
        .should("be.visible");
    });

    describe(' * should contain correct values', () => {
      it(' ~ name', () => {
        cy.enrollment_create_main_form_name_field()
          .should("have.value", enrollmentInput.name);
      });

      it(' ~ comment', () => {
        cy.enrollment_create_main_form_comment_field()
          .should("have.value", enrollmentInput.comment);
      });
    });
  });

  describe(' * go back to main form', () => {
    before(() => {
      const fixture = 'appointment/' + link + '.json';
      cy.enrollment_create_intercept_appointment(200, link, fixture);
      cy.navigate_to_enrollment_creation(link);
      cy.enrollment_create_fill_main_form(enrollmentInput);
      cy.enrollment_create_check_form_submit()
        .click();
      cy.enrollment_create_login_and_mail_form_back()
        .click();
      cy.enrollment_create_check_form_back()
        .click();
    });

    it(' ~ should exist and be visible', () => {
      cy.enrollment_create_main_form()
        .should("exist")
        .should("be.visible");
    });

    describe(' * should still contain correct values', () => {
      it(' ~ name', () => {
        cy.enrollment_create_main_form_name_field()
          .should("have.value", enrollmentInput.name);
      });

      it(' ~ comment', () => {
        cy.enrollment_create_main_form_comment_field()
          .should("have.value", enrollmentInput.comment);
      });
    });
  });

  describe(' * complete - invalid', () => {
    before(() => {
      const fixture = 'appointment/' + link + '.json';
      cy.enrollment_create_intercept_appointment(200, link, fixture);
      cy.navigate_to_enrollment_creation(link);
      cy.enrollment_create_fill_main_form(enrollmentInput);
      cy.enrollment_create_check_form_submit()
        .click();
      cy.enrollment_create_fill_login_and_mail_form("invalid");
    });

    it(" ~ should show correct error message", () => {
      cy.enrollment_create_login_and_mail_form_mail_field_error()
        .should("have.text", "Bitte gebe eine gültige E-Mail Adresse an");
    });
  });

  describe(' * complete', () => {
    before(() => {
      const enrollment_create_fixture = 'enrollment/create/38d6773b-9ce9-4e4a-87fe-bf9719c455ad.json';
      cy.enrollment_create_intercept_submit(201, enrollment_create_fixture);
      const fixture = 'appointment/' + link + '.json';
      cy.enrollment_create_intercept_appointment(200, link, fixture);
      cy.navigate_to_enrollment_creation(link);
      cy.enrollment_create_fill_main_form(enrollmentInput);
      cy.enrollment_create_check_form_submit()
        .click();
      cy.enrollment_create_fill_login_and_mail_form("mail@example.com");
      cy.wait("@enrollment_create_intercept_submit");
      cy.saveLocalStorage();
    });

    beforeEach(() => {
      cy.restoreLocalStorage();
    });

    afterEach(() => {
      cy.saveLocalStorage();
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

    it(' ~ should store enrollment information', () => {
      // fetch stored token to edit enrollment afterwards
      const storedEnrollmentValues = JSON.parse(window.localStorage.getItem('permissions'));

      const id = storedEnrollmentValues[0].enrollments[0].id;
      const token = storedEnrollmentValues[0].enrollments[0].token;
      const _link = storedEnrollmentValues[0].link;

      expect(id).to.equal('38d6773b-9ce9-4e4a-87fe-bf9719c455ad');
      expect(token).to.equal('mytoken');
      expect(_link).to.equal(link);
    });
  });

  describe(' * complete - already enrolled', () => {
    before(() => {
      const enrollment_create_fixture = 'enrollment/create/already-enrolled.json';
      cy.enrollment_create_intercept_submit(409, enrollment_create_fixture);
      const fixture = 'appointment/' + link + '.json';
      cy.enrollment_create_intercept_appointment(200, link, fixture);
      cy.navigate_to_enrollment_creation(link);
      cy.enrollment_create_fill_main_form(enrollmentInput);
      cy.enrollment_create_check_form_submit()
        .click();
      cy.enrollment_create_fill_login_and_mail_form("mail@example.com");
      cy.wait("@enrollment_create_intercept_submit");
    });


    it(" ~ should swap to main form", () => {
      cy.enrollment_create_main_form()
        .should("exist")
        .should("be.visible");
    });

    it(' ~ should show correct error message', () => {
      cy.enrollment_create_main_form_name_field_error()
        .should('have.text', "Es besteht bereits eine Anmeldung mit diesem Namen");
    });

    describe(' * should still contain correct values', () => {
      it(' ~ name', () => {
        cy.enrollment_create_main_form_name_field()
          .should("have.value", enrollmentInput.name);
      });

      it(' ~ comment', () => {
        cy.enrollment_create_main_form_comment_field()
          .should("have.value", enrollmentInput.comment);
      });
    });
  });


  describe(' * complete - login', () => {
    before(() => {
      const enrollment_create_fixture = 'enrollment/create/already-enrolled.json';
      cy.enrollment_create_intercept_submit(409, enrollment_create_fixture);
      const fixture = 'appointment/' + link + '.json';
      cy.enrollment_create_intercept_appointment(200, link, fixture);
      cy.navigate_to_enrollment_creation(link);
      cy.enrollment_create_fill_main_form(enrollmentInput);
      cy.enrollment_create_check_form_submit()
        .click();
      cy.saveLocalStorage();
      cy.enrollment_create_login_and_main_form_login()
        .click();
    });

    const url = "/account/login?returnUrl=%2Fenrollment%2Fadd%3Fa%3D" + link + "%26send%3Dtrue";

    it(" ~ should redirect to correct URL", () => {
      cy.on("url:changed", (newUrl) => {
        expect(newUrl).to.contain(url);
      });
    });

    describe(" * login via api and redirect back", () => {
      describe(" * successful ", () => {
        before(() => {
          cy.visit("http://localhost:4200");

          const fixture = 'appointment/' + link + '.json';
          cy.enrollment_create_intercept_appointment(200, link, fixture);
          const enrollment_create_fixture = 'enrollment/create/7980bede-58bf-4f0e-960c-125c48563e5a.json';
          cy.enrollment_create_intercept_submit(201, enrollment_create_fixture);

          const fixture_user_location = "user/gjm-test-protractor-general-enrollmentcreator-user-1.json";
          cy.fixture(fixture_user_location)
            .then(user => {
              cy.keycloack_login_via_api(user.username, user.password);
              cy.visit("http://localhost:4200" + url);
              cy.wait("@enrollment_create_intercept_appointment");
              cy.wait("@enrollment_create_intercept_submit");
            });

          cy.saveLocalStorage();
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

      describe(" * already enrolled ", () => {
        let fixture_user;

        before(() => {
          cy.restoreLocalStorage();

          cy.visit("http://localhost:4200");

          const fixture = 'appointment/' + link + '.json';
          cy.enrollment_create_intercept_appointment(200, link, fixture);
          const enrollment_create_fixture = 'enrollment/create/7980bede-58bf-4f0e-960c-125c48563e5a.json';
          cy.enrollment_create_intercept_submit(201, enrollment_create_fixture);

          // use enrollmentcreator 3, because appointment contains a enrollment of this user
          // error is raised in UI, not in API
          const fixture_user_location = "user/gjm-test-protractor-general-enrollmentcreator-user-3.json";
          cy.fixture(fixture_user_location)
            .then(user => {
              fixture_user = user;

              cy.keycloack_login_via_api(user.username, user.password);
              cy.visit("http://localhost:4200" + url);
              cy.wait("@enrollment_create_intercept_appointment");
              cy.saveLocalStorage();
            });
        });

        beforeEach(() => {
          cy.restoreLocalStorage();
        });

        afterEach(() => {
          cy.saveLocalStorage();
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

        it(' ~ should have correct selfenrollment check', () => {
          cy.enrollment_create_main_form_self_enrollment_field()
            .should('be.checked');
        });

        it(' ~ should have correct submit button attribute', () => {
          cy.enrollment_create_main_form_submit()
            .should("be.disabled");
        });

        describe(' * should still contain correct values', () => {
          it(' ~ name of logged in user', () => {
            cy.enrollment_create_main_form_name_field()
              .should("have.value", fixture_user.firstName + " " + fixture_user.lastName);
          });

          // it(' ~ comment', () => {
          //   cy.enrollment_create_main_form_comment_field()
          //     .should("have.value", enrollmentInput.comment);
          // });
        });
      });
    });
  });
});
