import { Component, Inject, OnInit } from '@angular/core';
import { LanguageService } from './services/general/language.service';
import { AuthService } from './services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {

  constructor(@Inject(AuthService) private authService: AuthService
    , @Inject(Router) private route: Router
    , @Inject(LanguageService) private languageService: LanguageService) {

  /*  authService.userLoggin$.subscribe(user => {
      if (user) {
        let returnUrl = localStorage.getItem('returnUrl');
        //route.navigateByUrl(returnUrl);
      }
    });*/
  }

  ngOnInit() {
    this.languageService.loadLanguage();
  }

  ChangeLanguage(idLanguage: string) {
    this.languageService.switchLanguage(idLanguage);
  }
}
