import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Inject } from '@angular/core'; 
import { ServiceResponse } from 'app/models/ServiceResponse';
import { environment } from 'environments/environment';
import { ApplicationLanguageModel } from 'app/models/simplemodel/ApplicationLanguageModel';
import { GenericService } from 'app/services/generic/generic.service';

const basePathUrl = '/ApplicationLanguage/v1';
@Injectable()
export class ApplicationLanguageService extends GenericService<ServiceResponse<ApplicationLanguageModel>, ApplicationLanguageModel, number> {

  constructor(@Inject(HttpClient) http: HttpClient) {
    super(http, `${environment.APIUrl + basePathUrl}`, '/FindAll');
  }

}
