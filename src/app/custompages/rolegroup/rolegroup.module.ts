import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CustomPagesModule } from 'app/custommodules/custompages.module';
import { RoleGroupComponent } from './rolegroup.component';
import { RoleGroupRoutes } from './rolegroup.routing';
import { RoleGroupService } from 'app/services/general/simple/rolegroup.service';
import { AddEditRoleGroupComponent } from './add-edit-rolegroup/add-edit-rolegroup.component';
import { NgxTranslateModule } from 'app/translate/translate.module';
import { LanguageService } from 'app/services/general/language.service'; 
import { CustomPipesModule } from 'app/common/custompipe/custompipe.module';
@NgModule({
    imports: [
        CustomPagesModule,
        RouterModule.forChild(RoleGroupRoutes),
        NgxTranslateModule
        ,CustomPipesModule
    ],
    declarations: [ 
        RoleGroupComponent,
        AddEditRoleGroupComponent
    ]
    ,
    providers: [
        RoleGroupService, LanguageService
    ],
})

export class RoleGroupModule { }
