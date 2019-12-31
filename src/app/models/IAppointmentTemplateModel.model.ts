import {IAdditionModel} from './IAddition.model';

export interface IAppointmentTemplateModel {
  title: string;
  description: string;
  location: string;
  maxEnrollments: number;
  additions: IAdditionModel[];
  driverAddition: boolean;
}
