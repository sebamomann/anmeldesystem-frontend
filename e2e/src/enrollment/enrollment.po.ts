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

  public setName(value: string) {
    const ref = element(by.id('name'));
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

  public setEmail(value: string) {
    const ref = element(by.id('mail'));
    return ref.clear().then(async () => {
      await ref.sendKeys(value);
    });
  }

  public getNameError() {
    return element(by.id('name-error'));
  }
}
