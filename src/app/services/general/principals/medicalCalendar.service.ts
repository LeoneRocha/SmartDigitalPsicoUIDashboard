import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map } from 'rxjs';
import { environment } from 'environments/environment';
import { GenericService } from 'app/services/generic/generic.service';
import { GetMedicalCalendarDto } from 'app/models/medicalcalendar/GetMedicalCalendarDto';
import { UpdateMedicalCalendarDto } from 'app/models/medicalcalendar/UpdateMedicalCalendarDto';
import { CalendarCriteriaDto } from 'app/models/medicalcalendar/CalendarCriteriaDto';
import { CalendarDto } from 'app/models/medicalcalendar/CalendarDto';
import { ScheduleCriteriaDto } from 'app/models/medicalcalendar/ScheduleCriteriaDto';
import { AppointmentCriteriaDto } from 'app/models/medicalcalendar/AppointmentCriteriaDto';
import { AppointmentDto } from 'app/models/medicalcalendar/AppointmentDto';
import { ServiceResponse } from 'app/models/ServiceResponse';
import { ActionMedicalCalendarDtoBase } from 'app/models/medicalcalendar/ActionMedicalCalendarDtoBase';
import { DeleteMedicalCalendarDto } from 'app/models/modelsbyswagger/deleteMedicalCalendarDto';

const basePathUrl = '/medical/v1/medicalcalendar';

@Injectable({
  providedIn: 'root',
})
export class MedicalCalendarService extends GenericService<ServiceResponse<GetMedicalCalendarDto>, GetMedicalCalendarDto, number> {
  private readonly _http: HttpClient;
  private readonly baseUrlLocal: string = `${environment.APIUrl + basePathUrl}`;

  constructor(@Inject(HttpClient) http: HttpClient) {
    super(http, `${environment.APIUrl + basePathUrl}`, '/FindAll');
    this._http = http;
  }

  private makePostRequest<T>(url: string, body: any): Observable<ServiceResponse<T>> {
    return this._http.post<ServiceResponse<T>>(url, body, { headers: this.getHeaders() })
      .pipe(
        map(response => response),
        catchError(super.customHandleError)
      );
  }

  findByID(id: number): Observable<ServiceResponse<GetMedicalCalendarDto>> {
    return this._http.get<ServiceResponse<GetMedicalCalendarDto>>(`${this.baseUrlLocal}/schedule/${id}`, { headers: this.getHeaders() })
      .pipe(
        map(response => response),
        catchError(super.customHandleError)
      );
  }

  create(newEntity: ActionMedicalCalendarDtoBase): Observable<ServiceResponse<GetMedicalCalendarDto>> { 
    return this.makePostRequest<GetMedicalCalendarDto>(`${this.baseUrlLocal}/schedule`, newEntity);
  }

  updateAny(updateEntity: UpdateMedicalCalendarDto): Observable<ServiceResponse<GetMedicalCalendarDto>> {
    return this._http.put<ServiceResponse<GetMedicalCalendarDto>>(`${this.baseUrlLocal}/schedule`, updateEntity, { headers: this.getHeaders() })
      .pipe(
        map(response => response),
        catchError(super.customHandleError)
      );
  }

  deleteByRequest(request: DeleteMedicalCalendarDto): Observable<ServiceResponse<boolean>> {
    return this.httpLocal.delete<ServiceResponse<boolean>>(`${this.baseUrlLocal}/schedule`, { headers: this.getHeaders(), body: request })
      .pipe(
        map(response => response),
        catchError(super.customHandleError)
      );
  }

  getMonthlyCalendar(criteria: CalendarCriteriaDto): Observable<ServiceResponse<CalendarDto>> {
    return this.makePostRequest<CalendarDto>(`${this.baseUrlLocal}/calendar`, criteria);
  }

  getAvailableMedicalCalendar(criteria: CalendarCriteriaDto): Observable<ServiceResponse<CalendarDto>> {
    return this.makePostRequest<CalendarDto>(`${this.baseUrlLocal}/available`, criteria);
  }

  sendAppointments(criteria: ScheduleCriteriaDto): Observable<ServiceResponse<CalendarDto>> {
    return this.makePostRequest<CalendarDto>(`${this.baseUrlLocal}/appointment/send`, criteria);
  }

  getAppointments(criteria: AppointmentCriteriaDto): Observable<ServiceResponse<AppointmentDto[]>> {
    return this.makePostRequest<AppointmentDto[]>(`${this.baseUrlLocal}/appointment/get`, criteria);
  }
}
