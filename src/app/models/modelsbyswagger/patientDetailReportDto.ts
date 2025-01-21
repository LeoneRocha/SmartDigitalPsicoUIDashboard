/**
 * SmartDigitalPsico.WebAPI
 * No description provided (generated by Swagger Codegen https://github.com/swagger-api/swagger-codegen)
 *
 * OpenAPI spec version: v1
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */
import { EMaritalStatus } from './eMaritalStatus';
import { PatientAdditionalInformationReportDto } from './patientAdditionalInformationReportDto';
import { PatientHospitalizationInformationReportDto } from './patientHospitalizationInformationReportDto';
import { PatientMedicationInformationReportDto } from './patientMedicationInformationReportDto';
import { PatientRecordReportDto } from './patientRecordReportDto';

export interface PatientDetailReportDto { 
    readonly genderDesc?: string;
    name?: string;
    email?: string;
    dateOfBirth?: Date;
    profession?: string;
    cpf?: string;
    rg?: string;
    education?: string;
    phoneNumber?: string;
    addressStreet?: string;
    addressNeighborhood?: string;
    addressCity?: string;
    addressState?: string;
    addressCep?: string;
    emergencyContactName?: string;
    maritalStatus?: EMaritalStatus;
    emergencyContactPhoneNumber?: string;
    patientAdditionalInformations?: Array<PatientAdditionalInformationReportDto>;
    patientHospitalizationInformations?: Array<PatientHospitalizationInformationReportDto>;
    patientMedicationInformations?: Array<PatientMedicationInformationReportDto>;
    patientRecords?: Array<PatientRecordReportDto>;
}