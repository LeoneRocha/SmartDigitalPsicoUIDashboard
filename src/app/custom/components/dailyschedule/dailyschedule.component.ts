import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AutoRefreshHelper } from 'app/helpers/AutoRefreshHelper';
import { DateHelper } from 'app/helpers/date-helper';
import { ICalendarEvent } from 'app/models/general/ICalendarEvent';
import { CalendarCriteriaDto } from 'app/models/medicalcalendar/CalendarCriteriaDto';
import { AuthService } from 'app/services/auth/auth.service';
import { CalendarEventService } from 'app/services/general/calendar/calendar-event.service';
import { LanguageService } from 'app/services/general/language.service';
import * as moment from 'moment';
@Component({
  selector: 'daily-schedule',
  templateUrl: './dailyschedule.component.html',
  styleUrls: ['./dailyschedule.component.css']
})

export class DailyScheduleComponent implements OnInit, OnDestroy {
  today: Date = new Date();
  events: ICalendarEvent[] = [];
  loading: boolean = false;
  languageUI: string;
  userLoged: any;
  parentId: number;
  protected isCanAccess: boolean = false;
  private autoRefreshHelper: AutoRefreshHelper;

  constructor(
    @Inject(AuthService) private authService: AuthService,
    @Inject(LanguageService) private languageService: LanguageService,
    @Inject(CalendarEventService) private calendarEventService: CalendarEventService,
    @Inject(Router) private router: Router,
    @Inject(ActivatedRoute) private route: ActivatedRoute

  ) {
    this.autoRefreshHelper = new AutoRefreshHelper(() => this.loadTodayEvents(), 2);
  }

  ngOnInit(): void {
    this.languageService.loadLanguage();
    this.isCanAccess = this.authService.isUserContainsRole('Medical');
    if (this.isCanAccess) {
      this.languageUI = this.languageService.getLanguageToLocalStorage(); 
      moment.locale(this.languageUI.toLowerCase());    

      this.loadTodayEvents();
      this.autoRefreshHelper.startAutoRefresh();
    }
  }
  ngOnDestroy(): void {
    this.autoRefreshHelper.stopAutoRefresh();
  }
  loadTodayEvents(): void {
    this.loading = true;
    let todayDate = this.today;
    const startDate = new Date(todayDate.setHours(0, 0, 0, 0));
    const endDate = new Date(todayDate.setHours(23, 59, 59, 999));
    const criteria: CalendarCriteriaDto = this.createCriteria(startDate, endDate);
    this.calendarEventService.getCalendarEvents(criteria).subscribe({
      next: (events) => {
        this.events = events;
        console.log('events' ,this.events);
        this.loading = false;
      },
      error: (error) => {
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
  }

  formatFullDate(date: Date): string {
    return DateHelper.formatFullDate(date, this.languageUI);
  }

  private capitalizeFirstLetterOnly(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }
  
  formatWeekday(date: Date): string {
    return this.capitalizeFirstLetterOnly(moment(date).format('dddd'));
  }
  
  formatFullDateDisplay(date: Date): string {
    const formattedDate = moment(date).format('LL');   
    const words = formattedDate.split(' ');
    if (words.length >= 3) {
      words[2] = this.capitalizeFirstLetterOnly(words[2]);  
    }
    return words.join(' ');
  }
}