import { Component, OnInit, Inject, AfterContentInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CalendarCriteriaDto } from 'app/models/medicalcalendar/CalendarCriteriaDto';
import { AuthService } from 'app/services/auth/auth.service';
import swal from 'sweetalert2';
import { ServiceResponse } from 'app/models/ServiceResponse';
import { MedicalCalendarService } from 'app/services/general/principals/medicalCalendar.service';
import * as moment from 'moment';
import { CalendarDto } from 'app/models/medicalcalendar/CalendarDto';
import { TimeSlotDto } from 'app/models/medicalcalendar/TimeSlotDto';
import { DateHelper } from 'app/helpers/date-helper';
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
  weekDays: string[] = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

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
      intervalInMinutes: new FormControl(60),
      filterDaysAndTimesWithAppointments: new FormControl(false),
      filterByDate: new FormControl()
    });
  }

  getParentId(): number {
    const paramsUrl = this.route.snapshot.paramMap;
    this.parentId = Number(paramsUrl.get('parentId'));
    const userLogger = this.authService.getLocalStorageUser();
    const medicalId = userLogger.typeUser === "Medical" && userLogger.medicalId ? userLogger.medicalId : 0;
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

    // Configurar filterByDate como null se estiver vazio
    if (!criteria.filterByDate) {
      criteria.filterByDate = null;
    }

    this.medicalCalendarService.getMonthlyCalendar(criteria).subscribe(
      (response: ServiceResponse<CalendarDto>) => {
        if (response.success) {
          const daysResult = DateHelper.sortTimeSlots(response.data.days);
          response.data.days = DateHelper.fillAddDayOfWeek(daysResult);
          this.calendarData = response.data;
          //console.log('----------------------getMonthlyCalendar-------------------------');
          //console.log(this.calendarData);
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

  getDayByFormatDateToLocal(dateStr: string): number {
    return moment.utc(dateStr).date();
  }

  formatDateToLocal(dateStr: string): moment.Moment {
    return moment.utc(dateStr);
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

  trackByTimeId(index: number, timeSlot: TimeSlotDto): number {
    return timeSlot.timeId;
  }

  getDayName(dayIndex: number): string {
    return DateHelper.getDayName(dayIndex);
  }

  getUniqueWeekDays(): number[] {
    return DateHelper.getUniqueWeekDays(this.calendarData.days);
  }
}