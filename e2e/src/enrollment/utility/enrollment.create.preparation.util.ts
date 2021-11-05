import { LoginPage } from 'e2e/src/general/login.po';
import { IUserDataProviderModel } from 'e2e/src/IUserDataProviderModel';
import { LocalStoragePage } from '../../general/localStorage.po';
import { EnrollmentCreatePage } from '../po/enrollment.create.po';

export class EnrollmentCreatePreparationUtil {
  public enrollmentCreatePage: EnrollmentCreatePage;
  public localStoragePage: LocalStoragePage;
  public loginPage: LoginPage;

  public async loadPage(appointmentLink: string): Promise<void> {
    if (this.loginPage) {
      await this.loginPage.logout();
    }

    await this.localStoragePage.clear();
    await this.localStoragePage.set("appointment-pins", [appointmentLink]);
    await this.enrollmentCreatePage.navigateToEnrollmentCreation(appointmentLink);
  }

  public async loadPageWithLogin(appointmentLink: string, user: IUserDataProviderModel): Promise<void> {
    if (this.loginPage) {
      await this.loginPage.logout();
    }

    await this.localStoragePage.clear();
    await this.localStoragePage.set("appointment-pins", [appointmentLink]);
    await this.loginPage.loginViaApi(user);
    await this.enrollmentCreatePage.navigateToEnrollmentCreation(appointmentLink);
  }
}
