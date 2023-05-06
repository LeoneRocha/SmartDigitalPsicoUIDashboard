 

export interface BaseEntityFileModel { 
    //fileFormData?: FormData;
    fileDetails?: FormData; 
    //fileDetails?: Blob; 
    filePath?: string
    fileData?: string
    fileExtension?: string
    fileContentType?: string
    fileSizeKB?: number 
}