import { LoginPage } from 'e2e/src/general/login.po';
import { IUserDataProviderModel } from 'e2e/src/IUserDataProviderModel';
import { EnrollmentEditPage } from '../po/enrollment.edit.po';
import { LocalStoragePage } from './../../general/localStorage.po';

export class EnrollmentEditPreparationUtil {
  public enrollmentEditPage: EnrollmentEditPage;
  public localStoragePage: LocalStoragePage;
  public loginPage: LoginPage;

  public async loadPage(appointmentLink: string, enrollmentId: string): Promise<void> {
    await this.localStoragePage.clear();
    await this.localStoragePage.set("appointment-pins", [appointmentLink]);
    await this.enrollmentEditPage.navigateToEnrollmentEdit(appointmentLink, enrollmentId);
  }

  public async loadPageWithLogin(appointmentLink: string, enrollmentId: string, user: IUserDataProviderModel): Promise<void> {
    await this.localStoragePage.clear();
    await this.localStoragePage.set("appointment-pins", [appointmentLink]);
    await this.loginPage.loginViaApi(user);
    await this.enrollmentEditPage.navigateToEnrollmentEdit(appointmentLink, enrollmentId);
  }

  public async loadPageWithPermissionToken(appointmentLink: string, enrollmentId: string, enrollmentEditToken: string): Promise<void> {
    await this.localStoragePage.clear();
    await this.localStoragePage.set("appointment-pins", [appointmentLink]);
    await this.setPermissionTokenForEnrollment(appointmentLink, enrollmentId, enrollmentEditToken);
    await this.enrollmentEditPage.navigateToEnrollmentEdit(appointmentLink, enrollmentId);
  }

  public async setPermissionTokenForEnrollment(appointmentLink: string, enrollmentId: string, enrollmentEditToken: string): Promise<void> {
    const permissions = [
      {
        link: appointmentLink,
        enrollments: [
          {
            'id': enrollmentId,
            'token': enrollmentEditToken
          }
        ]
      }
    ];

    await this.localStoragePage.set("permissions", permissions);
  }
}
