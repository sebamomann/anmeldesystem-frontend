import {browser} from 'protractor';

export class EnvironmentPage {
  constructor() {
  }

  public async getEnvironmentVariable(name: string): Promise<string> {
    return browser.executeScript(`return window.env.${name.toUpperCase()};`);
  }
}
