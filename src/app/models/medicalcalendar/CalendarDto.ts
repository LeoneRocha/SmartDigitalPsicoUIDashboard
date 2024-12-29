import { DayCalendarDto } from './DayCalendarDto';

export interface CalendarDto {
  medicalId: number;
  medicalName: string;
  days: DayCalendarDto[];
}