import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CalendarOptions, FullCalendarComponent } from '@fullcalendar/angular';
import swal from 'sweetalert2';
import { CalendarCriteriaDto } from 'app/models/medicalcalendar/CalendarCriteriaDto';
import { CalendarEventService } from 'app/services/general/calendar/calendar-event.service';
import { AuthService } from 'app/services/auth/auth.service';
import { DateHelper } from 'app/helpers/date-helper';
import { ICalendarEvent } from 'app/models/general/ICalendarEvent';
import { DropDownEntityModelSelect } from 'app/models/general/dropDownEntityModelSelect';
import * as moment from 'moment';
import { FormHelperCalendar } from 'app/helpers/formHelperCalendar';
import { ErrorHelper } from 'app/helpers/error-helper';
import { SuccessHelper } from 'app/helpers/success-helper';
//https://fullcalendar.io/demos
//or https://github.com/mattlewis92/angular-calendar/tree/v0.30.1
declare var $: any;
@Component({
	moduleId: module.id,
	selector: 'calendar-cmp',
	templateUrl: 'calendar.component.html'
})
export class CalendarComponent implements OnInit {
	@ViewChild('fullcalendar') fullcalendar: FullCalendarComponent;
	eventsData;
	calendarOptions: CalendarOptions;
	parentId: number;
	userLoged: any;
	eventForm: FormGroup;
	isEditMode = false;
	selectedEventId: number;
	patients: DropDownEntityModelSelect[] = [];
	// Variáveis locais para i18n
	labelPatient = 'Patient';
	labelTitle = 'Title';
	labelStartTime = 'Start Time';
	labelEndTime = 'End Time';
	labelSelectPatient = 'Select Patient';
	labelCreateEvent = 'Adicionar horario';
	labelEditEvent = 'Editar horario';
	labelSave = 'Save';

