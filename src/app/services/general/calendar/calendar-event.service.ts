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
import { EStatusCalendar } from 'app/models/medicalcalendar/enuns/EStatusCalendar';
import { PatientService } from '../principals/patient.service';
import { PatientModel } from 'app/models/principalsmodel/PatientModel';
import { DropDownEntityModelSelect } from 'app/models/general/dropDownEntityModelSelect';
import * as moment from 'moment';
import { TimeSlotDto } from 'app/models/medicalcalendar/TimeSlotDto';
import { LanguageService } from '../language.service';
import { GetMedicalCalendarTimeSlotDto } from 'app/models/medicalcalendar/GetMedicalCalendarTimeSlotDto';
import { DayOfWeek } from 'app/models/general/day-of-week';
import { DayCalendarDto } from 'app/models/medicalcalendar/DayCalendarDto';
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
    const newAppointment = this.mapToAddCalendarEvent(event);
    return this.medicalCalendarService.create(newAppointment);
  }

  updateCalendarEvent(event: ICalendarEvent): Observable<ServiceResponse<GetMedicalCalendarDto>> {
    const updateAppointment = this.mapToUpdateCalendarEvent(event);
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
    return resultCalendarData.days.flatMap(day => this.filterAndMapTimeSlots(day, day.timeSlots));
  }

  private filterAndMapTimeSlots(day: DayCalendarDto, timeSlots: any[]): ICalendarEvent[] {
    const isAvailableLabel = this.languageService.getTranslateInformationAsync('general.calendar.labelIsAvailable');
    const isNotAvailableLabel = this.languageService.getTranslateInformationAsync('general.calendar.labelIsNotAvailable');
    return timeSlots
      .filter(this.isSlotValid)
      .map(timeSlot => this.mapToCalendarEvent(day, timeSlot, isAvailableLabel, isNotAvailableLabel));
  }
  private isSlotValid(slot: TimeSlotDto): boolean {
    return slot.isAvailable || slot.medicalCalendar !== null;
  }

  private mapToCalendarEvent(day: DayCalendarDto, slot: TimeSlotDto, isAvailableLabel: string, isNotAvailableLabel: string): ICalendarEvent {
    const medicalCalendar = slot.medicalCalendar;
    const title = medicalCalendar ? medicalCalendar.patientName : (slot.isAvailable && slot.isPast == false ? isAvailableLabel : isNotAvailableLabel);
    const className = getClassNameEvent(slot, medicalCalendar);

    const eventResult: ICalendarEvent = {
      id: medicalCalendar ? medicalCalendar.id : 0,
      title: title,
      start: DateHelper.convertToLocalTime(slot.startTime),
      end: DateHelper.convertToLocalTime(slot.endTime),
      className: className,
      backgroundColor: getColorBackGround(medicalCalendar, slot),
      textColor: '#fff',
      editable: !slot.isPast,
      isPastDate: day.isPast,
      medicalCalendar: medicalCalendar ? this.mapMedicalCalendar(medicalCalendar) : null,
      status: medicalCalendar ? medicalCalendar.status : 0,
      isTimeFieldEditable: false,
    };
    return eventResult;
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


  private mapToActionCalendarEventBase(event: ICalendarEvent): ActionMedicalCalendarDtoBase {
    let recurrenceTypeValue = 0;

    if (event.recurrenceType !== null && !isNaN(Number(event.recurrenceType))) {
      recurrenceTypeValue = typeof event.recurrenceType === 'string' ? Number(event.recurrenceType) : event.recurrenceType;
    }

    let recurrenceDaysValue: DayOfWeek[] = [];

    if (event.recurrenceDays && event.recurrenceDays.length > 0) {
      recurrenceDaysValue = event.recurrenceDays.filter(day => !isNaN(Number(day)));
    }
    let newEntity: ActionMedicalCalendarDtoBase = {
      enable: true,
      id: event.id ?? 0,
      title: event.title,
      startDateTime: event.start,
      endDateTime: event.end,
      isAllDay: event.allDay ?? false,
      status: event.status ?? 0,
      colorCategoryHexa: event.colorCategoryHexa ?? '#000000',
      isPushedCalendar: false,
      timeZone: 'America/Sao_Paulo',
      location: event.location ?? '',
      description: event.title,
      recurrenceDays: recurrenceDaysValue,
      recurrenceType: recurrenceTypeValue,
      recurrenceCount: event.recurrenceCount ?? 0,
      recurrenceEndDate: event.recurrenceEndDate ? moment(event.recurrenceEndDate).utc(true).toDate() : null,
      medicalId: event.medicalId ?? 0,
      patientId: event.patientId ?? 0,
      createdUserId: null,
      modifyUserId: null,
      updateSeries: event.updateSeries ?? false,
      tokenRecurrence: event.tokenRecurrence
    };

    // Convert dates to UTC format
    newEntity.startDateTime = moment(newEntity.startDateTime).utc(true).toDate();
    newEntity.endDateTime = moment(newEntity.endDateTime).utc(true).toDate();
    return newEntity;
  }



  private mapToAddCalendarEvent(event: ICalendarEvent): ActionMedicalCalendarDtoBase {
    return this.mapToActionCalendarEventBase(event);
  }

  private mapToUpdateCalendarEvent(event: ICalendarEvent): UpdateMedicalCalendarDto {
    const baseDto = this.mapToActionCalendarEventBase(event) as UpdateMedicalCalendarDto;
    return {
      ...baseDto
    };
  }
}

function getColorBackGround(medicalCalendar: GetMedicalCalendarTimeSlotDto, slot: TimeSlotDto): string {

  if (medicalCalendar && medicalCalendar.colorCategoryHexa) {
    return medicalCalendar.colorCategoryHexa;
  }
  if (slot.isAvailable && !slot.isPast) {
    return 'green';
  }
  if (slot.isPast) {
    return 'gray';
  }
  return null;
}
function getClassNameEvent(slot: TimeSlotDto, medicalCalendar: GetMedicalCalendarTimeSlotDto): string {
  let classResult = "event-gray";
  if (medicalCalendar && medicalCalendar.id > 0 && !slot.isPast) {
    return 'event-azure';
  }
  if (slot.isAvailable && !slot.isPast) {
    return 'event-green';
  }
  return classResult;
} 