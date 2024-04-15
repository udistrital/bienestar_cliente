import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { GrupoCultural } from '../../@core/data/models/cultura/grupo_cultural';
import { HorarioGrupoCultural } from '../../@core/data/models/cultura/horarios_grupo_cultural';
import { ActividadCultural } from '../../@core/data/models/cultura/actividad_cultural';
import { ActividadGrupoCultural } from '../../@core/data/models/cultura/actividad_grupo_cultural';

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

    //Metodos HTTP para actividades culturales
    getActividadesCulturales(){
        return this.http.get(url + 'actividad_cultural?limit=100&sortby=Estado&order=asc');
    }
    
    getActividadCultural(id:number){
        return this.http.get(url + 'actividad_cultural/' + id);
    }

    postActividadCultural(actividadCultural: ActividadCultural): Observable<ActividadCultural>{
        return this.http.post<ActividadCultural>(url + 'actividad_cultural', actividadCultural);
    }

    putActividadCultural(actividaCultural: ActividadCultural, id: number): Observable<ActividadCultural>{
        return this.http.put<ActividadCultural>(url+'actividad_cultural/'+id, actividaCultural);
    }

    //Metodos HTTP para actividad grupo cultural
    getGruposCulturalesParticipantes(IdActividadCultural){
        return this.http.get(url + 'actividad_grupo_cultural?query=IdActividadCultural.Id:'+IdActividadCultural);
    }

    //Metodos HTTP para los grupos culturales participantes en una actividad cultural
    postActividadGrupoCultural(actividadGrupoCultural: ActividadGrupoCultural): Observable<ActividadGrupoCultural>{
        return this.http.post<ActividadGrupoCultural>(url + "actividad_grupo_cultural", actividadGrupoCultural);
    }

    //Metodos HTTP para grupos culturales
    getGrupoCultural(id:number){
        return this.http.get(url+"grupo_cultural/" + id);
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

    //Metodos HTTP para gestionar documentos
    postDocumento(documento: any) {
        return this.http.post(urlDocumentos + 'document/upload', documento);
    }

    getDocumento(idDocumento: string) {
        return this.http.get(urlDocumentos + 'document/' + idDocumento);
    }

    deleteDocumento(idDocumento: string){
        return this.http.delete(urlDocumentos + 'document/' + idDocumento);
    }
    
}