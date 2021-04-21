import {browser} from 'protractor';

export class LocalStoragePage {
  constructor() {
  }

  async clear() {
    await browser.executeScript('window.localStorage.clear();');
  }

  async preventEnrollmentHintForLink(appointmentLink: string) {
    await browser.executeScript('return window.localStorage.setItem(\'enrollmentHintCloses\', \'' +
      JSON.stringify([appointmentLink]) + '\');');
  }

  /**
   * @deprecated
   */
  async setSettingsObject(settings: any) {
    await browser.executeScript('return window.localStorage.setItem(\'settings\', \'' +
      JSON.stringify([settings]) + '\');');
  }

  /**
   * @deprecated
   */
  async pinAppointment(appointmentLink: string) {
    await browser.executeScript('return window.localStorage.setItem(\'appointment-pins\', \'' +
      JSON.stringify([appointmentLink]) + '\');');
  }

  /**
   * @deprecated
   */
  async setPermissions(permissions: { link: string; enrollments: { id: string; token: string }[] }[]) {
    browser.executeScript('return window.localStorage.setItem(\'permissions\', \'' + JSON.stringify(permissions) + '\');');
  }

  public async set(key: string, value: any): Promise<void> {
    await browser.executeScript(`return window.localStorage.setItem('${key}', '${JSON.stringify(value)}')`);
  }

  async setString(key: string, value: string) {
    await browser.executeScript(`return window.localStorage.setItem('${key}', '${value}')`);
  }
}
