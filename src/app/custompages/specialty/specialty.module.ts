import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CustomPagesModule } from 'app/custommodules/custompages.module';
import { SpecialtyComponent } from './specialty.component';
import { SpecialtyService } from 'app/services/general/simple/specialty.service';
import { SpecialtyRoutes } from './specialty.routing';
import { AddEditSpecialtyComponent } from './add-edit-specialty/add-edit-specialty.component';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { SpecialtyModel } from 'app/models/simplemodel/SpecialtyModel';
import { SpecialtyEffect } from 'app/storereduxngrx/effects/specialty.effects';
import { specialtyReducer } from 'app/storereduxngrx/reducers/specialty.reducer';
import { NgxTranslateModule } from 'app/translate/translate.module';
import { LanguageService } from 'app/services/general/language.service'; 
import { CustomPipesModule } from 'app/common/custompipe/custompipe.module';

@NgModule({
    imports: [
        CustomPagesModule,
        RouterModule.forChild(SpecialtyRoutes),
        StoreModule.forFeature('myspecialties', specialtyReducer),
        StoreModule.forFeature('onespecialty', specialtyReducer),
        EffectsModule.forFeature([SpecialtyEffect]),
        NgxTranslateModule
        ,CustomPipesModule
    ],
    declarations: [ 
        SpecialtyComponent,
        AddEditSpecialtyComponent
    ],
    providers: [
        SpecialtyService, LanguageService
    ],
})

export class SpecialtyModule { }