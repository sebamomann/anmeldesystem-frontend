import { browser } from "protractor";
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
}
