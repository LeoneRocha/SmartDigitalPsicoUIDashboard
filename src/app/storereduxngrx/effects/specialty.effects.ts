//3) Third time 
import { Inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { EMPTY, catchError, map, mergeMap, of, switchMap, throwError, withLatestFrom } from 'rxjs';
import { Appstate } from '../shared/appstate';
import { setAPIStatus } from '../shared/app.action';
import { SpecialtyService } from 'app/services/general/simple/specialty.service';
import { selectSpecialty } from '../selectors/specialty.selector';
import { deleteSpecialtyAPISuccess, invokeDeleteSpecialtyAPI, invokeLoadSpecialtyAPI, invokeSaveNewSpecialtyAPI, invokeSpecialtysAPI, invokeUpdateSpecialtyAPI, loadSpecialtyAPISucess, saveNewSpecialtyAPISucess, specialtysFetchAPISuccess, updateSpecialtyAPISucess } from '../actions/specialty.action';
@Injectable()
export class SpecialtyEffect {
  constructor(
    private actions$: Actions,
    @Inject(SpecialtyService) private enittyService: SpecialtyService,
    private store: Store,
    private appStore: Store<Appstate>
  ) { }

  loadEntities$ = createEffect(() =>
    this.actions$.pipe(
      ofType(invokeSpecialtysAPI),
      withLatestFrom(this.store.pipe(select(selectSpecialty))),
      mergeMap(([, enittyformStore]) => {
        if (enittyformStore.length > 0) {
          return EMPTY;
        }
        return this.enittyService
          .getAll()
          .pipe(
            map((responseData) => {
              this.appStore.dispatch(setAPIStatus({ apiStatus: { apiResponseMessage: 'invokeSpecialtysAPI', apiStatus: 'success', success: true }, })
              );
              return specialtysFetchAPISuccess({ allSpecialtys: responseData['data'], errors: responseData['errors'] })
            })
            , catchError((error) => {
              //https://andrew-evans.medium.com/exception-handling-with-ngrx-effects-70ec942e6465
              this.appStore.dispatch(setAPIStatus({ apiStatus: { apiResponseMessage: 'invokeSpecialtysAPI', apiStatus: 'error', errors: error }, }));
              return EMPTY;
            })/* END CATCH*/
          );
      })
    )
  );

  loadEntity$ = createEffect(() =>
    this.actions$.pipe(
      ofType(invokeLoadSpecialtyAPI),
      switchMap((actions) => { 
        this.appStore.dispatch(setAPIStatus({ apiStatus: { apiResponseMessage: '', apiStatus: '' } }));
        return this.enittyService
          .getById(Number(actions.id))
          .pipe(
            map((responseData) => {             
              this.appStore.dispatch(setAPIStatus({ apiStatus: { apiResponseMessage: 'invokeLoadSpecialtyAPI', apiStatus: 'success', resultAPI: responseData }, }));              
              return loadSpecialtyAPISucess({ loadSpecialty: responseData, errors: responseData['errors'] })
            })
            , catchError((error) => {
              this.appStore.dispatch(setAPIStatus({ apiStatus: { apiResponseMessage: 'invokeLoadSpecialtyAPI', apiStatus: 'error' }, }));
              return EMPTY;
            })/* END CATCH*/
          );
      })
    )
  ); 

  addEntity$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(invokeSaveNewSpecialtyAPI),
      switchMap((action) => {
        this.appStore.dispatch(setAPIStatus({ apiStatus: { apiResponseMessage: 'invokeSaveNewSpecialtyAPI', apiStatus: '' } }));
        return this.enittyService.add(action.newSpecialty).pipe(
          map((responseData) => {
            this.appStore.dispatch(setAPIStatus({ apiStatus: { apiResponseMessage: 'invokeSaveNewSpecialtyAPI', apiStatus: 'success' , resultAPI: responseData}, }));
            return saveNewSpecialtyAPISucess({ newSpecialty: responseData["data"], errors: responseData['errors'] });
          }), catchError((error) => {
            this.appStore.dispatch(setAPIStatus({ apiStatus: {  apiResponseMessage: 'invokeSaveNewSpecialtyAPI', apiStatus: 'error' }, }));
            return EMPTY;
          })/* END CATCH*/
        );
      })
    );
  });

  updateEntity$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(invokeUpdateSpecialtyAPI),
      switchMap((action) => {
        this.appStore.dispatch(setAPIStatus({ apiStatus: { apiResponseMessage: 'invokeUpdateSpecialtyAPI', apiStatus: '' } }));
        return this.enittyService.update(action.updateSpecialty).pipe(
          map((responseData) => {
            this.appStore.dispatch(setAPIStatus({ apiStatus: { apiResponseMessage: 'invokeUpdateSpecialtyAPI', apiStatus: 'success', resultAPI: responseData }, }));
            return updateSpecialtyAPISucess({ updateSpecialty: responseData["data"], errors: responseData['errors'] });
          }), catchError((error) => {
            this.appStore.dispatch(setAPIStatus({ apiStatus: {  apiResponseMessage: 'invokeUpdateSpecialtyAPI', apiStatus: 'error' }, }));
            return EMPTY;
          })/* END CATCH*/
        );
      })
    );
  });

  deleteEntity$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(invokeDeleteSpecialtyAPI),
      switchMap((actions) => {
        this.appStore.dispatch(
          setAPIStatus({ apiStatus: { apiResponseMessage: '', apiStatus: '' } })
        );
        return this.enittyService.delete(Number(actions.id)).pipe(
          map((responseData) => {
            this.appStore.dispatch(setAPIStatus({ apiStatus: { apiResponseMessage: '', apiStatus: 'success', resultAPI: responseData }, }));
            return deleteSpecialtyAPISuccess({ id: actions.id, errors: responseData['errors'] });
          }), catchError((error) => {
            this.appStore.dispatch(setAPIStatus({ apiStatus: { apiResponseMessage: error.message, apiStatus: 'error' }, }));
            return EMPTY;
          })/* END CATCH*/
        );
      })
    );
  });
}