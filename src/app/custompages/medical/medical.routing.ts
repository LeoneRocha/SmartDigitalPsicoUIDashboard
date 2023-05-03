import { Routes } from '@angular/router';      
import { MedicalComponent } from './medical.component';
import { AddEditMedicalComponent } from './add-edit-medical/add-edit-medical.component';

export const MedicalRoutes: Routes = [{
    path: '',
    children: [{
        //path: 'pages/medical',
        path: '',
        component: MedicalComponent
    } , {
        path: 'medicalaction',
        title: 'Médico',
        component: AddEditMedicalComponent
    } ]
}];
