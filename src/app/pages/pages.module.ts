import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PagesRoutes } from './pages.routing';
import { RegisterComponent } from './register/register.component';
import { LockComponent } from './lock/lock.component';
import { LoginComponent } from './login/login.component';
import { NoAccessComponent } from './no-access/no-access.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { NgxTranslateModule } from 'app/translate/translate.module';
import { LanguageService } from 'app/services/general/language.service';
import { LogoutComponent } from './logout/logout.component';
import { AppInformationVersionProductService } from 'app/services/general/simple/appinformationversionproduct.service';
@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(PagesRoutes),
        FormsModule,
        ReactiveFormsModule,
        NgxTranslateModule, 
    ],
    declarations: [
        LoginComponent,
        RegisterComponent,
        LockComponent, 
        NoAccessComponent, 
        NotFoundComponent,
        LogoutComponent
    ] ,
    providers: [
         LanguageService, AppInformationVersionProductService 
    ],
})

export class PagesModule { }
