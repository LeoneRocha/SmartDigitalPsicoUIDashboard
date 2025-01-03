import { GetMedicalCalendarTimeSlotDto } from "../medicalcalendar/GetMedicalCalendarTimeSlotDto";

export interface ICalendarEvent {
    title: string;
    start: Date;
    end?: Date;
    allDay?: boolean;
    className: string;
    id?: number;
    url?: string;
    medicalId?:number;
    patientId?:number;
    medicalCalendar?: GetMedicalCalendarTimeSlotDto;
  }