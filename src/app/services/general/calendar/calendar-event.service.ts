import { Injectable, Inject } from '@angular/core';
import { Observable, catchError, firstValueFrom, map } from 'rxjs';
import { CalendarCriteriaDto } from 'app/models/medicalcalendar/CalendarCriteriaDto';
import { CalendarDto } from 'app/models/medicalcalendar/CalendarDto';
import { ServiceResponse } from 'app/models/ServiceResponse';
import { MedicalCalendarService } from '../principals/medicalCalendar.service';
import { DateHelper } from 'app/helpers/date-helper';
import { ICalendarEvent } from 'app/models/general/ICalendarEvent';
import { UpdateMedicalCalendarDto } from 'app/models/medicalcalendar/UpdateMedicalCalendarDto';
import { ActionMedicalCalendarDtoBase } from 'app/models/medicalcalendar/ActionMedicalCalendarDtoBase';
import { GetMedicalCalendarDto } from 'app/models/medicalcalendar/GetMedicalCalendarDto';
import { DeleteMedicalCalendarDto } from 'app/models/modelsbyswagger/deleteMedicalCalendarDto';
import { ERecurrenceCalendarType } from 'app/models/medicalcalendar/enuns/ERecurrenceCalendarType';
import { EStatusCalendar } from 'app/models/medicalcalendar/enuns/EStatusCalendar';
import { PatientService } from '../principals/patient.service';
import { PatientModel } from 'app/models/principalsmodel/PatientModel';
import { DropDownEntityModelSelect } from 'app/models/general/dropDownEntityModelSelect';
import * as moment from 'moment';
import { TimeSlotDto } from 'app/models/medicalcalendar/TimeSlotDto';
import { LanguageService } from '../language.service';
import { GetMedicalCalendarTimeSlotDto } from 'app/models/medicalcalendar/GetMedicalCalendarTimeSlotDto';
@Injectable({
  providedIn: 'root',
})
export class CalendarEventService {
  constructor(
    private medicalCalendarService: MedicalCalendarService,
    @Inject(PatientService) private patientService: PatientService
    , private readonly languageService: LanguageService
  ) {
  }

  getCalendarEvents(criteria: CalendarCriteriaDto): Observable<ICalendarEvent[]> {
    return this.medicalCalendarService.getMonthlyCalendar(criteria).pipe(
      map((response: ServiceResponse<CalendarDto>) => this.processCalendarResponse(response)),
      catchError(error => {
        console.error('Erro ao carregar eventos do calendário', error);
        return [];
      })
    );
  }

  getPatientsByMedicalId(medicalId: number): Observable<DropDownEntityModelSelect[]> {
    return this.patientService.getAllByParentId(medicalId, 'medicalId').pipe(
      map((response: ServiceResponse<PatientModel>[]) =>
        response["data"].map(patient => ({
          id: patient.id,
          text: patient.name
        }))
      ),
      catchError(error => {
        console.error('Erro ao carregar pacientes do médico', error);
        return [];
      })
    );
  }

  getPatientsByMedicalId1(medicalId: number): Observable<PatientModel[]> {
    return this.patientService.getAllByParentId(medicalId, 'medicalId').pipe(
      map((response: any) => response.data),
      catchError(error => {
        console.error('Erro ao carregar pacientes do médico', error);
        return [];
      })
    );
  }

  addCalendarEvent(event: ICalendarEvent): Observable<ServiceResponse<GetMedicalCalendarDto>> {
    const newAppointment = this.mapToAddAppointmentDto(event);
    return this.medicalCalendarService.create(newAppointment);
  }

  updateCalendarEvent(event: ICalendarEvent): Observable<ServiceResponse<GetMedicalCalendarDto>> {
    const updateAppointment = this.mapToUpdateAppointmentDto(event);
    return this.medicalCalendarService.updateAny(updateAppointment);
  }

  deleteCalendarEvent(eventId: number): Observable<ServiceResponse<boolean>> {
    const deleteAppointment: DeleteMedicalCalendarDto = { id: eventId, deleteSeries: false, tokenRecurrence: '' };
    return this.medicalCalendarService.deleteByRequest(deleteAppointment);
  }

  private processCalendarResponse(response: ServiceResponse<CalendarDto>): ICalendarEvent[] {
    const sortedDays = DateHelper.sortTimeSlots(response.data.days);
    response.data.days = DateHelper.fillAddDayOfWeek(sortedDays);
    const resultCalendarData = response.data;
    return resultCalendarData.days.flatMap(day => this.filterAndMapTimeSlots(day.timeSlots));
  }

