import { ErrorResponse } from './ErrorResponse';

export interface ServiceResponse<T> {
  data?: T;
  success: boolean;
  message: string;
  errors: ErrorResponse[];
  unauthorized: boolean;
}