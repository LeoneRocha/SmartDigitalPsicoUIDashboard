import { ERecurrenceCalendarType } from "../medicalcalendar/enuns/ERecurrenceCalendarType";
import { GetMedicalCalendarTimeSlotDto } from "../medicalcalendar/GetMedicalCalendarTimeSlotDto";
import { DayOfWeek } from "./day-of-week";



export interface ICalendarEvent {
  title: string;
  start: Date;
  end?: Date;
  allDay?: boolean;
  className: string;
  id?: number;
  url?: string;
  medicalId?: number;
  patientId?: number;
  medicalCalendar?: GetMedicalCalendarTimeSlotDto;
  colorCategoryHexa?: string;
  location?: string;
  recurrenceDays?: DayOfWeek[];
  recurrenceType?: ERecurrenceCalendarType;
  recurrenceEndDate?: Date;
  recurrenceCount?: number;
  updateSeries?: boolean;
  tokenRecurrence?: string;
}
