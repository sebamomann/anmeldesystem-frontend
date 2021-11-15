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

  public async fillDriverForm(service: string, seats: number) {
    await this.enrollmentEditPage.selectDriver();

    if (service) this.enrollmentEditPage.selectDriverValue(service);
    if (seats) await this.enrollmentEditPage.setSeats(seats);

    await this.enrollmentEditPage.nextDriver();
  }

  public async fillPassengerForm(requirement: string) {
    await this.enrollmentEditPage.deselectDriver();

    this.enrollmentEditPage.selectPassengerValue(requirement);

    await this.enrollmentEditPage.nextDriver();
  }
}
