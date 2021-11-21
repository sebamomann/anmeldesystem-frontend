import { BasePage } from './../../../base.po';
import { browser, by, element, protractor } from 'protractor';
import { HttpClient } from 'protractor-http-client/dist/http-client';
import { AppointmentOverviewEnrollmentListPage } from './appointment.overview.enrollment-list.po';

export class AppointmentOverviewPage extends BasePage {
  constructor() {
    super();
  }

  public async navigateToAppointment(link: string) {
    return new Promise<void>((resolve, reject) => {
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

  public isLoginHintPresent() {
    const elem = AppointmentOverviewEnrollmentListPage.getElementLoginHint();
    return elem.isPresent();
  }

  public clickLoginHintLoginButton() {
    const elem = AppointmentOverviewEnrollmentListPage.getElementLoginHint();
    const button = elem.element(by.tagName('button'));

    return button.click();
  }

  // ---------------------NAVIGATIONS---------------------
  // ---------------------NAVIGATIONS---------------------

  public isDriverOverviewButtonPresent() {
    const elem = element(by.id('driver_overview_action_button'));
    return elem.isPresent();
  }

  public clickDriverOverviewButton() {
    return this.buttonClick('driver_overview_action_button');
  }

  public isCreationEnrollmentButtonPresent() {
    const elem = element(by.id('enroll_action_button'));
    return elem.isPresent();
  }

  public clickEnrollmentCreationButton() {
    return this.buttonClick('enroll_action_button');
  }

  // ------------------------------------------------------------------
  // ------------------------------------------------------------------


  /**
   * @deprecated
   * centralize
   */
  public buttonClick(id: string) {
    const elm = element(by.id(id));

    const EC = protractor.ExpectedConditions;
    browser.wait(EC.elementToBeClickable(elm), 10000, `Button with ID '${id}' taking too long to be clickable`);

    return elm.click();
  }

}

