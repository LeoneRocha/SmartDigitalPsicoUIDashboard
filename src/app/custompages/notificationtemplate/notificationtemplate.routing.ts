import { Routes } from '@angular/router';  
import { NotificationTemplateComponent } from './notificationtemplate.component';
import { AddEditNotificationTemplateComponent } from './add-edit-notificationtemplate/add-edit-notificationtemplate.component';
export const EmailTemplateRoutes: Routes = [{
    path: '',
    children: [{
        //path: 'pages/ApplicationLanguage',
        path: '',
        component: NotificationTemplateComponent
    }, {
        path: 'notificationtemplateaction',
        component: AddEditNotificationTemplateComponent
    }]
}];
