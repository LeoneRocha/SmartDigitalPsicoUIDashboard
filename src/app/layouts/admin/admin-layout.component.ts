import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';
import { Location } from '@angular/common';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { filter, Subscription } from 'rxjs';
import { LanguageService } from 'app/services/general/language.service';
declare var $: any;

@Component({
    selector: 'app-layout',
    templateUrl: './admin-layout.component.html'
})

export class AdminLayoutComponent implements OnInit {
    private lastPoppedUrl: string;
    private yScrollStack: number[] = [];
    url: any;
    location: Location;
    private _router: Subscription;
    // url: string;

    @ViewChild('sidebar') sidebar;
    @ViewChild(NavbarComponent) navbar: NavbarComponent;
    constructor(private router: Router, location: Location
        , @Inject(LanguageService) private languageService: LanguageService) {
        this.location = location;
    }

    ngOnInit() {
        this.languageService.loadLanguage();
        const elemMainPanel = <HTMLElement>document.querySelector('.main-panel');
        const elemSidebar = <HTMLElement>document.querySelector('.sidebar .sidebar-wrapper');

        this.router.events.subscribe((event: any) => {
            if (event instanceof NavigationStart) {
                if (event.url != this.lastPoppedUrl)
                    this.yScrollStack.push(window.scrollY);
            } else if (event instanceof NavigationEnd) {
                if (event.url == this.lastPoppedUrl) {
                    this.lastPoppedUrl = undefined;
                    window.scrollTo(0, this.yScrollStack.pop());
                }
                else
                    window.scrollTo(0, 0);
            }
        });
        this._router = this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((event: NavigationEnd) => {
            elemMainPanel.scrollTop = 0;
            elemSidebar.scrollTop = 0;
        });

        this._router = this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(event => {
            //   this.url = event.url;
            this.navbar.sidebarClose();
        });

        var isWindows = navigator.platform.indexOf('Win') > -1 ? true : false;
        if (isWindows) {
            // if we are on windows OS we activate the perfectScrollbar function
            var $main_panel = $('.main-panel');
            $main_panel.perfectScrollbar();
        }

    }
    public isMap() {
        if (this.location.prepareExternalUrl(this.location.path()) == '#/maps/fullscreen') {
            return true;
        }
        else {
            return false;
        }
    }
}
