import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CalendarComponent } from './calendar.component';
import { CalendarRoutes } from './calendar.routing';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { MedicalCalendarService } from 'app/services/general/principals/medicalCalendar.service';
import { CalendarEventService } from 'app/services/general/calendar/calendar-event.service';
import { PatientService } from 'app/services/general/principals/patient.service';
import { LanguageService } from 'app/services/general/language.service';
FullCalendarModule.registerPlugins([
  dayGridPlugin,
  interactionPlugin,
  timeGridPlugin
]);
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(CalendarRoutes),
    FormsModule,
    FullCalendarModule,
    ReactiveFormsModule // Adicione isto
  ],
  declarations: [CalendarComponent],
  providers: [
    , LanguageService
    , MedicalCalendarService
    , CalendarEventService
    , PatientService
  ]
})

export class CalendarModule { }
