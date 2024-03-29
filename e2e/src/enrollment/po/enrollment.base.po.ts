import { BasePage } from './../../base.po';
import { browser, by, element, protractor } from 'protractor';

export class EnrollmentBasePage extends BasePage {
  constructor() {
    super();
  }

  public waitForLoadingSpinnerToBeGone() {
    const loader = element(by.css('#loading-overlay'));
    const EC = protractor.ExpectedConditions;

    browser.wait(EC.visibilityOf(loader), 5000, 'Loading Spinner did not appear');
    browser.wait(EC.invisibilityOf(loader), 5000, 'Loading Spinner did not disappear');
  }

  public isAppointmentNotFoundCardPresent() {
    const elem = element(by.id('appointment-not-found'));
    return elem.isPresent();
  }

  public isEnrollmentNotFoundCardPresent() {
    const elem = element(by.id('enrollment-not-found'));
    return elem.isPresent();
  }

  /** FORM */
  /** FORM */
  /** FORM */
  /** FORM */
  /** FORM */
  public waitForFormBuild() {
    const EC = protractor.ExpectedConditions;
    const e = this.getName();

    return browser.wait(EC.presenceOf(e), 10000, 'Form could not be loaded');
  }

  public getMatCardTitle() {
    return element(by.id('title')).getText();
  }

  public getName() {
    return element(by.id('name'));
  }

  public async getNameValue() {
    return this.getName().getAttribute('value');
  }

  public async setName(value: string) {
    const ref = this.getName();

    return ref.clear().then(async () => {
      await ref.sendKeys(value);
    });
  }

  public async getNameErrorValue() {
    const elm = await this.getNameError();
    return elm.getText();
  }

  public async getNameError() {
    const elem = element(by.id('name-error'));
    const until = protractor.ExpectedConditions;
    browser.wait(until.presenceOf(elem), 5000, 'Element taking too long to appear in the DOM');
    await browser.wait(this.textNotToBePresentInElement(elem, ''), 5000, 'Element taking too long to appear in the DOM');
    return elem;
  }

  public isNameEnabled() {
    return this.getName().isEnabled();
  }

  public getComment() {
    return element(by.id('comment'));
  }

  public async getCommentValue() {
    return this.getComment().getAttribute('value');
  }


  public async setComment(value: string) {
    const ref = this.getComment();

    return ref.clear().then(async () => {
      await ref.sendKeys(value);
    });
  }

  public async nextMain() {
    return this.buttonClick('next_main')
  }

  public async waitForButtonToBeClickable(buttonId: string) {
    const elem = element(by.id(buttonId));
    const EC = protractor.ExpectedConditions;
    return browser.wait(EC.elementToBeClickable(elem), 10000);
  }

  /** ADDITIONS */
  /** ADDITIONS */

  public async selectAddition(id: string) {
    const elm = this.getAdditionElement(id);

    if ((await elm.isSelected() === false)) {
      return browser.executeScript('arguments[0].click();', elm.getWebElement());
    }

    return Promise.resolve();
  }

  public getAdditionElement(id: string) {
    const elem = element(by.id('addition-' + id + '-input'));
    const EC = protractor.ExpectedConditions;
    browser.wait(EC.visibilityOf(elem), 10000);

    return elem;
  }

  public async deselectAddition(id: string) {
    const elm = this.getAdditionElement(id);

    if ((await elm.isSelected() === true)) {
      return browser.executeScript('arguments[0].click();', elm.getWebElement());
    }

    return Promise.resolve();
  }

  public isAdditionSelected(id: string) {
    const elem = element(by.id('addition-' + id + '-input'));
    return elem.isSelected();
  }

  public getAdditionInput(id: string) {
    const elem = element(by.id('addition-' + id + '-input'));
    return elem;
  }

  public getAdditionValue(id: string) {
    const elem = element(by.css('#addition-' + id + ' .mat-checkbox-label'));
    return elem.getText();
  }

  public nextAdditions() {
    return this.buttonClick('next_additions')
  }

  public textNotToBePresentInElement(elem, text) {
    return async () => {
      const textreceived = await elem.getText();
      const bool = textreceived === text;
      return !(bool);
    };
  };

