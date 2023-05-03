 

export interface BaseEntityFileModel { 
    fileDetails: Blob; 
    filePath: string
    fileData: string
    fileExtension: string
    fileContentType: string
    fileSizeKB: number 
}