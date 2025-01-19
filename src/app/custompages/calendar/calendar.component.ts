import { Component, OnInit, ViewChild, Inject, ChangeDetectorRef, ViewContainerRef, ComponentFactoryResolver, TemplateRef, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CalendarOptions, DatesSetArg, FullCalendarComponent } from '@fullcalendar/angular'; 
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
import { LanguageService } from 'app/services/general/language.service';
import localesAll from '@fullcalendar/core/locales-all';
import { ERecurrenceCalendarType } from 'app/models/medicalcalendar/enuns/ERecurrenceCalendarType';
import { ILabelsEventModalForm } from 'app/models/LabelsEventModalForm';
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
	//#region Variables	   
	@ViewChild('fullcalendar') fullcalendar: FullCalendarComponent; 
	@ViewChild('calendarModalTemplate', { static: true }) calendarModalTemplate: ElementRef;

	eventsData;
	calendarOptions: CalendarOptions;
	parentId: number;
	userLoged: any;
	eventForm: FormGroup;
	isEditMode = false;
	selectedEventId: number;
	patients: DropDownEntityModelSelect[] = [];
	// Variáveis locais para i18n
	labelsForm: ILabelsEventModalForm;
	languageUI: string;
	//#endregion Variables
	// Adicione selectedEvent e inputDateIsoString
	selectedEvent: ICalendarEvent;
	inputDateIsoString: string;
	// Nova variável para controlar a exibição do modal
	showModal: boolean = false;
	modalTitle: string;	// Nova variável para controlar a exibição do formulário de evento
	showEventForm: boolean = false;

	//#region Constructor
	constructor(
		private fb: FormBuilder,
		@Inject(CalendarEventService) private calendarEventService: CalendarEventService,
		@Inject(Router) private router: Router,
		@Inject(ActivatedRoute) private route: ActivatedRoute,
		@Inject(AuthService) private authService: AuthService,
		private cdr: ChangeDetectorRef,
		private readonly languageService: LanguageService, 
	) {
	}
	//#endregion Constructor

	//#region Lifecycle Hooks
	ngOnInit(): void {
		this.loadDefinitionsFullCalendar();
		//this.loadDataFromApi(null);
		this.initForm();
		this.loadPatientsFromService();
		this.loadLablesModalEveent();
	}
	reloadComponent() {
		const currentUrl = this.router.url;
		this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
			this.router.navigate([currentUrl]);
		});
	}
	//#endregion Lifecycle Hooks

	//#region FULL CALENDAR 
	loadDefinitionsFullCalendar(): void {
		this.calendarOptions = {
			headerToolbar: {
				right: 'prev,next today',
				center: 'dayGridMonth,timeGridWeek,timeGridDay',
				left: 'title'
			},
			initialView: 'dayGridMonth',
			initialEvents: this.eventsData,
			locales: localesAll, // Adicione todos os idiomas
			locale: this.languageService.getLanguageToLocalStorage().toLowerCase(), // Defina o idioma padrão aqui
			weekends: true,
			editable: true,
			selectable: true,
			selectMirror: true,
			dayMaxEvents: true,
			droppable: true,
			displayEventTime: true,
			events: this.eventsData,
			views: {
				dayGridMonth: {
					titleFormat: { month: 'long', year: 'numeric' },
					eventTimeFormat: { hour: '2-digit', minute: '2-digit', hour12: false } // Formato de 24 horas
				},
				timeGridWeek: {
					titleFormat: { month: 'long', year: 'numeric', day: 'numeric' },
					slotDuration: '01:00', // Duração do slot de meia em meia hora
					slotLabelFormat: { hour: '2-digit', minute: '2-digit', hour12: false }, // Formato de 24 horas
					allDaySlot: false, // Desativar o slot de dia inteiro
					expandRows: true // Expandir linhas para mostrar todos os horários
				},
				timeGridDay: {
					titleFormat: { month: 'short', year: 'numeric', day: 'numeric' },
					slotDuration: '01:00', // Duração do slot de meia em meia hora
					slotLabelFormat: { hour: '2-digit', minute: '2-digit', hour12: false }, // Formato de 24 horas
					allDaySlot: false, // Desativar o slot de dia inteiro
					expandRows: true // Expandir linhas para mostrar todos os horários
				}
			},
			dateClick: this.openAddEventModal.bind(this),
			eventClick: this.openEditEventModal.bind(this),
			eventDrop: this.updateEvent.bind(this),
			eventResize: this.updateEvent.bind(this),
			//eventContent: this.renderEventContent.bind(this), // Adiciona o método renderEventContent
			datesSet: this.handleDatesSet.bind(this) // Adiciona o evento datesSet
		};
	}
	updateCalendarEventsComponent(): void {
		if (this.fullcalendar && this.fullcalendar.getApi()) {
			this.fullcalendar.getApi().removeAllEvents();
			this.fullcalendar.getApi().addEventSource(this.eventsData);
		}
	}
	//#endregion FULL CALENDAR 

	//#region FULL CALENDAR - EVENTS
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
		// Aqui você pode adicionar a lógica para apagar o evento do servidor, se necessário
	}

	handleDatesSet(arg: DatesSetArg) {
		const start = arg.start;
		const end = arg.end;
		// Atualiza os critérios com base nas novas datas
		this.loadDataFromService(start, end);
	}
	updateEvent(eventInfo): void {
		this.selectedEventId = eventInfo.event.id;
		const patientId = eventInfo.event.extendedProps.patientId;

		const startTime = eventInfo.event.start;
		const endTime = eventInfo.event.end;
		const startDateTime = moment(startTime).toDate();
		const endDateTime = endTime ? moment(endTime).toDate() : null;

		// Buscar o evento correspondente em this.eventsData pelo ID
		const updatedEvent: ICalendarEvent = this.eventsData.find(e => e.id == this.selectedEventId);
		updatedEvent.start = startDateTime;
		updatedEvent.end = endDateTime;
		updatedEvent.patientId = Number(patientId);
		updatedEvent.medicalId = this.getParentId();
		updatedEvent.title = updatedEvent.medicalCalendar?.title ?? updatedEvent.title;

		if (updatedEvent && updatedEvent.medicalCalendar) {
			updatedEvent.patientId = updatedEvent.medicalCalendar?.patientId;
		}
		if (this.selectedEventId > 0) {
			updatedEvent.id = this.selectedEventId;
			this.updateCalendarEventFromService(updatedEvent);
		}
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
		// Atualiza o título do modal
		const modalTitle = this.labelsForm.labelCreateEvent;
		this.inputDateIsoString = arg.dateStr;
		this.selectedEvent = null;
		// Mostra o modal usando SweetAlert2
		this.showModal = true;
		// Mostra o formulário de evento
		this.showEventForm = true; 
		// swal.fire({
		// 	title: this.labelsForm.labelCreateEvent,
		// 	//html: formHtml,
		// 	//html: this.modalContainer.element.nativeElement,
		// 	html: this.calendarModalTemplate.nativeElement,
		// 	focusConfirm: false,
		// 	showCancelButton: true,
		// 	confirmButtonText: this.labelsForm.labelSave,
		// 	preConfirm: () => this.saveEventFromSwal(arg.dateStr)
		// }).then(() => {
		// 	//this.modalContainer.clear(); // Limpa o container após fechar o modal
		// 	//componentRef.destroy(); // Destroi o componente após fechar o modal
		// 	document.getElementById('modal-cancel-button').onclick = () => {
		// 		this.showModal = false;
		// 		swal.close();
		// 	};
		// });
	}
	openEditEventModal(arg): void {
		this.isEditMode = true;
		const event = arg.event;
		const eventDateString = moment(event.start).format('YYYY-MM-DD');
		this.selectedEventId = event.id;

		// Buscar o evento correspondente em this.eventsData pelo ID
		const selectedEvent: ICalendarEvent = this.eventsData.find(e => e.id == this.selectedEventId);

		// Atualiza os valores do formulário de forma dinâmica
		this.updateForm_WithEventValues(event, selectedEvent, eventDateString);
	
		const modalTitle = this.labelsForm.labelEditEvent;
		this.inputDateIsoString = eventDateString;
		this.selectedEvent = selectedEvent;
		
		// Mostra o modal
		this.showModal = true;
		// Mostra o formulário de evento
		this.showEventForm = true; 
		
		const formHtml = this.getFormCalendar(this.eventForm, eventDateString, selectedEvent); 
		/*swal.fire({
			title: this.selectedEventId > 0 ? this.labelsForm.labelEditEvent : this.labelsForm.labelCreateEvent,
			html: formHtml,
			//html: this.modalContainer.element.nativeElement,
			//html: modalContent,
			//html: this.calendarModalTemplate.nativeElement,
			focusConfirm: false,
			showCancelButton: true,
			confirmButtonText: this.labelsForm.labelSave,
			preConfirm: () => this.saveEventFromSwal(eventDateString)
		}).then(() => {
		});*/
	}
	closeEventForm(): void {		
		this.showModal = false;
		this.showEventForm = false;
	}

	confirmEventForm(): void {  
		if (this.isEditMode) {
			this.saveEventFromSwal(this.inputDateIsoString);
		} else {
			this.saveEventFromSwal(this.inputDateIsoString);
		}
		this.showModal = false;
			this.showEventForm = false;
	}

	//#endregion FULL CALENDAR - EVENTS

	//#region ACTIONS E LOAD API DATA   
	loadPatientsFromService(): void {
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
	loadDataFromService(startDateTime?: Date, endDateTime?: Date): void {
		const criteria: CalendarCriteriaDto = this.createCriteria(startDateTime, endDateTime);
		console.log('----------------------loadDataFromApi - criteria-------------------------');
		console.log(criteria);
		this.calendarEventService.getCalendarEvents(criteria).subscribe(events => {
			this.eventsData = events;
			this.updateCalendarEventsComponent();
		});
	}
	saveEventFromSwal(dateStr: string): void {
		const newEventData = this.getEventDataFromFormModal(dateStr);
		const newEvent: ICalendarEvent = newEventData.event;
		const newEventInput = newEventData.eventInput;
		console.log('----------------------saveEventFromSwal - newEvent-------------------------');
		console.log(newEvent);
		if (this.isEditMode && this.selectedEventId > 0) {
			newEvent.id = this.selectedEventId;
			this.updateCalendarEventFromService(newEvent);
		} else {
			this.addCalendarEventFromService(newEvent, newEventInput);
		}
	}
	addCalendarEventFromService(newEvent: any, newEventInput: any): void {
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

	updateCalendarEventFromService(updatedEvent: ICalendarEvent): void { 
		this.calendarEventService.updateCalendarEvent(updatedEvent).subscribe({
			next: (response) => {
				 
				const event = this.fullcalendar.getApi().getEventById(this.selectedEventId.toString());
				event.setProp('title', updatedEvent.title);
				event.setStart(new Date(updatedEvent.start));
				event.setEnd(updatedEvent.end ? new Date(updatedEvent.end) : null);
				SuccessHelper.displaySuccess(response);
				this.reloadComponent();
			},
			error: (err) => {
				console.log('----------------------updateCalendarEventFromService - err-------------------------');
				console.log(err);
				const errors = Array.isArray(err?.originalError?.error) ? err?.originalError?.error : [{ message: 'An error occurred while updating the event.' }];
				ErrorHelper.displayErrors(errors);
			}
		});
	}
	deleteEventFromService(eventId: number): void {
		this.calendarEventService.deleteCalendarEvent(eventId).subscribe(() => {
			const event = this.fullcalendar.getApi().getEventById(eventId.toString());
			if (event) {
				event.remove();
			}
		});
	}
	//#endregion ACTIONS E LOAD API DATA 

	//#region AUXILIAR   
	getEventDataFromFormModal(dateStr: string): any {
		const title = (document.getElementById('swal-title') as HTMLInputElement).value;
		const startTime = (document.getElementById('swal-startTime') as HTMLInputElement).value;
		const endTime = (document.getElementById('swal-endTime') as HTMLInputElement).value;
		const patientId = (document.getElementById('swal-patient') as HTMLSelectElement).value;
		const location = (document.getElementById('swal-location') as HTMLInputElement).value;
		const colorCategoryHexa = (document.getElementById('swal-color') as HTMLInputElement).value;
		const allDay = (document.getElementById('swal-allDay') as HTMLInputElement).checked;
		const recurrenceType = (document.getElementById('swal-recurrence') as HTMLSelectElement).value;

		// Recupere os dias da semana selecionados como checkboxes
		const recurrenceDays = Array.from(document.querySelectorAll('.form-check-input:checked')).map((checkbox: HTMLInputElement) => Number(checkbox.value));

		const recurrenceEndDate = (document.getElementById('swal-recurrenceEndDate') as HTMLInputElement).value ? new Date((document.getElementById('swal-recurrenceEndDate') as HTMLInputElement).value) : null;
		const recurrenceCount = (document.getElementById('swal-recurrenceCount') as HTMLInputElement).value ? Number((document.getElementById('swal-recurrenceCount') as HTMLInputElement).value) : null;

		const startDateTime = moment(`${dateStr}T${startTime}`).toDate();
		const endDateTime = endTime ? moment(`${dateStr}T${endTime}`).toDate() : null;

		const newEvent: ICalendarEvent = {
			title: title,
			start: startDateTime,
			end: endDateTime,
			className: 'event-default',
			medicalId: this.getParentId(),
			patientId: Number(patientId),
			location: location,
			colorCategoryHexa: colorCategoryHexa,
			allDay: allDay,
			recurrenceType: recurrenceType ? ERecurrenceCalendarType[recurrenceType] : ERecurrenceCalendarType.None,
			recurrenceDays: recurrenceDays.length ? recurrenceDays : [],
			recurrenceEndDate: recurrenceEndDate,
			recurrenceCount: recurrenceCount
		};
		const newEventInput: any = newEvent;
		const resultForm = { event: newEvent, eventInput: newEventInput };
		return resultForm;
	}

	private initForm(): void {
		this.eventForm = this.fb.group({
			title: ['', Validators.required],
			startTime: ['', Validators.required],
			endTime: [''],
			patientId: ['', Validators.required],
			dateEvent: [new Date(), Validators.required],
			allDay: [false],
			colorCategoryHexa: ['#000000'],
			location: [''],
			recurrenceType: [''],
			recurrenceDays: [[]],
			recurrenceEndDate: [''],
			recurrenceCount: ['']
		});
	}
	private updateForm_WithEventValues(event: any, selectedEvent: ICalendarEvent, eventDateString: string): void {
		const startDateTime = moment(event.start);
		const endTimeDateTime = moment(event.end)

		let tiltleEvent = 'Digite aqui';
		if (selectedEvent && selectedEvent.medicalCalendar) {
			tiltleEvent = selectedEvent.medicalCalendar.title ?? selectedEvent.medicalCalendar.patientName;
		}
		const dataEvent = selectedEvent.medicalCalendar;

		this.eventForm.patchValue({
			title: dataEvent?.title ?? tiltleEvent,
			dateEvent: eventDateString,
			startTime: startDateTime.format('HH:mm'),
			endTime: endTimeDateTime.format('HH:mm'),
			patientId: dataEvent?.patientId,
			allDay: dataEvent?.isAllDay,
			colorCategoryHexa: dataEvent?.colorCategoryHexa,
			location: dataEvent?.location,
			recurrenceType: dataEvent?.recurrenceType,
			recurrenceDays: dataEvent?.recurrenceDays,
			recurrenceEndDate: dataEvent?.recurrenceEndDate ? moment(dataEvent?.recurrenceEndDate).format('YYYY-MM-DD') : '',
			recurrenceCount: dataEvent?.recurrenceCount
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
			startDate: moment(startDateTime).toDate(),
			endDate: moment(endDateTime).toDate(),
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
	loadLablesModalEveent() {
		const labelCreateEvent: string = this.languageService.getTranslateInformationAsync('general.calendar.labelCreateEvent');
		const labelEditEvent: string = this.languageService.getTranslateInformationAsync('general.calendar.labelEditEvent');
		const labelSave: string = this.languageService.getTranslateInformationAsync('general.calendar.labelSave');

		const labelPatient: string = this.languageService.getTranslateInformationAsync('general.calendar.labelPatient');
		const labelTitle: string = this.languageService.getTranslateInformationAsync('general.calendar.labelTitle');
		const labelStartTime: string = this.languageService.getTranslateInformationAsync('general.calendar.labelStartTime');
		const labelEndTime: string = this.languageService.getTranslateInformationAsync('general.calendar.labelEndTime');
		const labelSelectPatient = this.languageService.getTranslateInformationAsync('general.calendar.labelSelectPatient');

		const labelAllDay: string = this.languageService.getTranslateInformationAsync('general.calendar.labelAllDay');
		const labelColor: string = this.languageService.getTranslateInformationAsync('general.calendar.labelColor');
		const labelLocation: string = this.languageService.getTranslateInformationAsync('general.calendar.labelLocation');
		const labelRecurrence: string = this.languageService.getTranslateInformationAsync('general.calendar.labelRecurrence');
		const labelRecurrenceDays: string = this.languageService.getTranslateInformationAsync('general.calendar.labelRecurrenceDays');
		const labelRecurrenceCount: string = this.languageService.getTranslateInformationAsync('general.calendar.labelRecurrenceCount');
		const labelRecurrenceEndDate: string = this.languageService.getTranslateInformationAsync('general.calendar.labelRecurrenceEndDate');
		const labelSelectRecurrence: string = this.languageService.getTranslateInformationAsync('general.calendar.labelSelectRecurrence');

		this.languageUI = this.languageService.getLanguageToLocalStorage();

		this.labelsForm = {
			labelCreateEvent: labelCreateEvent,
			labelEditEvent: labelEditEvent,
			labelSave: labelSave,
			labelPatient: labelPatient,
			labelTitle: labelTitle,
			labelStartTime: labelStartTime,
			labelEndTime: labelEndTime,
			labelSelectPatient: labelSelectPatient,
			labelAllDay: labelAllDay,
			labelColor: labelColor,
			labelLocation: labelLocation,
			labelRecurrence: labelRecurrence,
			labelRecurrenceDays: labelRecurrenceDays,
			labelRecurrenceEndDate: labelRecurrenceEndDate,
			labelRecurrenceCount: labelRecurrenceCount,
			labelSelectRecurrence: labelSelectRecurrence
		};
	}

	getFormCalendar(eventForm: FormGroup, inputDateIsoString: string, selectedEvent: any): string {
		const formHtml = FormHelperCalendar.getFormHtml(eventForm, this.patients, this.labelsForm, inputDateIsoString, selectedEvent);
		return formHtml;
	}
	//#endregion AUXILIAR 
}