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
import { ErrorResponse } from './errorResponse';
import { GetEmailTemplateDto } from './getEmailTemplateDto';

export interface GetEmailTemplateDtoListServiceResponse { 
    data?: Array<GetEmailTemplateDto>;
    success?: boolean;
    message?: string;
    errors?: Array<ErrorResponse>;
    unauthorized?: boolean;
}