import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Inject } from '@angular/core';
import { GenderModel } from 'app/models/simplemodel/GenderModel';
import { GenericService } from '../../generic/generic.service';
import { ServiceResponse } from 'app/models/ServiceResponse';
import { environment } from 'environments/environment';

const basePathUrl = '/Gender/v1';
@Injectable()
export class GenderService extends GenericService<ServiceResponse<GenderModel>, GenderModel, number> {

  constructor(@Inject(HttpClient) http: HttpClient) {
    super(http, `${environment.APIUrl + basePathUrl}`, '/FindAll');
  }

}
