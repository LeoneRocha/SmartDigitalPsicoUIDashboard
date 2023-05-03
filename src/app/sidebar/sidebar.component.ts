import { Component, OnInit, AfterViewInit, AfterViewChecked, AfterContentInit, Inject } from '@angular/core';
import { AuthService } from 'app/services/auth/auth.service';
import { ROUTES, RouteInfo } from '../common/routerpaths';
declare var $: any;
@Component({
    moduleId: module.id,
    selector: 'sidebar-cmp',
    templateUrl: 'sidebar.component.html',
})

export class SidebarComponent {
    public userNameAtenticate: string;//= "Nome do Medico/User Logado";
    public menuItems: any[];

    isNotMobileMenu() {
        if ($(window).width() > 991) {
            return false;
        }
        return true;
    }
    constructor(@Inject(AuthService) private authService: AuthService) {

    }
    checkCanAccess(menuItem: RouteInfo): boolean {
        let isCanAccess: boolean = true;
        let userCanRoleMenu = this.authService.isUserContainsRole(menuItem?.roleaccess);
        isCanAccess = userCanRoleMenu;
        if (menuItem.path.indexOf('administrative') >= 0) {
            isCanAccess = this.authService.isUserContainsRole('Admin');
        }
        return isCanAccess;
    }
    isLoggedIn(): boolean {
        return this.authService.isLoggedIn();
    }
    ngOnInit() {
        this.userNameAtenticate = this.authService.getLocalStorageUser().name;
        var isWindows = navigator.platform.indexOf('Win') > -1 ? true : false;
        this.menuItems = ROUTES.filter(menuItem => menuItem);


        isWindows = navigator.platform.indexOf('Win') > -1 ? true : false;

        if (isWindows) {
            // if we are on windows OS we activate the perfectScrollbar function
            $('.sidebar .sidebar-wrapper, .main-panel').perfectScrollbar();
            $('html').addClass('perfect-scrollbar-on');
        } else {
            $('html').addClass('perfect-scrollbar-off');
        }
    }
    userCanAccess(menuItem: any) { 
        let roleRequired: string = menuItem['roleaccess'];
        let isuserCanAccess: boolean = this.authService.isUserContainsRole(roleRequired)
        if (isuserCanAccess) {
            return true;
        } 
        return false;
    }
    ngAfterViewInit() {
        var $sidebarParent = $('.sidebar .nav > li.active .collapse li.active > a').parent().parent().parent();

        var collapseId = $sidebarParent.siblings('a').attr("href");

        $(collapseId).collapse("show");
    }
}
