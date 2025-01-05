import { Component, OnInit, ViewChild, Inject, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CalendarOptions, DatesSetArg, FullCalendarComponent } from '@fullcalendar/angular';
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
	templateUrl: 'calendar.component.html',
	styleUrls: ['calendar.component.css']
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
		@Inject(AuthService) private authService: AuthService,
		private cdr: ChangeDetectorRef
	) { }
	ngOnInit(): void {
		this.loadDefCalendar();
		//this.loadDataFromApi(null);
		this.initForm();
		this.loadPatients();
	}

	reloadComponent() {
		const currentUrl = this.router.url;
		this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
			this.router.navigate([currentUrl]);
		});
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
	loadDataFromApi(startDateTime?: Date, endDateTime?: Date): void {
		const criteria: CalendarCriteriaDto = this.createCriteria(startDateTime, endDateTime);
		console.log('----------------------loadDataFromApi - criteria-------------------------');
		console.log(criteria);
		this.calendarEventService.getCalendarEvents(criteria).subscribe(events => {
			this.eventsData = events;
			this.updateCalendarEvents();
			console.log('----------------------loadDataFromApi - eventsData-------------------------');
			//console.log(this.eventsData);
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

	createCriteria(startDateTime?: Date, endDateTime?: Date): CalendarCriteriaDto {
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
			userIdLogged: this.userLoged?.id,
			startDate : moment(startDateTime).toDate(),
			endDate : moment(endDateTime).toDate(),
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
			//eventContent: this.renderEventContent.bind(this) // Adiciona o método renderEventContent
			datesSet: this.handleDatesSet.bind(this) // Adiciona o evento datesSet
		};
	}
	renderEventContent(eventInfo) {
		const deleteIcon = document.createElement('span');
		deleteIcon.innerHTML = '🗑️';
		deleteIcon.classList.add('delete-event');
		deleteIcon.addEventListener('click', (e) => {
			e.stopPropagation(); // Para evitar o disparo do eventClick
			this.handleDeleteEvent(eventInfo.event);
		});
		const title = document.createElement('span');
		title.innerHTML = eventInfo.event.title;
		const eventEl = document.createElement('div');
		eventEl.appendChild(title);
		eventEl.appendChild(deleteIcon);
		return { domNodes: [eventEl] };
	}
	handleDeleteEvent(event) {
		//this.calendarComponent.getApi().getEventById(event.id).remove();
		console.log('----------------------handleDeleteEvent - event-------------------------');
		console.log(event.id);
		// Aqui você pode adicionar a lógica para apagar o evento do servidor, se necessário
	}

	handleDatesSet(arg: DatesSetArg) {
		const start = arg.start;
		const end = arg.end;
		console.log('----------------------handleDatesSet - arg-------------------------');
		console.log(arg);

		// Atualiza os critérios com base nas novas datas
		this.loadDataFromApi(start, end);
	}
	getFormCalendar(eventForm: any, inputDateIsoString: string, selectedEvent: any): string {
		const formHtml = FormHelperCalendar.getFormHtml(eventForm, this.patients, {
			labelPatient: this.labelPatient,
			labelTitle: this.labelTitle,
			labelStartTime: this.labelStartTime,
			labelEndTime: this.labelEndTime,
			labelSelectPatient: this.labelSelectPatient
		}, inputDateIsoString, selectedEvent);
		return formHtml;
	}
	openAddEventModal(arg): void {
		const startDateTime = moment(new Date());
		const endTimeDateTime = moment(new Date().setHours(startDateTime.hour() + 1));
		let tiltleEvent = 'Digite aqui';

		this.isEditMode = false;
		this.eventForm.reset();
		this.eventForm.patchValue({
			dateEvent: arg.dateStr,
			title: tiltleEvent,
			startTime: startDateTime.format('HH:mm'),
			endTime: endTimeDateTime.format('HH:mm'),
		});
		const formHtml = this.getFormCalendar(this.eventForm, arg.dateStr, null);
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
		const eventDateString = moment(event.start).format('YYYY-MM-DD');
		this.selectedEventId = event.id;
		// Buscar o evento correspondente em this.eventsData pelo ID
		const selectedEvent = this.eventsData.find(e => e.id == this.selectedEventId);
		const startDateTime = moment(event.start);
		const endTimeDateTime = moment(event.end);

		let tiltleEvent = 'Digite aqui';
		if (selectedEvent && selectedEvent.medicalCalendar) {
			tiltleEvent = selectedEvent && selectedEvent.medicalCalendar && selectedEvent.medicalCalendar?.patientName ? selectedEvent.medicalCalendar?.title : selectedEvent.medicalCalendar?.patientName;
		}
		this.eventForm.patchValue({
			title: tiltleEvent,
			dateEvent: eventDateString,
			startTime: startDateTime.format('HH:mm'),
			endTime: endTimeDateTime.format('HH:mm'),
			patientId: event.extendedProps.patientId
		});
		const formHtml = this.getFormCalendar(this.eventForm, eventDateString, selectedEvent);
		swal.fire({
			title: this.selectedEventId > 0 ? this.labelEditEvent : this.labelCreateEvent,
			html: formHtml,
			focusConfirm: false,
			showCancelButton: true,
			confirmButtonText: this.labelSave,
			preConfirm: () => this.saveEventFromSwal(eventDateString)
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

		if (this.isEditMode && this.selectedEventId > 0) {
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
		this.selectedEventId = eventInfo.event.id;
		const title = eventInfo.event.title;
		const startTime = eventInfo.event.start;
		const endTime = eventInfo.event.end;
		const patientId = eventInfo.event.extendedProps.patientId;
		const startDateTime = moment(startTime).toDate();
		const endDateTime = endTime ? moment(endTime).toDate() : null;
		const formData = {
			id: eventInfo.event.id,
			title,
			start: startDateTime,
			end: endDateTime,
			patientId
		};
		const updatedEvent: ICalendarEvent = {
			id: formData.id,
			title: formData.title,
			start: formData.start,
			end: formData.end,
			className: 'event-default',
			medicalId: this.getParentId(),
			patientId: Number(formData.patientId)
		};
		// Buscar o evento correspondente em this.eventsData pelo ID
		const selectedEvent = this.eventsData.find(e => e.id == this.selectedEventId);
		if (selectedEvent && selectedEvent.medicalCalendar) {
			updatedEvent.patientId = selectedEvent.medicalCalendar?.patientId;
		}
		console.log('----------------------updateEvent - updatedEvent-------------------------');
		console.log(updatedEvent);
		if (this.selectedEventId > 0) {
			updatedEvent.id = this.selectedEventId;
			this.calendarEventService.updateCalendarEvent(updatedEvent).subscribe({
				next: (response) => {
					const event = this.fullcalendar.getApi().getEventById(this.selectedEventId.toString());
					event.setProp('title', formData.title);
					event.setStart(new Date(updatedEvent.start));
					event.setEnd(updatedEvent.end ? new Date(updatedEvent.end) : null);
					SuccessHelper.displaySuccess(response);
					this.reloadComponent();
				},
				error: (err) => {
					ErrorHelper.displayErrors(err?.originalError?.error || [{ message: 'An error occurred while updating the event.' }]);
				}
			});
		}
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