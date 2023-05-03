import { SimpleModel } from "../contracts/SimpleModel";

export interface RoleGroupModel extends SimpleModel {
  selected?: boolean;
  rolePolicyClaimCode: string;    
}