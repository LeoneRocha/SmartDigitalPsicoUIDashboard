import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CustomPagesModule } from 'app/custommodules/custompages.module';
import { PatientService } from 'app/services/general/principals/patient.service';
import { PatientComponent } from './patient.component';
import { PatientRoutes } from './patient.routing';
import { AddEditPatientComponent } from './add-edit-patient/add-edit-patient.component';
import { GenderService } from 'app/services/general/simple/gender.service';
import { DatePipe } from '@angular/common';
import { LanguageService } from 'app/services/general/language.service';
import { NgxTranslateModule } from 'app/translate/translate.module';
import { PatientAdditionalInformationComponent } from './additionalinformation/patient_additionalinformation.component';
import { PatientAdditionalInformationService } from 'app/services/general/principals/patientadditionalinformation.service';
import { AddEditPatientAdditionalInformationComponent } from './additionalinformation/add-edit-patient_additionalinformation.component';
import { ShortenStringPipe } from 'app/common/custompipe/shortenstring.pipe';
import { AddEditPatientHospitalizationInformationComponent } from './hospitalizationinformation/add-edit-patient_hospitalizationinformation.component';
import { PatientHospitalizationInformationService } from 'app/services/general/principals/patienthospitalizationinformation.service';
import { PatientHospitalizationinformationComponent } from './hospitalizationinformation/patient_hospitalizationinformation.component';
import { PatientMedicationInformationComponent } from './medicationinformation/patient_medicationinformation.component';
import { AddEditPatientMedicationInformationComponent } from './medicationinformation/add-edit-patientmedicationinformation.component';
import { PatientMedicationInformationService } from 'app/services/general/principals/patientmedicationinformation.service';
import { PatientRecordComponent } from './record/patient_record.component';
import { AddEditPatientRecordComponent } from './record/add-edit-patient_record.component';
import { PatientRecordService } from 'app/services/general/principals/patientrecord.service';
import { CustomPipesModule } from 'app/common/custompipe/custompipe.module';
import { FileUploadPatientComponent } from './fileupload-patient/fileupload-patient.component';
import { AddEditFileUploadPatientComponent } from './fileupload-patient/add-edit-fileupload-patient.component';
import { PatientFileService } from 'app/services/general/principals/patientfile.service';

@NgModule({
    imports: [
        CustomPagesModule
        , RouterModule.forChild(PatientRoutes)
        , NgxTranslateModule
        , CustomPipesModule
    ],
    declarations: [
        ShortenStringPipe
        , PatientComponent
        , AddEditPatientComponent
        , PatientAdditionalInformationComponent
        , AddEditPatientAdditionalInformationComponent
        , PatientHospitalizationinformationComponent
        , AddEditPatientHospitalizationInformationComponent
        , PatientMedicationInformationComponent
        , AddEditPatientMedicationInformationComponent
        , PatientRecordComponent
        , AddEditPatientRecordComponent
        , FileUploadPatientComponent
        , AddEditFileUploadPatientComponent
    ]
    ,
    providers: [
        , DatePipe
        , PatientService
        , GenderService
        , LanguageService
        , PatientAdditionalInformationService
        , PatientHospitalizationInformationService
        , PatientMedicationInformationService
        , PatientRecordService
        , PatientFileService
    ],
})

export class PatientModule { }
