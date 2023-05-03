import { Routes } from '@angular/router';
import { GenderComponent } from '../custompages/gender/gender.component';

import { UserComponent } from './user.component';

export const UserRoutes: Routes = [{
    path: '',
    children: [{
        path: '',
        component: UserComponent
    } ]
}];
