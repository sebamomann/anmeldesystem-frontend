import { browser, by, element, protractor } from "protractor";

export class BasePage {

  public currentUrlContains(url: string) {
    return browser.wait(protractor.ExpectedConditions.urlContains(url), 5000);
  }

  public getErrorSnackbar() {
    const EC = protractor.ExpectedConditions;
    const snackBar = element(by.className('snackbar-error'));
    browser.wait(EC.visibilityOf(snackBar), 4000, "Cant find error snackbar");

    return snackBar;
  }

  public getSnackbar() {
    const EC = protractor.ExpectedConditions;
    const snackBar = browser.element(by.className('snackbar-default'));
    browser.wait(EC.visibilityOf(snackBar), 4000, "Cant find snackbar");

    return snackBar;
  }
}
