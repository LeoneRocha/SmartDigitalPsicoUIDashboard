import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { DayOfWeek } from 'app/models/general/day-of-week';
import { ICalendarEvent } from 'app/models/general/ICalendarEvent';
import { ERecurrenceCalendarType } from 'app/models/medicalcalendar/enuns/ERecurrenceCalendarType';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';
import { ILabelsEventModalForm } from 'app/models/LabelsEventModalForm';
import { FormHelperCalendar } from 'app/helpers/formHelperCalendar';

@Component({
  selector: 'app-calendar-event-modal',
  templateUrl: './calendar-event-modal.component.html',
  styleUrls: ['./calendar-event-modal.component.css'],
  providers: [DatePipe] // Adicione isso para usar o DatePipe
})
export class CalendarEventModalComponent implements OnInit, AfterViewInit {
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

  constructor(private datePipe: DatePipe, private fb: FormBuilder) { }

  ngOnInit(): void {
    // Initialize if necessary
    //console.log('----------------------CalendarEventModalComponent - ngOnInit-------------------------');
    //console.log({ form: this.form, patients: this.patients, labels: this.labels, selectedEvent: this.selectedEvent, inputDateIsoString: this.inputDateIsoString, languageUI: this.languageUI });

    // Inicialize o FormGroup com os controles de formulário necessários
    this.form = this.fb.group({
      title: ['', Validators.required],
      patientId: ['', Validators.required],
      startTime: [this.form.value.startTime, Validators.required],
      endTime: [this.form.value.endTime, Validators.required],
      location: [''],
      colorCategoryHexa: [''],
      allDay: [false],
      recurrenceType: [''],
      recurrenceDays: this.fb.array([]),
      recurrenceEndDate: [''],
      recurrenceCount: [0],
      updateSeries: [false]
    });

    // Configure se necessário
    this.labelFormTitle = this.selectedEvent && this.selectedEvent.id > 0 ? this.labels.labelEditEvent : this.labels.labelCreateEvent;
    this.labelFormSave = this.selectedEvent && this.selectedEvent.id > 0 ? this.labels.labelBtnUpdate : this.labels.labelBtnSave;

    this.isEditMode = !!this.selectedEvent && !!this.selectedEvent.id;
    this.tokenRecurrence = this.selectedEvent?.medicalCalendar?.tokenRecurrence || null;

    this.initializeRecurrenceOptions();
    this.initializeDaysOfWeek();
    this.populateForm();
    this.setRecurrenceValidators();
  }

  ngAfterViewInit(): void {
    // Coloca o foco no campo título quando o componente for renderizado
    setTimeout(() => {
      this.titleInput.nativeElement.focus();
      // Marca o campo isRecurring se tokenRecurrence estiver presente
      if (this.tokenRecurrence) {
        this.isRecurring = true;
        this.setRecurrenceValidators();
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

  populateForm(): void {
    const startDateTime = moment(this.selectedEvent?.start);
    const endTimeDateTime = moment(this.selectedEvent?.end);
    let tiltleEvent = this.labels.labelTitle;

    if (this.selectedEvent && this.selectedEvent.medicalCalendar) {
      tiltleEvent = this.selectedEvent.medicalCalendar.title ?? this.selectedEvent.medicalCalendar.patientName;
    }
    tiltleEvent
    if (this.selectedEvent && this.selectedEvent?.id > 0) {
      const dataRegister = this.selectedEvent.medicalCalendar;

      this.form.patchValue({
        title: tiltleEvent,
        patientId: dataRegister.patientId,
        startTime: startDateTime.format('HH:mm'),
        endTime: endTimeDateTime.format('HH:mm'),
        location: dataRegister.location,
        colorCategoryHexa: dataRegister.colorCategoryHexa,
        allDay: dataRegister.isAllDay,
        recurrenceType: dataRegister.recurrenceType,
        recurrenceEndDate: dataRegister.recurrenceEndDate ? moment(dataRegister.recurrenceEndDate).format('YYYY-MM-DD') : '',
        recurrenceCount: dataRegister.recurrenceCount,
        updateSeries: false
      });

      if (dataRegister?.recurrenceDays) {
        const recurrenceDaysArray = dataRegister.recurrenceDays.map(day => this.fb.control(day));
        this.form.setControl('recurrenceDays', this.fb.array(recurrenceDaysArray, Validators.required));
      }
    } else {
      this.form.patchValue({
        title: tiltleEvent,
        updateSeries: false
      });
    }
  }

  checkRecurrenceDaysFormIsValid(): void {
    const recurrenceDaysArray = this.form.get('recurrenceDays') as FormArray;
    if (recurrenceDaysArray.length === 0) {
      this.form.get('recurrenceDays').setErrors({ required: true });
    } else {
      this.form.get('recurrenceDays').setErrors(null);
    }    
    this.form.get('recurrenceDays').updateValueAndValidity();
  }

  onRecurrenceDayChange(day: number): void {
    const recurrenceDaysArray = this.form.get('recurrenceDays') as FormArray;
    if (recurrenceDaysArray.value.includes(day)) {
      const index = recurrenceDaysArray.value.indexOf(day);
      recurrenceDaysArray.removeAt(index);
    } else {
      recurrenceDaysArray.push(this.fb.control(day));
    }
  
    this.form.setControl('recurrenceDays', recurrenceDaysArray); // Adiciona o array ao campo recurrenceDays
    this.checkRecurrenceDaysFormIsValid();
  }
  
 
  setRecurrenceValidators(): void {
    if (this.isRecurring) {
      this.form.get('recurrenceType').setValidators(Validators.required);
      this.form.get('recurrenceDays').setValidators(Validators.required);
      this.form.get('recurrenceEndDate').setValidators(Validators.required);
      this.form.get('recurrenceCount').setValidators(Validators.required);
      this.checkRecurrenceDaysFormIsValid(); 
    } else {
      this.form.get('recurrenceType').clearValidators();
      this.form.get('recurrenceDays').clearValidators();
      this.form.get('recurrenceEndDate').clearValidators();
      this.form.get('recurrenceCount').clearValidators();
    }
    this.form.get('recurrenceType').updateValueAndValidity();
    this.form.get('recurrenceDays').updateValueAndValidity();
    this.form.get('recurrenceEndDate').updateValueAndValidity();
    this.form.get('recurrenceCount').updateValueAndValidity();
  }

  toggleIsAllDay(): void {
    this.isAllDay = !this.isAllDay;
    FormHelperCalendar.checkFormValidity(this.form)
  }

  toggleRecurrence(): void {
    this.isRecurring = !this.isRecurring;
    this.setRecurrenceValidators();
  }
}
