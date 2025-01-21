import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MedicalCalendarTestComponent } from './medical-calendar-test.component'; 
import { CustomPagesModule } from 'app/custommodules/custompages.module';
import { CustomPipesModule } from 'app/common/custompipe/custompipe.module';
import { MedicalCalendarService } from 'app/services/general/principals/medicalCalendar.service';
import { MedicalCalendarTestRoutes } from './medical-calendar-test.routing';

@NgModule({
  imports: [
    CommonModule,
    CustomPagesModule,
    //RouterModule.forChild([{ path: '', component: MedicalCalendarTestComponent }]),
    RouterModule.forChild(MedicalCalendarTestRoutes),
    FormsModule,
    ReactiveFormsModule,
    CustomPipesModule
  ],
  declarations: [MedicalCalendarTestComponent],
  providers: [MedicalCalendarService],
})
export class MedicalCalendarTestModule { }
