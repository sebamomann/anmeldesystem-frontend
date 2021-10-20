import { EnrollmentCreatePage } from './../po/enrollment.create.po';

export class EnrollmentCreateTestUtil {

  public enrollmentCreatePage: EnrollmentCreatePage;

  public async fillMainForm(data: { name: string, comment: string }) {
    const nameToSet = data.name;
    const commentToSet = data.comment;

    this.enrollmentCreatePage.waitForFormBuild();

    if (nameToSet) {
      await this.enrollmentCreatePage.setName(nameToSet);
    }

    if (commentToSet) {
      await this.enrollmentCreatePage.setComment(commentToSet);
    }

    this.enrollmentCreatePage.nextMain();
  };

  public async fillAdditionForm(args: boolean[]) {
    for (let i = 0; i < args.length; i++) {
      if (args[i]) {
        await this.enrollmentCreatePage.selectAddition(String(i));
      }
    }

    this.enrollmentCreatePage.nextAdditions();
  }

  public async fillDriverFormPassenger(requirement: string) {
    this.enrollmentCreatePage.deselectDriver();
    this.enrollmentCreatePage.selectPassengerValue(requirement);

    this.enrollmentCreatePage.nextDriver();
  }

  public async fillDriverFormDriver(service: string, seats: number) {
    this.enrollmentCreatePage.selectDriver();
    this.enrollmentCreatePage.selectDriverValue(service);
    this.enrollmentCreatePage.setSeats(seats);

    this.enrollmentCreatePage.nextDriver();
  }
}
