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
  constructor(private medicalCalendarService: MedicalCalendarService) {}

  getCalendarEvents(criteria: CalendarCriteriaDto): Observable<ICalendarEvent[]> {
    return this.medicalCalendarService.getMonthlyCalendar(criteria).pipe(
      map((response: ServiceResponse<CalendarDto>) => this.processCalendarResponse(response)),
      catchError(error => {
        console.error('Erro ao carregar eventos do calendário', error);
        return [];
      })
    );
  }

  private processCalendarResponse(response: ServiceResponse<CalendarDto>): ICalendarEvent[] {
    const sortedDays = DateHelper.sortTimeSlots(response.data.days);
    response.data.days = DateHelper.fillAddDayOfWeek(sortedDays);
    const resultCalendarData = response.data;
    return resultCalendarData.days.flatMap(day => this.filterAndMapTimeSlots(day.timeSlots));
  }

  private filterAndMapTimeSlots(timeSlots: any[]): ICalendarEvent[] {
    return timeSlots
      .filter(this.isSlotValid)
      .map(this.mapToCalendarEvent);
  }

  private isSlotValid(slot: any): boolean {
    return slot.isAvailable || slot.medicalCalendar !== null;
  }

  private mapToCalendarEvent(slot: any): ICalendarEvent {
    return {
      title: slot.isAvailable ? 'Available' : 'Not Available',
      start: DateHelper.convertToLocalTime(slot.startTime),
      end: DateHelper.convertToLocalTime(slot.endTime),
      className: slot.isAvailable ? 'event-green' : 'event-gray'
    };
  }
}
