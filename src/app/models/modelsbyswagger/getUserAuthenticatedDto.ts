/**
 * SmartDigitalPsico.WebAPI
 * No description provided (generated by Swagger Codegen https://github.com/swagger-api/swagger-codegen)
 *
 * OpenAPI spec version: v1
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */
import { GetRoleGroupDto } from './getRoleGroupDto';
import { TokenVO } from './tokenVO';

export interface GetUserAuthenticatedDto { 
    id?: number;
    enable?: boolean;
    name?: string;
    language?: string;
    tokenAuth?: TokenVO;
    roleGroups?: Array<GetRoleGroupDto>;
    medicalId?: number;
}