  public causeEmptyErrorName() {
    const ref = this.getName();

    ref.sendKeys(protractor.Key.chord(protractor.Key.CONTROL, 'a'));
    ref.sendKeys(protractor.Key.BACK_SPACE);

    ref.clear();

    element(by.id('title')).click();
  }

  public buttonClick(id: string) {
    const elm = element(by.id(id));

    const EC = protractor.ExpectedConditions;
    browser.wait(EC.elementToBeClickable(elm), 10000, `Button with ID '${id}' taking too long to be clickable`);

    return elm.click();
  }

  /** DRIVER AND PASSENGER */
  /** DRIVER AND PASSENGER */
  /** DRIVER AND PASSENGER */
  /** DRIVER AND PASSENGER */
  /** DRIVER AND PASSENGER */

  public driverFormExists() {
    const until = protractor.ExpectedConditions;
    const elm = element(by.id('driver-form-wrapper'));
    browser.wait(until.presenceOf(elm), 10000);

    return elm.isPresent();
  }

  public getDriverCheckbox() {
    const elem = element(by.css('#driver-input'));
    const EC = protractor.ExpectedConditions;
    browser.wait(EC.visibilityOf(elem), 10000);

    return elem;
  }

  public async isDriverCheckboxSelected() {
    const elm = element(by.css('#driver-input'));
    return elm.isSelected();
  }

  public async deselectDriver() {
    const elm = this.getDriverCheckbox();
    if ((await elm.isSelected() === true)) {
      return browser.executeScript('arguments[0].click();', elm.getWebElement());
    }

    return Promise.resolve();
  }

  public async selectDriver() {
    const elm = this.getDriverCheckbox();
    if ((await elm.isSelected() === false)) {
      return browser.executeScript('arguments[0].click();', elm.getWebElement());
    }

    return Promise.resolve();
  }

  /** DRIVER */
  /** DRIVER */

  public getDriverService() {
    return element(by.css('.mat-select-value-text span'));
  }

  public selectDriverValue(val: string) {
    const EC = protractor.ExpectedConditions;
    const elem = element(by.id('service-select'));
    browser.wait(EC.elementToBeClickable(elem), 10000);
    elem.click();

    const elem2 = element(by.cssContainingText('.mat-option-text', val));
    browser.wait(EC.visibilityOf(elem2), 10000);

    return elem2.click();
  }

  public getSeats() {
    return element(by.id('seats'));
  }

  public async getSeatsValue() {
    return this.getSeats().getAttribute('value');
  }

  public async setSeats(val: number) {
    const ref = this.getSeats();
    const EC2 = protractor.ExpectedConditions;
    browser.wait(EC2.elementToBeClickable(ref), 10000, 'Element taking too long to be clickable');

    await ref.clear();
    await ref.sendKeys(val);
  }

  public getServiceSelectValue() {
    const elm = element(by.css('#service-select .mat-select-value-text span'));
    return elm.getText();
  }

  public isServiceSelectEmpty() {
    const elm = element(by.css('#service-select .mat-select-placeholder'));
    return elm.isPresent();
  }

  public nextDriver() {
    return this.buttonClick('next_driver')
  }

  /** PASSENGER */
  /** PASSENGER */

  public selectPassengerValue(val: string) {
    const EC = protractor.ExpectedConditions;
    const elem = element(by.id('requirement-select'));
    browser.wait(EC.elementToBeClickable(elem), 10000);
    elem.click();

    const elem2 = element(by.cssContainingText('.mat-option-text', val));
    browser.wait(EC.visibilityOf(elem2), 10000);

    return elem2.click();
  }

  public passengerFormExists() {
    const until = protractor.ExpectedConditions;
    const elm = element(by.id('passenger-form-wrapper'));
    browser.wait(until.presenceOf(elm), 10000);

    return elm.isPresent();
  }

  public getRequirementSelectValue() {
    const elm = element(by.css('#requirement-select .mat-select-value-text'));
    return elm.getText();
  }

  public isRequirementSelectEmpty() {
    const elm = element(by.css('#requirement-select .mat-select-placeholder'));
    return elm.isPresent();
  }
}
