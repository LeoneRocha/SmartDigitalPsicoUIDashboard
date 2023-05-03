import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { OfficeComponent } from './office.component';
import { OfficeService } from 'app/services/general/simple/office.service';
import { OfficeRoutes } from './office.routing';
import { AddEditOfficeComponent } from './add-edit-office/add-edit-office.component';
import { CustomPagesModule } from 'app/custommodules/custompages.module';
import { NgxTranslateModule } from 'app/translate/translate.module';
import { LanguageService } from 'app/services/general/language.service'; 
import { CustomPipesModule } from 'app/common/custompipe/custompipe.module';
@NgModule({
    imports: [
        CustomPagesModule,
        RouterModule.forChild(OfficeRoutes),    
        NgxTranslateModule
        ,CustomPipesModule
    ],
    declarations: [ 
        OfficeComponent,
        AddEditOfficeComponent,
    ]
    ,
    providers: [
        OfficeService, LanguageService
    ],
})

export class OfficeModule { }
