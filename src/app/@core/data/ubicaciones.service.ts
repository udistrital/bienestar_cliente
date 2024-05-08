import { Injectable } from '@angular/core';
import { RequestManager } from '../managers/requestManager';

@Injectable({
  providedIn: 'root'
})
export class UbicacionesService {
  constructor(private requestManager: RequestManager) {
    this.requestManager.setPath('UBICACIONES');
  }

  get(endpoint) {
    this.requestManager.setPath('UBICACIONES');
    return this.requestManager.get(endpoint);
  }

  post(endpoint, element) {
    this.requestManager.setPath('UBICACIONES');
    return this.requestManager.post(endpoint, element);
  }

  put(endpoint, element, id) {
    this.requestManager.setPath('UBICACIONES');
    return this.requestManager.put(endpoint, element, id);
  }

  delete(endpoint, element) {
    this.requestManager.setPath('UBICACIONES');
    return this.requestManager.delete(endpoint, element.Id);
  }
}



