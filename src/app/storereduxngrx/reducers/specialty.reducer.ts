import { createReducer, on } from '@ngrx/store';  
import { SpecialtyModel } from 'app/models/simplemodel/SpecialtyModel';
import { deleteSpecialtyAPISuccess, loadSpecialtyAPISucess, saveNewSpecialtyAPISucess, specialtysFetchAPISuccess, updateSpecialtyAPISucess } from '../actions/specialty.action';
import { ServiceResponse } from 'app/models/ServiceResponse';

export const initialStateModel: ServiceResponse<SpecialtyModel> = {
    data : null,
    errors: null,
    message : null,
    success :false
};

export const initialState: ReadonlyArray<SpecialtyModel> = [];
 
export const specialtyReducer = createReducer(
    initialState,
  on(specialtysFetchAPISuccess, (state, { allSpecialtys }) => {
    return allSpecialtys;
  }),
  on(saveNewSpecialtyAPISucess, (state, { newSpecialty }) => {
    let newState = [...state];
    newState.unshift(newSpecialty);
    return newState;
  }),
  on(loadSpecialtyAPISucess, (state, { loadSpecialty }) => {
    let newState = [...state]; 
    return newState;
  }),
  on(updateSpecialtyAPISucess, (state, { updateSpecialty }) => {
    let newState = state.filter((_) => _.id != updateSpecialty.id);
    newState.unshift(updateSpecialty);
    return newState;
  }),
  on(deleteSpecialtyAPISuccess, (state, { id }) => {
    let newState =state.filter((_) => _.id != id);
    return newState;
  })
);
