import {IFileDataProviderModel} from './IFileDataProviderModel';

export interface IAppointmentDataProviderModel {
  id: string;
  title: string;
  description: string;
  link: string;
  location: string;
  date: string,
  deadline: string;
  maxEnrollments: number;
  hidden: boolean;
  driverAddition: boolean;
  creator: {
    name: string,
    username: string,
  };
  iat: string;
  lud: string;
  files: IFileDataProviderModel[]
}
