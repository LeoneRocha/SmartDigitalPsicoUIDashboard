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
//https://fullcalendar.io/demos
//or  https://github.com/mattlewis92/angular-calendar/tree/v0.30.1
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
	labelStartDate = 'Start Date';
	labelEndDate = 'End Date';
	labelSelectPatient = 'Select Patient';
	labelCreateEvent = 'Create an Event';
	labelEditEvent = 'Edit Event';
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
			start: ['', Validators.required],
			end: [''],
			patientId: ['', Validators.required]
		});
	}
	loadDataFromApi(): void {
		const criteria: CalendarCriteriaDto = this.createCriteria();
		console.log('-------------------- loadDataFromApi --------------------');
		console.log(criteria);

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
				const criteria: CalendarCriteriaDto = this.createCriteria();
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

	getFormCalendar(): string {
		const formHtml = FormHelperCalendar.getFormHtml(this.eventForm, this.patients, {
			labelPatient: this.labelPatient,
			labelTitle: this.labelTitle,
			labelStartDate: this.labelStartDate,
			labelEndDate: this.labelEndDate,
			labelSelectPatient: this.labelSelectPatient
		});
		return formHtml;
	}
	openAddEventModal(arg): void {
		this.isEditMode = false;
		this.eventForm.reset();
		this.eventForm.patchValue({
			start: moment(arg.date).format('YYYY-MM-DDTHH:mm:ss'),
			end: moment(arg.date).format('YYYY-MM-DDTHH:mm:ss'),
		});
		const formHtml = this.getFormCalendar();
		swal.fire({
			title: 'Create an Event',
			html: formHtml,
			focusConfirm: false,
			showCancelButton: true,
			confirmButtonText: 'Save',
			preConfirm: () => this.saveEventFromSwal()
		});
	}
	openEditEventModal(arg): void {
		this.isEditMode = true;
		const event = arg.event;
		this.selectedEventId = event.id;
		this.eventForm.patchValue({
			title: event.title,
			start: moment(event.start).format('YYYY-MM-DDTHH:mm:ss'),
			end: event.end ? moment(event.end).format('YYYY-MM-DDTHH:mm:ss') : '',
			patientId: event.extendedProps.patientId
		});
		const formHtml = this.getFormCalendar();

		swal.fire({
			title: this.labelCreateEvent,
			html: formHtml,
			focusConfirm: false,
			showCancelButton: true,
			confirmButtonText: this.labelSave,
			preConfirm: () => this.saveEventFromSwal()
		});
	}

	saveEventFromSwal(): void {
		const title = (document.getElementById('swal-title') as HTMLInputElement).value;
		const start = (document.getElementById('swal-start') as HTMLInputElement).value;
		const end = (document.getElementById('swal-end') as HTMLInputElement).value;
		const patientId = (document.getElementById('swal-patient') as HTMLSelectElement).value;
		const formData = {
			title,
			start,
			end,
			patientId
		};
		const newEvent: ICalendarEvent = {
			title: formData.title,
			start: new Date(formData.start),
			end: formData.end ? new Date(formData.end) : null,
			className: 'event-default',
			medicalId: this.getParentId(),
			patientId: Number(formData.patientId)
		};
		const newEventInput = {
			title: formData.title,
			start: new Date(formData.start),
			end: formData.end ? new Date(formData.end) : null,
			className: 'event-default',
			medicalId: this.getParentId(),
			patientId: Number(formData.patientId)
		};
		if (this.isEditMode) {
			newEvent.id = this.selectedEventId;
			this.calendarEventService.updateCalendarEvent(newEvent).subscribe(() => {
				const event = this.fullcalendar.getApi().getEventById(this.selectedEventId.toString());
				event.setProp('title', formData.title);
				event.setStart(new Date(formData.start));
				event.setEnd(new Date(formData.end));
			});
		} else {
			this.calendarEventService.addCalendarEvent(newEvent).subscribe(response => {
				newEvent.id = response.data.id;
				this.fullcalendar.getApi().addEvent(newEventInput);
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
			//patientId: eventInfo.event.extendedProps.patientId
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