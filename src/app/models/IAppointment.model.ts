import {IAdditionModel} from './IAddition.model';
import {IEnrollmentModel} from './IEnrollment.model';

export interface IAppointmentModel {
  id?: string;
  title: string;
  description: string;
  location: string;
  creator: string;
  date: string;
  deadline: string;
  link: string;
  maxEnrollments: number;
  additions: IAdditionModel[];
  driverAddition: boolean;
  enrollments: IEnrollmentModel[];
  file: string | null;
}
