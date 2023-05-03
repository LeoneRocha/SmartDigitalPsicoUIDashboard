import { Routes } from '@angular/router';  
import { OfficeComponent } from './office.component';
import { AddEditOfficeComponent } from './add-edit-office/add-edit-office.component';

export const OfficeRoutes: Routes = [{
    path: '',
    children: [{
        //path: 'pages/office',
        path: '',
        component: OfficeComponent
    }, {
        path: 'officeaction',
        component: AddEditOfficeComponent
    }]
}];
