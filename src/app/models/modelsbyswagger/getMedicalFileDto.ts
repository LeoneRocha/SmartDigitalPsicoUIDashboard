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
import { HyperMediaLink } from './hyperMediaLink';

export interface GetMedicalFileDto { 
    id?: number;
    enable?: boolean;
    description?: string;
    fileName?: string;
    filePath?: string;
    fileData?: string;
    fileExtension?: string;
    fileContentType?: string;
    fileSizeKB?: number;
    medical?: GetMedicalDto;
    links?: Array<HyperMediaLink>;
    dataFileStream?: Blob;
    fileUrl?: string;
}