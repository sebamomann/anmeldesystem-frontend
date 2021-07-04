import {by, element} from 'protractor';

export class AppointmentOverviewDataPage {
  constructor() {
  }

  public openAppointmentMenu() {
    const elem = element(by.id('appointment_menu'));
    return elem.click();
  }

  public isMenuOpened() {
    const elem = element(by.css('.mat-menu-content'));
    return elem.isPresent();
  }

  public getElementAppointmentData() {
    return element(by.css('.appointment-data'));
  }

  public getAppointmentDataLocation() {
    const appointmentDataElement = this.getElementAppointmentData();
    const locationElement = appointmentDataElement.element(by.css('.appointment_location span'));

    return locationElement.getText();
  }

  public getAppointmentDataDate() {
    const appointmentDataElement = this.getElementAppointmentData();
    const dateElement = appointmentDataElement.element(by.css('.appointment_date span'));

    return dateElement.getText();
  }

  public getAppointmentDataDeadline() {
    const appointmentDataElement = this.getElementAppointmentData();
    const deadlineElement = appointmentDataElement.element(by.css('.appointment_deadline span'));

    return deadlineElement.getText();
  }

  public getAppointmentDataCreatorName() {
    const appointmentDataElement = this.getElementAppointmentData();
    const nameElement = appointmentDataElement.element(by.css('.appointment_creator .name'));

    return nameElement.getText();
  }

  public getAppointmentDataCreatorUsername() {
    const appointmentDataElement = this.getElementAppointmentData();
    const usernameElement = appointmentDataElement.element(by.css('.appointment_creator .username'));

    return usernameElement.getText();
  }

  public isAppointmentDataDeadlinePresent() {
    const appointmentDataElement = this.getElementAppointmentData();
    const deadlineElement = appointmentDataElement.element(by.css('.appointment_creator .deadline'));

    return deadlineElement.isPresent();
  }

  public getFileBlocks() {
    return element.all(by.css('.file'));
  }

  public clickFirstFile() {
    const elements = element.all(by.css('.file'));
    elements.first().click();
  }
}

