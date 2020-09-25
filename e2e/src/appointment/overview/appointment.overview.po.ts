import {browser, by, element, protractor} from 'protractor';

export class AppointmentOverviewPage {
  constructor(private appointmentLink: string) {
  }

  public async navigateTo() {
    return browser.get('/enroll?a=' + this.appointmentLink)
      .then(() => {
        return this.spinnerGone();
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
    browser.get('/account/login');

    await this.fillLoginData(val);

    return browser.driver.wait(() => browser.driver.getCurrentUrl().then(url => /dashboard/.test(url)), 10000);
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

  public logout() {
    return browser.get('/account/logout');
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

  getEnrollments() {
    const EC = protractor.ExpectedConditions;
    const elem = element.all(by.css('.enrollment'));

    browser.wait(EC.presenceOf(elem.get(0)), 10000, 'Element taking too long to be present');

    return elem;
  }

  async getEnrollmentUsername(id: string) {
    const elem = element(by.css('[enrollment-id=' + id + '] .user-information .username'));

    const EC = protractor.ExpectedConditions;
    browser.wait(EC.presenceOf(elem), 10000, 'Element taking too long to be present');
    await browser.wait(this.textNotToBePresentInElement(elem, ''), 5000, 'Element taking too long to appear in the DOM');

    return elem;
  }

  async getEnrollmentName(id: string) {
    const elem = element(by.css('[enrollment-id="' + id + '"].enrollment .user-information .name'));

    const EC = protractor.ExpectedConditions;
    browser.wait(EC.presenceOf(elem), 10000, 'Element taking too long to be present');
    await browser.wait(this.textNotToBePresentInElement(elem, ''), 5000, 'Element taking too long to appear in the DOM');

    return elem;
  }

  enrollmentUsernamePresent(id: string) {
    const elem = element(by.css('[enrollment-id="' + id + '"].enrollment .user-information .username'));
    return elem.isPresent();
  }

  enrollmentCommentPresent(id: string) {
    const elem = element(by.css('[enrollment-id="' + id + '"].enrollment .comment'));
    return elem.isPresent();
  }

  enrollmentCommentSeparatorPresent(id: string) {
    const elem = element(by.css('[enrollment-id="' + id + '"].enrollment .comment-separator'));
    return elem.isPresent();
  }

  async getEnrollmentComment(id: string) {
    const elem = element(by.css('[enrollment-id="' + id + '"].enrollment .comment'));

    const EC = protractor.ExpectedConditions;
    browser.wait(EC.presenceOf(elem), 10000, 'Element taking too long to be present');
    await browser.wait(this.textNotToBePresentInElement(elem, ''), 5000, 'Element taking too long to appear in the DOM');

    return elem;
  }

  clickEnrollment(id: string) {
    const elem = element(by.css('[enrollment-id="' + id + '"].enrollment'));

    const EC = protractor.ExpectedConditions;
    browser.wait(EC.presenceOf(elem), 10000, 'Element taking too long to be present');

    return elem.click();
  }

  enrollmentExpanded(id: string) {
    const elem = element(by.css('[enrollment-id="' + id + '"].enrollment-additions'));
    return elem.isPresent();
  }

  clickEnrollmentDelete(id: string) {
    const elem = element(by.css('[enrollment-id="' + id + '"].enrollment-additions .delete'));

    const EC = protractor.ExpectedConditions;
    browser.wait(EC.elementToBeClickable(elem), 10000, 'Element taking too long to be present');

    return elem.click();
  }

  clickEnrollmentEdit(id: string) {
    const elem = element(by.css('[enrollment-id="' + id + '"].enrollment-additions .edit'));

    const EC = protractor.ExpectedConditions;
    browser.wait(EC.elementToBeClickable(elem), 10000, 'Element taking too long to be present');

    return elem.click();
  }

  confirmationDialogOpened() {
    const elem = this.getConfirmationDialog();

    return elem.isPresent();
  }

  missingPermissionDialogOpened() {
    const elem = this.getMissingPermissionDialog();

    return elem.isPresent();
  }

  getConfirmationDialog() {
    const elem = element(by.css('.confirmation-dialog'));

    const EC = protractor.ExpectedConditions;
    browser.wait(EC.presenceOf(elem), 10000, 'Element taking too long to be present');

    return elem;
  }

  getMissingPermissionDialog() {
    const elem = element(by.css('.missing-permission-dialog'));

    const EC = protractor.ExpectedConditions;
    browser.wait(EC.presenceOf(elem), 10000, 'Element taking too long to be present');

    return elem;
  }

  getConfirmationDialogMessage() {
    const elem = element(by.css('.confirmation-dialog .message'));

    const EC = protractor.ExpectedConditions;
    browser.wait(EC.presenceOf(elem), 10000, 'Element taking too long to be present');

    return elem;
  }

  confirm() {
    const elem = element(by.id('confirm'));

    const EC = protractor.ExpectedConditions;
    browser.wait(EC.presenceOf(elem), 10000, 'Element taking too long to be present');

    return elem.click();
  }
}
