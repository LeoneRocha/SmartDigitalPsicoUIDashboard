import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FooterComponent } from './footer.component';
import { NgxTranslateModule } from 'app/translate/translate.module';
import { AppInformationVersionProductService } from 'app/services/general/simple/appinformationversionproduct.service';

@NgModule({
    imports: [
        RouterModule
        , CommonModule
        , NgxTranslateModule],
    declarations: [FooterComponent],
    providers: [ 
         AppInformationVersionProductService 
    ],
    exports: [FooterComponent]
})

export class FooterModule { }
