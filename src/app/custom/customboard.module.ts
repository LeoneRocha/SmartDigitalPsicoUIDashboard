import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DailyScheduleComponent } from './components/dailyschedule/dailyschedule.component';
import { LanguageService } from 'app/services/general/language.service';
import { MedicalCalendarService } from 'app/services/general/principals/medicalCalendar.service';
import { CalendarEventService } from 'app/services/general/calendar/calendar-event.service';
import { PatientService } from 'app/services/general/principals/patient.service';
import { NgxTranslateModule } from 'app/translate/translate.module';
import { CustomPipesModule } from 'app/common/custompipe/custompipe.module';
@NgModule({
  declarations: [
    DailyScheduleComponent,
  ],
  imports: [
    CommonModule,
    NgxTranslateModule,
    CustomPipesModule,
  ],
  exports: [
    DailyScheduleComponent,
  ],
  providers: [
    , LanguageService
    , MedicalCalendarService
    , CalendarEventService
    , PatientService
  ]
})
export class CustomBoardModule { }