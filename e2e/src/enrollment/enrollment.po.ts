import {browser, by, element, protractor} from 'protractor';

export class EnrollmentPage {
  public async navigateTo() {
    await browser.get('/enroll?a=protractor'); // NEEDED TO REMOVE "PINNED" Snackbar
    return browser.get('/enroll/add?a=protractor');
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
    return ref.clear().then(async () => {
      await ref.sendKeys(value);
    });
  }

  public submit() {
    return element(by.id('submit')).click();
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

  public getNameError() {
    return element(by.id('name-error'));
  }

  public async login(val: string) {
    browser.get('/account/login');
    const refName = element(by.id('username'));
    await refName.clear().then(async () => {
      await refName.sendKeys(val);
    });
    const refPass = element(by.id('password'));
    await refPass.clear().then(async () => {
      await refPass.sendKeys('123');
    });

    await this.submit();

    return browser.driver.wait(() => browser.driver.getCurrentUrl().then(url => /dashboard/.test(url)), 10000);
  }

  public getSelfEnrollment() {
    return element(by.id('selfEnrollment-input'));
  }
}
