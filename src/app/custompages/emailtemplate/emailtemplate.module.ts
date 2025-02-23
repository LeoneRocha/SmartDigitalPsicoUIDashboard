import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CustomPagesModule } from 'app/custommodules/custompages.module';
import { NgxTranslateModule } from 'app/translate/translate.module';
import { LanguageService } from 'app/services/general/language.service';
import { CustomPipesModule } from 'app/common/custompipe/custompipe.module';
import { EmailTemplateComponent } from './emailtemplate.component';
import { EmailTemplateRoutes } from './emailtemplate.routing';
import { EmailTemplateService } from 'app/services/general/principals/emailTemplate.service';
import { AddEditEmailTemplateComponent } from './add-edit-emailtemplate/add-edit-emailtemplate.component';

import { AngularEditorModule } from '@kolkov/angular-editor';
import { HttpClientModule } from '@angular/common/http';
@NgModule({
    imports: [
        HttpClientModule,
        CustomPagesModule,
        RouterModule.forChild(EmailTemplateRoutes),
        NgxTranslateModule,
        CustomPipesModule,
        AngularEditorModule
    ],
    declarations: [
        EmailTemplateComponent,
        AddEditEmailTemplateComponent
    ]
    ,
    providers: [
        EmailTemplateService, LanguageService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class EmailTemplateModule { }
