import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable, forkJoin, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  private keyLanguage: string = "AppLanguageId";

  constructor(private translate: TranslateService) { }

  loadLanguage() {
    let lang: string;
    lang = this.getLanguageToLocalStorage();
    this.translate.use(lang);
    this.translate.setDefaultLang(lang);
  }

  translateInformationAsync(infoKeys: string[]): string[] {
    let translatedInfo: string[] = [];
    this.translateInformations(infoKeys).subscribe((response: string[]) => {
      response.forEach(key => {
        translatedInfo.push(key);
      });
    });

    return translatedInfo;
  }
  private getTranslates(infoKey: string | string[]): Observable<any> {
    return this.translate.get(infoKey);
  }

  private translateInformations(infoKeys: string[]): Observable<string[]> {
    return this.translate.get(infoKeys).pipe(
      map(translations => {
        let translatedInfo: string[] = [];
        infoKeys.forEach(key => {
          translatedInfo.push(translations[key]);
        });
        return translatedInfo;
      })
    );
  }

  setInstant(infoKey: string): any {
    return this.translate.instant(infoKey);
  }

  private getTranslate(infoKey: string): any {
    let result: string = '';
    this.translate.get(infoKey).subscribe((res: string) => {
      result = res;
      return result
    });
    return result;
  }
  switchLanguage(lang: string) {

    if (this.translate.currentLang === 'pt-BR') {
      lang = 'en';
    } else {
      lang = 'pt-BR';
    }
    this.translate.use(lang);
    this.translate.setDefaultLang(lang);

    this.removeLanguageToLocalStorage();
    this.saveLanguageToLocalStorage(lang);
    window.location.reload();//paliativa
  }

  setLanguage(lang: string) {
    this.translate.use(lang);
    this.translate.setDefaultLang(lang);

    this.removeLanguageToLocalStorage();
    this.saveLanguageToLocalStorage(lang);

    window.location.reload();//paliativa
  }

  private saveLanguageToLocalStorage(lang: string) {
    localStorage.setItem(this.keyLanguage, lang);
  }
  private removeLanguageToLocalStorage() {
    localStorage.removeItem(this.keyLanguage);
  }

  getLanguageToLocalStorage(): string {
    let result: string;
    result = localStorage.getItem(this.keyLanguage);

    if (result === undefined || result === null || result === '')
      return "en";

    return result;
  } 

  getTranslateInformationAsync(key: string): string {
    let result = this.translateInformationAsync([key])[0];
    return result;
  }


}
