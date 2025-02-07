import { BaseEntityPatientChildModel } from "../contracts/BaseEntityPatientChildModel";
import { SimpleModelBaseDescription } from "../contracts/SimpleModel";

export interface PatientMedicationInformationModel extends SimpleModelBaseDescription, BaseEntityPatientChildModel {
    startDate: Date;
    endDate: Date;
    dosage: string;
    posology: string;
    mainDrug: string;
}