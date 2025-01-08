import { FormGroup } from '@angular/forms';
import { DayOfWeek } from 'app/models/general/day-of-week';
import { ICalendarEvent } from 'app/models/general/ICalendarEvent';
import { ERecurrenceCalendarType } from 'app/models/medicalcalendar/enuns/ERecurrenceCalendarType';

export class FormHelperCalendar {
  public static getFormHtml(form: FormGroup, patients: any[], labels: any, date: string, selectedEvent: ICalendarEvent): string {
    const patientsOptions = patients.map(p =>
      `<option value="${p.id}" ${selectedEvent && selectedEvent.medicalCalendar && p.id === selectedEvent.medicalCalendar.patientId ? 'selected' : ''}>${p.text}</option>`
    ).join('');

    const recurrenceOptions = Object.keys(ERecurrenceCalendarType)
      .filter(key => isNaN(Number(key))) // Filtra apenas as chaves que não são números
      .map(key => `<option value="${ERecurrenceCalendarType[key]}" ${selectedEvent && selectedEvent.recurrenceType === ERecurrenceCalendarType[key] ? 'selected' : ''}>${key}</option>`)
      .join('');

    const daysOfWeek = [
      { value: DayOfWeek.Sunday, label: 'Sunday' },
      { value: DayOfWeek.Monday, label: 'Monday' },
      { value: DayOfWeek.Tuesday, label: 'Tuesday' },
      { value: DayOfWeek.Wednesday, label: 'Wednesday' },
      { value: DayOfWeek.Thursday, label: 'Thursday' },
      { value: DayOfWeek.Friday, label: 'Friday' },
      { value: DayOfWeek.Saturday, label: 'Saturday' }
    ];

    const recurrenceDaysOptions = daysOfWeek.map(day =>
      `<div class="form-check">
         <input class="form-check-input" type="checkbox" id="day-${day.value}" value="${day.value}" ${selectedEvent && selectedEvent.recurrenceDays && selectedEvent.recurrenceDays.includes(day.value) ? 'checked' : ''}>
         <label class="form-check-label" for="day-${day.value}">${day.label}</label>
       </div>`
    ).join('');

    return `
      <form>
        <div class="form-group">
          <label for="swal-patient" class="text-left">${labels.labelPatient}</label>
          <select class="form-control" id="swal-patient">
            <option value="">${labels.labelSelectPatient}</option>
            ${patientsOptions}
          </select>
        </div>
        <div class="form-group">
          <label for="swal-title" class="text-left">${labels.labelTitle}</label>
          <input type="text" class="form-control" id="swal-title" value="${form.get('title').value ?? ''}">
        </div>
        <div class="form-group">
          <label for="swal-start" class="text-left">${labels.labelStartTime}</label>
          <input type="time" class="form-control" id="swal-startTime" value="${form.get('startTime').value ?? ''}">
        </div>
        <div class="form-group">
          <label for="swal-end" class="text-left">${labels.labelEndTime}</label>
          <input type="time" class="form-control" id="swal-endTime" value="${form.get('endTime').value ?? ''}">
        </div>
        <div class="form-group">
          <label for="swal-location" class="text-left">${labels.labelLocation}</label>
          <input type="text" class="form-control" id="swal-location" value="${form.get('location').value ?? ''}">
        </div>
        <div class="form-group">
          <label for="swal-color" class="text-left">${labels.labelColor}</label>
          <input type="color" class="form-control" id="swal-color" value="${form.get('colorCategoryHexa').value ?? '#000000'}">
        </div>  
        <div class="form-group">
          <label class="text-left">${labels.labelAllDay}</label>
          <input type="checkbox" id="swal-allDay" ${form.get('allDay').value ? 'checked' : ''}>
        </div>
        <div class="form-group">
          <label for="swal-recurrence" class="text-left">${labels.labelRecurrence}</label>
          <select class="form-control" id="swal-recurrence">
            <option value="">${labels.labelSelectRecurrence}</option>
            ${recurrenceOptions}
          </select>
        </div>
        <div class="form-group" id="recurrence-details" >
          <div class="form-group">
            <label for="swal-recurrenceDays" class="text-left">${labels.labelRecurrenceDays}</label>
            ${recurrenceDaysOptions}
          </div>         
          <div class="form-group">
            <label for="swal-recurrenceCount" class="text-left">${labels.labelRecurrenceCount}</label>
            <input type="number" class="form-control" id="swal-recurrenceCount" value="${form.get('recurrenceCount').value ?? ''}">
          </div>
           <div class="form-group">
            <label for="swal-recurrenceEndDate" class="text-left">${labels.labelRecurrenceEndDate}</label>
            <input type="date" class="form-control" id="swal-recurrenceEndDate" value="${form.get('recurrenceEndDate').value ?? ''}">
          </div>
        </div>
      </form>

      <script>
        document.getElementById('swal-recurrence').addEventListener('change', function() {
          const recurrenceDetails = document.getElementById('recurrence-details');
          recurrenceDetails.style.display = this.value ? 'block' : 'none';
        });
      </script>
    `;
  }
}
//style="display: none;"