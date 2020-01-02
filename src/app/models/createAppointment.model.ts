import {IFileModelUpload} from './IFileModelUpload.model';

export interface CreateAppointmentModel {
  title: string;
  description: string;
  link: string;
  location: string;
  date: string;
  deadline: string;
  maxEnrollments: number;
  additions: string[];
  driverAddition: boolean;
  administrators: string[];
  files: IFileModelUpload[];
}
