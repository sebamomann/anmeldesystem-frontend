import { EnrollmentCreatePage } from '../po/enrollment.create.po';

export class EnrollmentCreateUserTestUtil {
  public enrollmentCreatePage: EnrollmentCreatePage;

  public async fillMainForm(isSelfEnrollment: boolean, data: { name: string, comment: string }) {
    const nameToSet = data.name;
    const commentToSet = data.comment;

    this.enrollmentCreatePage.waitForFormBuild();

    const isSelfEnrollmentSelected = this.enrollmentCreatePage.isSelfEnrollmentSelected();
    if (isSelfEnrollmentSelected && !isSelfEnrollment) {
      await this.enrollmentCreatePage.deselectSelfEnrollment();
    } else if (!isSelfEnrollment && isSelfEnrollment) {
      await this.enrollmentCreatePage.selectSelfEnrollment();
    }

    if (nameToSet) {
      await this.enrollmentCreatePage.setName(nameToSet);
    }

    if (commentToSet) {
      await this.enrollmentCreatePage.setComment(commentToSet);
    }

    await this.enrollmentCreatePage.nextMain();
  };
}
