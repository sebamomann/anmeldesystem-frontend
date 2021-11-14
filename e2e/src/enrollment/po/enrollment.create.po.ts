import { browser, by, element, protractor } from 'protractor';
import { EnrollmentBasePage } from './enrollment.base.po';

// const request = require('request');

export class EnrollmentCreatePage extends EnrollmentBasePage {
  constructor() {
    super();
  }

  public async navigateToEnrollmentCreation(link: string) {
    return new Promise<void>((resolve, reject) => {
      browser.get('/enrollment/add?a=' + link)
        .then(
          _ => {
            this.waitForLoadingSpinnerToBeGone();

            resolve();
          })
        .catch(
          _ => {
            reject();
          }
        );
    }
    );
  }

  public spinnerGone() {
    const loader = element(by.css('#loading-overlay'));
    const EC = protractor.ExpectedConditions;

    return browser.wait(EC.invisibilityOf(loader), 10000);
  }



  public getSeats() {
    return element(by.id('seats'));
  }

  public async getSeatsValue() {
    return this.getSeats().getAttribute('value');
  }

  public getUsername() {
    const EC = protractor.ExpectedConditions;
    const elem = element(by.id('username'));
    browser.wait(EC.visibilityOf(elem), 10000);

    return elem;
  }

  public getSubmit() {
    return element(by.id('submit'));
  }

  public getNextMain() {
    const EC = protractor.ExpectedConditions;
    const elem = element(by.id('next_main'));
    browser.wait(EC.visibilityOf(elem), 10000);

    return elem;
  }


  public async setEmail(value: string) {
    const ref = this.getMail();
    const EC2 = protractor.ExpectedConditions;
    browser.wait(EC2.elementToBeClickable(ref), 2000, 'Element taking too long to be clickable');
    return ref.clear().then(async () => {
      await ref.sendKeys(value);
    });
  }

  /**
   * @todo mail_submit?
   * @returns
   */
  public submit() {
    const elm = element(by.id('submit'));
    const EC = protractor.ExpectedConditions;
    browser.wait(EC.elementToBeClickable(elm), 10000, 'Element taking too long to be clickable');

    return elm.click();
  }

  public getUrl() {
    return browser.driver.getCurrentUrl();
  }

  public appointmentNotFoundCardExists() {
    const until = protractor.ExpectedConditions;
    const elm = element(by.id('appointment-not-found'));
    browser.wait(until.presenceOf(elm), 10000);

    return element(by.id('appointment-not-found')).isPresent();
  }

  public loginAndMailFormExists() {
    // const until = protractor.ExpectedConditions;
    const elm = element(by.id('login-mail-form'));
    // browser.wait(until.presenceOf(elm), 10000);

    return elm.isPresent();
  }

  public loginAndMailFormLoginContentExists() {
    return element(by.id('login-content')).isPresent();
  }

  public loginAndMailFormLoginContentAltExists() {
    return element(by.id('login-content-alt')).isPresent();
  }

  public async getMailErrorValue() {
    const elm = await this.getMailError();
    return elm.getText();
  };

  public async getMailError() {
    const elem = element(by.id('mail-error'));
    const until = protractor.ExpectedConditions;
    browser.wait(until.presenceOf(elem), 5000, 'Element taking too long to appear in the DOM');
    await browser.wait(this.textNotToBePresentInElement(elem, ''), 5000, 'Element taking too long to appear in the DOM');
    return elem;
  }

  public getCreatorErrorValue() {
    const elem = element(by.id('creator-error'));
    return elem.getText();
  }

  public async getCreatorError() {
    const elem = element(by.id('creator-error'));
    const until = protractor.ExpectedConditions;
    await browser.wait(until.presenceOf(elem), 5000, 'Element taking too long to appear in the DOM');
    await browser.wait(this.textNotToBePresentInElement(elem, ''), 5000, 'Element taking too long to appear in the DOM');

    return elem;
  }

