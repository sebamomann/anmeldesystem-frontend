import { EnrollmentEditPage } from './../po/enrollment.edit.po';

export class EnrollmentEditTestUtil {
  public enrollmentEditPage: EnrollmentEditPage;

  public async fillMainForm(data: { name: string, comment: string }) {
    const nameToSet = data.name;
    const commentToSet = data.comment;

    this.enrollmentEditPage.waitForFormBuild();

    if (nameToSet) {
      await this.enrollmentEditPage.setName(nameToSet);
    }

    if (commentToSet) {
      await this.enrollmentEditPage.setComment(commentToSet);
    }

    this.enrollmentEditPage.nextMain();
  };
}
