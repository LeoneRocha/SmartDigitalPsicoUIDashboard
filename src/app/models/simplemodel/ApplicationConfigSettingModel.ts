import { SimpleModel } from "../contracts/SimpleModel";

export interface ApplicationConfigSettingModel extends SimpleModel {    
    endPointUrl_StorageFiles: string;
    endPointUrl_Cache: string;
}