import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CustomPagesModule } from 'app/custommodules/custompages.module';
import { ApplicationLanguageRoutes } from './applicationlanguage.routing';
import { ApplicationLanguageComponent } from './applicationlanguage.component';
import { AddEditApplicationLanguageComponent } from './add-edit-applicationlanguage/add-edit-applicationlanguage.component';
import { ApplicationLanguageService } from 'app/services/general/simple/applicationlanguage.service';
import { NgxTranslateModule } from 'app/translate/translate.module';
import { LanguageService } from 'app/services/general/language.service';
import { CustomPipesModule } from 'app/common/custompipe/custompipe.module';
@NgModule({
    imports: [
        CustomPagesModule,
        RouterModule.forChild(ApplicationLanguageRoutes),
        NgxTranslateModule
        ,CustomPipesModule
    ],
    declarations: [
        ApplicationLanguageComponent,
        AddEditApplicationLanguageComponent
    ]
    ,
    providers: [
        ApplicationLanguageService, LanguageService
    ],
})

export class ApplicationLanguageModule { }
