import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DailyScheduleComponent } from './components/dailyschedule/dailyschedule.component';

@NgModule({
  declarations: [
    DailyScheduleComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    DailyScheduleComponent
  ]
})
export class CustomBoardModule { }
