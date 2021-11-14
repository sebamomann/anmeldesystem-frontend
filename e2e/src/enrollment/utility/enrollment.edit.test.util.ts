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

  public async fillAdditionForm(args: boolean[]) {
    for (let i = 0; i < args.length; i++) {
      if (args[i]) {
        await this.enrollmentEditPage.selectAddition(String(i));
      } else {
        await this.enrollmentEditPage.deselectAddition(String(i));
      }
    }

    this.enrollmentEditPage.nextAdditions();
  }
}
