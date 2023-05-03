import { Component, OnInit, ElementRef, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'app/services/auth/auth.service';

declare var $: any;

@Component({
    moduleId: module.id,
    selector: 'logout-cmp',
    templateUrl: './logout.component.html'
})

export class LogoutComponent implements OnInit {

    constructor(
        @Inject(Router) private router: Router
        , @Inject(ActivatedRoute) private route: ActivatedRoute
        , @Inject(AuthService) private authService: AuthService
    ) {

    }
    ngOnInit() {        
        this.authService.logout();
        this.router.navigate(['/authpages/login']);
    }
}
