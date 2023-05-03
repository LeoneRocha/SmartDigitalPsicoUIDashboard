import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Inject } from '@angular/core';  
import { ServiceResponse } from 'app/models/ServiceResponse';
import { environment } from 'environments/environment'; 
import { GenericService } from 'app/services/generic/generic.service'; 
import { MedicalModel } from 'app/models/principalsmodel/MedicalModel';
 
const basePathUrl = '/medical/v1/Medical';
@Injectable()
export class MedicalService extends GenericService<ServiceResponse<MedicalModel>, MedicalModel, number> {

  constructor(@Inject(HttpClient) http: HttpClient) {
    super(http, `${environment.APIUrl + basePathUrl}`, '/FindAll');
  }

}
