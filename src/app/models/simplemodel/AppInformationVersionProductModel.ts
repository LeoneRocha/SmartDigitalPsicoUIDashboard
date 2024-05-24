import { SimpleGeneralModel } from "../contracts/SimpleModel";

export interface AppInformationVersionProductModel extends SimpleGeneralModel {
    environmentName: string;
    version: string;   
    message: string;
}