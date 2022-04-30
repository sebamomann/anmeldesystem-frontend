/// <reference types="cypress" />

describe('Appointment - Overview - Menu', () => {
  before(() => {
    cy.visit('http://localhost:4200');
  });

  describe(' * default appointment', () => {
    const link = "valid";

    before(() => {
      const fixture = 'appointment/' + link + '.json';
      cy.appointment_overview_intercept_appointment(200, link, fixture);
      cy.navigate_to_appointment(link);
    });

    describe(' * click on menu', () => {
      before(() => {
        cy.appointment_data_menu_button()
          .click();
      });

      it('~ menu should be open', () => {
        cy.appointment_data_menu_content()
          .should("be.visible");
      });
    });
  });

  describe(' * not logged in', () => {
    const link = "valid";

    before(() => {
      const fixture = 'appointment/' + link + '.json';
      cy.appointment_overview_intercept_appointment(200, link, fixture);
      cy.navigate_to_appointment(link);
    });

    describe(' * click on menu', () => {
      before(() => {
        cy.appointment_data_menu_button()
          .click();
      });

      describe(' * menu items', () => {
        it(' ~ should be 3', () => {
          cy.appointment_data_menu_items()
            .should("have.length", 3);
        });

        it(' ~ should have correct values', () => {
          cy.appointment_data_menu_item_names()
            .as('item-names');

          cy.get('@item-names')
            .eq(0)
            .should('have.text', "Teilen");

          // actual pin behaviour covered in different test
          cy.get('@item-names')
            .eq(1)
            .each(x => {
              expect(x.text()).to.be.oneOf(["Anpinnen", "Entfernen"]);
            });

          cy.get('@item-names')
            .eq(2)
            .should('have.text', "Benachrichtigungen aktivieren");
        });
      });
    });
  });

  describe(' * logged in', () => {
    const link = "valid";

    before(() => {
      const fixture_user_location = "user/gjm-test-protractor-appointment-creator-user.json";
      cy.fixture(fixture_user_location)
        .then(user => {
          cy.keycloack_login_via_api(user.username, user.password);

          const fixture = 'appointment/' + link + '.json';
          cy.appointment_overview_intercept_appointment(200, link, fixture);
          cy.navigate_to_appointment(link);
        });
    });

    describe(' * click on menu', () => {
      before(() => {
        cy.appointment_data_menu_button()
          .click();
      });

      describe(' * menu items', () => {
        it(' ~ should be 4', () => {
          cy.appointment_data_menu_items()
            .should("have.length", 4);
        });

        it(' ~ should have correct values', () => {
          cy.appointment_data_menu_item_names()
            .as('item-names');

          cy.get('@item-names')
            .eq(0)
            .should('have.text', "Teilen");

          // actual pin behaviour covered in different test
          cy.get('@item-names')
            .eq(1)
            .each(x => {
              expect(x.text()).to.be.oneOf(["Anpinnen", "Entfernen"]);
            });

          cy.get('@item-names')
            .eq(2)
            .should('have.text', "Einstellungen");

          cy.get('@item-names')
            .eq(3)
            .should('have.text', "Benachrichtigungen aktivieren");
        });
      });
    });
  });

  describe(' * pin check', () => {
    const link = "valid";

    describe(' * not pinned', () => {
      before(() => {
        window.localStorage.setItem('appointment-pins', JSON.stringify([]));
        window.localStorage.setItem('settings', JSON.stringify({ autoPinAppointment: false }));

        const fixture = 'appointment/' + link + '.json';
        cy.appointment_overview_intercept_appointment(200, link, fixture);
        cy.navigate_to_appointment(link);
      });

      describe(' * click on menu', () => {
        before(() => {
          cy.appointment_data_menu_button()
            .click();
        });

        describe(' * menu item', () => {
          it(' ~ should have correct value', async () => {
            cy.appointment_data_menu_item_by_id("appointment-menu-pin").
              should('have.text', 'Anpinnen');
          });
        });
      });
    });

    describe(' * not pinned', () => {
      before(() => {
        window.localStorage.setItem('appointment-pins', JSON.stringify([link]));
        window.localStorage.setItem('settings', JSON.stringify({ autoPinAppointment: false }));

        const fixture = 'appointment/' + link + '.json';
        cy.appointment_overview_intercept_appointment(200, link, fixture);
        cy.navigate_to_appointment(link);
      });

      describe(' * click on menu', () => {
        before(() => {
          cy.appointment_data_menu_button()
            .click();
        });

        describe(' * menu item', () => {
          it(' ~ should have correct value', () => {
            cy.appointment_data_menu_item_by_id("appointment-menu-pin").
              should('have.text', 'Entfernen');
          });
        });
      });
    });
  });
});
