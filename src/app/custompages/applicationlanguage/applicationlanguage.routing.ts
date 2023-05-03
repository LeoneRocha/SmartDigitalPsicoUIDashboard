import { Routes } from '@angular/router'; 
import { ApplicationLanguageComponent } from './applicationlanguage.component';
import { AddEditApplicationLanguageComponent } from './add-edit-applicationlanguage/add-edit-applicationlanguage.component';
export const ApplicationLanguageRoutes: Routes = [{
    path: '',
    children: [{
        //path: 'pages/ApplicationLanguage',
        path: '',
        component: ApplicationLanguageComponent
    }, {
        path: 'applicationlanguageaction',
        component: AddEditApplicationLanguageComponent
    }]
}];
