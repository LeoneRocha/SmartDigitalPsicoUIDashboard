import { Routes } from '@angular/router'; 
import { FileUploadMedicalComponent } from './fileupload-medical/fileupload-medical.component';
import { AddEditFileUploadMedicalComponent } from './fileupload-medical/add-edit-fileupload-medical.component';

export const MedicalAccessRoutes: Routes = [{
    path: '',
    children: [{
        //path: 'pages/medical',
        path: '',
        component: FileUploadMedicalComponent
    }, 
    {
        path: 'fileaction',
        //title: 'navbar.patient',
        component: AddEditFileUploadMedicalComponent
    },]
}];
