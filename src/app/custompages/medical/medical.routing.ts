import { Routes } from '@angular/router';      
import { MedicalComponent } from './medical.component';
import { AddEditMedicalComponent } from './add-edit-medical/add-edit-medical.component';
import { FileUploadMedicalComponent } from './fileupload-medical/fileupload-medical.component';
import { AddEditFileUploadMedicalComponent } from './fileupload-medical/add-edit-fileupload-medical.component';
import { AuthGuard } from 'app/services/auth/auth-guard.service';
import { MedicalAuthGuard } from 'app/services/auth/medical-auth-guard.service';

export const MedicalRoutes: Routes = [{
    path: '',
    children: [{
        //path: 'pages/medical',
        path: '', 
        canActivate: [AuthGuard],
        component: MedicalComponent
    } , {
        path: 'medicalaction',
        title: 'Médico',
        canActivate: [AuthGuard],
        component: AddEditMedicalComponent,  
    } , {
        path: 'filelist',
        title: 'Médico',
        canActivate: [AuthGuard, MedicalAuthGuard],
        component: FileUploadMedicalComponent,  
    } ,
    {
        path: 'fileaction',
        canActivate: [AuthGuard, MedicalAuthGuard],
        //title: 'navbar.patient',
        component: AddEditFileUploadMedicalComponent
    },]
}];
