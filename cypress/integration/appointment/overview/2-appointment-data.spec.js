/// <reference types='cypress' />

describe('Appointment - Overview - Appointment Data', () => {
  describe('* default appointment', () => {
    let fixture_appointment = undefined;
    const link = 'valid';

    before(() => {
      const fixture = 'appointment/' + link + '.json';
      cy.fixture(fixture).then(function (appointment) {
        fixture_appointment = appointment;
      });
      cy.appointment_overview_intercept_appointment(200, link, fixture);
      cy.navigate_to_appointment(link);
    });

    it(' ~ should have correct values', () => {
      cy.appointment_data_location()
        .should('have.text', fixture_appointment.location);

      cy.appointment_data_description()
        .should('have.text', fixture_appointment.description);

      cy.appointment_data_creator_name()
        .should('have.text', fixture_appointment.creator.name);

      cy.appointment_data_creator_username()
        .should('have.text', '@' + fixture_appointment.creator.username);
    });

    // TOODO
    // PARSING
    // it('date should be correct', () => {
    //   const date = appointmentPage.getAppointmentDataDate();
    //
    //   const expected = this.convertDateSimilarToDatePipe(date);
    //
    //   expect(date).toBe(date);
    // });
    //
    // it('deadline should be correct', () => {
    //   const location = appointmentPage.getAppointmentDataDeadline();
    //
    //   expect(location).toBe(appointment.deadline);
    // });
  });

  describe(' * appointment without deadline', () => {
    let fixture_appointment = undefined;
    const link = 'valid-no-deadline';

    before(() => {
      const fixture = 'appointment/' + link + '.json';
      cy.fixture(fixture).then(function (appointment) {
        fixture_appointment = appointment;
      });
      cy.appointment_overview_intercept_appointment(200, link, fixture);
      cy.navigate_to_appointment(link);
    });

    it(' ~ deadline should not be present', () => {
      cy.appointment_data_deadline()
        .should('not.exist');
    });
  });

  describe(' * appointment without deadline', () => {
    let fixture_appointment = undefined;
    const link = 'valid-file';

    before(() => {
      const fixture = 'appointment/' + link + '.json';
      cy.fixture(fixture).then(function (appointment) {
        fixture_appointment = appointment;
      });
      cy.appointment_overview_intercept_appointment(200, link, fixture);
      cy.navigate_to_appointment(link);
    });

    it(' ~ should show one file (block)', () => {
      cy.appointment_data_files()
        .should('have.length', 1);
    });

    it(' ~ should have correct filename', () => {
      cy.appointment_data_files()
        .first()
        .children('a')
        .should('have.text', fixture_appointment.files[0].name);
    });


    describe(' * click', () => {
      before(() => {
        cy.appointment_data_files()
          .first()
          .click();
      });

      // it(' ~ should redirect to file', () => {
      //   const url = 'https://localhost:3000/files/2e57b350-78fa-472b-b42f-b1de84dac157';
      //   cy.url().should('include', url);
      // });
    });
  });
});
