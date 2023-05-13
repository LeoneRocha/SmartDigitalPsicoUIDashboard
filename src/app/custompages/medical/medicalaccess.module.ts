import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CustomPagesModule } from 'app/custommodules/custompages.module';  
import { MedicalService } from 'app/services/general/principals/medical.service'; 
import { OfficeService } from 'app/services/general/simple/office.service';
import { SpecialtyService } from 'app/services/general/simple/specialty.service';  
import { LanguageService } from 'app/services/general/language.service';
import { NgxTranslateModule } from 'app/translate/translate.module'; 
import { CustomPipesModule } from 'app/common/custompipe/custompipe.module'; 
import { MedicalFileService } from 'app/services/general/principals/medicalfile.service'; 
import { MedicalAccessRoutes } from './medicalaccess.routing'; 
@NgModule({
    imports: [
        CustomPagesModule,
        RouterModule.forChild(MedicalAccessRoutes),
        NgxTranslateModule
        ,CustomPipesModule
    ],
    declarations: [   
        //FileUploadMedicalComponent,
       // AddEditFileUploadMedicalComponent
    ]
    ,
    providers: [
        MedicalService,
        OfficeService, SpecialtyService, LanguageService, MedicalFileService
    ],
})

export class MedicalAccessModule { }
