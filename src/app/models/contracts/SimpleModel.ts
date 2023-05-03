export interface SimpleModel extends SimpleModelBase{    
    description: string; 
    language: string;     
  } 
  
  export interface SimpleModelBase{
    id: number;  
    enable: boolean; 
  }  

  export interface SimpleModelBaseDescription extends SimpleModelBase{ 
    description: string; 
  }  



  export interface SimpleGeneralModel{
    id: string;
    name: string;  
  }  