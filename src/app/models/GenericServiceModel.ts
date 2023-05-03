import { Observable } from 'rxjs';

export interface GenericServiceModel<T, E, ID> {
  add(t: E): Observable<any>;
  update(t: E): Observable<T>;
  getById(id: ID): Observable<T>;
  getAll(): Observable<T[]>;
  delete(id: ID): Observable<any>;
}