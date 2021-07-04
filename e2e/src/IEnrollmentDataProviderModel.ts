export interface IEnrollmentDataProviderModel {
  id: string;
  name?: string;
  comment?: string;
  creator?: {
    name: string,
    username: string,
  };
  iat: string;
}
