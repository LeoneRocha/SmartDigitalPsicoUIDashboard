import { SimpleModel } from "../contracts/SimpleModel";


export declare interface RouteEntity{
    baseRoute: string; 
}

export declare interface DataTable {
    headerRow: string[];
    footerRow: string[];
    dataRows: string[][];
    dataRowsSimple: SimpleModel[];
    routes : RouteEntity;
}


 