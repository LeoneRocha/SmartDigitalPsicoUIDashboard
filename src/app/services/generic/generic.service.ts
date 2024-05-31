import { HttpClient, HttpHeaders, } from '@angular/common/http';
import { GenericServiceModel } from 'app/models/GenericServiceModel';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Inject } from '@angular/core';
import { BadInput } from 'app/common/errohandler/bad-input';
import { NotFoundError } from 'app/common/errohandler/not-found-error';
import { AppError } from 'app/common/errohandler/app-error';
import { CaptureTologFunc } from 'app/common/errohandler/app-error-handler';
import { FluentValidationResponse } from 'app/models/FluentValidationResponse';
export class GenericService<T, E, ID> implements GenericServiceModel<T, E, ID> {
  protected httpLocal: HttpClient;
  constructor(
    @Inject(HttpClient) private http: HttpClient, private baseUrl: string, private urlgetAll: string) {
    this.httpLocal = http;
  }

  add(t: E): Observable<any> {

    let headers = this.getHeaders();
    return this.http.post<T>(this.baseUrl, t, { headers: headers }).pipe(map(response => { CaptureTologFunc('GenericService-add', response); return response; }), catchError(this.customHandleError));
  }

  update(t: E): Observable<T> {
    let headers = this.getHeaders(); 
    return this.http.put<T>(`${this.baseUrl}/`, t, { headers: headers }).pipe(map(response => { return response; }), catchError(this.customHandleError));
  }

  getById(id: ID): Observable<T> {
    let headers = this.getHeaders();
    return this.http.get<T>(`${this.baseUrl}/${id}`, { headers: headers }).pipe(map(response => { return response; }), catchError(this.customHandleError));
  }

  getAll(): Observable<T[]> {
    let headers = this.getHeaders(); 
    return this.http.get<T[]>(this.baseUrl + this.urlgetAll, { headers: headers }).pipe(map(response => { return response; }), catchError(this.customHandleError));
  }

  getAllByParentId(id: ID, parentProp: string): Observable<T[]> {
    let headers = this.getHeaders();
    return this.http.get<T[]>(`${this.baseUrl + this.urlgetAll}?${parentProp}=${id}`, { headers: headers }).pipe(map(response => { return response; }), catchError(this.customHandleError));
  }

  delete(id: ID): Observable<any> {
    let headers = this.getHeaders();
    return this.http.delete<T>(`${this.baseUrl}/${id}`, { headers: headers }).pipe(map(response => { return response; }), catchError(this.customHandleError));
  }
  getHeaders(): HttpHeaders {

    let token: string = localStorage.getItem('tokenjwt');
    let cultureUI: string = localStorage.getItem("AppLanguageId"); 
    if (cultureUI !== 'pt-BR') {
      cultureUI = "en-US";
    }     
    const headers = new HttpHeaders()
    .set('Access-Control-Allow-Origin', '*')
      .set('Authorization', `Bearer ${token}`)
      .set('X-Culture', cultureUI);
    return headers
  }  
  protected customHandleError(error: Response) { 
    const erroFluentValidationResponse: FluentValidationResponse = { ...error?.['error'] }; 

    if (error.status === 400)
      return throwError(() => new BadInput(error));

    if (error.status === 404)
      return throwError(() => new NotFoundError());

    //return Observable.throw(new AppError(error));
    // Return an observable with a user-facing error message.
    return throwError(() => new AppError(error));
  }


}
