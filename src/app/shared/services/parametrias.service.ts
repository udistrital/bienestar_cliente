import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RequestManager } from '../../@core/managers/requestManager';

@Injectable({
  providedIn: 'root'
})
export class ParametriasService {

  constructor(private readonly rqManager: RequestManager) { }

  getParametriaPeriodo(id: any): Promise<any> {
    this.rqManager.setPath('PARAMETRIAS');
    let data = this.rqManager.get(`periodo/${id}`).toPromise();
    return data;
  }

  getParametriaPeriodoObservable(id: any): Observable<any> {
    this.rqManager.setPath('PARAMETRIAS');
    return this.rqManager.get(`periodo/${id}`);
  }

  actualizarPeriodo(parametria): Observable<any> {
    this.rqManager.setPath('PARAMETRIAS');
    return this.rqManager.put('periodo/', parametria, parametria.Id);
  }
}