  public isSelfEnrollmentSelected() {
    const elem = this.getSelfEnrollment();
    return elem.isSelected();
  }


  public getSelfEnrollment() {
    const EC = protractor.ExpectedConditions;
    const elem = element(by.id('selfEnrollment-input'));
    browser.wait(EC.visibilityOf(elem), 10000);

    return element(by.id('selfEnrollment-input'));
  }

  /**
   * @deprecated TODO
   * @todo back_mail?
   * @returns
   */
  public goBack() {
    const elm = element(by.id('back'));
    return elm.click();
  }

  public goBackCheck() {
    const elm = element(by.id('back_check'));
    return elm.click();
  }

  public goBackAdditions() {
    const elm = element(by.id('back_additions'));
    return elm.click();
  }

  public clickLogin() {
    const elm = element(by.id('login'));
    const EC2 = protractor.ExpectedConditions;
    browser.wait(EC2.elementToBeClickable(elm), 10000, 'Element taking too long to be clickable');

    return elm.click();
  }

  public async fillLoginData(val: string) {
    // wait for login form to be built
    const EC = protractor.ExpectedConditions;
    const e = this.getUsername();

    browser.wait(EC.presenceOf(e), 10000, 'Form could not be loaded');

    const refName = element(by.id('username'));
    refName.clear().then(() => refName.sendKeys(val));

    await this.next();

    const elm = element(by.id('password'));
    const EC2 = protractor.ExpectedConditions;
    browser.wait(EC2.elementToBeClickable(elm), 10000, 'Element taking too long to be clickable');
    elm.clear().then(() => elm.sendKeys('123'));

    await this.submit();
  }

  public async logout() {
    await browser.executeScript('window.localStorage.clear();');
  }

  public isMainFormPresent() {
    const elem = element(by.id('main-form'));
    return elem.isPresent();
  }

  public async deselectSelfEnrollment() {
    const elm = this.getSelfEnrollment();
    if ((await elm.isSelected() === true)) {
      return browser.executeScript('arguments[0].click();', elm.getWebElement());
    }

    return Promise.resolve();
  }

  public async selectSelfEnrollment() {
    const elm = this.getSelfEnrollment();
    if ((await elm.isSelected() === false)) {
      return browser.executeScript('arguments[0].click();', elm.getWebElement());
    }

    return Promise.resolve();
  }

  //
  // async closeLoginSnackbar() {
  //   browser.driver.wait(() =>
  //     browser.driver.getCurrentUrl().then(url => /enrollment\/add\?a=url/.test(url.replace(this.appointmentLink, 'url'))), 10000);
  //
  //   await browser.executeScript('document.getElementsByClassName(\'login-snackbar\')[0].remove();');
  // }

  public textNotToBePresentInElement(elem, text) {
    return async () => {
      const textreceived = await elem.getText();
      const bool = textreceived === text;
      return !(bool);
    };
  };

  public next() {
    return this.buttonClick('next')
  }

  public nextCheck() {
    return this.buttonClick('next_check')
  }

  public nextDriver() {
    return this.buttonClick('next_driver')
  }

  public getCheckNameValue() {
    const elm = element(by.css('.enrollment .user-information .name'));
    return elm.getText();
  }

  public getCheckCommentValue() {
    const elm = element(by.css('.enrollment .comment'));
    return elm.getText();
  }

  public getCheckUsername() {
    const elm = element(by.css('.enrollment .user-information .username'));
    return elm.getText();
  }

  public waitForDriverPassengerFormToBePresent(): void {
    const EC = protractor.ExpectedConditions;
    const elem = element(by.css('app-enrollment-driver-passenger'));

    browser.wait(EC.presenceOf(elem), 10000, 'Element taking too long to be present');
  }

  getCheckboxes() {
    const EC = protractor.ExpectedConditions;
    const elem = element.all(by.css('.addition-checkbox'));

    browser.wait(EC.presenceOf(elem.get(0)), 10000, 'Element taking too long to be present');

    return elem;
  }

