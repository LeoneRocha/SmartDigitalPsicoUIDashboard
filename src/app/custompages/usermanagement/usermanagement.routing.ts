import { Routes } from '@angular/router';     
import { UserManagementComponent } from './usermanagement.component';
import { AddEditUserManagementComponent } from './add-edit-usermanagement/add-edit-usermanagement.component';

export const UserManagementRoutes: Routes = [{
    path: '',
    children: [{
        //path: 'pages/UserManagement',
        path: '',
        component: UserManagementComponent
    } , {
        path: 'usermanagementaction',
        component: AddEditUserManagementComponent
    }]
}];
