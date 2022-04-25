import { Injectable } from '@angular/core';
import { RequestManager } from '../managers/requestManager';

@Injectable({
  providedIn: 'root'
})
export class OikosService {

  constructor(private requestManager: RequestManager) { 
    this.requestManager.setPath('OIKOS_SERVICE');
  }
  get(endpoint) {
    this.requestManager.setPath('OIKOS_SERVICE');
    return this.requestManager.get(endpoint);
  }
  post(endpoint, element) {
    console.info(element)
    this.requestManager.setPath('OIKOS_SERVICE');
    return this.requestManager.post(endpoint, element);
  }
  put(endpoint, element, id) {
    this.requestManager.setPath('OIKOS_SERVICE');
    return this.requestManager.put(endpoint, element, id);
  }
  delete(endpoint, element) {
    this.requestManager.setPath('OIKOS_SERVICE');
    return this.requestManager.delete(endpoint, element.Id);
  }
}
