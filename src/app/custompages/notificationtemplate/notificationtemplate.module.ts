import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CustomPagesModule } from 'app/custommodules/custompages.module';
import { NgxTranslateModule } from 'app/translate/translate.module';
import { LanguageService } from 'app/services/general/language.service';
import { CustomPipesModule } from 'app/common/custompipe/custompipe.module';
import { NotificationTemplateComponent } from './notificationtemplate.component';
import { EmailTemplateRoutes } from './notificationtemplate.routing';
import { NotificationTemplateService } from 'app/services/general/principals/notificationtemplate.service';
import { AddEditNotificationTemplateComponent } from './add-edit-notificationtemplate/add-edit-notificationtemplate.component';

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
        NotificationTemplateComponent,
        AddEditNotificationTemplateComponent
    ]
    ,
    providers: [
        NotificationTemplateService, LanguageService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class EmailTemplateModule { }
