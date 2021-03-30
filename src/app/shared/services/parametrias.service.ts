import { Injectable } from '@angular/core';
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
}
