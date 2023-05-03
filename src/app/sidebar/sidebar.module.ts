import { Inject, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from './sidebar.component';
import { AuthService } from 'app/services/auth/auth.service';
import { NgxTranslateModule } from 'app/translate/translate.module';

@NgModule({
    imports: [
        RouterModule
        , CommonModule
        , NgxTranslateModule
    ],
    declarations: [
        SidebarComponent
    ],
    exports: [
        SidebarComponent
    ]
})

export class SidebarModule {


    constructor(@Inject(AuthService) private authService: AuthService) {

    }
}
