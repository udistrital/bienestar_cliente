import { Injectable } from '@angular/core';
import { RequestManager } from '../managers/requestManager';

@Injectable({
  providedIn: 'root'
})
export class ParametrosService {

  constructor(private requestManager: RequestManager) { 
    this.requestManager.setPath('PARAMETROS');
  }
  get(endpoint) {
    this.requestManager.setPath('PARAMETROS');
    return this.requestManager.get(endpoint);
  }
  post(endpoint, element) {
    console.info(element)
    this.requestManager.setPath('PARAMETROS');
    return this.requestManager.post(endpoint, element);
  }
  put(endpoint, element) {
    this.requestManager.setPath('PARAMETROS');
    return this.requestManager.put(endpoint, element, element.Id);
  }
  delete(endpoint, element) {
    this.requestManager.setPath('PARAMETROS');
    return this.requestManager.delete(endpoint, element.Id);
  }
}
