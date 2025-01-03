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
import { EStatusCalendar } from './eStatusCalendar';

export interface AppointmentDto { 
    medicalName?: string;
    medicalId?: number;
    startDateTime?: Date;
    endDateTime?: Date;
    status?: EStatusCalendar;
    timeZone?: string;
    location?: string;
    description?: string;
    isPast?: boolean;
}