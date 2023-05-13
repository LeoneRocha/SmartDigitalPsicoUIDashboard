import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Inject } from '@angular/core';
import { GenericService } from '../generic/generic.service';
import { ServiceResponse } from 'app/models/ServiceResponse';
import { environment } from 'environments/environment';
import { catchError, map, throwError } from 'rxjs';
import { AppError } from 'app/common/errohandler/app-error';
import { JwtHelperService } from '@auth0/angular-jwt';
import { UserAutenticateModel } from 'app/models/usermodels/UserAutenticateModel';
import { TokenAuth } from 'app/models/general/TokenAuth';
import { UserAutenticateView } from 'app/models/usermodels/UserAutenticateView';
import { RoleGroupModel } from 'app/models/simplemodel/RoleGroupModel';
import { UserLoginModel } from 'app/models/usermodels/UserLoginModel';

const basePathUrl = '/Auth/v1';
@Injectable()
export class AuthService extends GenericService<ServiceResponse<UserAutenticateModel>, UserLoginModel, number> {

  private keyLocalStorage: string = "tokenjwt";
  private userAutenticate: UserAutenticateModel;

  constructor(@Inject(HttpClient) http: HttpClient) {
    super(http, `${environment.APIUrl + basePathUrl}`, '/');
  }

  getMedicalId(): number {
    let userLoged = this.getLocalStorageUser();
    let isAdminUser = this.isUserContainsRole('Admin');
    return isAdminUser ? 0 : userLoged.medicalId;
  }
  login(credentials: UserLoginModel) {
    let urlAut = `${environment.APIUrl + basePathUrl}/authenticate`;
    //urlAut = '/api/authenticate'//Test Mock
    //JSON.stringify(credentials)  
    return this.httpLocal.post<ServiceResponse<UserAutenticateModel>>(urlAut, credentials).pipe(map(response => {
      return this.processLoginApi(response);
    }), catchError(this.customHandleErrorAuthService));
  }
  processLoginApi(response: ServiceResponse<UserAutenticateModel>) {
    this.userAutenticate = response?.data;
    let token = this.userAutenticate.tokenAuth;
    if (token && token?.authenticated && token.accessToken) {
      this.setLocalStorageUser(token);
      return true;
    }
    return false;
  }
  setLocalStorageUser(token: TokenAuth): void {
    const userLogged = this.userAutenticate;
    localStorage.setItem(this.keyLocalStorage, token.accessToken);
    let userCache: UserAutenticateView = {
      id: userLogged.id,
      name: userLogged.name,
      language: userLogged.language,
      roleGroups: userLogged.roleGroups,
      medicalId: userLogged.medicalId,
    };
    const strUserAutenticate = JSON.stringify(userCache);
    localStorage.setItem(this.keyLocalStorage + '_user', strUserAutenticate);
  }
  getLocalStorageUser(): UserAutenticateView {
    const strUserAutenticate = localStorage.getItem(this.keyLocalStorage + '_user');
    let userLoaded: UserAutenticateView
    userLoaded = JSON.parse(strUserAutenticate);
    userLoaded.typeUser = this.getTypeUser(userLoaded);
    return userLoaded;
  }
  getRolesUser(): RoleGroupModel[] {
    let userLoaded: UserAutenticateView = this.getLocalStorageUser();
    if (userLoaded != null && userLoaded != undefined)
      return userLoaded?.roleGroups;

    return null;
  }
  getTypeUser(userLoaded: UserAutenticateView): string {

    if (userLoaded === null && userLoaded === undefined)
      return '';

    if (this.isUserContainsRoleByUser("Admin", userLoaded?.roleGroups))
      return 'Admin';

    if (this.isUserContainsRoleByUser('Medical', userLoaded?.roleGroups))
      return 'Medical';
  }

  private isUserContainsRoleByUser(roleCheck: string, roleGroups: RoleGroupModel[]): boolean {
    let isUserContainRole: boolean = false;
    const userRoles: RoleGroupModel[] = roleGroups;
    //const roleFinded: RoleGroup = userRoles.find(role => role?.rolePolicyClaimCode?.toUpperCase().trim() == roleCheck?.toUpperCase().trim());    
    //if (roleFinded) { isUserContainRole = true };
    if (userRoles != null && userRoles != undefined)
      isUserContainRole = userRoles?.some(role => role?.rolePolicyClaimCode === roleCheck);
    return isUserContainRole;
  }

  isUserContainsRole(roleCheck: string): boolean {
    let isUserContainRole: boolean = false;
    const userRoles: RoleGroupModel[] = this.getRolesUser();
    return this.isUserContainsRoleByUser(roleCheck, userRoles);
  }

  removeLocalStorageUser() {
    localStorage.removeItem(this.keyLocalStorage);
    localStorage.removeItem(this.keyLocalStorage + '_user');
  }
  logout() {
    this.removeLocalStorageUser();
  }

  isLoggedIn() {
    let sessionTokenActive = false;
    sessionTokenActive = this.checkTokenJWT();
    return sessionTokenActive;
  }

  private checkTokenJWT(): boolean {
    let sessionTokenActive = false;
    let cacheTokenLS: string = localStorage.getItem(this.keyLocalStorage);
    if (!cacheTokenLS) return sessionTokenActive;

    if (cacheTokenLS && cacheTokenLS != '') {
      sessionTokenActive = true;

      let jwtHelper = new JwtHelperService(cacheTokenLS);
      let expirationDate = jwtHelper.getTokenExpirationDate(cacheTokenLS);
      let isTokenExpired = jwtHelper.isTokenExpired(cacheTokenLS);
      sessionTokenActive = !isTokenExpired;
    }
    return sessionTokenActive;
  }

  private customHandleErrorAuthService(error: Response) {
    /*if (error.status === 400)
      return throwError(() => new BadInput(error.json()));

    if (error.status === 404)
      return throwError(() => new NotFoundError());
*/
    //return Observable.throw(new AppError(error));
    // Return an observable with a user-facing error message.
    return throwError(() => new AppError(error));
  }
}