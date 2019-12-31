import {IAdditionModel} from './IAddition.model';
import {IEnrollmentModel} from './IEnrollment.model';
import {IFileModel} from './IFileModel.model';

export interface IAppointmentModel {
  id?: string;
  title: string;
  description: string;
  location: string;
  creator: any;
  date: string;
  deadline: string | null;
  link: string;
  maxEnrollments: number | null;
  additions: IAdditionModel[];
  driverAddition: boolean;
  enrollments: IEnrollmentModel[];
  files: IFileModel[];
}
