import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from './../../../environments/environment';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { RequestManager } from '../managers/requestManager';

const httpOptions = {
    headers: new HttpHeaders({
        'Accept': 'application/json',
    }),
}

@Injectable()
export class DocumentoService {
    constructor(private requestManager: RequestManager) {
        this.requestManager.setPath('DOCUMENTO_SERVICE');
      }
      get(endpoint) {
        this.requestManager.setPath('DOCUMENTO_SERVICE');
        return this.requestManager.get(endpoint);
      }
      post(endpoint, element) {
        this.requestManager.setPath('DOCUMENTO_SERVICE');
        return this.requestManager.post(endpoint, element);
      }
      put(endpoint, element, id) {
        this.requestManager.setPath('DOCUMENTO_SERVICE');
        return this.requestManager.put(endpoint, element, id);
      }
      delete(endpoint, element) {
        this.requestManager.setPath('DOCUMENTO_SERVICE');
        return this.requestManager.delete(endpoint, element.Id);
      }
    }
