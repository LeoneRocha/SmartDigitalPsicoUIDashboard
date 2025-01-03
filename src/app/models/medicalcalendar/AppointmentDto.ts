import { EStatusCalendar } from './enuns/EStatusCalendar';

export interface AppointmentDto {
  medicalName: string;
  medicalId: number;
  startDateTime: Date;
  endDateTime: Date;
  status: EStatusCalendar;
  timeZone: string;
  location: string;
  description: string;
  isPast: boolean;
}