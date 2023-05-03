import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
 
import { GenderService } from 'app/services/general/simple/gender.service';
import { NgxTranslateModule } from 'app/translate/translate.module';
import { UserProfileRoutes } from './userprofile.routing';
import { UserProfileComponent } from './userprofile.component';
import { UserService } from 'app/services/general/principals/user.service';
import { MedicalService } from 'app/services/general/principals/medical.service';
import { LanguageService } from 'app/services/general/language.service';
import { PatientService } from 'app/services/general/principals/patient.service';
import { CustomPagesModule } from 'app/custommodules/custompages.module';
import { CustomPipesModule } from 'app/common/custompipe/custompipe.module';
@NgModule({
    imports: [
        CommonModule,
        CustomPagesModule,
        RouterModule.forChild(UserProfileRoutes),
        FormsModule,
        NgxTranslateModule
        ,CustomPipesModule
    ],
    declarations: [
        UserProfileComponent
    ]
    , providers: [
        UserService, MedicalService, LanguageService, PatientService
    ],
})

export class UserProfileModule { }
