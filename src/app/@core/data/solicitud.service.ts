import { Injectable } from '@angular/core';
import { RequestManager } from '../managers/requestManager';

@Injectable({
  providedIn: 'root'
})
export class SolicitudService {

  constructor(private requestManager: RequestManager) { 
    this.requestManager.setPath('SOLICITUD');
  }
  get(endpoint) {
    this.requestManager.setPath('SOLICITUD');
    return this.requestManager.get(endpoint);
  }
  post(endpoint, element) {
    console.info(element)
    this.requestManager.setPath('SOLICITUD');
    return this.requestManager.post(endpoint, element);
  }
  put(endpoint, element, id) {
    this.requestManager.setPath('SOLICITUD');
    return this.requestManager.put(endpoint, element, id);
  }
  delete(endpoint, element) {
    this.requestManager.setPath('SOLICITUD');
    return this.requestManager.delete(endpoint, element.Id);
  }

}




  

