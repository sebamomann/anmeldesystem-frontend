import {browser, by, element, protractor} from 'protractor';

export class EnrollmentPage {
  public async navigateTo() {
    browser.get('/enroll/add?a=protractor')
      .then(() => {
        const EC = protractor.ExpectedConditions;
        const e = this.getName();

        return browser.wait(EC.presenceOf(e), 10000, 'Form could not be loaded');
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

  public loginAndMailFormExists() {
    return element(by.id('login-mail-form')).isPresent();
  }

  public async getNameError() {
    const elem = element(by.id('name-error'));
    const until = protractor.ExpectedConditions;
    await browser.wait(until.presenceOf(elem), 5000, 'Element taking too long to appear in the DOM');
    return elem;
  }

  public async getCreatorError() {
    const elem = element(by.id('creator-error'));
    const until = protractor.ExpectedConditions;
    await browser.wait(until.presenceOf(elem), 5000, 'Element taking too long to appear in the DOM');
    return elem;
  }

  public async login(val: string) {
    browser.get('/account/login');

    const refName = element(by.id('username'));
    refName.clear().then(() => refName.sendKeys(val));
    const refPass = element(by.id('password'));
    refPass.clear().then(() => refPass.sendKeys('123'));

    this.submit();

    return browser.driver.wait(() => browser.driver.getCurrentUrl().then(url => /dashboard/.test(url)), 10000);
  }

  public getSelfEnrollment() {
    return element(by.id('selfEnrollment-input'));
  }
}
