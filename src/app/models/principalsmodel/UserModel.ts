import { BaseEntityMedicalChildModel } from "../contracts/BaseEntityMedicalChildModel";
import { BaseEntityModel } from "../contracts/BaseEntityModel";

export interface UserModel extends BaseEntityModel, BaseEntityMedicalChildModel {
    /* language: string; 
     timeZone: string; 
     login: string;      
     password: string; 
 */
    language: string;
    timeZone: string;
    roleGroupsIds: number[];
    //medicalId: number;
    login: string;
    password: string;
    role: string;
    admin: boolean;
}

export interface UserProfileModel extends BaseEntityMedicalChildModel {
    id: number;
    name: string;
    email: string;
    language: string;
    timeZone: string;
    password: string;
}