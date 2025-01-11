import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DayOfWeek } from 'app/models/general/day-of-week';
import { ICalendarEvent } from 'app/models/general/ICalendarEvent';
import { ERecurrenceCalendarType } from 'app/models/medicalcalendar/enuns/ERecurrenceCalendarType';

@Component({
  selector: 'app-calendar-event-modal',
  templateUrl: './calendar-event-modal.component.html',
  styleUrls: ['./calendar-event-modal.component.css']
})
  
export class CalendarEventModalComponent implements OnInit {
  @Input() form: FormGroup;
  @Input() patients: any[];
  @Input() labels: any;
  @Input() selectedEvent?: ICalendarEvent;
  @Input() inputDateIsoString: string;

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
      value: ERecurrenceCalendarType[key],
      label: key
    }));

  ngOnInit(): void {
    // Initialize if necessary
    console.log('----------------------CalendarEventModalComponent - ngOnInit-------------------------');
    console.log({ form: this.form, patients: this.patients, labels: this.labels, selectedEvent: this.selectedEvent, inputDateIsoString: this.inputDateIsoString })
  }
}
