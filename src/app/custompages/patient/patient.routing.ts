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

export const PatientRoutes: Routes = [{
    path: '',
    children: [{
        //path: 'pages/Patient',
        path: '',
        component: PatientComponent
    },
    {
        path: 'patientaction',
        //title: 'navbar.patient',
        component: AddEditPatientComponent
    },
    {
        path: 'additionalinformation',
        //title: 'navbar.patient',
        component: PatientAdditionalInformationComponent
    },
    {
        path: 'additionalinformationaction',
        //title: 'navbar.patient',
        component: AddEditPatientAdditionalInformationComponent
    },
    {
        path: 'hospitalizationinformation',
        //title: 'navbar.patient',
        component: PatientHospitalizationinformationComponent
    },
    {
        path: 'hospitalizationinformationaction',
        //title: 'navbar.patient',
        component: AddEditPatientHospitalizationInformationComponent
    },
    {
        path: 'medicationinformation',
        //title: 'navbar.patient',
        component: PatientMedicationInformationComponent
    },
    {
        path: 'medicationinformationaction',
        //title: 'navbar.patient',
        component: AddEditPatientMedicationInformationComponent
    },
    {
        path: 'record',
        //title: 'navbar.patient',
        component: PatientRecordComponent
    },
    {
        path: 'recordaction',
        //title: 'navbar.patient',
        component: AddEditPatientRecordComponent
    }
    ]
}];
