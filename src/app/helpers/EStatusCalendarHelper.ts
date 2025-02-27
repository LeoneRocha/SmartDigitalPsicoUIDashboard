import { Injectable } from '@angular/core';
import { EStatusCalendar } from 'app/models/medicalcalendar/enuns/EStatusCalendar';
import { LanguageService } from 'app/services/general/language.service';

@Injectable({
    providedIn: 'root'
})
export class EStatusCalendarHelper { 

    static getStatusLabel(languageService: LanguageService, status: EStatusCalendar): string {
        const statusMap = {
            [EStatusCalendar.Active]: 'general.calendar.labelStatusActive',
            [EStatusCalendar.Scheduled]: 'general.calendar.labelStatusScheduled',
            [EStatusCalendar.Confirmed]: 'general.calendar.labelStatusConfirmed',
            [EStatusCalendar.Refused]: 'general.calendar.labelStatusRefused',
            [EStatusCalendar.Completed]: 'general.calendar.labelStatusCompleted',
            [EStatusCalendar.NoShow]: 'general.calendar.labelStatusNoShow',
            [EStatusCalendar.PendingConfirmation]: 'general.calendar.labelStatusPendingConfirmation',
            [EStatusCalendar.InProgress]: 'general.calendar.labelStatusInProgress',
            [EStatusCalendar.Rescheduled]: 'general.calendar.labelStatusRescheduled',
            [EStatusCalendar.Canceled]: 'general.calendar.labelStatusCanceled',
            [EStatusCalendar.PendingCancellation]: 'general.calendar.labelStatusPendingCancellation'
        };
        return languageService.getTranslateInformationAsync(statusMap[status]);
    }

    static getStatusIconAndClass(status: EStatusCalendar): { icon: string, class: string } {
        const iconClassMap = {
          [EStatusCalendar.Active]: { icon: 'pe-7s-check', class: 'text-success' },
          [EStatusCalendar.Scheduled]: { icon: 'pe-7s-clock', class: 'text-primary' },
          [EStatusCalendar.Confirmed]: { icon: 'pe-7s-check', class: 'text-success' },
          [EStatusCalendar.Refused]: { icon: 'pe-7s-close', class: 'text-danger' },
          [EStatusCalendar.Completed]: { icon: 'pe-7s-check', class: 'text-success' },
          [EStatusCalendar.NoShow]: { icon: 'pe-7s-close-circle', class: 'text-danger' },
          [EStatusCalendar.PendingConfirmation]: { icon: 'pe-7s-help1', class: 'text-warning' },
          [EStatusCalendar.InProgress]: { icon: 'pe-7s-forward', class: 'text-info' },
          [EStatusCalendar.Rescheduled]: { icon: 'pe-7s-refresh-2', class: 'text-warning' },
          [EStatusCalendar.Canceled]: { icon: 'pe-7s-close-circle', class: 'text-danger' },
          [EStatusCalendar.PendingCancellation]: { icon: 'pe-7s-help1', class: 'text-warning' }
        };
        return iconClassMap[status];
      } 
}
