import { BaseEntityPatientChildModel } from "../contracts/BaseEntityPatientChildModel";
import { SimpleModel, SimpleModelBase, SimpleModelBaseDescription } from "../contracts/SimpleModel";

export interface PatientHospitalizationInformationModel extends SimpleModelBaseDescription, BaseEntityPatientChildModel {   
    startDate: Date;
    endDate: Date;
    cid: string;
    observation: string;
}