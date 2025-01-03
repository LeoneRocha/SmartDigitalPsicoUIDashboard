import { ServiceResponse } from 'app/models/ServiceResponse';
import swal from 'sweetalert2';
export class ErrorHelper {
  static displayErrors(errorResponse: ServiceResponse<any>): void {    
    const errors = errorResponse.errors || [{ message: 'An unknown error occurred.' }];
    let errorMessagesArray = [];
    for (let error of errors) {
      let message = error.message;
      if (message.endsWith('|')) {
        message = message.slice(0, -1); // Remove o caractere | no final da mensagem
      }
      errorMessagesArray.push(message.split('|').pop());
    }
    const errorMessages = errorMessagesArray.join('\n');
    console.log(errorMessages);
    swal.fire({
      icon: 'error',
      title: errorResponse.message,
      text: errorMessages,
    });
  }
}