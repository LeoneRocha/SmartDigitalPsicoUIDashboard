import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Inject } from '@angular/core'; 
import { ServiceResponse } from 'app/models/ServiceResponse';
import { environment } from 'environments/environment';
import { GenericService } from 'app/services/generic/generic.service';
import { RoleGroupModel } from 'app/models/simplemodel/RoleGroupModel';

const basePathUrl = '/RoleGroup/v1';
@Injectable()
export class RoleGroupService extends GenericService<ServiceResponse<RoleGroupModel>, RoleGroupModel, number> {

  constructor(@Inject(HttpClient) http: HttpClient) {
    super(http, `${environment.APIUrl + basePathUrl}`, '/FindAll');
  }

}