	constructor(
		private fb: FormBuilder,
		@Inject(CalendarEventService) private calendarEventService: CalendarEventService,
		@Inject(Router) private router: Router,
		@Inject(ActivatedRoute) private route: ActivatedRoute,
		@Inject(AuthService) private authService: AuthService
	) { }
	ngOnInit(): void {
		this.loadDefCalendar();
		this.loadDataFromApi();
		this.initForm();
		this.loadPatients();
	}
	initForm(): void {
		this.eventForm = this.fb.group({
			title: ['', Validators.required],
			startTime: ['', Validators.required],
			endTime: [''],
			patientId: ['', Validators.required],
			dateEvent: [new Date(), Validators.required]  // Novo campo para a data do evento
		});
	}
	loadDataFromApi(): void {
		const criteria: CalendarCriteriaDto = this.createCriteria();
		this.calendarEventService.getCalendarEvents(criteria).subscribe(events => {
			this.eventsData = events;
			this.updateCalendarEvents();
		});
	}
	loadPatients(): void {
		const medicalId: number = this.getParentId();
		this.calendarEventService.getPatientsByMedicalId(medicalId).subscribe({
			next: (response: DropDownEntityModelSelect[]) => {
				this.patients = response;
			},
			error: (err) => {
				console.error('Erro ao carregar pacientes do médico', err);
			}
		});
	}
	createCriteria(): CalendarCriteriaDto {
		this.userLoged = this.authService.getLocalStorageUser();
		const today = DateHelper.newDateUTC();
		const y = today.getFullYear();
		const m = today.getMonth();
		const criteria: CalendarCriteriaDto = {
			medicalId: this.getParentId(),
			month: m + 1,
			year: y,
			intervalInMinutes: 60,
			filterDaysAndTimesWithAppointments: false,
			filterByDate: null,
			userIdLogged: this.userLoged?.id
		};
		return criteria;
	}
	getParentId(): number {
		const userLogger = this.authService.getLocalStorageUser();
		const paramsUrl = this.route.snapshot.paramMap;
		this.parentId = Number(paramsUrl.get('parentId'));
		const medicalId = userLogger.typeUser === "Medical" && userLogger.medicalId ? userLogger.medicalId : 0;
		this.parentId = medicalId;
		return medicalId;
	}
	loadDefCalendar(): void {
		this.calendarOptions = {
			headerToolbar: {
				right: 'prev,next today',
				center: 'dayGridMonth,timeGridWeek,timeGridDay',
				left: 'title'
			},
			initialView: 'dayGridMonth',
			initialEvents: this.eventsData,
			weekends: true,
			editable: true,
			selectable: true,
			selectMirror: true,
			dayMaxEvents: true,
			droppable: true,
			displayEventTime: true,
			events: this.eventsData,
			views: {
				month: {
					titleFormat: { month: 'long', year: 'numeric' }
				},
				agendaWeek: {
					titleFormat: { month: 'long', year: 'numeric', day: 'numeric' }
				},
				agendaDay: {
					titleFormat: { month: 'short', year: 'numeric', day: 'numeric' }
				}
			},
			dateClick: this.openAddEventModal.bind(this),
			eventClick: this.openEditEventModal.bind(this),
			eventDrop: this.updateEvent.bind(this),
			eventResize: this.updateEvent.bind(this),
		};
	}
	getFormCalendar(eventForm: any, inputDateIsoString: string): string {
		const formHtml = FormHelperCalendar.getFormHtml(eventForm, this.patients, {
			labelPatient: this.labelPatient,
			labelTitle: this.labelTitle,
			labelStartTime: this.labelStartTime,
			labelEndTime: this.labelEndTime,
			labelSelectPatient: this.labelSelectPatient
		}, inputDateIsoString);
		return formHtml;
	}
	openAddEventModal(arg): void {
		this.isEditMode = false;
		this.eventForm.reset();
		this.eventForm.patchValue({
			dateEvent: arg.dateStr,
			title: 'Teste',
			startTime: '11:00',
			endTime: '12:00'
		});
		const formHtml = this.getFormCalendar(this.eventForm, arg.dateStr);
		swal.fire({
			title: this.labelCreateEvent,
			html: formHtml,
			focusConfirm: false,
			showCancelButton: true,
			confirmButtonText: this.labelSave,
			preConfirm: () => this.saveEventFromSwal(arg.dateStr)
		});
	}
	openEditEventModal(arg): void {
		this.isEditMode = true;
		const event = arg.event;
		this.selectedEventId = event.id;
		this.eventForm.patchValue({
			title: event.title,
			dateEvent: moment(event.start).format('YYYY-MM-DD'),
			startTime: moment(event.start).format('HH:mm'),
			endTime: event.end ? moment(event.end).format('HH:mm') : '',
			patientId: event.extendedProps.patientId
		});
		const formHtml = this.getFormCalendar(this.eventForm, event.start.format('YYYY-MM-DD'));
		swal.fire({
			title: this.labelEditEvent,
			html: formHtml,
			focusConfirm: false,
			showCancelButton: true,
			confirmButtonText: this.labelSave,
			preConfirm: () => this.saveEventFromSwal(event.start)
		});
	}
	// Dentro do método saveEventFromSwal
	saveEventFromSwal(dateStr: string): void {
		const title = (document.getElementById('swal-title') as HTMLInputElement).value;
		const startTime = (document.getElementById('swal-startTime') as HTMLInputElement).value;
		const endTime = (document.getElementById('swal-endTime') as HTMLInputElement).value;
		const patientId = (document.getElementById('swal-patient') as HTMLSelectElement).value;

		const startDateTime = moment(`${dateStr}T${startTime}`).toDate();
		const endDateTime = endTime ? moment(`${dateStr}T${endTime}`).toDate() : null;

		const formData = {
			title,
			start: startDateTime,
			end: endDateTime,
			patientId
		};

		const newEvent: ICalendarEvent = {
			title: formData.title,
			start: formData.start,
			end: formData.end,
			className: 'event-default',
			medicalId: this.getParentId(),
			patientId: Number(formData.patientId)
		};

		const newEventInput: any = {
			title: formData.title,
			start: formData.start,
			end: formData.end,
			className: 'event-default',
			medicalId: this.getParentId(),
			patientId: Number(formData.patientId)
		};
		console.log('----------------------saveEventFromSwal-------------------------');
		console.log(newEvent);

		if (this.isEditMode) {
			newEvent.id = this.selectedEventId;

			this.calendarEventService.updateCalendarEvent(newEvent).subscribe({
				next: (response) => {
					const event = this.fullcalendar.getApi().getEventById(this.selectedEventId.toString());
					event.setProp('title', formData.title);
					event.setStart(new Date(newEvent.start));
					event.setEnd(newEvent.end ? new Date(newEvent.end) : null);
					SuccessHelper.displaySuccess(response);
				},
				error: (err) => {
					ErrorHelper.displayErrors(err?.originalError?.error || [{ message: 'An error occurred while updating the event.' }]);
				}
			});
		} else {
			this.calendarEventService.addCalendarEvent(newEvent).subscribe({
				next: (response) => {
					newEvent.id = response.data.id;
					this.fullcalendar.getApi().addEvent(newEventInput);
					SuccessHelper.displaySuccess(response);
				},
				error: (err) => {
					ErrorHelper.displayErrors(err?.originalError?.error || [{ message: 'An error occurred while adding the event.' }]);
				}
			});
		}
	}

	updateEvent(eventInfo): void {
		const updatedEvent: ICalendarEvent = {
			id: eventInfo.event.id,
			title: eventInfo.event.title,
			start: eventInfo.event.start,
			end: eventInfo.event.end,
			className: eventInfo.event.classNames[0],
			medicalId: this.getParentId(),
			patientId: eventInfo.event.extendedProps.patientId
		};
		this.calendarEventService.updateCalendarEvent(updatedEvent).subscribe();
	}
	deleteEvent(eventId: number): void {
		this.calendarEventService.deleteCalendarEvent(eventId).subscribe(() => {
			const event = this.fullcalendar.getApi().getEventById(eventId.toString());
			if (event) {
				event.remove();
			}
		});
	}
	updateCalendarEvents(): void {
		if (this.fullcalendar && this.fullcalendar.getApi()) {
			this.fullcalendar.getApi().removeAllEvents();
			this.fullcalendar.getApi().addEventSource(this.eventsData);
		}
	}
}