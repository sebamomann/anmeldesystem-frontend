import {by, element} from 'protractor';

export class AppointmentOverviewMenuPage {
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

  public getMenuItems() {
    return element.all(by.css('.mat-menu-item'));
  }

  public async getMenuItemsNames() {
    const elem = element.all(by.css('.mat-menu-item span'));
    return await elem.map(val => val.getText());
  }
}

