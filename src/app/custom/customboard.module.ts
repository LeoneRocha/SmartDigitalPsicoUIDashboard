import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DailyScheduleComponent } from './components/dailyschedule/dailyschedule.component';
import { LanguageService } from 'app/services/general/language.service';
import { MedicalCalendarService } from 'app/services/general/principals/medicalCalendar.service';
import { CalendarEventService } from 'app/services/general/calendar/calendar-event.service';
import { PatientService } from 'app/services/general/principals/patient.service';
import { ProgressBarService } from 'app/services/progress-bar.service';

@NgModule({
  declarations: [
    DailyScheduleComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    DailyScheduleComponent
  ],
    providers: [
      , LanguageService
      , MedicalCalendarService
      , CalendarEventService
      , PatientService
      ,ProgressBarService      
    ] 
})
export class CustomBoardModule { }
