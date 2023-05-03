import { Component, OnInit, ElementRef, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserLoginModel } from 'app/models/usermodels/UserLoginModel';
import { AuthService } from 'app/services/auth/auth.service';
import { LanguageService } from 'app/services/general/language.service';

declare var $: any;

@Component({
    moduleId: module.id,
    selector: 'login-cmp',
    templateUrl: './login.component.html'
})

export class LoginComponent implements OnInit {
    test: Date = new Date();
    invalidLogin: boolean;
    public userLoginModel: UserLoginModel;

    constructor(
        @Inject(Router) private router: Router
        , @Inject(ActivatedRoute) private route: ActivatedRoute
        , @Inject(AuthService) private authService: AuthService
        , @Inject(LanguageService) private languageService: LanguageService
        // @Inject(TranslateService) private translate: TranslateService
    ) {

    }
    ngOnInit() {
        this.languageService.loadLanguage();
        this.userLoginModel = {
            login: '', password: ''
        };
        this.checkFullPageBackgroundImage();
        setTimeout(function () {
            // after 1000 ms we add the class animated to the login/register card
            $('.card').removeClass('card-hidden');
        }, 700);
        const isLoged: boolean = this.authService.isLoggedIn();
        if (isLoged) {
            let returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
            this.router.navigate([returnUrl || '/administrative/dashboard']);
        }
    }
    checkFullPageBackgroundImage() {
        var $page = $('.full-page');
        var image_src = $page.data('image');

        if (image_src !== undefined) {
            var image_container = '<div class="full-page-background" style="background-image: url(' + image_src + ') "/>'
            $page.append(image_container);
        }
    };
    proccessSignIn(response: any) {
        const userLoged = this.authService.getLocalStorageUser()
        this.languageService.setLanguage(userLoged.language);
        let returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
        this.router.navigate([returnUrl || '/administrative/dashboard']);
    }

    signIn() {
        this.authService.login(this.userLoginModel).subscribe({
            next: (response: any) => {
                this.proccessSignIn(response);
            },
            error: (err) => { this.invalidLogin = true; }
        });
        //(ngSubmit)="signIn()"  type="submit"
        //value="admin"
        //value="mock123adm"
        //doctor doctor123

    }
}
//TODO:  ) TELAS DO MEDICO LOGADO.