import { Routes } from '@angular/router';
import { AddEditGenderComponent } from './add-edit-gender/add-edit-gender.component';
import { GenderComponent } from './gender.component';

export const GenderRoutes: Routes = [{
    path: '',
    children: [{
        //path: 'pages/gender',
        path: '',
        component: GenderComponent
    }, {
        path: 'genderaction',
        component: AddEditGenderComponent
    }]
}];
