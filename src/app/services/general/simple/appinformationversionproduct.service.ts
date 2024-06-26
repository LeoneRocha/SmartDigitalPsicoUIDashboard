import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Inject } from '@angular/core';  
import { environment } from 'environments/environment';
import { GenericService } from 'app/services/generic/generic.service';  
import { AppInformationVersionProductModel } from 'app/models/simplemodel/AppInformationVersionProductModel';

const basePathUrl = '/AppInformationVersionProduct/v1';
@Injectable()
export class AppInformationVersionProductService extends GenericService<AppInformationVersionProductModel, AppInformationVersionProductModel, number> {

  constructor(@Inject(HttpClient) http: HttpClient) {
    super(http, `${environment.APIUrl + basePathUrl}`, '/GetAppInformationVersionProduct');
  }

}