  isAdditionChecked(s: string) {
    const elm = element(by.css('[addition-index="' + s + '"] .mat-checkbox-checked'));
    return elm.isPresent();
  }

  /**
   * @deprecated isSelected() // needs to be created
   */
  isAdditionUnchecked(s: string) {
    const elm = element(by.css('[addition-index="' + s + '"] .mat-checkbox'));
    return elm.isPresent();
  }

  getDriverCheckbox() {
    const elem = element(by.css('#driver-input'));
    const EC = protractor.ExpectedConditions;
    browser.wait(EC.visibilityOf(elem), 10000);

    return elem;
  }

  selectPassengerValue(val: string) {
    const EC = protractor.ExpectedConditions;
    const elem = element(by.id('requirement-select'));
    browser.wait(EC.elementToBeClickable(elem), 10000);
    elem.click();

    const elem2 = element(by.cssContainingText('.mat-option-text', val));
    browser.wait(EC.visibilityOf(elem2), 10000);

    return elem2.click();
  }

  passengerFormExists() {
    const until = protractor.ExpectedConditions;
    const elm = element(by.id('passenger-form-wrapper'));
    browser.wait(until.presenceOf(elm), 10000);

    return elm.isPresent();
  }

  driverFormExists() {
    const until = protractor.ExpectedConditions;
    const elm = element(by.id('driver-form-wrapper'));
    browser.wait(until.presenceOf(elm), 10000);

    return elm.isPresent();
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

  setSeats(val: number) {
    const ref = this.getSeats();
    const EC2 = protractor.ExpectedConditions;
    browser.wait(EC2.elementToBeClickable(ref), 10000, 'Element taking too long to be clickable');

    return ref.clear().then(async () => {
      await ref.sendKeys(val);
    });
  }

  driverIconExists() {
    const until = protractor.ExpectedConditions;
    const elm = element(by.css('.isDriver-icon'));
    browser.wait(until.presenceOf(elm), 10000);

    return elm.isPresent();
  }

  getDriverService() {
    return element(by.css('.mat-select-value-text span'));
  }

  getPassengerRequirement() {
    return element(by.css('.mat-select-value-text span'));
  }

  selectDriverValue(val: string) {
    const EC = protractor.ExpectedConditions;
    const elem = element(by.id('service-select'));
    browser.wait(EC.elementToBeClickable(elem), 10000);
    elem.click();

    const elem2 = element(by.cssContainingText('.mat-option-text', val));
    browser.wait(EC.visibilityOf(elem2), 10000);

    return elem2.click();
  }

  public getMail() {
    return element(by.id('mail'));
  }


  public getAdditionCheckSelected(id: string) {
    const elm = element(by.css('.addition-list .addition-index-' + id + ' .checkbox_selected'));
    return elm.isPresent();
  }

  public async isDriverCheckboxSelected() {
    const elm = element(by.css('#driver-input'));
    return elm.isSelected();
  }

  public getRequirementSelectValue() {
    const elm = element(by.css('#requirement-select .mat-select-value-text'));
    return elm.getText();
  }

  public getServiceSelectValue() {
    const elm = element(by.css('#service-select .mat-select-value-text'));
    return elm.getText();
  }

  public isRequirementSelectEmpty() {
    const elm = element(by.css('#requirement-select .mat-select-placeholder'));
    return elm.isPresent();
  }

  public async selectDriverCheckbox() {
    const elm = this.getDriverCheckbox();
    if ((await elm.isSelected() === false)) {
      return browser.executeScript('arguments[0].click();', elm.getWebElement());
    }

    return Promise.resolve();
  }

  public isServiceSelectEmpty() {
    const elm = element(by.css('#service-select .mat-select-placeholder'));
    return elm.isPresent();
  }

  public isEnrollmentCheckCardPreset() {
    const elem = element(by.id('enrollment-check-card'));
    return elem.isPresent();
  }
}
