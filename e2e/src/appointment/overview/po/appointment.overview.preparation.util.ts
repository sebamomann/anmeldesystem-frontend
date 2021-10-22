import { LocalStoragePage } from "e2e/src/general/localStorage.po";
import { LoginPage } from "e2e/src/general/login.po";
import { IUserDataProviderModel } from "e2e/src/IUserDataProviderModel";
import { AppointmentOverviewPage } from "./appointment.overview.po";


export class AppointmentOverviewPreparationUtil {
  public appointmentOverviewPage: AppointmentOverviewPage;
  public localStoragePage: LocalStoragePage;
  public loginPage: LoginPage;

  public async loadPage(appointmentLink: string): Promise<void> {
    if (this.loginPage) {
      await this.loginPage.logout();
    }

    await this.localStoragePage.clear();
    await this.localStoragePage.set("appointment-pins", [appointmentLink]);
    await this.appointmentOverviewPage.navigateToAppointment(appointmentLink);
  }

  public async loadPageWithLogin(appointmentLink: string, user: IUserDataProviderModel): Promise<void> {
    if (this.loginPage) {
      await this.loginPage.logout();
    }

    await this.localStoragePage.clear();
    await this.localStoragePage.set("appointment-pins", [appointmentLink]);
    await this.loginPage.loginViaApi(user);
    await this.appointmentOverviewPage.navigateToAppointment(appointmentLink);
  }
}
