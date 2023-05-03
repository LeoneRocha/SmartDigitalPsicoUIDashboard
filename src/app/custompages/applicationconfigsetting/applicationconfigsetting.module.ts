import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';  
import { CustomPagesModule } from 'app/custommodules/custompages.module';  
import { ApplicationConfigSettingRoutes } from './applicationconfigsetting.routing';
import { ApplicationConfigSettingComponent } from './applicationconfigsetting.component'; 
import { ApplicationConfigSettingService } from 'app/services/general/simple/applicationconfigsetting.service';
import { AddEditApplicationConfigSettingComponent } from './add-edit-applicationconfigsetting/add-edit-applicationconfigsetting.component';
import { NgxTranslateModule } from 'app/translate/translate.module';
import { LanguageService } from 'app/services/general/language.service'; 
import { CustomPipesModule } from 'app/common/custompipe/custompipe.module';
@NgModule({
    imports: [
        CustomPagesModule,
        RouterModule.forChild(ApplicationConfigSettingRoutes),
        NgxTranslateModule    
        ,CustomPipesModule
    ],
    declarations: [ 
        ApplicationConfigSettingComponent ,
        AddEditApplicationConfigSettingComponent
    ]
    ,
    providers: [
        ApplicationConfigSettingService, LanguageService
    ],
})

export class ApplicationConfigSettingModule { }
