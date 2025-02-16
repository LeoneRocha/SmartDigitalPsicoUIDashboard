import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DateHelper } from 'app/helpers/date-helper';
import { ICalendarEvent } from 'app/models/general/ICalendarEvent';
import { CalendarCriteriaDto } from 'app/models/medicalcalendar/CalendarCriteriaDto';
import { AuthService } from 'app/services/auth/auth.service';
import { CalendarEventService } from 'app/services/general/calendar/calendar-event.service';
import { LanguageService } from 'app/services/general/language.service';
import * as moment from 'moment';
 
@Component({
  selector: 'app-daily-schedule',
  templateUrl: './dailyschedule.component.html',
  styleUrls: ['./dailyschedule.component.css']
})
export class DailyScheduleComponent implements OnInit {
  today: Date = new Date();
  events: ICalendarEvent[] = [];
  loading: boolean = false;
  languageUI: string;
  userLoged: any;
  parentId: number;

  constructor(
    @Inject(CalendarEventService) private calendarEventService: CalendarEventService,
   @Inject(AuthService) private authService: AuthService,
   @Inject(Router) private router: Router,
   @Inject(ActivatedRoute) private route: ActivatedRoute,
   @Inject(LanguageService) private languageService: LanguageService
  ) { }

  ngOnInit(): void {
   // this.languageUI = this.languageService.getLanguageToLocalStorage();
    //this.loadTodayEvents();
  }
/*
  loadTodayEvents(): void {
    this.loading = true;
    const startDate = new Date(this.today.setHours(0, 0, 0, 0));
    const endDate = new Date(this.today.setHours(23, 59, 59, 999));
 
    const criteria: CalendarCriteriaDto = this.createCriteria(startDate, endDate);

    this.calendarEventService.getCalendarEvents(criteria).subscribe({
      next: (events) => {
        this.events = events;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading events:', error);
        this.loading = false;
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
      filterDaysAndTimesWithAppointments: true,
      filterByDate: startDateTime,
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
  }*/
}