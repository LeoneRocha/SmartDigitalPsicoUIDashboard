import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DayOfWeek } from 'app/models/general/day-of-week';
import { ICalendarEvent } from 'app/models/general/ICalendarEvent';
import { ERecurrenceCalendarType } from 'app/models/medicalcalendar/enuns/ERecurrenceCalendarType';
import { DatePipe } from '@angular/common'
import * as moment from 'moment';
import { ILabelsEventModalForm } from 'app/models/LabelsEventModalForm';
@Component({
  selector: 'app-calendar-event-modal',
  templateUrl: './calendar-event-modal.component.html',
  styleUrls: ['./calendar-event-modal.component.css'],
  providers: [DatePipe] // Adicione isso para usar o DatePipe
})

export class CalendarEventModalComponent implements OnInit {
  labelFormTitle: string = '';
  labelFormSave: string = '';

  @Input() form: FormGroup;
  @Input() patients: any[];
  @Input() labels: ILabelsEventModalForm;
  @Input() selectedEvent?: ICalendarEvent;
  @Input() inputDateIsoString: string;
  @Input() languageUI: string;

  @Output() onClose = new EventEmitter<void>(); // Adicione isso para o evento de fechar
  @Output() onConfirm = new EventEmitter<void>(); // Adicione isso para o evento de confirmar

  @ViewChild('titleInput') titleInput: ElementRef; // ViewChild para acessar o input do título

  daysOfWeek = [];
  recurrenceOptions = [];
  public isRecurring: boolean = false; // Adicione isso para controlar o estado do switch
  isEditMode: boolean = false; // Controle do modo de edição
  tokenRecurrence: string | null = null; // Token de recorrência

  public isAllDay: boolean = false;

  constructor(private datePipe: DatePipe) {
  }

  ngOnInit(): void {
    // Initialize if necessary
    //console.log('----------------------CalendarEventModalComponent - ngOnInit-------------------------');
    //console.log({ form: this.form, patients: this.patients, labels: this.labels, selectedEvent: this.selectedEvent, inputDateIsoString: this.inputDateIsoString, languageUI: this.languageUI });
    this.labelFormTitle = this.selectedEvent && this.selectedEvent.id > 0 ? this.labels.labelEditEvent : this.labels.labelCreateEvent;
    this.labelFormSave = this.selectedEvent && this.selectedEvent.id > 0 ? this.labels.labelBtnUpdate : this.labels.labelBtnSave;

    this.isEditMode = !!this.selectedEvent && !!this.selectedEvent.id;
    this.tokenRecurrence = this.selectedEvent?.medicalCalendar?.tokenRecurrence || null;

    this.initializeRecurrenceOptions();
    this.initializeDaysOfWeek(); 
  }

  ngAfterViewInit(): void {
    // Coloca o foco no campo título quando o componente for renderizado
    setTimeout(() => {
      this.titleInput.nativeElement.focus();

      // Marca o campo isRecurring se tokenRecurrence estiver presente
      if (this.tokenRecurrence) {
        this.isRecurring = true;
      }

      // Marca os dias de recorrência
      if (this.selectedEvent && this.selectedEvent.medicalCalendar && this.selectedEvent.medicalCalendar.recurrenceDays) {
        this.selectedEvent.medicalCalendar.recurrenceDays.forEach(day => {
          const checkbox = document.getElementById(`day-${day}`) as HTMLInputElement;
          if (checkbox) {
            checkbox.checked = true;
          }
        });
      }
    }, 0);
  }


  getFormattedDate(dateStr: string): string {
    return moment(dateStr).locale(this.languageUI).format('LL'); // Formata a data de acordo com o idioma
  }

  initializeDaysOfWeek(): void {
    moment.locale(this.languageUI); // Define o idioma no moment
    const days = moment.weekdays(true); // Obtém os dias da semana no idioma definido

    this.daysOfWeek = [
      { value: DayOfWeek.Sunday, label: days[0] },
      { value: DayOfWeek.Monday, label: days[1] },
      { value: DayOfWeek.Tuesday, label: days[2] },
      { value: DayOfWeek.Wednesday, label: days[3] },
      { value: DayOfWeek.Thursday, label: days[4] },
      { value: DayOfWeek.Friday, label: days[5] },
      { value: DayOfWeek.Saturday, label: days[6] }
    ];
  }
  initializeRecurrenceOptions(): void {
    this.recurrenceOptions = Object.keys(ERecurrenceCalendarType)
      .filter(key => isNaN(Number(key))) // Filtra apenas as chaves que não são números
      .map(key => ({
        value: ERecurrenceCalendarType[key],
        label: this.labels[`labelRecurrence${key}`] // Usa a chave do i18n para buscar o rótulo
      }));
  }
  toggleIsAllDay(): void {
    this.isAllDay = !this.isAllDay;
  }
  toggleRecurrence(): void {
    this.isRecurring = !this.isRecurring;
  }
}