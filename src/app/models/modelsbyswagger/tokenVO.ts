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

export interface TokenVO { 
    readonly authenticated?: boolean;
    readonly created?: string;
    readonly expiration?: string;
    readonly accessToken?: string;
    readonly refreshToken?: string;
}