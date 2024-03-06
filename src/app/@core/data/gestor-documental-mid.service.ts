import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { RequestManager } from '../managers/requestManager';

const httpOptions = {
    headers: new HttpHeaders({
        'Accept': 'application/json',
    }),
}

@Injectable({
  providedIn: 'root'
})
export class GestorDocumentoMidService {
    constructor(private requestManager: RequestManager) {
        this.requestManager.setPath('GESTOR_DOCUMENTAL');
    }

    get(endpoint) {
      this.requestManager.setPath('GESTOR_DOCUMENTAL');
      return this.requestManager.get(endpoint);
    }
    post(endpoint, element) {
      this.requestManager.setPath('GESTOR_DOCUMENTAL');
      return this.requestManager.post(endpoint, element);
    }
    put(endpoint, element, id) {
      this.requestManager.setPath('GESTOR_DOCUMENTAL');
      return this.requestManager.put(endpoint, element, id);
    }
    delete(endpoint, element) {
      this.requestManager.setPath('GESTOR_DOCUMENTAL');
      return this.requestManager.delete(endpoint, element.Id);
    }
}
