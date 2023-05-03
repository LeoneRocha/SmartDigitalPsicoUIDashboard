import { BaseEntityPatientChildModel } from "../contracts/BaseEntityPatientChildModel";
import { SimpleModel } from "../contracts/SimpleModel";

export interface PatientNotificationMessageModel extends SimpleModel, BaseEntityPatientChildModel {
    message: string;
    cpf: string;
    rg: string;
    email: string;
    isReaded: boolean;
    notified: boolean;
}