/// <reference types="cypress" />

describe('Appointment - Overview - Navigations', () => {
  describe('* navigate to default appointment', () => {
    const link = "valid";

    describe('* ', () => {
      before(() => {
        const fixture = 'appointment/' + link + '.json';
        cy.appointment_overview_intercept_appointment(200, link, fixture);
        cy.navigate_to_appointment(link);
      });

      describe('* enrollment creation navigation', () => {
        it(' ~ should be present', () => {
          cy.appointment_overview_enrollment_creation_button().should("exist");
        });

        describe(' * on click', () => {
          before(() => {
            cy.appointment_overview_enrollment_creation_button().click();
          });

          it(' ~ should redirect to enrollment creation page', () => {
            const url = '/enrollment/add?a=' + link;
            cy.url()
              .should('include', url);
          });
        });
      });
    });

    describe('* ', () => {
      before(() => {
        const fixture = 'appointment/' + link + '.json';
        cy.appointment_overview_intercept_appointment(200, link, fixture);
        cy.navigate_to_appointment(link);
      });

      describe('* driver overview navigation', () => {
        it(' ~ should not be present', () => {
          cy.appointment_overview_driver_overview_button().should("not.exist");
        });
      });
    });

    describe('* login hint ', () => {
      describe(' * as not logged in user', () => {
        before(() => {
          const fixture = 'appointment/' + link + '.json';
          cy.appointment_overview_intercept_appointment(200, link, fixture);
          cy.navigate_to_appointment(link);
        });

        it(' ~ should be visible', () => {
          cy.appointment_overview_login_hint()
            .should("exist");
        });

        // describe(' * on click', () => {
        //   before(() => {
        //     cy.appointment_overview_login_hint()
        //       .children("button")
        //       .click();
        //   });

        //   it(' ~ should redirect to login page', () => {
        //     const kc_url = Cypress.env('keycloak_url');
        //     const realm = Cypress.env('keycloak_realm');
        //     const url = `${kc_url}realms/${realm}/protocol/openid-connect/auth`;

        //     cy.url().should('include', url);
        //   });
        // });
      });

      describe(' * as not logged in user', () => {
        before(() => {
          const fixture_user_location = "user/gjm-test-protractor-appointment-creator-user.json";
          cy.fixture(fixture_user_location)
            .then(user => {
              const fixture = 'appointment/' + link + '.json';
              cy.appointment_overview_intercept_appointment(200, link, fixture);
              cy.navigate_to_appointment(link, user);
            });
        });

        it(' ~ should not be visible', () => {
          cy.appointment_overview_login_hint()
            .should("not.exist");
        });
      });
    });
  });

  describe('* navigate to driver appointment', () => {
    const link = "valid-driver";

    before(() => {
      const fixture = 'appointment/' + link + '.json';
      cy.appointment_overview_intercept_appointment(200, link, fixture);
      cy.navigate_to_appointment(link);
    });

    describe('* driver overview navigation', () => {
      it(' ~ should be present', () => {
        cy.appointment_overview_driver_overview_button().should("exist");
      });

      describe(' * on click', () => {
        before(() => {
          cy.appointment_overview_driver_overview_button().click();
        });

        it(' ~ should redirect to driver overview page', () => {
          const url = '/appointment/driver?a=' + link;
          cy.url()
            .should('include', url);
        });
      });
    });
  });
});
