import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core'; 
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; 
import { NgxTranslateModule } from 'app/translate/translate.module';
import { JwBootstrapSwitchNg2Module } from '../shared/bswitch/jw-bootstrap-switch-ng2.module';
  
@NgModule({ 
  exports: [ 
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    JwBootstrapSwitchNg2Module,
    NgxTranslateModule
  ]
})
export class CustomPagesModule { }
