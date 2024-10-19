import { BaseEntityModel } from "../contracts/BaseEntityModel";
import { ETypeAccreditation } from "../general/eTypeAccreditation";
import { OfficeModel } from "../simplemodel/OfficeModel";
import { SpecialtyModel } from "../simplemodel/SpecialtyModel";

export interface MedicalModel extends BaseEntityModel {
    office?: OfficeModel
    officeId: number;
    specialtiesIds: Array<number>;
    specialties?: SpecialtyModel[];
    accreditation: string;
    typeAccreditation: number;
    startWorkingTime: string; // Usando string para simplificar
    endWorkingTime: string;
    workingDays: Array<number>; 
    patientIntervalTimeMinutes: number;
}