import { Routes } from '@angular/router'; 
import { MedicalCalendarTestComponent } from './medical-calendar-test.component';


export const MedicalCalendarTestRoutes: Routes = [{
    path: '',
   // title: 'userprofile.title',
    children: [{
        path: '',
        //title: 'userprofile.title',
        component: MedicalCalendarTestComponent
    }]
}];
