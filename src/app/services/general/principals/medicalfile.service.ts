import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Inject } from '@angular/core';  
import { ServiceResponse } from 'app/models/ServiceResponse';
import { environment } from 'environments/environment'; 
import { GenericService } from 'app/services/generic/generic.service';
import { MedicalFileModel } from 'app/models/principalsmodel/MedicalFileModel';
import { Observable, catchError, map } from 'rxjs';
 
const basePathUrl = '/medical/v1/MedicalFile';
@Injectable()
export class MedicalFileService extends GenericService<ServiceResponse<MedicalFileModel>, MedicalFileModel, number> {

  _http: HttpClient;
  baseUrlLocal: string = `${environment.APIUrl + basePathUrl}`;

  constructor(@Inject(HttpClient) http: HttpClient) {
    super(http, `${environment.APIUrl + basePathUrl}`, '/FindAll');
    this._http = http;
  } 

  upload(medicalFileModel: FormData): Observable<ServiceResponse<MedicalFileModel>> {
    let headers = this.getHeaders();
    return this._http.post<ServiceResponse<MedicalFileModel>>(`${this.baseUrlLocal}/Upload`, medicalFileModel, { headers: headers })
    .pipe(map(response => { return response; }), catchError(super.customHandleError));
  } 

}
