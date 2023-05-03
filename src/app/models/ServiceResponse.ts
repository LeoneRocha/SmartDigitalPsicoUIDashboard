import { ErroResponse } from "./general/ErroResponse";

export interface ServiceResponse<T> {
  data: T;
  dataList?: T[];
  success: boolean;
  message: string;
  errors: ErroResponse[];
} 