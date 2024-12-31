import { Injectable, Inject } from '@angular/core';
import { Observable, catchError, map } from 'rxjs';
import { CalendarCriteriaDto } from 'app/models/medicalcalendar/CalendarCriteriaDto';
import { CalendarDto } from 'app/models/medicalcalendar/CalendarDto';
import { ServiceResponse } from 'app/models/ServiceResponse';
import { MedicalCalendarService } from '../principals/medicalCalendar.service';
import { DateHelper } from 'app/helpers/date-helper'; 
import { ICalendarEvent } from 'app/models/general/ICalendarEvent';

@Injectable({
  providedIn: 'root',
})
export class CalendarEventService {
  constructor(private medicalCalendarService: MedicalCalendarService) { }

  getCalendarEvents(criteria: CalendarCriteriaDto): Observable<ICalendarEvent[]> {
    return this.medicalCalendarService.getMonthlyCalendar(criteria).pipe(
      map((response: ServiceResponse<CalendarDto>) => {
        const daysResult = DateHelper.sortTimeSlots(response.data.days);
        response.data.days = DateHelper.fillAddDayOfWeek(daysResult);
        const resultCalendarData = response.data;
        const eventsResult: ICalendarEvent[] = resultCalendarData.days.flatMap(day =>
          day.timeSlots.map(slot => ({
            title: slot.isAvailable ? 'Available' : 'Not Available',
            start: DateHelper.convertToLocalTime(slot.startTime),
            end: DateHelper.convertToLocalTime(slot.endTime),
            className: slot.isAvailable ? 'event-green' : 'event-gray'
          }))
        );
        //console.log('-------------------- getCalendarEvents --------------------');
        //console.log(eventsResult);
        return eventsResult;
      }),
      catchError(error => {
        console.error('Erro ao carregar eventos do calendário', error);
        return [];
      })
    );
  }
}
