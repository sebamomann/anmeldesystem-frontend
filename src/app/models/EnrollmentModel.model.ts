import {IEnrollmentModel} from './IEnrollment.model';
import {IAdditionModel} from './IAddition.model';
import {ICommentModel} from './ICommentModel.model';
import {IDriverModel} from './IDriverModel.model';
import {IPassengerModel} from './IPassengerModel.model';

export class EnrollmentModel implements IEnrollmentModel {
  private _additions: IAdditionModel[];

  get additions(): IAdditionModel[] {
    return this._additions;
  }

  set additions(value: IAdditionModel[]) {
    this._additions = value;
  }

  private _comment: string;

  get comment(): string {
    return this._comment;
  }

  set comment(value: string) {
    this._comment = value;
  }

  private _comments: ICommentModel[];

  get comments(): ICommentModel[] {
    return this._comments;
  }

  set comments(value: ICommentModel[]) {
    this._comments = value;
  }

  private _driver: IDriverModel | null;

  get driver(): IDriverModel | null {
    return this._driver;
  }

  set driver(value: IDriverModel | null) {
    this._driver = value;
  }

  private _editKey: string;

  get editKey(): string {
    return this._editKey;
  }

  set editKey(value: string) {
    this._editKey = value;
  }

  private _iat: string;

  get iat(): string {
    return this._iat;
  }

  set iat(value: string) {
    this._iat = value;
  }

  private _id: string;

  get id(): string {
    return this._id;
  }

  set id(value: string) {
    this._id = value;
  }

  private _name: string;

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }

  private _passenger: IPassengerModel | null;

  get passenger(): IPassengerModel | null {
    return this._passenger;
  }

  set passenger(value: IPassengerModel | null) {
    this._passenger = value;
  }
}
