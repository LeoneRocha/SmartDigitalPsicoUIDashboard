import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http'; 
import { environment } from 'environments/environment';
import { GenericService } from 'app/services/generic/generic.service';
import { ServiceResponse } from 'app/models/ServiceResponse';
import { EmailTemplateDto } from 'app/models/modelsbyswagger/EmailTemplateDto'; 

const basePathUrl = '/emailtemplate/v1';

@Injectable({
  providedIn: 'root',
})
export class EmailTemplateService extends GenericService<ServiceResponse<EmailTemplateDto>, EmailTemplateDto, number> {
  private readonly _http: HttpClient;
  private readonly baseUrlLocal: string = `${environment.APIUrl + basePathUrl}`;

  constructor(@Inject(HttpClient) http: HttpClient) {
    super(http, `${environment.APIUrl + basePathUrl}`, '/FindAll');
    this._http = http;
  }
 
}
