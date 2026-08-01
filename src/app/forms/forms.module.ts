import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EqualValidator } from './equal-validator.directive';
import { LbdModule } from '../lbd/lbd.module';
import { FormsRoutes } from './forms.routing';
import { TagInputModule } from '../shared/tag-input/tag-input.module';
import { NouisliderModule } from '../shared/nouislider/nouislider.module';
import { JwBootstrapSwitchNg2Module } from '../shared/bswitch/jw-bootstrap-switch-ng2.module';

import { ExtendedFormsComponent } from './extendedforms/extendedforms.component';
import { RegularFormsComponent } from './regularforms/regularforms.component';
import { ValidationFormsComponent } from './validationforms/validationforms.component';
import { WizardComponent } from './wizard/wizard.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(FormsRoutes),
        FormsModule,
        ReactiveFormsModule,
        TagInputModule,
        NouisliderModule,
        JwBootstrapSwitchNg2Module,
        LbdModule
    ],
    declarations: [
          ExtendedFormsComponent,
          RegularFormsComponent,
          ValidationFormsComponent,
          WizardComponent,
          EqualValidator
    ]
})

export class Forms {}
