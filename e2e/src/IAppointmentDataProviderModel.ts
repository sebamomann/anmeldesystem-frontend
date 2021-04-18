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
  creatorId: string;
  iat: string;
  lud: string;
}
