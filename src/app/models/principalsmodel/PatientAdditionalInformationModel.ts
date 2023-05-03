import { BaseEntityPatientChildModel } from "../contracts/BaseEntityPatientChildModel";
import { SimpleModel, SimpleModelBase } from "../contracts/SimpleModel";

export interface PatientAdditionalInformationModel extends SimpleModelBase, BaseEntityPatientChildModel {        
    followUp_Neurological: string;
    followUp_Psychiatric: string;
}