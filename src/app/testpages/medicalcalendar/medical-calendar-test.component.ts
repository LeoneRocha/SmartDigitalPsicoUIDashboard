import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'; 
import { CalendarCriteriaDto } from 'app/models/medicalcalendar/CalendarCriteriaDto';
import { CalendarDto } from 'app/models/medicalcalendar/CalendarDto';
import { ServiceResponse } from 'app/models/ServiceResponse';
import swal from 'sweetalert2';
import { MedicalCalendarService } from 'app/services/general/principals/medicalCalendar.service';

@Component({
  moduleId: module.id,
  selector: 'medical-calendar-test',
  templateUrl: './medical-calendar-test.component.html',
  styleUrls: ['./medical-calendar-test.component.css']
})
export class MedicalCalendarTestComponent implements OnInit {
  calendarData: CalendarDto;
  errorMessage: string;
  calendarForm: FormGroup;

  constructor(
    @Inject(ActivatedRoute) private route: ActivatedRoute,
    private fb: FormBuilder,
    @Inject(Router) private router: Router,
    @Inject(MedicalCalendarService) private medicalCalendarService: MedicalCalendarService
  ) {
    this.createCalendarForm();
  }

  ngOnInit(): void {
    this.getMonthlyCalendar();
  }

  createCalendarForm() {
    this.calendarForm = this.fb.group({
      medicalId: new FormControl('', [Validators.required]),
      month: new FormControl(new Date().getMonth() + 1, [Validators.required]),
      year: new FormControl(new Date().getFullYear(), [Validators.required])
    });
  }

  getMonthlyCalendar(): void {
    const criteria: CalendarCriteriaDto = this.calendarForm.value;
    criteria.userIdLogged = 123; // Substitua pelo ID do usuário logado

    this.medicalCalendarService.getMonthlyCalendar(criteria).subscribe(
      (response: ServiceResponse<CalendarDto>) => {
        if (response.success) {
          this.calendarData = response.data;
        } else {
          this.errorMessage = response.message;
        }
      },
      error => {
        this.errorMessage = 'Erro ao carregar o calendário mensal';
        console.error(error);
      }
    );
  }

  modalSuccessAlert() {
    swal.fire({
      title: 'Calendário carregado com sucesso',
      text: 'Os dados do calendário foram carregados corretamente.',
      timer: 5000,
      buttonsStyling: false,
      customClass: {
        confirmButton: "btn btn-fill btn-success",
      },
      icon: "success"
    });
  }

  modalErroAlert(msgErro: string) {
    swal.fire({
      title: 'Erro',
      text: msgErro,
      icon: 'error',
      customClass: {
        confirmButton: "btn btn-fill btn-info",
      },
      buttonsStyling: false
    });
  }
}
