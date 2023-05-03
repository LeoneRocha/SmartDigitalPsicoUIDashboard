import { createAction, props } from '@ngrx/store';
import { ServiceResponse } from 'app/models/ServiceResponse';
import { ErroResponse } from 'app/models/general/ErroResponse';
import { SpecialtyModel } from 'app/models/simplemodel/SpecialtyModel';

//List all - init
export const invokeSpecialtysAPI = createAction(
  '[Specialtys API] Invoke Specialtys Fetch API'
);
//List all - result 
export const specialtysFetchAPISuccess = createAction(
  '[Specialtys API] Fetch API Success',
  props<{ allSpecialtys: SpecialtyModel[], errors?: ErroResponse[] }>()
);
//Load - init
export const invokeLoadSpecialtyAPI = createAction(
  '[Specialtys API] Inovke save new Specialty api',
  props<{ id: number }>()
);
//Load - result 
export const loadSpecialtyAPISucess = createAction(
  '[Specialtys API] load Specialty api success',
  props<{ loadSpecialty: ServiceResponse<SpecialtyModel>, errors?: ErroResponse[] }>()
);
//save - init
export const invokeSaveNewSpecialtyAPI = createAction(
  '[Specialtys API] Inovke save new Specialty api',
  props<{ newSpecialty: SpecialtyModel }>()
);
//save - result 
export const saveNewSpecialtyAPISucess = createAction(
  '[Specialtys API] save new Specialty api success',
  props<{ newSpecialty: SpecialtyModel, errors?: ErroResponse[] }>()
);
//update - init
export const invokeUpdateSpecialtyAPI = createAction(
  '[Specialtys API] Inovke update Specialty api',
  props<{ updateSpecialty: SpecialtyModel }>()
);
//update - result 
export const updateSpecialtyAPISucess = createAction(
  '[Specialtys API] update  Specialty api success',
  props<{ updateSpecialty: SpecialtyModel, errors?: ErroResponse[] }>()
);
//delete - init
export const invokeDeleteSpecialtyAPI = createAction(
  '[Specialtys API] Inovke delete Specialty api',
  props<{ id: number }>()
);
//delete - result 
export const deleteSpecialtyAPISuccess = createAction(
  '[Specialtys API] deleted Specialty api success',
  props<{ id: number, errors?: ErroResponse[] }>()
);