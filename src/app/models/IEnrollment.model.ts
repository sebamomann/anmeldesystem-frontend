import {ICommentModel} from './ICommentModel.model';
import {IDriverModel} from './IDriverModel.model';
import {IAdditionModel} from './IAddition.model';
import {IPassengerModel} from './IPassengerModel.model';
import {IUserModel} from './IUserModel.model';

export interface IEnrollmentModel {
  editMail?: any;
  id?: string;
  name?: string;
  comment: string;
  comments?: ICommentModel[];
  driver: IDriverModel | null;
  passenger: IPassengerModel | null;
  additions: IAdditionModel[];
  iat?: string;
  mail?: string;
  createdByUser?: boolean;
  token?: string;
  creator?: IUserModel;
}
