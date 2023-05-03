import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FixedPluginComponent } from './fixedplugin.component';
import { JwBootstrapSwitchNg2Module } from 'jw-bootstrap-switch-ng2';
import { FormsModule } from '@angular/forms';
import { NgxTranslateModule } from 'app/translate/translate.module';

@NgModule({
    imports: [ RouterModule, CommonModule, FormsModule, JwBootstrapSwitchNg2Module , NgxTranslateModule, ],
    declarations: [ FixedPluginComponent ],
    exports: [ FixedPluginComponent ]
})

export class FixedPluginModule {}
