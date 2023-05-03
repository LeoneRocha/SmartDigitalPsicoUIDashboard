import { Routes } from '@angular/router';
import { SpecialtyComponent } from './specialty.component';
import { AddEditSpecialtyComponent } from './add-edit-specialty/add-edit-specialty.component';

export const SpecialtyRoutes: Routes = [{
    path: '',
    children: [{
        //path: 'pages/specialty',
        path: '',
        component: SpecialtyComponent
    }, {
        path: 'specialtyaction',
        component: AddEditSpecialtyComponent
    }]
}];
