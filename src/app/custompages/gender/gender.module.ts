import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { GenderService } from 'app/services/general/simple/gender.service';
import { GenderComponent } from './gender.component';
import { GenderRoutes } from './gender.routing';
import { AddEditGenderComponent } from './add-edit-gender/add-edit-gender.component';
import { GenericDataTableGrid } from 'app/components/genericdatatablegrid/genericdatatablegrid.component';
import { CustomPagesModule } from 'app/custommodules/custompages.module'; 
import { NgxTranslateModule } from 'app/translate/translate.module';
import { LanguageService } from 'app/services/general/language.service';
import { ModalAlertComponent } from 'app/components/modalalert/modalalert.component'; 
import { CustomPipesModule } from 'app/common/custompipe/custompipe.module';


@NgModule({
    imports: [
        CustomPagesModule,
        RouterModule.forChild(GenderRoutes),
        NgxTranslateModule
        ,CustomPipesModule
    ],
    declarations: [ 
        GenderComponent,
        AddEditGenderComponent,
        ModalAlertComponent,
        GenericDataTableGrid
    ]
    ,
    providers: [
        GenderService, LanguageService
    ],
})

export class GenderModule { }
