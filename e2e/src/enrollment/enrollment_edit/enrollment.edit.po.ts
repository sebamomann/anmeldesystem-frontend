import {browser, by, element, protractor} from 'protractor';
import {HttpClient} from 'protractor-http-client/dist/http-client';

export class EnrollmentEditPage {
  constructor(private appointmentLink: string, private enrollmentId: string) {
  }

  public async navigateTo() {
    return browser.get('/enrollment?a=' + this.appointmentLink + '&e=' + this.enrollmentId)
      .then(() => {
        return this.waitForFormBuild();
      })
      .catch(() => {
      });
  }

  public getMatCardTitle() {
    return element(by.css('#title')).getText();
  }

  public spinnerGone() {
    const loader = element(by.css('#loading-overlay'));
    const EC = protractor.ExpectedConditions;

    return browser.wait(EC.invisibilityOf(loader), 10000);
  }

  public getName() {
    return element(by.id('name'));
  }

  public getUsername() {
    return element(by.id('username'));
  }

  public getComment() {
    return element(by.id('comment'));
  }

  public getSubmit() {
    return element(by.id('submit'));
  }

  public setName(value: string) {
    const ref = this.getName();
    return ref.clear().then(async () => {
      await ref.sendKeys(value);
    });
  }

  public setEmail(value: string) {
    const ref = element(by.id('mail'));
    return ref.clear().then(async () => {
      await ref.sendKeys(value);
    });
  }

  public setComment(value: string) {
    const ref = element(by.id('comment'));
    return ref.clear().then(() => ref.sendKeys(value));
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

  public enrollmentNotFoundCardExists() {
    const until = protractor.ExpectedConditions;
    const elm = element(by.id('enrollment-not-found'));
    browser.wait(until.presenceOf(elm), 10000);

    return element(by.id('enrollment-not-found')).isPresent();
  }

  public loginAndMailFormExists() {
    return element(by.id('login-mail-form')).isPresent();
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
    await browser.wait(until.presenceOf(elem), 5000, 'Element taking too long to appear in the DOM');
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

  public async creatorErrorExists() {
    return element(by.id('creator-error')).isPresent();
  }

  public async login(val: string) {
    const data = {
      username: val,
      password: '123',
    };
    const http = new HttpClient('http://localhost:3000');

    const res = await http.post('/auth/login', data);
    await browser.executeScript('return window.localStorage.setItem(\'currentUser\', \'' + JSON.stringify(res.body) + '\');');
  }

  public getSelfEnrollment() {
    return element(by.id('selfEnrollment-input'));
  }

  public goBack() {
    return element(by.id('back')).click();
  }

  public clickLogin() {
    return element(by.id('login')).click();
  }

  public async fillLoginData(val: string) {
    // wait for login form to be built
    const EC = protractor.ExpectedConditions;
    const e = this.getUsername();

    browser.wait(EC.presenceOf(e), 10000, 'Form could not be loaded');

    const refName = element(by.id('username'));
    refName.clear().then(() => refName.sendKeys(val));
    this.next();

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

  public async clearName() {
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
}
