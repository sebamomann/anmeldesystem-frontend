import {browser, by, element, protractor} from 'protractor';
import {HttpClient} from 'protractor-http-client/dist/http-client';

// const request = require('request');

export class EnrollmentPage {
  constructor(private appointmentLink: string) {
  }

  public navigateTo() {
    return browser.get('/enrollment/add?a=' + this.appointmentLink);
  }

  public getMatCardTitle() {
    const EC = protractor.ExpectedConditions;
    const elem = element(by.id('title'));
    browser.wait(EC.visibilityOf(elem), 10000);

    return elem;
  }

  public spinnerGone() {
    const loader = element(by.css('#loading-overlay'));
    const EC = protractor.ExpectedConditions;

    return browser.wait(EC.invisibilityOf(loader), 10000);
  }

  public getName() {
    const EC = protractor.ExpectedConditions;
    const elem = element(by.id('name'));
    browser.wait(EC.visibilityOf(elem), 10000);

    return elem;
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
    const EC = protractor.ExpectedConditions;
    const elem = element(by.id('comment'));
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

  public setName(value: string) {
    const ref = this.getName();
    const EC2 = protractor.ExpectedConditions;
    browser.wait(EC2.elementToBeClickable(ref), 10000, 'Element taking too long to be clickable');

    return ref.clear().then(async () => {
      await ref.sendKeys(value);
    });
  }

  public setEmail(value: string) {
    const ref = element(by.id('mail'));
    const EC2 = protractor.ExpectedConditions;
    browser.wait(EC2.elementToBeClickable(ref), 10000, 'Element taking too long to be clickable');
    return ref.clear().then(async () => {
      await ref.sendKeys(value);
    });
  }

  public async setComment(value: string) {
    const ref = this.getComment();
    return await ref.clear().then(() => ref.sendKeys(value));
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
    const until = protractor.ExpectedConditions;
    const elm = element(by.id('login-mail-form'));
    browser.wait(until.presenceOf(elm), 10000);

    return elm.isPresent();
  }

  public loginAndMailFormLoginContentExists() {
    return element(by.id('login-content')).isPresent();
  }

  public loginAndMailFormLoginContentAltExists() {
    return element(by.id('login-content-alt')).isPresent();
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

  public async login(val: string) {
    const data = {
      username: val,
      password: '123',
    };
    // @ts-ignore

    const http = new HttpClient(await browser.executeScript('return window.env.API_URL;') ? await browser.executeScript('return window.env.API_URL;') : 'http://localhost:3000');

    const res = await http.post('/auth/login', data);
    await browser.executeScript('return window.localStorage.setItem(\'currentUser\', \'' + JSON.stringify(res.body) + '\');');
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
    browser.sleep(100); // TODO ???????? thats dumb, but doesnt work otherwise somehow ....
    const elm = element(by.id('back'));
    const EC2 = protractor.ExpectedConditions;
    browser.wait(EC2.visibilityOf(elm) && EC2.elementToBeClickable(elm), 10000, 'Element taking too long to be clickable');

    return elm.click();
  }

  public goBackCheck() {
    const elm = element(by.id('back_check'));
    const EC2 = protractor.ExpectedConditions;
    browser.wait(EC2.visibilityOf(elm) && EC2.elementToBeClickable(elm), 10000, 'Element taking too long to be clickable');

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

  public clearName() {
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

  async closeLoginSnackbar() {
    browser.driver.wait(() =>
      browser.driver.getCurrentUrl().then(url => /enrollment\/add\?a=url/.test(url.replace(this.appointmentLink, 'url'))), 10000);

    await browser.executeScript('document.getElementsByClassName(\'login-snackbar\')[0].remove();');
  }

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

  public async getCheckName() {
    const until = protractor.ExpectedConditions;
    const elm = element(by.css('.enrollment .user-information .name'));
    browser.wait(until.presenceOf(elm), 10000);
    await browser.wait(this.textNotToBePresentInElement(elm, ''), 5000, 'Element taking too long to appear in the DOM');

    return element(by.css('.enrollment .user-information .name'));
  }

  public async getCheckUsername() {
    const until = protractor.ExpectedConditions;
    const elm = element(by.css('.enrollment .user-information .username'));
    browser.wait(until.presenceOf(elm), 10000);
    await browser.wait(this.textNotToBePresentInElement(elm, ''), 5000, 'Element taking too long to appear in the DOM');

    return element(by.css('.enrollment .user-information .username'));
  }

  public async getCheckComment() {
    const until = protractor.ExpectedConditions;
    const elm = element(by.css('.enrollment .comment'));
    browser.wait(until.presenceOf(elm), 10000);
    await browser.wait(this.textNotToBePresentInElement(elm, ''), 5000, 'Element taking too long to appear in the DOM');

    return element(by.css('.enrollment .comment'));
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
}
