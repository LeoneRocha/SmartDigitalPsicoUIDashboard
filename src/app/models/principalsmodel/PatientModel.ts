import { BaseEntityMedicalChildModel } from "../contracts/BaseEntityMedicalChildModel";
import { BaseEntityModel } from "../contracts/BaseEntityModel";
import { GenderModel } from "../simplemodel/GenderModel";

export interface PatientModel extends BaseEntityModel, BaseEntityMedicalChildModel {

    gender?: GenderModel
    genderId: number;

    dateOfBirth: Date
    profession: string
    cpf: string
    rg: string
    education: string
    phoneNumber: string
    addressStreet: string
    addressNeighborhood: string
    addressCity: string
    addressState: string
    addressCep: string
    emergencyContactName: string
    emergencyContactPhoneNumber: string,
    maritalStatus: number
} 