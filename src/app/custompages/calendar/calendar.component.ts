import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CalendarOptions, FullCalendarComponent } from '@fullcalendar/angular';
import swal from 'sweetalert2';
import { CalendarCriteriaDto } from 'app/models/medicalcalendar/CalendarCriteriaDto';
import { CalendarEventService } from 'app/services/general/calendar/calendar-event.service';
import { AuthService } from 'app/services/auth/auth.service';
import { DateHelper } from 'app/helpers/date-helper';
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

	constructor(@Inject(CalendarEventService) private calendarEventService: CalendarEventService
		, @Inject(Router) private router: Router
		, @Inject(ActivatedRoute) private route: ActivatedRoute
		, @Inject(AuthService) private authService: AuthService) {
	}

	loadDataFromApi(): void {
		const criteria: CalendarCriteriaDto = this.createCriteria();
		this.calendarEventService.getCalendarEvents(criteria).subscribe(events => {
			this.eventsData = events;
			this.updateCalendarEvents();
		});
	}

	getParentId(): number {
		const userLogger = this.authService.getLocalStorageUser();
		const paramsUrl = this.route.snapshot.paramMap;
		this.parentId = Number(paramsUrl.get('parentId'));
		const medicalId = userLogger.typeUser === "Medical" && userLogger.medicalId ? userLogger.medicalId : 0;
		this.parentId = medicalId;
		return medicalId;
	}

	createCriteria(): CalendarCriteriaDto {
		this.userLoged = this.authService.getLocalStorageUser();
		const today = DateHelper.newDateUTC();
		const y = today.getFullYear();
		const m = today.getMonth();
		const d = today.getDate();
		const criteria: CalendarCriteriaDto = {
			medicalId: this.getParentId(),
			month: m + 1,
			year: y,
			intervalInMinutes: 60,
			filterDaysAndTimesWithAppointments: false,
			filterByDate: today,
			userIdLogged: this.userLoged?.id
		};
		return criteria;
	}

	ngOnInit(): void {
		this.loadDefCalendar();
		this.loadDataFromApi();
	}
	handleDateClick() {
	}
	addEvent(event) {
		swal.fire({
			title: 'Create an Event',

			customClass: {
				confirmButton: "btn btn-fill btn-primary",
				cancelButton: "btn btn-default",
				input: "swl-input"
			},
			showCancelButton: true,
			confirmButtonText: "Save",
			input: "text",
			inputPlaceholder: "Event Title"

		}).then((result) => {
			this.fullcalendar.getApi().addEvent({
				title: result.value,
				start: event.date,
				className: 'event-default'
			});
		})
	}

	updateCalendarEvents(): void {
		if (this.fullcalendar && this.fullcalendar.getApi()) {
			this.fullcalendar.getApi().removeAllEvents();
			this.fullcalendar.getApi().addEventSource(this.eventsData);
		}
	}

	loadDefCalendar(): void {
		this.calendarOptions = {
			headerToolbar: {
				right: 'prev,next today',
				center: 'dayGridMonth,timeGridWeek,timeGridDay',
				left: 'title'
			},
			initialView: 'dayGridMonth',
			initialEvents: this.eventsData, // alternatively, use the `events` setting to fetch from a feed
			weekends: true,
			editable: true,
			selectable: true,
			selectMirror: true,
			dayMaxEvents: true,
			droppable: true,
			displayEventTime: true,
			views: {
				month: {
					titleFormat: { month: "long", year: "numeric" }
				},
				agendaWeek: {
					titleFormat: { month: "long", year: "numeric", day: "numeric" }
				},
				agendaDay: {
					titleFormat: { month: "short", year: "numeric", day: "numeric" }
				}
			},
			dateClick: this.addEvent.bind(this),
		};
	}
}