import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LbdModule } from '../lbd/lbd.module';

import { DashboardComponent } from './dashboard.component';
import { DashboardRoutes } from './dashboard.routing';
import { NgxTranslateModule } from 'app/translate/translate.module';
import { CustomBoardModule } from 'app/custom/customboard.module';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(DashboardRoutes),
        FormsModule,
        LbdModule, NgxTranslateModule, 
        CustomBoardModule  
    ],
    declarations: [DashboardComponent]
})

export class DashboardModule {}
