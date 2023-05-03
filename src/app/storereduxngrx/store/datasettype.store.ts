import { ErroResponse } from "app/models/general/ErroResponse";
 
export type EntityState<T> = {
    data: T,
    dataList: T[],
    success: boolean,
    isLoading: boolean,
    error: string | null,
    message: string,
    errors: ErroResponse[]
    selectedId?: number,
    ids: number[]
  }

export type DataState<T> = {
    data: T,
    dataList: T[],
    success: boolean,
    isLoading: boolean,
    error: string | null,
    message: string,
    errors: ErroResponse[]
  }

  export interface EntityStateOLD<T> {
    entities: { [id: string]: T };
    ids: string[];
    selectedId?: string;
  }

  