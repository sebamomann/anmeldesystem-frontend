import { browser, by, element, protractor } from 'protractor';

export class EnrollmentBasePage {
  constructor() {
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

  /**
   * Submit Buttons (next_buttons)
   */
  public nextMain() { // TODO EC NEEDED?
    const elm = element(by.id('next_main'));
    const EC = protractor.ExpectedConditions;
    browser.wait(EC.elementToBeClickable(elm), 10000, 'Element taking too long to be clickable');

    return elm.click();
  }

  /**
   * @deprecated
   * centralize
   */
  public pageRedirectedToUrl(url: string) {
    return browser.wait(protractor.ExpectedConditions.urlContains(url), 5000);
  }

  public getSnackbar() { // TODO EC NEEDED?
    const EC = protractor.ExpectedConditions;
    const snackBar = element(by.tagName('simple-snack-bar'));
    browser.wait(EC.visibilityOf(snackBar), 10000);

    return element(by.tagName('simple-snack-bar'));
  }
}
