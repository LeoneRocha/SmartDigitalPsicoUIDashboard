import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Inject } from '@angular/core';
import { ServiceResponse } from 'app/models/ServiceResponse';
import { environment } from 'environments/environment';
import { GenericService } from 'app/services/generic/generic.service';
import { PatientFileModel } from 'app/models/principalsmodel/PatientFileModel';
import { Observable, catchError, map } from 'rxjs';

const basePathUrl = '/patient/v1/patientFile';
@Injectable()
export class PatientFileService extends GenericService<ServiceResponse<PatientFileModel>, PatientFileModel, number> {

  _http: HttpClient;
  baseUrlLocal: string = `${environment.APIUrl + basePathUrl}`;

  constructor(@Inject(HttpClient) http: HttpClient) {
    super(http, `${environment.APIUrl + basePathUrl}`, '/FindAll');
    this._http = http;
  }

  upload(patientFileModel: FormData): Observable<ServiceResponse<PatientFileModel>> {
    let headers = this.getHeaders();
    return this._http.post<ServiceResponse<PatientFileModel>>(`${this.baseUrlLocal}/Upload`, patientFileModel, { headers: headers })
      .pipe(map(response => { return response; }), catchError(super.customHandleError));
  }

  downloadFile(fileId: number): Observable<HttpResponse<Blob>> {
    let headers = this.getHeaders();
    headers.set('Content-Type', 'application/json');
    //headers.set('Referrer-Policy', 'no-referrer');    
    const options = {
      headers,
      //observe: 'response',
      responseType: 'blob'  as 'json'
    };
    return this._http.get(`${this.baseUrlLocal}/Download/${fileId}`, { headers: headers, observe: 'response', responseType: 'blob'})
    .pipe(map(response => { return response; }), catchError(super.customHandleError)); 
  }
  //https://stackoverflow.com/questions/52154874/angular-6-downloading-file-from-rest-api

}
