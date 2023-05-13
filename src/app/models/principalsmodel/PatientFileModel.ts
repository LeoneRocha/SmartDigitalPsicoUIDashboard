import { BaseEntityFileModel } from "../contracts/BaseEntityFileModel"; 
import { BaseEntityPatientChildModel } from "../contracts/BaseEntityPatientChildModel";
import { SimpleModelBaseDescription } from "../contracts/SimpleModel";
export interface PatientFileModel extends SimpleModelBaseDescription, BaseEntityPatientChildModel, BaseEntityFileModel {

}