  private filterAndMapTimeSlots(timeSlots: any[]): ICalendarEvent[] {
    const isAvailableLabel = this.languageService.getTranslateInformationAsync('general.calendar.labelIsAvailable');
    const isNotAvailableLabel = this.languageService.getTranslateInformationAsync('general.calendar.labelIsNotAvailable');
    return timeSlots
      .filter(this.isSlotValid)
      .map(data => this.mapToCalendarEvent(data, isAvailableLabel, isNotAvailableLabel));
  }
  private isSlotValid(slot: TimeSlotDto): boolean {
    return slot.isAvailable || slot.medicalCalendar !== null;
  }

  private mapToCalendarEvent(slot: TimeSlotDto, isAvailableLabel: string, isNotAvailableLabel: string): ICalendarEvent {
    const medicalCalendar = slot.medicalCalendar;
    const title = medicalCalendar ? medicalCalendar.patientName : (slot.isAvailable ? isAvailableLabel : isNotAvailableLabel);
    const className = slot.isAvailable ? 'event-green' : 'event-gray';

    return {
      id: medicalCalendar ? medicalCalendar.id : 0,
      title: title,
      start: DateHelper.convertToLocalTime(slot.startTime),
      end: DateHelper.convertToLocalTime(slot.endTime),
      className: className,
      medicalCalendar: medicalCalendar ? this.mapMedicalCalendar(medicalCalendar) : null
    };
  }

  private mapMedicalCalendar(medicalCalendar: GetMedicalCalendarTimeSlotDto): GetMedicalCalendarTimeSlotDto {
    return {
      patientId: medicalCalendar.patientId,
      patientName: medicalCalendar.patientName,
      title: medicalCalendar.title,
      startDateTime: medicalCalendar.startDateTime,
      endDateTime: medicalCalendar.endDateTime,
      isAllDay: medicalCalendar.isAllDay,
      status: medicalCalendar.status,
      colorCategoryHexa: medicalCalendar.colorCategoryHexa,
      isPushedCalendar: medicalCalendar.isPushedCalendar,
      timeZone: medicalCalendar.timeZone,
      location: medicalCalendar.location,
      description: medicalCalendar.description,
      recurrenceDays: medicalCalendar.recurrenceDays,
      recurrenceType: medicalCalendar.recurrenceType,
      recurrenceEndDate: medicalCalendar.recurrenceEndDate,
      recurrenceCount: medicalCalendar.recurrenceCount,
      id: medicalCalendar.id,
      enable: medicalCalendar.enable,
      links: medicalCalendar.links,
      medical: medicalCalendar.medical,
      tokenRecurrence: medicalCalendar.tokenRecurrence,
      patient: medicalCalendar.patient
    };
  }


  private mapToBaseAppointmentDto(event: ICalendarEvent): ActionMedicalCalendarDtoBase {
    let newEntity: ActionMedicalCalendarDtoBase = {
      enable: true,
      id: event.id ?? 0,
      title: event.title,
      startDateTime: event.start,
      endDateTime: event.end,
      isAllDay: event.allDay ?? false,
      status: EStatusCalendar.Active,
      colorCategoryHexa: event.colorCategoryHexa ?? '#000000',
      isPushedCalendar: false,
      timeZone: 'America/Sao_Paulo',
      location: event.location ?? '',
      description: event.title,
      recurrenceDays: event.recurrenceDays ?? [],
      recurrenceType: event.recurrenceType ?? ERecurrenceCalendarType.None,
      recurrenceCount: event.recurrenceCount ?? 0,
      recurrenceEndDate: event.recurrenceEndDate ? moment(event.recurrenceEndDate).utc(true).toDate() : null,
      medicalId: event.medicalId ?? 0,
      patientId: event.patientId ?? 0,
      createdUserId: null,
      modifyUserId: null
    };
    // Convert dates to UTC format
    newEntity.startDateTime = moment(newEntity.startDateTime).utc(true).toDate();
    newEntity.endDateTime = moment(newEntity.endDateTime).utc(true).toDate();
    return newEntity;

  }

  private mapToAddAppointmentDto(event: ICalendarEvent): ActionMedicalCalendarDtoBase {
    return this.mapToBaseAppointmentDto(event);
  }

  private mapToUpdateAppointmentDto(event: ICalendarEvent): UpdateMedicalCalendarDto {
    const baseDto = this.mapToBaseAppointmentDto(event) as UpdateMedicalCalendarDto;
    return {
      ...baseDto,
      updateSeries: false,
      tokenRecurrence: ''
    };
  }
}