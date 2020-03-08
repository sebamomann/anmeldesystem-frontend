import {IEnrollmentModel} from './IEnrollment.model';
import {IAdditionModel} from './IAddition.model';
import {ICommentModel} from './ICommentModel.model';
import {IDriverModel} from './IDriverModel.model';
import {IPassengerModel} from './IPassengerModel.model';

export class EnrollmentModel implements IEnrollmentModel {
  public mail?: string;
  public createdByUser?: boolean;
  public additions: IAdditionModel[];
  public comment: string;
  public comments: ICommentModel[];
  public driver: IDriverModel | null;
  public editMail?: string;
  public iat: string;
  public id: string;
  public name: string;
  public passenger: IPassengerModel | null;

  constructor() {
    this.additions = [];
  }
}
