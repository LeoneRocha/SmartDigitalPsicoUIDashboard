import { NgModule, isDevMode } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // this is needed!
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { FixedPluginModule } from './shared/fixedplugin/fixedplugin.module';
import { AdminLayoutComponent } from './layouts/admin/admin-layout.component';
import { AuthLayoutComponent } from './layouts/auth/auth-layout.component';
import { AppRoutes } from './app.routing';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from './services/auth/auth.service';
import { AuthGuard } from './services/auth/auth-guard.service';
import { AdminAuthGuard, AdminOrMedicalAuthGuard } from './services/auth/admin-auth-guard.service';
import { MedicalAuthGuard } from './services/auth/medical-auth-guard.service';
import { PatientAuthGuard } from './services/auth/patient-auth-guard.service';
import { CountDownTimerComponent } from './common/countdowntimer/countdowntimer.component';
import { LayoutModule } from './custommodules/layout.module';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsModule } from '@ngrx/effects';
import { appReducer } from './storereduxngrx/shared/app.reducer';
import { GlobalizationCultureService } from './services/general/simple/globalizationculture.service';
import { GlobalizationTimeZonesService } from './services/general/simple/globalizationtimezone.service';
import { NgxTranslateModule } from './translate/translate.module';
import { LanguageService } from './services/general/language.service';
import { CustomTextActivePipe } from './common/custompipe/customtextactive.pipe';
import { CustomPipesModule } from './common/custompipe/custompipe.module';


@NgModule({
    imports: [
        BrowserAnimationsModule,
        RouterModule.forRoot(AppRoutes, {
            useHash: false//HashLocationStrategy- default true https://www.tektutorialshub.com/angular/angular-location-strategies/
        }),
        LayoutModule,
        FixedPluginModule,
        HttpClientModule,
        StoreModule.forRoot({ appState: appReducer }),//4)fourth time 
        EffectsModule.forRoot([]),
        StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: !isDevMode() }),
        NgxTranslateModule,
    ],
    declarations: [  
        AppComponent,
        AdminLayoutComponent,
        AuthLayoutComponent,
        CountDownTimerComponent
    ],
    bootstrap: [AppComponent],
    providers: [
        //Services
        AuthService
        , GlobalizationCultureService
        , GlobalizationTimeZonesService
        , LanguageService
        //Guards
        , AuthGuard, AdminAuthGuard, AdminOrMedicalAuthGuard, AuthGuard, MedicalAuthGuard, PatientAuthGuard
    ],
})

export class AppModule { }
