import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CalendarOptions, FullCalendarComponent } from '@fullcalendar/angular';
import swal from 'sweetalert2';
import { CalendarCriteriaDto } from 'app/models/medicalcalendar/CalendarCriteriaDto';
import { CalendarEventService } from 'app/services/general/calendar/calendar-event.service';
import { AuthService } from 'app/services/auth/auth.service';
import { DateHelper } from 'app/helpers/date-helper';
import { ICalendarEvent } from 'app/models/general/ICalendarEvent';

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

	constructor(
		@Inject(CalendarEventService) private calendarEventService: CalendarEventService,
		@Inject(Router) private router: Router,
		@Inject(ActivatedRoute) private route: ActivatedRoute,
		@Inject(AuthService) private authService: AuthService
	) { }

	ngOnInit(): void {
		this.loadDefCalendar();
		this.loadDataFromApi();
	}

	loadDataFromApi(): void {
		const criteria: CalendarCriteriaDto = this.createCriteria();
		this.calendarEventService.getCalendarEvents(criteria).subscribe(events => {
			this.eventsData = events;
			this.updateCalendarEvents();
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
			dateClick: this.addEvent.bind(this),
			eventClick: this.editEvent.bind(this),
			eventDrop: this.updateEvent.bind(this),
			eventResize: this.updateEvent.bind(this),
		};
	}

	addEvent(event): void {
		swal
			.fire({
				title: 'Create an Event',
				customClass: {
					confirmButton: 'btn btn-fill btn-primary',
					cancelButton: 'btn btn-default',
					input: 'swl-input'
				},
				showCancelButton: true,
				confirmButtonText: 'Save',
				input: 'text',
				inputPlaceholder: 'Event Title'
			})
			.then(result => {
				if (result.isConfirmed) {
					const newEvent = {
						id: null,
						title: result.value,
						start: event.date,
						end: event.date,
						className: 'event-default',
						//medicalId: this.getParentId()
					};
					this.calendarEventService.addCalendarEvent(newEvent).subscribe(response => {
						newEvent.id = response.data.id;
						this.fullcalendar.getApi().addEvent(newEvent);
					});
				}
			});
	}

	editEvent(eventInfo): void {
		swal
			.fire({
				title: 'Edit Event',
				input: 'text',
				inputValue: eventInfo.event.title,
				showCancelButton: true,
				confirmButtonText: 'Save',
				customClass: {
					confirmButton: 'btn btn-fill btn-primary',
					cancelButton: 'btn btn-default'
				}
			})
			.then(result => {
				if (result.isConfirmed) {
					const updatedEvent: ICalendarEvent = {
						id: eventInfo.event.id,
						title: result.value,
						start: eventInfo.event.start,
						end: eventInfo.event.end,
						className: eventInfo.event.classNames[0],
						//medicalId: this.getParentId()
					};
					this.calendarEventService.updateCalendarEvent(updatedEvent).subscribe(() => {
						eventInfo.event.setProp('title', result.value);
					});
				}
			});
	}

	updateEvent(eventInfo): void {
		const updatedEvent: ICalendarEvent = {
			id: eventInfo.event.id,
			title: eventInfo.event.title,
			start: eventInfo.event.start,
			end: eventInfo.event.end,
			className: eventInfo.event.classNames[0],
			//medicalId: this.getParentId()
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
