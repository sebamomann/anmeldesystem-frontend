import {ICommentModel} from './ICommentModel.model';
import {IDriverModel} from './IDriverModel.model';
import {IAdditionModel} from './IAddition.model';
import {IPassengerModel} from './IPassengerModel.model';

export interface IEnrollmentModel {
  id?: string;
  name: string;
  comment: string;
  comments?: ICommentModel[];
  driver: IDriverModel | null;
  passenger: IPassengerModel | null;
  additions: IAdditionModel[];
  iat?: string;
  editKey: string;
}
