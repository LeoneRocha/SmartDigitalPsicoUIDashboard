import { Injectable, Inject } from '@angular/core';
import { Observable, catchError, map } from 'rxjs'; 
import { CalendarCriteriaDto } from 'app/models/medicalcalendar/CalendarCriteriaDto';
import { CalendarDto } from 'app/models/medicalcalendar/CalendarDto';
import { ServiceResponse } from 'app/models/ServiceResponse';
import { MedicalCalendarService } from '../principals/medicalCalendar.service';

@Injectable({
  providedIn: 'root',
})
export class CalendarEventService {
  constructor(private medicalCalendarService: MedicalCalendarService) {}

  getCalendarEvents(criteria: CalendarCriteriaDto): Observable<any[]> {
    return this.medicalCalendarService.getMonthlyCalendar(criteria).pipe(
      map((response: ServiceResponse<CalendarDto>) => {
        return response.data.days.flatMap(day =>
          day.timeSlots.map(slot => ({
            title: slot.isAvailable ? 'Available' : 'Not Available',
            start: slot.startTime,
            end: slot.endTime,
            className: slot.isAvailable ? 'event-success' : 'event-danger'
          }))
        );
      }),
      catchError(error => {
        console.error('Erro ao carregar eventos do calendário', error);
        return [];
      })
    );
  }
}
