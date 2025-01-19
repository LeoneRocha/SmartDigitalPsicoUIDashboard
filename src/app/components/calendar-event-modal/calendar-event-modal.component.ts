import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DayOfWeek } from 'app/models/general/day-of-week';
import { ICalendarEvent } from 'app/models/general/ICalendarEvent';
import { ERecurrenceCalendarType } from 'app/models/medicalcalendar/enuns/ERecurrenceCalendarType';
import { DatePipe } from '@angular/common'
import * as moment from 'moment';
@Component({
  selector: 'app-calendar-event-modal',
  templateUrl: './calendar-event-modal.component.html',
  styleUrls: ['./calendar-event-modal.component.css'],
  providers: [DatePipe] // Adicione isso para usar o DatePipe
})

export class CalendarEventModalComponent implements OnInit {
  labelFormTitle: string = '';

  @Input() form: FormGroup;
  @Input() patients: any[];
  @Input() labels: any;
  @Input() selectedEvent?: ICalendarEvent;
  @Input() inputDateIsoString: string;
  @Input() languageUI: string;

  daysOfWeek = [
    { value: DayOfWeek.Sunday, label: 'Sunday' },
    { value: DayOfWeek.Monday, label: 'Monday' },
    { value: DayOfWeek.Tuesday, label: 'Tuesday' },
    { value: DayOfWeek.Wednesday, label: 'Wednesday' },
    { value: DayOfWeek.Thursday, label: 'Thursday' },
    { value: DayOfWeek.Friday, label: 'Friday' },
    { value: DayOfWeek.Saturday, label: 'Saturday' }
  ];

  recurrenceOptions = Object.keys(ERecurrenceCalendarType)
    .filter(key => isNaN(Number(key))) // Filtra apenas as chaves que não são números
    .map(key => ({
      value: Number(key),
      label: key
    }));

  constructor(private datePipe: DatePipe) {
  }

  ngOnInit(): void {
    // Initialize if necessary
    console.log('----------------------CalendarEventModalComponent - ngOnInit-------------------------');
    console.log({ form: this.form, patients: this.patients, labels: this.labels, selectedEvent: this.selectedEvent, inputDateIsoString: this.inputDateIsoString, languageUI: this.languageUI });
    this.labelFormTitle = this.selectedEvent ? this.labels.labelEditEvent : this.labels.labelCreateEvent;
  }
  getFormattedDate(dateStr: string): string { 
    return moment(dateStr).locale(this.languageUI).format('LL'); // Formata a data de acordo com o idioma
  }
}