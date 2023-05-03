import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from './navbar.component';
import { NgxTranslateModule } from 'app/translate/translate.module';

@NgModule({
    imports: [
        RouterModule,
        CommonModule,
        NgxTranslateModule
    ],
    declarations: [NavbarComponent],
    exports: [NavbarComponent]
})

export class NavbarModule { }
