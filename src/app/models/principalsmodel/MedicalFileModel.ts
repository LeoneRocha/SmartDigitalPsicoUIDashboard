import { BaseEntityFileModel } from "../contracts/BaseEntityFileModel";
import { BaseEntityMedicalChildModel } from "../contracts/BaseEntityMedicalChildModel";
import { SimpleModelBaseDescription } from "../contracts/SimpleModel";

export interface MedicalFileModel extends SimpleModelBaseDescription, BaseEntityMedicalChildModel, BaseEntityFileModel {

}


