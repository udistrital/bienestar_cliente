import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { RequestManager } from '../../@core/managers/requestManager';
import { PopUpManager } from '../../@core/managers/popUpManager';
import { map } from 'rxjs/operators';


const headers = {
    headers: new HttpHeaders({
      'Accept': 'application/json',
      'Authorization': `Bearer ${window.localStorage.getItem('access_token')}`,
    })
  }
const url = environment.CULTURA;
const urlDocumentos = environment.GESTOR_DOCUMENTAL;
const query = '?query=';
@Injectable({
    providedIn: 'root'
})
export class CulturaService {
    
    constructor(private http: HttpClient) { }

    getGruposCulturales(){
        return this.http.get(url+"/grupo_cultural");
    }
}