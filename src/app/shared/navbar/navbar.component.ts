import { Component, OnInit, Renderer2, ViewChild, ElementRef, Directive, Inject } from '@angular/core'; 
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { AuthService } from 'app/services/auth/auth.service';
import { ROUTES } from 'app/common/routerpaths';
import { AppComponent } from 'app/app.component';

var misc: any = {
    navbar_menu_visible: 0,
    active_collapse: true,
    disabled_collapse_init: 0,
}
declare var $: any;

@Component({
    moduleId: module.id,
    selector: 'navbar-cmp',
    templateUrl: 'navbar.component.html'
})

export class NavbarComponent implements OnInit {
    private listTitles: any[];
    location: Location;
    private nativeElement: Node;
    private toggleButton;
    private sidebarVisible: boolean;

    @ViewChild("navbar-cmp") button;

    constructor(location: Location, private renderer: Renderer2, private element: ElementRef
        , @Inject(AuthService) private authService: AuthService
        , @Inject(AppComponent) private appComponent: AppComponent) {
        this.location = location;
        this.nativeElement = element.nativeElement;
        this.sidebarVisible = false;

    }

    ngOnInit() {
        this.listTitles = ROUTES.filter(listTitle => listTitle);

        var navbar: HTMLElement = this.element.nativeElement;
        this.toggleButton = navbar.getElementsByClassName('navbar-toggle')[0];
        if ($('body').hasClass('sidebar-mini')) {
            misc.sidebar_mini_active = true;
        }
        $('#minimizeSidebar').click(function () {
            var $btn = $(this);

            if (misc.sidebar_mini_active == true) {
                $('body').removeClass('sidebar-mini');
                misc.sidebar_mini_active = false;

            } else {
                setTimeout(function () {
                    $('body').addClass('sidebar-mini');

                    misc.sidebar_mini_active = true;
                }, 300);
            }

            // we simulate the window Resize so the charts will get updated in realtime.
            var simulateWindowResize = setInterval(function () {
                window.dispatchEvent(new Event('resize'));
            }, 180);

            // we stop the simulation of Window Resize after the animations are completed
            setTimeout(function () {
                clearInterval(simulateWindowResize);
            }, 1000);
        });
    }
    ChangeLanguage(idLanguage: string) { 
        this.appComponent.ChangeLanguage(idLanguage); 
    }

    isMobileMenu() {
        if ($(window).width() < 991) {
            return false;
        }
        return true;
    }

    sidebarOpen() {
        var toggleButton = this.toggleButton;
        var body = document.getElementsByTagName('body')[0];
        setTimeout(function () {
            toggleButton.classList.add('toggled');
        }, 500);
        body.classList.add('nav-open');
        this.sidebarVisible = true;
    }
    sidebarClose() {
        var body = document.getElementsByTagName('body')[0];
        this.toggleButton.classList.remove('toggled');
        this.sidebarVisible = false;
        body.classList.remove('nav-open');
    }
    sidebarToggle() {
        if (this.sidebarVisible == false) {
            this.sidebarOpen();
        } else {
            this.sidebarClose();
        }
    }

    getTitle() {
        let titleNavigated: string = 'Default';
        var titlee = this.location.prepareExternalUrl(this.location.path()); 
        if (titlee.charAt(0) === '#') {
            titlee = titlee.slice(1);
            titleNavigated = titlee;
        }
        for (let i = 0; i < this.listTitles.length; i++) {
            if (this.listTitles[i].type === "link" && this.listTitles[i].path === titlee) {
                titleNavigated = this.listTitles[i].title;
            } else if (this.listTitles[i].type === "sub") {
                for (let j = 0; j < this.listTitles[i].children.length; j++) {
                    let subtitle = this.listTitles[i].path + '/' + this.listTitles[i].children[j].path;
                    if (subtitle === titlee) {
                        titleNavigated = this.listTitles[i].children[j].title;
                    }
                }
            }
        }
        let firstRootPath = titlee.split('/')[1];
        for (let i = 0; i < this.listTitles.length; i++) {
            let routerItem: string = this.listTitles[i];
            if (routerItem['path'].indexOf(firstRootPath) >= 0) {                
                titleNavigated = routerItem['title'];
            }
        }
        //todo:Criar um translate
        titleNavigated = titleNavigated === 'RoleGroup' ? 'Role Group' : titleNavigated;        
        return titleNavigated;
    }

    getPath() {
        return this.location.prepareExternalUrl(this.location.path());
    }
}
