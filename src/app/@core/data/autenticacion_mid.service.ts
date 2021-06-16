import { Injectable } from '@angular/core';
import { RequestManager } from '../managers/requestManager';

@Injectable({
  providedIn: 'root'
})
export class AutenticacionMidService {
  constructor(private requestManager: RequestManager) {
    this.requestManager.setPath('AUTENTICACION_MID');
  }

  post(endpoint, element) {
    this.requestManager.setPath('AUTENTICACION_MID');
    return this.requestManager.post(endpoint, element);
  }

}



