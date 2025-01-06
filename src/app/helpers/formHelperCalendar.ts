import { FormGroup } from '@angular/forms';

export class FormHelperCalendar {
  public static getFormHtml(form: FormGroup, patients: any[], labels: any, date: string, selectedEvent: any): string {
    const patientsOptions = patients.map(p => 
      `<option value="${p.id}" ${selectedEvent && selectedEvent.medicalCalendar && p.id === selectedEvent.medicalCalendar.patientId ? 'selected' : ''}>${p.text}</option>`
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
        <div class="form-group" style="display: none;">
          <input type="text" class="form-control" id="swal-dateEvent" value="${form.get('dateEvent').value ?? new Date()}">
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
      </form>
    `;
  }
}
