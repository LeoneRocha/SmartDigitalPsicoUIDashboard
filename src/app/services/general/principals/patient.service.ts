import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Inject } from '@angular/core';  
import { ServiceResponse } from 'app/models/ServiceResponse';
import { environment } from 'environments/environment'; 
import { GenericService } from 'app/services/generic/generic.service'; 
import { PatientModel } from 'app/models/principalsmodel/PatientModel';
 
const basePathUrl = '/patient/v1/patient';
@Injectable()
export class PatientService extends GenericService<ServiceResponse<PatientModel>, PatientModel, number> {

  constructor(@Inject(HttpClient) http: HttpClient) {
    super(http, `${environment.APIUrl + basePathUrl}`, '/FindAll');
  }
}  