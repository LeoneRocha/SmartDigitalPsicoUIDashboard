import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { UserComponent } from './user.component';
import { UserRoutes } from './user.routing';
import { GenderService } from 'app/services/general/simple/gender.service';
import { NgxTranslateModule } from 'app/translate/translate.module';
@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(UserRoutes),
        FormsModule,
        NgxTranslateModule
    ],
    declarations: [UserComponent]
    , providers: [
        GenderService
    ],
})

export class UserModule { }
