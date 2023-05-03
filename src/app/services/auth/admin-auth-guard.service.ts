import { Injectable } from "@angular/core";
import {
	ActivatedRouteSnapshot,
	CanActivate,
	Router,
	RouterStateSnapshot,
	UrlTree
} from "@angular/router";
import { AuthService } from "./auth.service";


@Injectable()
export class AdminAuthGuard implements CanActivate {

	constructor(
		private authService: AuthService,
		private router: Router) { }
	canActivate(
		route: ActivatedRouteSnapshot,
		state: RouterStateSnapshot): boolean | Promise<boolean> {
		var isAuthenticated = this.authService.isUserContainsRole('Admin');

		if (!isAuthenticated) {
			this.router.navigate(['/authpages/no-access', { queryParams: { returnUrl: state.url } }]);
		}
		return isAuthenticated;
	}
}
 
@Injectable()
export class AdminOrMedicalAuthGuard implements CanActivate {

	constructor(
		private authService: AuthService,
		private router: Router) { }
	canActivate(
		route: ActivatedRouteSnapshot,
		state: RouterStateSnapshot): boolean | Promise<boolean> {
		var isAuthenticated = this.authService.isUserContainsRole('Admin') || this.authService.isUserContainsRole('Medical');

		if (!isAuthenticated) {
			this.router.navigate(['/authpages/no-access', { queryParams: { returnUrl: state.url } }]);
		}
		return isAuthenticated;
	}
}

