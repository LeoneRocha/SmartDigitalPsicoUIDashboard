import { PatientModel } from "../principalsmodel/PatientModel";

export interface BaseEntityPatientChildModel {
    patientId: number;
    patient?: PatientModel;
}