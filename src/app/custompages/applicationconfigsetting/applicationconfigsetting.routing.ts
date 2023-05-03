import { Routes } from '@angular/router';
import { ApplicationConfigSettingComponent } from './applicationconfigsetting.component';
import { AddEditApplicationConfigSettingComponent } from './add-edit-applicationconfigsetting/add-edit-applicationconfigsetting.component';


export const ApplicationConfigSettingRoutes: Routes = [{
    path: '',
    children: [{
        //path: 'pages/applicationconfigsetting',
        path: '',
        component: ApplicationConfigSettingComponent
    }, {
        path: 'applicationsettingaction',
        component: AddEditApplicationConfigSettingComponent
    }]
}];
