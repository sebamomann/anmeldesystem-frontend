/// <reference types="cypress" />

import "cypress-localstorage-commands";

const link = "valid-enrollments-create-user";

const enrollmentInput = {
  name: 'User Enrollment - Foreign enrollment',
  comment: 'User Enrollment Comment'
};

describe('Enrollment - Create - Foreign Enrollment', () => {
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
            cy.navigate_to_enrollment_creation(link, user);
            cy.enrollment_create_fill_forms({ isSelf: false });
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
        it(' ~ enabled name field', () => {
          cy.enrollment_create_main_form_name_field()
            .should("be.enabled");
        });

        it(' ~ unchecked self enrollment', () => {
          cy.enrollment_create_main_form_self_enrollment_field()
            .should("not.be.checked");
        });
      });

      describe(' * should have correct values', () => {
        it(' ~ still contain name of authorized user', () => {
          cy.enrollment_create_main_form_name_field()
            .should("have.value", fixture_user.firstName + " " + fixture_user.lastName);
        });

        it(' ~ empty comment', () => {
          cy.enrollment_create_main_form_comment_field()
            .should("have.value", "");
        });
      });
    });

    describe(' * already enrolled - then uncheck ', () => {
      let fixture_user;

      before(() => {
        const fixture = 'appointment/' + link + '.json';
        cy.enrollment_create_intercept_appointment(200, link, fixture);
        const fixture_user_location = "user/gjm-test-protractor-general-enrollmentcreator-user-3.json";
        cy.fixture(fixture_user_location)
          .then(user => {
            fixture_user = user;
            cy.navigate_to_enrollment_creation(link, user);
            cy.enrollment_create_fill_forms({ isSelf: false });
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

      it(' ~ should not show creator error', () => {
        cy.enrollment_create_main_form_creator_error()
          .should("not.exist");
      });

      describe(' * should have correct attributes', () => {
        it(' ~ enabled name field', () => {
          cy.enrollment_create_main_form_name_field()
            .should("be.enabled");
        });

        it(' ~ unchecked self enrollment', () => {
          cy.enrollment_create_main_form_self_enrollment_field()
            .should("not.be.checked");
        });
      });

      describe(' * should have correct values', () => {
        it(' ~ still contain name of authorized user', () => {
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

    before(() => {
      const fixture = 'appointment/' + link + '.json';
      cy.enrollment_create_intercept_appointment(200, link, fixture);
      const fixture_user_location = "user/gjm-test-protractor-general-enrollmentcreator-user-1.json";
      cy.fixture(fixture_user_location)
        .then(user => {
          cy.navigate_to_enrollment_creation(link, user);
          cy.enrollment_create_fill_forms({ ...enrollmentInput, isSelf: false });
          cy.saveLocalStorage();
        });
    });

    it(' ~ should be present and be visible', () => {
      cy.enrollment_create_check_form()
        .should("exist")
        .should("be.visible");
    });

    describe(' * should contain correct values', () => {
      it(' ~ name', () => {
        cy.enrollment_create_check_form_name()
          .should("have.text", enrollmentInput.name);
      });

      it(' ~ username', () => {
        cy.enrollment_create_check_form_username()
          .should("not.exist");
      });

      it(' ~ comment', () => {
        cy.enrollment_create_check_form_comment()
          .should("have.text", enrollmentInput.comment);
      });
    });
  });

  describe(' * login and mail form', () => {
    let fixture_user;

    before(() => {
      const fixture = 'appointment/' + link + '.json';
      cy.enrollment_create_intercept_appointment(200, link, fixture);
      const fixture_user_location = "user/gjm-test-protractor-general-enrollmentcreator-user-1.json";
      cy.fixture(fixture_user_location)
        .then(user => {
          fixture_user = user;
          cy.navigate_to_enrollment_creation(link, user);
          cy.enrollment_create_fill_forms({ ...enrollmentInput, isSelf: false, check: true });
          cy.saveLocalStorage();
        });
    });

    it(" ~ should exist and be visible", () => {
      cy.enrollment_create_login_and_mail_form()
        .should("exist")
        .should("be.visible");
    });

    it(" ~ should not contain login button", () => {
      cy.enrollment_create_login_and_mail_form_login_block()
        .should("not.exist");
    });

    it(" ~ should contain alternative text", () => {
      cy.enrollment_create_login_and_mail_form_login_alternative_block()
        .should("exist")
        .should("be.visible");
    });
  });

  describe(' * login and mail form - go back', () => {
    let fixture_user;

    before(() => {
      const fixture = 'appointment/' + link + '.json';
      cy.enrollment_create_intercept_appointment(200, link, fixture);
      const fixture_user_location = "user/gjm-test-protractor-general-enrollmentcreator-user-1.json";
      cy.fixture(fixture_user_location)
        .then(user => {
          fixture_user = user;
          cy.navigate_to_enrollment_creation(link, user);
          cy.enrollment_create_fill_forms({ ...enrollmentInput, isSelf: false, check: true });
          cy.enrollment_create_login_and_mail_form_back()
            .click();
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
      it(' ~ enabled name field', () => {
        cy.enrollment_create_main_form_name_field()
          .should("be.enabled");
      });

      it(' ~ unchecked self enrollment', () => {
        cy.enrollment_create_main_form_self_enrollment_field()
          .should("not.be.checked");
      });
    });

    describe(' * should have correct values', () => {
      it(' ~ still contain name of authorized user', () => {
        cy.enrollment_create_main_form_name_field()
          .should("have.value", enrollmentInput.name);
      });

      it(' ~ empty comment', () => {
        cy.enrollment_create_main_form_comment_field()
          .should("have.value", enrollmentInput.comment);
      });
    });
  });

  describe(' * complete', () => {
    let fixture_user;

    before(() => {
      const enrollment_create_fixture = 'enrollment/create/903a9705-3da7-45ef-b062-6fc7292db259.json';
      cy.enrollment_create_intercept_submit(201, enrollment_create_fixture);
      const fixture = 'appointment/' + link + '.json';
      cy.enrollment_create_intercept_appointment(200, link, fixture);
      const fixture_user_location = "user/gjm-test-protractor-general-enrollmentcreator-user-1.json";
      cy.fixture(fixture_user_location)
        .then(user => {
          fixture_user = user;
          cy.navigate_to_enrollment_creation(link, user);
          cy.enrollment_create_fill_forms({ ...enrollmentInput, isSelf: false, check: true, mail: "mail@example.com" });
          cy.wait("@enrollment_create_intercept_submit");
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

      expect(id).to.equal('903a9705-3da7-45ef-b062-6fc7292db259');
      expect(token).to.equal('mytoken');
      expect(_link).to.equal(link);
    });
  });

  describe(' * complete - already enrolled', () => {
    let fixture_user;

    before(() => {
      const enrollment_create_fixture = 'enrollment/create/foreign-enrollment-already-enrolled.json';
      cy.enrollment_create_intercept_submit(409, enrollment_create_fixture);
      const fixture = 'appointment/' + link + '.json';
      cy.enrollment_create_intercept_appointment(200, link, fixture);
      const fixture_user_location = "user/gjm-test-protractor-general-enrollmentcreator-user-1.json";
      cy.fixture(fixture_user_location)
        .then(user => {
          fixture_user = user;
          cy.navigate_to_enrollment_creation(link, user);
          cy.enrollment_create_fill_forms({ ...enrollmentInput, isSelf: false, check: true, mail: "mail@example.com" });
          cy.wait("@enrollment_create_intercept_submit");
        });
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


    describe(' * should have correct attributes', () => {
      it(' ~ enabled name field', () => {
        cy.enrollment_create_main_form_name_field()
          .should("be.enabled");
      });

      it(' ~ unchecked self enrollment', () => {
        cy.enrollment_create_main_form_self_enrollment_field()
          .should("not.be.checked");
      });
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
});
