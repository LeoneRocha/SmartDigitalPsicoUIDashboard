import { Routes } from '@angular/router';      
import { MedicalComponent } from './medical.component';
import { AddEditMedicalComponent } from './add-edit-medical/add-edit-medical.component';
import { FileUploadMedicalComponent } from './fileupload-medical/fileupload-medical.component';
import { AddEditFileUploadMedicalComponent } from './fileupload-medical/add-edit-fileupload-medical.component';

export const MedicalRoutes: Routes = [{
    path: '',
    children: [{
        //path: 'pages/medical',
        path: '',
        component: MedicalComponent
    } , {
        path: 'medicalaction',
        title: 'Médico',
        component: AddEditMedicalComponent,  
    } , {
        path: 'filelist',
        title: 'Médico',
        component: FileUploadMedicalComponent,  
    } ,
    {
        path: 'fileaction',
        //title: 'navbar.patient',
        component: AddEditFileUploadMedicalComponent
    },]
}];
