import {browser, by, element, protractor} from 'protractor';

// const request = require('request');

export class EnrollmentCreationPage {
  constructor() {
  }

  public async navigateToEnrollmentCreation(link: string) {
    return new Promise((resolve, reject) => {
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

  public waitForLoadingSpinnerToBeGone() {
    const loader = element(by.css('#loading-overlay'));
    const EC = protractor.ExpectedConditions;

    browser.wait(EC.visibilityOf(loader), 5000, 'Loading Spinner did not appear');
    browser.wait(EC.invisibilityOf(loader), 5000, 'Loading Spinner did not disappear');
  }

  public getMatCardTitle() {
    return element(by.id('title')).getText();
  }

  public spinnerGone() {
    const loader = element(by.css('#loading-overlay'));
    const EC = protractor.ExpectedConditions;

    return browser.wait(EC.invisibilityOf(loader), 10000);
  }

  public getName() {
    return element(by.id('name'));
  }

  public async getNameValue() {
    return this.getName().getAttribute('value');
  }

  public getSeats() {
    const EC = protractor.ExpectedConditions;
    const elem = element(by.id('seats'));
    browser.wait(EC.visibilityOf(elem), 10000);

    return elem;
  }

  public getUsername() {
    const EC = protractor.ExpectedConditions;
    const elem = element(by.id('username'));
    browser.wait(EC.visibilityOf(elem), 10000);

    return elem;
  }

  public getComment() {
    return element(by.id('comment'));
  }

  public async getCommentValue() {
    return this.getComment().getAttribute('value');
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

  public async setName(value: string) {
    const ref = this.getName();
    // const EC2 = protractor.ExpectedConditions;
    // browser.wait(EC2.elementToBeClickable(ref), 2000, 'Element taking too long to be clickable');

    return ref.clear().then(async () => {
      await ref.sendKeys(value);
    });
  }

  public async setEmail(value: string) {
    const ref = this.getMail();
    const EC2 = protractor.ExpectedConditions;
    browser.wait(EC2.elementToBeClickable(ref), 2000, 'Element taking too long to be clickable');
    return ref.clear().then(async () => {
      await ref.sendKeys(value);
    });
  }

  public async setComment(value: string) {
    const ref = this.getComment();
    const EC2 = protractor.ExpectedConditions;
    browser.wait(EC2.elementToBeClickable(ref), 2000, 'Element taking too long to be clickable');

    return ref.clear().then(async () => {
      await ref.sendKeys(value);
    });
  }

  public submit() {
    const elm = element(by.id('submit'));
    const EC = protractor.ExpectedConditions;
    browser.wait(EC.elementToBeClickable(elm), 10000, 'Element taking too long to be clickable');

    return elm.click();
  }

  public getUrl() {
    return browser.driver.getCurrentUrl();
  }

  public getSnackbar() {
    const EC = protractor.ExpectedConditions;
    const snackBar = element(by.tagName('simple-snack-bar'));
    browser.wait(EC.visibilityOf(snackBar), 10000);

    return element(by.tagName('simple-snack-bar'));
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

  public getNameErrorValue() {
    const elm = element(by.id('name-error'));
    return elm.getText();
  }

  public async getNameError() {
    const elem = element(by.id('name-error'));
    const until = protractor.ExpectedConditions;
    browser.wait(until.presenceOf(elem), 5000, 'Element taking too long to appear in the DOM');
    await browser.wait(this.textNotToBePresentInElement(elem, ''), 5000, 'Element taking too long to appear in the DOM');
    return elem;
  }

  public async getMailError() {
    const elem = element(by.id('mail-error'));
    const until = protractor.ExpectedConditions;
    browser.wait(until.presenceOf(elem), 5000, 'Element taking too long to appear in the DOM');
    await browser.wait(this.textNotToBePresentInElement(elem, ''), 5000, 'Element taking too long to appear in the DOM');
    return elem;
  }

  public async getCreatorError() {
    const elem = element(by.id('creator-error'));
    const until = protractor.ExpectedConditions;
    await browser.wait(until.presenceOf(elem), 5000, 'Element taking too long to appear in the DOM');
    await browser.wait(this.textNotToBePresentInElement(elem, ''), 5000, 'Element taking too long to appear in the DOM');
    return elem;
  }

  public getSelfEnrollment() {
    const EC = protractor.ExpectedConditions;
    const elem = element(by.id('selfEnrollment-input'));
    browser.wait(EC.visibilityOf(elem), 10000);

    return element(by.id('selfEnrollment-input'));
  }

  public getAddition(id: string) {
    const EC = protractor.ExpectedConditions;
    const elem = element(by.id('addition-' + id + '-input'));
    browser.wait(EC.visibilityOf(elem), 10000);

    return elem;
  }

  public goBack() {
    const elm = element(by.id('back'));
    return elm.click();
  }

  public goBackCheck() {
    const elm = element(by.id('back_check'));
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

  public waitForFormBuild() {
    const EC = protractor.ExpectedConditions;
    const e = this.getName();

    return browser.wait(EC.presenceOf(e), 10000, 'Form could not be loaded');
  }

  public isMainFormPresent() {
    const elem = element(by.id('main-form'));
    return elem.isPresent();
  }

  public async causeEmptyErrorName() {
    const ref = this.getName();

    ref.sendKeys(protractor.Key.chord(protractor.Key.CONTROL, 'a'));
    ref.sendKeys(protractor.Key.BACK_SPACE);

    return ref.clear();
  }

  public async deselectSelfEnrollment() {
    const elm = this.getSelfEnrollment();
    if ((await elm.isSelected() === true)) {
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
    const elm = element(by.id('next'));
    const EC = protractor.ExpectedConditions;
    browser.wait(EC.elementToBeClickable(elm), 10000, 'Element taking too long to be clickable');

    return elm.click();
  }

  public nextMain() {
    const elm = element(by.id('next_main'));
    const EC = protractor.ExpectedConditions;
    browser.wait(EC.elementToBeClickable(elm), 10000, 'Element taking too long to be clickable');

    return elm.click();
  }

  public nextCheck() {
    const elm = element(by.id('next_check'));
    const EC = protractor.ExpectedConditions;
    browser.wait(EC.elementToBeClickable(elm), 10000, 'Element taking too long to be clickable');

    return elm.click();
  }

  public nextAdditions() {
    const elm = element(by.id('next_additions'));
    const EC = protractor.ExpectedConditions;
    browser.wait(EC.elementToBeClickable(elm), 10000, 'Element taking too long to be clickable');

    return elm.click();
  }

  public nextDriver() {
    const elm = element(by.id('next_driver'));
    const EC = protractor.ExpectedConditions;
    browser.wait(EC.elementToBeClickable(elm), 10000, 'Element taking too long to be clickable');

    return elm.click();
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

  getCheckboxes() {
    const EC = protractor.ExpectedConditions;
    const elem = element.all(by.css('.addition-checkbox'));

    browser.wait(EC.presenceOf(elem.get(0)), 10000, 'Element taking too long to be present');

    return elem;
  }

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

  getAdditionCheckSelected(s: string) {
    const elm = element(by.css('.addition-list .addition-index-' + s + ' .checkbox_selected'));
    const EC = protractor.ExpectedConditions;
    browser.wait(EC.visibilityOf(elm), 10000);

    return elm.isPresent();
  }


  getAdditionCheckDeselected(s: string) {
    const elm = element(by.css('.addition-list .addition-index-' + s + ' .checkbox_blank'));
    const EC = protractor.ExpectedConditions;
    browser.wait(EC.visibilityOf(elm), 10000);

    return elm.isPresent();
  }

  getDriverCheckbox() {
    const EC = protractor.ExpectedConditions;
    const elem = element(by.id('driver-input'));
    browser.wait(EC.elementToBeClickable(elem), 10000);

    return element(by.id('driver-input'));
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

  async selectDriver() {
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

  public isAppointmentNotFoundCardPresent() {
    const elem = element(by.id('appointment-not-found'));
    return elem.isPresent();
  }

  public isEnrollmentCheckCardPreset() {
    const elem = element(by.id('enrollment-check-card'));
    return elem.isPresent();
  }

  public getMail() {
    return element(by.id('mail'));
  }

  public isNameEnabled() {
    return this.getName().isEnabled();
  }
}
