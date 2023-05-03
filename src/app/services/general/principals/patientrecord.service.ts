import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Inject } from '@angular/core';  
import { ServiceResponse } from 'app/models/ServiceResponse';
import { environment } from 'environments/environment'; 
import { GenericService } from 'app/services/generic/generic.service';   
import { PatientRecordModel } from 'app/models/principalsmodel/PatientRecordModel';

const basePathUrl = '/patient/v1/PatientRecord';
@Injectable()
export class PatientRecordService extends GenericService<ServiceResponse<PatientRecordModel>, PatientRecordModel, number> {

  constructor(@Inject(HttpClient) http: HttpClient) {
    super(http, `${environment.APIUrl + basePathUrl}`, '/FindAll');
  }

}
