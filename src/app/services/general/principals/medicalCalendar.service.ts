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

    findByID(id: number): Observable<ServiceResponse<GetMedicalCalendarDto>> {
        return this._http.get<ServiceResponse<GetMedicalCalendarDto>>(`${this.baseUrlLocal}/schedule/${id}`, { headers: this.getHeaders() });
    }

    create(newEntity: GetMedicalCalendarDto): Observable<ServiceResponse<GetMedicalCalendarDto>> {
        return this._http.post<ServiceResponse<GetMedicalCalendarDto>>(`${this.baseUrlLocal}/schedule`, newEntity, { headers: this.getHeaders() });
    }

    updateAny(updateEntity: UpdateMedicalCalendarDto): Observable<ServiceResponse<GetMedicalCalendarDto>> {
        return this._http.put<ServiceResponse<GetMedicalCalendarDto>>(`${this.baseUrlLocal}/schedule`, updateEntity, { headers: this.getHeaders() });
    }

    deleteByRequest(request: UpdateMedicalCalendarDto): Observable<ServiceResponse<boolean>> {
        return this.httpLocal.delete<ServiceResponse<boolean>>(`${this.baseUrlLocal}/schedule`, { headers: this.getHeaders(), body: request });
    }

    getMonthlyCalendar(criteria: CalendarCriteriaDto): Observable<ServiceResponse<CalendarDto>> {
        let headers = this.getHeaders(); 
        return this._http.post<ServiceResponse<CalendarDto>>(`${this.baseUrlLocal}/calendar`, criteria, { headers: headers })
            .pipe(map(response => { return response; }), catchError(super.customHandleError));
    }

    getAvailableMedicalCalendar(criteria: CalendarCriteriaDto): Observable<ServiceResponse<CalendarDto>> {
        return this._http.post<ServiceResponse<CalendarDto>>(`${this.baseUrlLocal}/available`, criteria, { headers: this.getHeaders() });
    }

    sendAppointments(criteria: ScheduleCriteriaDto): Observable<ServiceResponse<CalendarDto>> {
        return this._http.post<ServiceResponse<CalendarDto>>(`${this.baseUrlLocal}/appointment/send`, criteria, { headers: this.getHeaders() });
    }
    getAppointments(criteria: AppointmentCriteriaDto): Observable<ServiceResponse<AppointmentDto[]>> {
        return this._http.post<ServiceResponse<AppointmentDto[]>>(`${this.baseUrlLocal}/appointment/get`, criteria, { headers: this.getHeaders() });
    }
}