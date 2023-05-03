import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Inject } from '@angular/core';
import { ServiceResponse } from 'app/models/ServiceResponse';
import { environment } from 'environments/environment';
import { GenericService } from 'app/services/generic/generic.service';
import { UserModel, UserProfileModel } from 'app/models/principalsmodel/UserModel';
import { catchError, map, Observable, throwError } from 'rxjs';

const basePathUrl = '/User/v1';
@Injectable()
export class UserService extends GenericService<ServiceResponse<UserModel>, UserModel, number> {
  _http: HttpClient;
  baseUrlLocal: string = `${environment.APIUrl + basePathUrl}`;

  constructor(@Inject(HttpClient) http: HttpClient) {
    super(http, `${environment.APIUrl + basePathUrl}`, '/FindAll');
    this._http = http;
  } 
  
  updateProfile(UserModel: UserProfileModel): Observable<ServiceResponse<UserProfileModel>> {
    let headers = this.getHeaders();
    return this._http.patch<ServiceResponse<UserProfileModel>>(`${this.baseUrlLocal}/`, UserModel, { headers: headers }).pipe(map(response => { return response; }), catchError(super.customHandleError));
  } 
}
