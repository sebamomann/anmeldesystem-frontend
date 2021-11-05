import {browser} from 'protractor';

export class LocalStoragePage {
  constructor() {
  }

  public async clear() {
    await browser.executeScript('window.localStorage.clear();');
  }

  public async preventEnrollmentHintForLink(appointmentLink: string) {
    await browser.executeScript(`return window.localStorage.setItem('enrollmentHintCloses', '${JSON.stringify([appointmentLink])}');`);
  }

  /**
   * @deprecated
   */
  public async setSettingsObject(settings: any) {
    await browser.executeScript(`return window.localStorage.setItem('settings', '${JSON.stringify(settings)}');`);
  }

  /**
   * @deprecated
   */
  public async pinAppointment(appointmentLink: string) {
    await browser.executeScript(`return window.localStorage.setItem('appointment-pins', '${JSON.stringify([appointmentLink])}');`);
  }

  /**
   * @deprecated
   */
  public async setPermissions(permissions: { link: string; enrollments: { id: string; token: string }[] }[]) {
    await browser.executeScript(`return window.localStorage.setItem('permissions', '${JSON.stringify(permissions)}');`);
  }

  public async set(key: string, value: any): Promise<void> {
    await browser.executeScript(`return window.localStorage.setItem('${key}', '${JSON.stringify(value)}');`);
  }

  public async setString(key: string, value: string) {
    await browser.executeScript(`return window.localStorage.setItem('${key}', '${value}')`);
  }

  async getObject(key: string) {
    let obj;
    let retry = 20;

    while (retry > 0) {
      retry--;
      obj = JSON.parse(await browser.executeScript(`return window.localStorage.getItem('${key}')`));
      if (obj !== null) {
        return obj;
      }

      await browser.sleep(100);
    }
    throw new Error('object not found');
  }

  public async getString(key: string): Promise<string> {
    return browser.executeScript(`return window.localStorage.getItem('${key}')`);
  }
}
