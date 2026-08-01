import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  provideTranslateService,
  provideTranslateCompiler,
  TranslatePipe,
  TranslateDirective
} from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { TranslateMessageFormatCompiler } from 'ngx-translate-messageformat-compiler';

@NgModule({
  imports: [CommonModule, TranslatePipe, TranslateDirective],
  exports: [TranslatePipe, TranslateDirective],
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    ...provideTranslateService({
      lang: 'en',
      fallbackLang: 'en',
      compiler: provideTranslateCompiler(TranslateMessageFormatCompiler)
    }),
    ...provideTranslateHttpLoader({
      prefix: './assets/i18n/',
      suffix: '.json'
    })
  ]
})
export class NgxTranslateModule { }
