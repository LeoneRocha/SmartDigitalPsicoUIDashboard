import { ErroResponse } from "app/models/general/ErroResponse";

export interface Appstate {
  apiStatus: string;
  apiResponseMessage: string;
  success?: boolean;
  message?: string;
  errors?: any;
  resultAPI?: any;
}
