import { EScheduleCalendarType } from './enuns/EScheduleCalendarType';

export interface ScheduleCriteriaDto {
  appointmentDateTime: Date;
  reason: string;
  timeZone: string;
  scheduleType: EScheduleCalendarType;
  patientId: number;
  medicalId: number;
  userIdLogged: number;
}