import { Routes } from '@angular/router';  
import { EmailTemplateComponent } from './emailtemplate.component';
import { AddEditEmailTemplateComponent } from './add-edit-emailtemplate/add-edit-emailtemplate.component';
export const EmailTemplateRoutes: Routes = [{
    path: '',
    children: [{
        //path: 'pages/ApplicationLanguage',
        path: '',
        component: EmailTemplateComponent
    }, {
        path: 'emailtemplateaction',
        component: AddEditEmailTemplateComponent
    }]
}];
