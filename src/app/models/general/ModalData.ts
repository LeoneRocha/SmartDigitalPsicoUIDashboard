import { SimpleModel } from "../contracts/SimpleModel";

 
export declare interface ModalData {
    show:boolean;
    typeModal: string;    
    title: string;
    text: string; 
    confirmButtonText : string;
    cancelButtonText : string;
}