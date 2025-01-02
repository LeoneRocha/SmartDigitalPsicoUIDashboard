import { Injectable, Inject } from '@angular/core';
import { Observable, catchError, map } from 'rxjs';
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
@Injectable({
  providedIn: 'root',
})
export class CalendarEventService {
  constructor(
    private medicalCalendarService: MedicalCalendarService,
    @Inject(PatientService) private patientService: PatientService
  ) { }

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
    console.log('-------------------- addCalendarEvent --------------------');
    console.log(newAppointment);
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
    return timeSlots
      .filter(this.isSlotValid)
      .map(this.mapToCalendarEvent);
  }

  private isSlotValid(slot: any): boolean {
    return slot.isAvailable || slot.medicalCalendar !== null;
  }

  private mapToCalendarEvent(slot: any): ICalendarEvent {
    return {
      id: slot.id,
      title: slot.isAvailable ? 'Available' : 'Not Available',
      start: DateHelper.convertToLocalTime(slot.startTime),
      end: DateHelper.convertToLocalTime(slot.endTime),
      className: slot.isAvailable ? 'event-green' : 'event-gray',
    };
  }

  private mapToAddAppointmentDto(event: ICalendarEvent): ActionMedicalCalendarDtoBase {
    // TODO ABRIR UMA MODAL QUE SEJA POSSIVEL INCLUIR MAIS CAMPOS E FORMULARIOS ESCOLHAR A HORA DENTRO --- POSTERIONENTE BLOQUEAR SO HORARIO DO PROPRIO MEDICO 

    let newEntity: ActionMedicalCalendarDtoBase = {
      enable: true,
      id: 0,
      title: event.title,
      startDateTime: event.start,
      endDateTime: event.end,
      isAllDay: false,
      status: EStatusCalendar.Active,
      colorCategoryHexa: '#000000',
      isPushedCalendar: false,
      timeZone: 'America/Sao_Paulo',
      location: '',
      description: event.title,
      recurrenceDays: [],
      recurrenceType: ERecurrenceCalendarType.None,
      recurrenceCount: 0,
      recurrenceEndDate: null,
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

  private mapToUpdateAppointmentDto(event: ICalendarEvent): UpdateMedicalCalendarDto {
    return {
      enable: true,
      id: event.id,
      title: event.title,
      startDateTime: event.start,
      endDateTime: event.end,
      isAllDay: false,
      status: EStatusCalendar.Active,
      colorCategoryHexa: '#000000',
      isPushedCalendar: false,
      timeZone: 'America/Sao_Paulo',
      location: '',
      description: event.title,
      recurrenceDays: [],
      recurrenceType: ERecurrenceCalendarType.None,
      recurrenceCount: 0,
      recurrenceEndDate: null,
      medicalId: event.medicalId,
      patientId: null,
      createdUserId: null,
      modifyUserId: null,
      updateSeries: false,
      tokenRecurrence: ''
    };
  }
}
