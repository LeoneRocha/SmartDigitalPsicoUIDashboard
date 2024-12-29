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
import { GetMedicalDto } from './getMedicalDto';
import { GetRoleGroupDto } from './getRoleGroupDto';
import { HyperMediaLink } from './hyperMediaLink';

export interface GetUserDto { 
    id?: number;
    enable?: boolean;
    name?: string;
    email?: string;
    roleGroups?: Array<GetRoleGroupDto>;
    medicalId?: number;
    medical?: GetMedicalDto;
    login?: string;
    role?: string;
    admin?: boolean;
    language?: string;
    timeZone?: string;
    links?: Array<HyperMediaLink>;
}