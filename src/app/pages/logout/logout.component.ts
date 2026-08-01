import { Component, OnInit, ElementRef, Inject, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'app/services/auth/auth.service';

declare var $: any;

@Component({
    selector: 'logout-cmp',
    templateUrl: './logout.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
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
