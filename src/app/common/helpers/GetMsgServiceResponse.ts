import { ServiceResponse } from "app/models/ServiceResponse";

export function GetMsgServiceResponse<T>(response: ServiceResponse<T>) {
    let messageResult: string = 'Ocorreu um erro!';
  
    if (response?.errors?.length > 0) {
      messageResult ='';
      response?.errors?.forEach(responseItem => {
        messageResult += ` O Campo: ${responseItem.name}. Detalhe: ${responseItem.message}`;
      });
    }
    return messageResult;
  }