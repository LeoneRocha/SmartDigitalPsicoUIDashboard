import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Inject } from '@angular/core';  
import { environment } from 'environments/environment';
import { GenericService } from 'app/services/generic/generic.service'; 
import { SimpleGeneralModel } from 'app/models/contracts/SimpleModel';

const basePathUrl = '/GlobalizationCultures/v1';
@Injectable()
export class GlobalizationCultureService extends GenericService<SimpleGeneralModel, SimpleGeneralModel, number> {

  constructor(@Inject(HttpClient) http: HttpClient) {
    super(http, `${environment.APIUrl + basePathUrl}`, '/GetCultures');
  }

}
