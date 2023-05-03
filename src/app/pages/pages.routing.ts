import { Routes } from '@angular/router';

import { RegisterComponent } from './register/register.component';
import { LockComponent } from './lock/lock.component';
import { LoginComponent } from './login/login.component';
import { NoAccessComponent } from './no-access/no-access.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { LogoutComponent } from './logout/logout.component';

export const PagesRoutes: Routes = [{
    path: '',
    children: [{
        path: 'login',
        component: LoginComponent
    }, {
        path: 'logout',
        component: LogoutComponent
    }, {
        path: 'lock',
        component: LockComponent
    }, {
        path: 'register',
        component: RegisterComponent
    }, {
        path: 'no-access',
        component: NoAccessComponent
    },
    {
        path: 'not-found',
        component: NotFoundComponent
    }
    ]
}];
