import { ErrorHandler } from '@angular/core';
import { environment } from 'environments/environment';



export class AppErrorHandler implements ErrorHandler {
    handleError(error: any) {
        //alert('An unexpected error occurred.'); 
        CaptureTologFunc('AppErrorHandler', error);
    }
}

export function CaptureTologFunc(oringErro: string, logToCapture: any) {
    let iscaptureResponseTolog: boolean = environment.EnableCaptureResponseTolog;
    if (iscaptureResponseTolog) {
        console.log('INI--' + oringErro + '--');
        console.log(logToCapture);
        console.log('END--' + oringErro + '--');
    }
}