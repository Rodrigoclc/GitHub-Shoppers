export interface IApiResponse<T = any> {
  message: string;
  data?: T;
  error?: string;
}