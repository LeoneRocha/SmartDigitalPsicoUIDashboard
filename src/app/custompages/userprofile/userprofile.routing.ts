import { Routes } from '@angular/router';
import { UserProfileComponent } from './userprofile.component';


export const UserProfileRoutes: Routes = [{
    path: '',
   // title: 'userprofile.title',
    children: [{
        path: '',
        //title: 'userprofile.title',
        component: UserProfileComponent
    }]
}];
