import { BaseEntityFileModel } from "../contracts/BaseEntityFileModel";
import { BaseEntityMedicalChildModel } from "../contracts/BaseEntityMedicalChildModel";
import { SimpleModel } from "../contracts/SimpleModel"; 

export interface MedicalFileModel extends SimpleModel, BaseEntityMedicalChildModel, BaseEntityFileModel {    
   
} 
  
  
 