import { BaseEntityFileModel } from "../contracts/BaseEntityFileModel";
import { BaseEntityPatientChildModel } from "../contracts/BaseEntityPatientChildModel";
import { SimpleModel } from "../contracts/SimpleModel";

export interface PatientFileModel extends SimpleModel, BaseEntityPatientChildModel, BaseEntityFileModel {

}