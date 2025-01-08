import { EntityDtoBase } from './EntityDtoBase';
import { EStatusCalendar } from './enuns/EStatusCalendar'; 
import { ERecurrenceCalendarType } from './enuns/ERecurrenceCalendarType';
import { DayOfWeek } from '../general/day-of-week';

export interface GetMedicalCalendarDtoBase extends EntityDtoBase {
  title: string;
  startDateTime: Date;
  endDateTime?: Date;
  isAllDay: boolean;
  status: EStatusCalendar;
  colorCategoryHexa: string;
  isPushedCalendar: boolean;
  timeZone: string;
  location: string;
  description: string;
  recurrenceDays: DayOfWeek[];
  recurrenceType: ERecurrenceCalendarType;
  recurrenceEndDate?: Date;
  recurrenceCount: number;
}