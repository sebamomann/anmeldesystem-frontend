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

  /**
   * @deprecated
   * centralize
   */
  public pageRedirectedToUrl(url: string) {
    return browser.wait(protractor.ExpectedConditions.urlContains(url), 5000);
  }

  public getSnackbar() {
    const EC = protractor.ExpectedConditions;
    const snackBar = element(by.className('snackbar-default'));
    browser.wait(EC.visibilityOf(snackBar), 10000);

    return element(by.className('snackbar-default'));
  }

  public getErrorSnackbar() { // TODO EC NEEDED?
    const EC = protractor.ExpectedConditions;
    const snackBar = element(by.className('snackbar-error'));
    browser.wait(EC.visibilityOf(snackBar), 10000);

    return element(by.className('snackbar-error'));
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
}
