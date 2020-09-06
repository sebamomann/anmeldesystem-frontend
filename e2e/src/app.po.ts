import {browser, by, element} from 'protractor';

export class AppPage {
  navigateTo(val: string) {
    return browser.get(val) as Promise<any>;
  }

  getTitleText() {
    return element(by.css('app-root .content span')).getText() as Promise<string>;
  }
}
