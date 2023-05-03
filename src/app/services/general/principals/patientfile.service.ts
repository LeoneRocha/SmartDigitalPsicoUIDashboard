import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Inject } from '@angular/core';  
import { ServiceResponse } from 'app/models/ServiceResponse';
import { environment } from 'environments/environment'; 
import { GenericService } from 'app/services/generic/generic.service';  
import { PatientFileModel } from 'app/models/principalsmodel/PatientFileModel';

const basePathUrl = '/PatientFile/v1';
@Injectable()
export class PatientFileService extends GenericService<ServiceResponse<PatientFileModel>, PatientFileModel, number> {

  constructor(@Inject(HttpClient) http: HttpClient) {
    super(http, `${environment.APIUrl + basePathUrl}`, '/FindAll');
  }

}
