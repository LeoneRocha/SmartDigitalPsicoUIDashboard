import { FormGroup } from '@angular/forms';


export class FormHelperCalendar {
    
    public static getFormHtml(form: FormGroup, patients: any[], labels: any): string {
        const patientsOptions = patients.map(p => `<option value="${p.id}">${p.text}</option>`).join('');
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
        <label for="swal-start" class="text-left">${labels.labelStartDate}</label>
        <input type="datetime-local" class="form-control" id="swal-start" value="${form.get('start').value ?? ''}">
      </div>
      <div class="form-group">
        <label for="swal-end" class="text-left">${labels.labelEndDate}</label>
        <input type="datetime-local" class="form-control" id="swal-end" value="${form.get('end').value ?? ''}">
      </div>
    </form>
  `;
    }
}