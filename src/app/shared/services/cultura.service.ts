import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { RequestManager } from '../../@core/managers/requestManager';
import { PopUpManager } from '../../@core/managers/popUpManager';
import { map } from 'rxjs/operators';
import { GrupoCultural } from '../../@core/data/models/cultura/grupo_cultural';
import { HorarioGrupoCultural } from '../../@core/data/models/cultura/horarios_grupo_cultural';

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

    //Metodos HTTP para grupos culturales
    getGrupoCultural(id:number){
        return this.http.get(url+"grupo_cultural/"+id);
    }

    getGruposCulturales(){
        return this.http.get(url+"grupo_cultural?limit=100&sortby=Nombre&order=asc");
    }

    postGrupoCultural(grupoCultural: GrupoCultural): Observable<GrupoCultural>{
        return this.http.post<GrupoCultural>(url + 'grupo_cultural', grupoCultural);
    } 

    putGrupoCultural(grupoCultural: GrupoCultural, id: number): Observable<GrupoCultural>{
        return this.http.put<GrupoCultural>(url+'grupo_cultural/'+id, grupoCultural);
    }

    //Metodos HTTP para horarios de grupos culturales
    getHorariosGrupoCultural(IdGrupoCultural: number){
        return this.http.get(url+"horarios_grupo_cultural?query=IdGrupoCultural.Id:"+IdGrupoCultural);
    }

    postHorarioGrupoCultural(horarioGrupoCultural: HorarioGrupoCultural): Observable<HorarioGrupoCultural>{
        return this.http.post<HorarioGrupoCultural>(url+'horarios_grupo_cultural', horarioGrupoCultural);
    }

    putHorarioGrupoCultural(horarioGrupoCultural: HorarioGrupoCultural, id: number){
        return this.http.post<HorarioGrupoCultural>(url+'horarios_grupo_cultural/'+id, horarioGrupoCultural);
    }
    deleteHorarioGrupoCultural(id: number){
        return this.http.delete(url+'horarios_grupo_cultural/'+id);
    }
}