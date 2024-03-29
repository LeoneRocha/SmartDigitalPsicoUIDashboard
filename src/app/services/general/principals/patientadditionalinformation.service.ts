import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Inject } from '@angular/core';
import { ServiceResponse } from 'app/models/ServiceResponse';
import { environment } from 'environments/environment';
import { GenericService } from 'app/services/generic/generic.service';
import { PatientAdditionalInformationModel } from 'app/models/principalsmodel/PatientAdditionalInformationModel';

const basePathUrl = '/patient/v1/PatientAdditionalInformation';
@Injectable()
export class PatientAdditionalInformationService extends GenericService<ServiceResponse<PatientAdditionalInformationModel>, PatientAdditionalInformationModel, number> {

  constructor(@Inject(HttpClient) http: HttpClient) {
    super(http, `${environment.APIUrl + basePathUrl}`, '/FindAll');
  }

}
