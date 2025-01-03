import { ServiceResponse } from 'app/models/ServiceResponse';
import swal from 'sweetalert2';

export class SuccessHelper {
  static displaySuccess(successResponse: ServiceResponse<any>): void { 
    swal.fire({
      icon: 'success',
      title: 'Success',
      text: successResponse.message,
    });
  }
}
