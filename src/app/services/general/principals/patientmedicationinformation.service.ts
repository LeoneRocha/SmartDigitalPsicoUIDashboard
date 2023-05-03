import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Inject } from '@angular/core';  
import { ServiceResponse } from 'app/models/ServiceResponse';
import { environment } from 'environments/environment'; 
import { GenericService } from 'app/services/generic/generic.service';  
import { PatientMedicationInformationModel } from 'app/models/principalsmodel/PatientMedicationInformationModel';

const basePathUrl = '/patient/v1/PatientMedicationInformation';
@Injectable()
export class PatientMedicationInformationService extends GenericService<ServiceResponse<PatientMedicationInformationModel>, PatientMedicationInformationModel, number> {

  constructor(@Inject(HttpClient) http: HttpClient) {
    super(http, `${environment.APIUrl + basePathUrl}`, '/FindAll');
  }

}
