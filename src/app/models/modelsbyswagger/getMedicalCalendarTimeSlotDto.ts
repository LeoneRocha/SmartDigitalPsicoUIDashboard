/**
 * SmartDigitalPsico.WebAPI
 * No description provided (generated by Swagger Codegen https://github.com/swagger-api/swagger-codegen)
 *
 * OpenAPI spec version: v1
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */
import { DayOfWeek } from './dayOfWeek';
import { ERecurrenceCalendarType } from './eRecurrenceCalendarType';
import { EStatusCalendar } from './eStatusCalendar';

export interface GetMedicalCalendarTimeSlotDto { 
    id?: number;
    enable?: boolean;
    title?: string;
    startDateTime?: Date;
    endDateTime?: Date;
    isAllDay?: boolean;
    status?: EStatusCalendar;
    colorCategoryHexa?: string;
    isPushedCalendar?: boolean;
    timeZone?: string;
    location?: string;
    description?: string;
    recurrenceDays?: Array<DayOfWeek>;
    recurrenceType?: ERecurrenceCalendarType;
    recurrenceEndDate?: Date;
    recurrenceCount?: number;
    tokenRecurrence?: string;
    patientId?: number;
    readonly patientName?: string;
}