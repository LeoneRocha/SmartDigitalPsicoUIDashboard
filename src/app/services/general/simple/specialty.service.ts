import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Inject } from '@angular/core';  
import { ServiceResponse } from 'app/models/ServiceResponse';
import { environment } from 'environments/environment';
import { SpecialtyModel } from 'app/models/simplemodel/SpecialtyModel';
import { GenericService } from 'app/services/generic/generic.service';

const basePathUrl = '/specialty/v1';
@Injectable()
export class SpecialtyService extends GenericService<ServiceResponse<SpecialtyModel>, SpecialtyModel, number> {

  constructor(@Inject(HttpClient) http: HttpClient) {
    super(http, `${environment.APIUrl + basePathUrl}`, '/FindAll');
  }

}
