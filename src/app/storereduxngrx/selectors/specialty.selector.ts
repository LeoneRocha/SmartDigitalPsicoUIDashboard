//3)Third time
import { createFeatureSelector, createSelector } from '@ngrx/store'; 
import { ServiceResponse } from 'app/models/ServiceResponse';
import { SpecialtyModel } from 'app/models/simplemodel/SpecialtyModel';
 
export const selectSpecialty = createFeatureSelector<SpecialtyModel[]>('myspecialties');
export const selectOneSpecialty = createFeatureSelector<ServiceResponse<SpecialtyModel>>('onespecialty');

export const selectSpecialtyById = (id: number) =>
  createSelector(selectSpecialty, (specialties: SpecialtyModel[]) => {
    var enittybyId = specialties.filter((_) => _.id == id);
    if (enittybyId.length == 0) {
      return null;
    }
    return enittybyId[0];
  });
 