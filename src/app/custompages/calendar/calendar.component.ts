import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CalendarOptions, FullCalendarComponent } from '@fullcalendar/angular';
import swal from 'sweetalert2';
import { CalendarCriteriaDto } from 'app/models/medicalcalendar/CalendarCriteriaDto';
import { CalendarEventService } from 'app/services/general/calendar/calendar-event.service';
import { AuthService } from 'app/services/auth/auth.service';
import { EventUtility } from 'app/helpers/eventUtility';
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
	events;
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
		const today = new Date();
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
		this.userLoged = this.authService.getLocalStorageUser();

		this.calendarEventService.getCalendarEvents(criteria).subscribe(events => {
			this.eventsData = events; 
		}); 
		
		console.log('----------------------loadDataFromApi- getCalendarEvents -------------------------');
		console.log(this.eventsData);
	}
	getParentId(): number {
		const paramsUrl = this.route.snapshot.paramMap;
		this.parentId = Number(paramsUrl.get('parentId'));
		const userLogger = this.authService.getLocalStorageUser();
		const medicalId = userLogger.typeUser === "Medical" && userLogger.medicalId ? userLogger.medicalId : 0;
		this.parentId = medicalId;
		return medicalId;
	}

	loadExampleData(): void {

		const today = new Date();
		const y = today.getFullYear();
		const m = today.getMonth();
		const d = today.getDate();
		this.events = [
			{
				title: 'All Day Event',
				start: new Date(y, m, 1),
				className: 'event-default'
			},
			{
				id: 999,
				title: 'Repeating Event',
				start: new Date(y, m, d + 3, 6, 0),
				allDay: false,
				className: 'event-rose'
			},
			{
				title: 'Meeting',
				start: new Date(y, m, d - 1, 10, 30),
				allDay: false,
				className: 'event-green'
			},
			{
				title: 'Lunch',
				start: new Date(y, m, d + 7, 12, 0),
				end: new Date(y, m, d + 7, 14, 0),
				allDay: false,
				className: 'event-red'
			},
			{
				title: 'Md-pro Launch',
				start: new Date(y, m, d - 2, 12, 0),
				allDay: true,
				className: 'event-azure'
			},
			{
				title: 'Birthday Party',
				start: new Date(y, m, d + 1, 19, 0),
				end: new Date(y, m, d + 1, 22, 30),
				allDay: false,
				className: 'event-azure'
			},
			{
				title: 'Click for Creative Tim',
				start: new Date(y, m, 21),
				end: new Date(y, m, 22),
				url: 'https://www.creative-tim.com/',
				className: 'event-orange'
			},
			{
				title: 'Click for Google',
				start: new Date(y, m, 21),
				end: new Date(y, m, 22),
				url: 'https://www.creative-tim.com/',
				className: 'event-orange'
			}
		];
	}
	ngOnInit(): void {

		this.events = EventUtility.generateEvents();
		console.log('----------------------ngOnInit-------------------------');
		console.log(this.events);

		this.loadDataFromApi();
		//this.loadExampleData();

		this.calendarOptions = {
			headerToolbar: {
				right: 'prev,next today',
				center: 'dayGridMonth,timeGridWeek,timeGridDay',
				left: 'title'
			},
			initialView: 'dayGridMonth',
			initialEvents: this.events, // alternatively, use the `events` setting to fetch from a feed
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
}	