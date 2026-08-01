import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CalendarComponent } from './calendar.component';
import { CalendarRoutes } from './calendar.routing';
import { FullCalendarModule } from '@fullcalendar/angular';
import { MedicalCalendarService } from 'app/services/general/principals/medicalCalendar.service';
import { CalendarEventService } from 'app/services/general/calendar/calendar-event.service';
import { PatientService } from 'app/services/general/principals/patient.service';
import { LanguageService } from 'app/services/general/language.service';
import { CalendarEventModalComponent } from 'app/components/calendar-event-modal/calendar-event-modal.component';
import { JwBootstrapSwitchNg2Module } from '../../shared/bswitch/jw-bootstrap-switch-ng2.module';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(CalendarRoutes),
    FormsModule,
    FullCalendarModule,
    ReactiveFormsModule,
    JwBootstrapSwitchNg2Module,
    AutocompleteLibModule
  ],
  declarations: [CalendarComponent, CalendarEventModalComponent],
  providers: [
    LanguageService,
    MedicalCalendarService,
    CalendarEventService,
    PatientService
  ]
})
export class CalendarModule { }
