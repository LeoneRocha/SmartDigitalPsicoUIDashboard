import { Routes } from '@angular/router';
import { PatientComponent } from './patient.component';
import { AddEditPatientComponent } from './add-edit-patient/add-edit-patient.component';
import { PatientAdditionalInformationComponent } from './additionalinformation/patient_additionalinformation.component';
import { AddEditPatientAdditionalInformationComponent } from './additionalinformation/add-edit-patient_additionalinformation.component';
import { AddEditPatientHospitalizationInformationComponent } from './hospitalizationinformation/add-edit-patient_hospitalizationinformation.component';
import { PatientHospitalizationinformationComponent } from './hospitalizationinformation/patient_hospitalizationinformation.component';
import { AddEditPatientMedicationInformationComponent } from './medicationinformation/add-edit-patientmedicationinformation.component';
import { PatientMedicationInformationComponent } from './medicationinformation/patient_medicationinformation.component';
import { PatientRecordComponent } from './record/patient_record.component';
import { AddEditPatientRecordComponent } from './record/add-edit-patient_record.component';
import { FileUploadPatientComponent } from './fileupload-patient/fileupload-patient.component';
import { AddEditFileUploadPatientComponent } from './fileupload-patient/add-edit-fileupload-patient.component';
import { MedicalAuthGuard } from 'app/services/auth/medical-auth-guard.service';
import { AuthGuard } from 'app/services/auth/auth-guard.service';

export const PatientRoutes: Routes = [{
    path: '',
    children: [{
        //path: 'pages/Patient',
        path: '',
        canActivate: [AuthGuard, MedicalAuthGuard],
        component: PatientComponent
    },
    {
        path: 'patientaction',
        //title: 'navbar.patient',
        canActivate: [AuthGuard, MedicalAuthGuard],
        component: AddEditPatientComponent
    },
    {
        path: 'additionalinformation',
        //title: 'navbar.patient',
        canActivate: [AuthGuard, MedicalAuthGuard],
        component: PatientAdditionalInformationComponent
    },
    {
        path: 'additionalinformationaction',
        //title: 'navbar.patient',
        canActivate: [AuthGuard, MedicalAuthGuard],
        component: AddEditPatientAdditionalInformationComponent
    },
    {
        path: 'hospitalizationinformation',
        //title: 'navbar.patient',
        canActivate: [AuthGuard, MedicalAuthGuard],
        component: PatientHospitalizationinformationComponent
    },
    {
        path: 'hospitalizationinformationaction',
        //title: 'navbar.patient',
        canActivate: [AuthGuard, MedicalAuthGuard],
        component: AddEditPatientHospitalizationInformationComponent
    },
    {
        path: 'medicationinformation',
        //title: 'navbar.patient',
        canActivate: [AuthGuard, MedicalAuthGuard],
        component: PatientMedicationInformationComponent
    },
    {
        path: 'medicationinformationaction',
        //title: 'navbar.patient',
        canActivate: [AuthGuard, MedicalAuthGuard],
        component: AddEditPatientMedicationInformationComponent
    },
    {
        path: 'record',
        //title: 'navbar.patient',
        canActivate: [AuthGuard, MedicalAuthGuard],
        component: PatientRecordComponent
    },
    {
        path: 'recordaction',
        //title: 'navbar.patient',
        canActivate: [AuthGuard, MedicalAuthGuard],
        component: AddEditPatientRecordComponent
    }, {
        path: 'filelist', 
        canActivate: [AuthGuard, MedicalAuthGuard],
        component: FileUploadPatientComponent,  
    } ,
    {
        path: 'fileaction',
        //title: 'navbar.patient',
        canActivate: [AuthGuard, MedicalAuthGuard],
        component: AddEditFileUploadPatientComponent
    }
    ]
}];
