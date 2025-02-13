import { BaseEntityPatientChildModel } from "../contracts/BaseEntityPatientChildModel";
import { SimpleModelBaseDescription } from "../contracts/SimpleModel";

export interface PatientRecordModel extends SimpleModelBaseDescription, BaseEntityPatientChildModel {
    annotation: string;
    annotationDate: Date;
}