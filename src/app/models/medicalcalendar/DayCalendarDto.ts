import { TimeSlotDto } from './TimeSlotDto';

export interface DayCalendarDto {
  date: Date;
  timeSlots: TimeSlotDto[];
  dayOfWeek?:string;
}