import { browser, by, protractor } from "protractor";
import { EnrollmentBasePage } from "./enrollment.base.po";

export class EnrollmentEditPage extends EnrollmentBasePage {
  constructor() {
    super();
  }

  public async navigateToEnrollmentEdit(link: string, enrollmentId: string) {
    return new Promise<void>((resolve, reject) => {
      browser
        .get(`/enrollment/edit?a=${link}&e=${enrollmentId}`)
        .then((_) => {
          this.waitForLoadingSpinnerToBeGone();

          resolve();
        })
        .catch((_) => {
          reject();
        });
    });
  }

  public navigateToAdditionsTab() {
    const EC = protractor.ExpectedConditions;
    const elem = browser.element(by.css('.additions-tab'));
    browser.wait(EC.visibilityOf(elem), 4000, "Cant find additions tab");

    return elem.click();
  }

  public navigateToDriverTab() {
    const EC = protractor.ExpectedConditions;
    const elem = browser.element(by.css('.driver-tab'));
    browser.wait(EC.visibilityOf(elem), 4000, "Cant find driver tab");

    return elem.click();
  }
}
