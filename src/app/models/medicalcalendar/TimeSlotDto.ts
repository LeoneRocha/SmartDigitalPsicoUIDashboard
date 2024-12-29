import { GetMedicalCalendarTimeSlotDto } from './GetMedicalCalendarTimeSlotDto';

export interface TimeSlotDto {
  startTime: Date;
  endTime?: Date;
  isAvailable: boolean;
  medicalCalendar?: GetMedicalCalendarTimeSlotDto;
  isPast: boolean;
}