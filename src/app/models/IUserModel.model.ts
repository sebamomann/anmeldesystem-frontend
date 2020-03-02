export interface IUserModel {
  id: string;
  name: string;
  username: string;
  password?: string;
  mail: string;
  emailChange?: any[];
  token: string;
}
