import {browser, by, element, protractor} from 'protractor';
import {HttpClient} from 'protractor-http-client/dist/http-client';

export class AppointmentOverviewPage {
  constructor() {
  }

  public async navigateToAppointment(link: string) {
    return new Promise((resolve, reject) => {
        browser.get('/enroll?a=' + link)
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
    return element(by.css('#title')).getText();
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

  public isAppointmentNotFoundCardPresent() {
    const elem = element(by.id('appointment-not-found'));
    return elem.isPresent();
  }

  public enrollmentNotFoundCardExists() {
    const until = protractor.ExpectedConditions;
    const elm = element(by.id('enrollment-not-found'));
    browser.wait(until.presenceOf(elm), 10000);

    return element(by.id('enrollment-not-found')).isPresent();
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

  public getEnrollmentBlocks() {
    return element.all(by.css('.enrollment'));
  }

  public getEnrollmentBlocksCreatedByUser() {
    return element.all(by.css('.enrollment.creator'));
  }

  public getEnrollmentBlocksCreatedByUnknown() {
    return element.all(by.css('.enrollment.unknown'));
  }

  public getEnrollmentUsernameById(id: string) {
    const elem = element(by.css('[enrollment-id="' + id + '"].enrollment .user-information .username'));
    return elem.getText();
  }

  public getEnrollmentNameById(id: string) {
    const elem = element(by.css('[enrollment-id="' + id + '"].enrollment .user-information .name'));
    return elem.getText();
  }

  public getEnrollmentComment(id: string) {
    const elem = element(by.css('[enrollment-id="' + id + '"].enrollment .comment'));
    return elem.getText();
  }

  public isEnrollmentPresent(id: string) {
    const elem = element(by.css('[enrollment-id="' + id + '"].enrollment'));
    return elem.isPresent();
  }

  public isEnrollmentUsernamePresent(id: string) {
    const elem = element(by.css('[enrollment-id="' + id + '"].enrollment .user-information .username'));
    return elem.isPresent();
  }

  public isEnrollmentCommentPresent(id: string) {
    const elem = element(by.css('[enrollment-id="' + id + '"].enrollment .comment'));
    return elem.isPresent();
  }

  public isEnrollmentCommentSeparatorPresent(id: string) {
    const elem = element(by.css('[enrollment-id="' + id + '"].enrollment .comment-separator'));
    return elem.isPresent();
  }

  clickEnrollment(id: string) {
    const elem = element(by.css('[enrollment-id="' + id + '"].enrollment'));

    const EC = protractor.ExpectedConditions;
    browser.wait(EC.presenceOf(elem), 10000, 'Element taking too long to be present');

    return elem.click();
  }

  enrollmentPanelExpanded(id: string) {
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

  async getConfirmationDialogMessageText() {
    const elem = element(by.css('.confirmation-dialog .message'));

    const EC = protractor.ExpectedConditions;
    browser.wait(EC.presenceOf(elem), 10000, 'Element taking too long to be present');
    await browser.wait(this.textNotToBePresentInElement(elem, ''), 5000, 'Element taking too long to appear in the DOM');

    return elem.getText();
  }

  confirm() {
    const elem = element(by.id('confirm'));

    const EC = protractor.ExpectedConditions;
    browser.wait(EC.presenceOf(elem), 10000, 'Element taking too long to be present');

    return elem.click();
  }

  public isDriverOverviewButtonPresent() {
    const elem = element(by.id('driver_overview_action_button'));
    return elem.isPresent();
  }

  public clickDriverOverviewButton() {
    const elem = element(by.id('driver_overview_action_button'));
    return elem.click();
  }

  public isCreationEnrollmentButtonPresent() {
    const elem = element(by.id('enroll_action_button'));
    return elem.isPresent();
  }

  public clickEnrollCreationButton() {
    const elem = element(by.id('enroll_action_button'));
    return elem.click();
  }

  public pageRedirectedToUrl(url: string) {
    return browser.wait(protractor.ExpectedConditions.urlContains(url), 5000);
  }

  public openAppointmentMenu() {
    const elem = element(by.id('appointment_menu'));
    return elem.click();
  }

  public isMenuOpened() {
    const elem = element(by.css('.mat-menu-content'));
    return elem.isPresent();
  }

  public clickLoginHintLoginButton() {
    const elem = this.getElementLoginHint();
    const button = elem.element(by.tagName('button'));

    return button.click();
  }

  public isLoginHintPresent() {
    const elem = this.getElementLoginHint();
    return elem.isPresent();
  }

  public getElementLoginHint() {
    return element(by.css('#login_hint'));
  }
}

