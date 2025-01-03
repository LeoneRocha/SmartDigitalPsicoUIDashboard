import { CalendarCriteriaDtoBase } from './CalendarCriteriaDtoBase';

export interface CalendarCriteriaDtoWithPatientIdBase extends CalendarCriteriaDtoBase {
  patientId: number;
}