import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CustomPagesModule } from 'app/custommodules/custompages.module';  
import { MedicalService } from 'app/services/general/principals/medical.service';
import { MedicalComponent } from './medical.component';
import { MedicalRoutes } from './medical.routing';
import { AddEditMedicalComponent } from './add-edit-medical/add-edit-medical.component';
import { OfficeService } from 'app/services/general/simple/office.service';
import { SpecialtyService } from 'app/services/general/simple/specialty.service';  
import { LanguageService } from 'app/services/general/language.service';
import { NgxTranslateModule } from 'app/translate/translate.module'; 
import { CustomPipesModule } from 'app/common/custompipe/custompipe.module';
import { FileUploadMedicalComponent } from './fileupload-medical/fileupload-medical.component';
import { MedicalFileService } from 'app/services/general/principals/medicalfile.service';
import { AddEditFileUploadMedicalComponent } from './fileupload-medical/add-edit-fileupload-medical.component';
@NgModule({
    imports: [
        CustomPagesModule,
        RouterModule.forChild(MedicalRoutes),
        NgxTranslateModule
        ,CustomPipesModule
    ],
    declarations: [ 
        MedicalComponent, 
        AddEditMedicalComponent,  
        FileUploadMedicalComponent,
        AddEditFileUploadMedicalComponent
    ]
    ,
    providers: [
        MedicalService,
        OfficeService, SpecialtyService, LanguageService, MedicalFileService
    ],
})

export class MedicalModule { }
