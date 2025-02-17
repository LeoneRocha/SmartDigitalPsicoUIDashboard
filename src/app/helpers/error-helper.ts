import { ServiceResponse } from 'app/models/ServiceResponse';
import swal from 'sweetalert2';

export class ErrorHelper {
  static displayErrors(errorResponse: ServiceResponse<any>): void {
    const errors = errorResponse.errors || [{ message: 'An unknown error occurred.' }];
    let errorMessagesArray = [];
    for (let error of errors) {
      let message = error.message;
      if (message.endsWith('|')) {
        message = message.slice(0, -1);
      }
      errorMessagesArray.push(message.split('|').pop());
    }
    const errorMessages = errorMessagesArray.join('\n');
    swal.fire({
      icon: 'error',
      title: errorResponse.message,
      text: errorMessages,
    });
  }

  static displayHttpErrors(error: any, titleError: string, defaultError: string): void {

    if (error?.originalError?.status === 0 && error?.originalError?.statusText === "Unknown Error") {
      swal.fire({
        icon: 'error',
        title: titleError,
        text: defaultError
      });
      return;
    }
    const errorResponse = error?.originalError?.error;

    if (!errorResponse) {
      swal.fire({
        icon: 'error',
        title: titleError,
        text: defaultError
      });
      return;
    }

    const mainMessage = errorResponse.message || titleError;
    const detailedMessages = errorResponse.errors
      ? errorResponse.errors.map(e => e.message).join('\n')
      : '';

    const fullMessage = detailedMessages
      ? `${mainMessage}\n\n${detailedMessages}`
      : mainMessage;

    swal.fire({
      icon: 'error',
      title: titleError,
      text: fullMessage,
    });
  }
}