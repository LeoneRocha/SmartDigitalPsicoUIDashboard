import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FooterComponent } from './footer.component';
import { NgxTranslateModule } from 'app/translate/translate.module';

@NgModule({
    imports: [
        RouterModule
        , CommonModule
        , NgxTranslateModule],
    declarations: [FooterComponent],
    exports: [FooterComponent]
})

export class FooterModule { }
