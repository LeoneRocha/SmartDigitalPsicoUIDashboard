import { CalendarCriteriaDtoBase } from './CalendarCriteriaDtoBase';

export interface CalendarCriteriaDto extends CalendarCriteriaDtoBase {
  intervalInMinutes: number;
  filterDaysAndTimesWithAppointments: boolean;
  filterByDate?: Date;
}