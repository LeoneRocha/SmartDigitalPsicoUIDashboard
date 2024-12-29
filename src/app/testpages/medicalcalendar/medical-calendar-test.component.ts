import { Component, OnInit, Inject, AfterContentInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CalendarCriteriaDto } from 'app/models/medicalcalendar/CalendarCriteriaDto';
import { CalendarDto } from 'app/models/medicalcalendar/CalendarDto'; 
import { AuthService } from 'app/services/auth/auth.service';
import swal from 'sweetalert2';
import { ServiceResponse } from 'app/models/ServiceResponse';
import { MedicalCalendarService } from 'app/services/general/principals/medicalCalendar.service';
declare var $: any;

@Component({
  moduleId: module.id,
  selector: 'medical-calendar-test',
  templateUrl: './medical-calendar-test.component.html',
  styleUrls: ['./medical-calendar-test.component.css']
})
export class MedicalCalendarTestComponent implements OnInit, AfterContentInit, AfterViewInit {
  calendarData: CalendarDto;
  errorMessage: string;
  calendarForm: FormGroup;
  parentId: number;
  userLoged: any;
  serviceResponse: ServiceResponse<CalendarDto>;
  
  constructor(
    @Inject(ActivatedRoute) private route: ActivatedRoute,
    private fb: FormBuilder,
    @Inject(Router) private router: Router,
    @Inject(MedicalCalendarService) private medicalCalendarService: MedicalCalendarService,
    @Inject(AuthService) private authService: AuthService
  ) {
    this.createCalendarForm();
  }

  ngOnInit(): void {
    this.userLoged = this.authService.getLocalStorageUser();
    this.getParentId();
    this.loadFormRegister();
  }

  ngAfterContentInit(): void {
    this.loadBootstrap();
  }

  ngAfterViewInit(): void { }

  createCalendarForm() {
    this.calendarForm = this.fb.group({
      medicalId: new FormControl('', [Validators.required]),
      month: new FormControl(new Date().getMonth() + 1, [Validators.required]),
      year: new FormControl(new Date().getFullYear(), [Validators.required]),
      intervalInMinutes: new FormControl(60), // Valor padrão de 60 minutos
      filterDaysAndTimesWithAppointments: new FormControl(false),
      filterByDate: new FormControl()
    });
  }

  getParentId(): number {
    
    const paramsUrl = this.route.snapshot.paramMap;
    this.parentId = Number(paramsUrl.get('parentId'));
    const userLogger = this.authService.getLocalStorageUser();
    const medicalId = userLogger.typeUser === "Medical" && userLogger.medicalId  ? userLogger.medicalId : 0;
    this.parentId = medicalId; 
    return medicalId;
  }

  loadBootstrap() {
    $('[rel="tooltip"]').tooltip();
    if ($(".selectpicker").length !== 0) {
      $(".selectpicker").selectpicker({
        iconBase: "fa",
        tickIcon: "fa-check"
      });
    }
  }

  loadFormRegister() {
    let formsElement = this.calendarForm;
    this.userLoged = this.authService.getLocalStorageUser();
    this.calendarForm.controls['medicalId'].setValue(this.parentId);
  }

  getMonthlyCalendar(): void {
    if (this.calendarForm.invalid) {
      this.errorMessage = 'Por favor, preencha todos os campos obrigatórios.';
      return;
    }
    const criteria: CalendarCriteriaDto = this.calendarForm.value;
    criteria.userIdLogged = this.userLoged.id;

    this.medicalCalendarService.getMonthlyCalendar(criteria).subscribe(
      (response: ServiceResponse<CalendarDto>) => {
        if (response.success) {
          this.calendarData = response.data;
          this.errorMessage = null;
          this.modalSuccessAlert();
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
