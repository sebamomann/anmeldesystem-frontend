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
  hidden: boolean;
  additions?: IAdditionModel[];
  administrators?: { username: string }[];
  driverAddition: boolean;
  enrollments?: IEnrollmentModel[];
  files?: IFileModel[];
  relations?: ('CREATOR' | 'ADMIN' | 'ENROLLED' | 'PINNED')[];
  numberOfEnrollments?: number;
}
