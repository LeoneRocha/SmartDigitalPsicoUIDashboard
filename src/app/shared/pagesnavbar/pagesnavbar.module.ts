import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagesnavbarComponent } from './pagesnavbar.component';
import { RouterModule } from '@angular/router';
import { NgxTranslateModule } from 'app/translate/translate.module'; 
import { LanguageService } from 'app/services/general/language.service';
import { AppComponent } from 'app/app.component';
@NgModule({
  imports: [
    RouterModule,
    CommonModule,
    NgxTranslateModule
  ],
  declarations: [PagesnavbarComponent],
  exports: [PagesnavbarComponent],  
  providers: [     
    LanguageService
  ],
})
export class PagesnavbarModule { }
