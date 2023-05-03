import { Component, Inject, OnInit } from '@angular/core';
import { LanguageService } from './services/general/language.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit{

  constructor(@Inject(LanguageService) private languageService: LanguageService) {
  }

  ngOnInit() {
    this.languageService.loadLanguage();  
  }

  ChangeLanguage(idLanguage: string) {
    this.languageService.switchLanguage(idLanguage);
  }
}
