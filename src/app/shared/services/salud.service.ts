import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { HojaHistoria } from '../models/Salud/hojaHistoria.model';
import { ConsultaFisioterapia } from '../models/Salud/consultaFisioterapia.model';
import { Examen } from '../models/Salud/examen.model';
import { Diagnostico } from '../models/Salud/diagnostico.model';
import { TipoAntecedente } from '../models/Salud/tipoAntecedente.model';
import { Sistemas } from '../models/Salud/sistemas.model';
import { HistoriaClinica } from '../models/Salud/historiaClinica.model';
import { TipoExamen } from '../models/Salud/tipoExamen.model';
import { Antecedente } from '../models/Salud/antecedente.model';

@Injectable({
  providedIn: 'root'
})
export class SaludService {
  url = environment.SALUD;
  query = '?query=';
  IdPersona: number | string;
  IdHistoria: number;
  constructor(private httpClient: HttpClient) { }

  getConsultaFisioterapia(IdHistoriaClinica): Observable<ConsultaFisioterapia> {
    return this.httpClient.get<ConsultaFisioterapia>(this.url + 'Medicina/ConsultaFisioterapia' + this.query + 'HistoriaClinica.Id:' + `${IdHistoriaClinica}`);
  }
  getExamen(IdHistoriaClinica): Observable<Examen> {
    return this.httpClient.get<Examen>(this.url + 'Medicina/Examen' + this.query + 'HistoriaClinica.Id:' + `${IdHistoriaClinica}` + '&limit=-1');
  }
  getDiagnostico(IdHistoriaClinica): Observable<Diagnostico> {
    return this.httpClient.get<Diagnostico>(this.url + 'Medicina/Diagnostico' + this.query + 'HistoriaClinica.Id:' + `${IdHistoriaClinica}`);
  }
  getTipoAntecedente(): Observable<TipoAntecedente> {
    return this.httpClient.get<TipoAntecedente>(this.url + 'Medicina/TipoAntecedente');
  }
  getSistema(IdHistoriaClinica): Observable<Sistemas> {
    return this.httpClient.get<Sistemas>(this.url + 'Medicina/Sistema' + this.query + 'HistoriaClinica.Id:' + `${IdHistoriaClinica}` + '&limit=-1');
  }
  getTipoSistema(): Observable<Sistemas> {
    return this.httpClient.get<Sistemas>(this.url + 'Medicina/TipoSistema');
  }
  getHojaHistoria(IdPersona): Observable<HojaHistoria> {
    return this.httpClient.get<HojaHistoria>(this.url + 'Medicina/HojaHistoria/' + this.query + 'Persona:' + `${IdPersona}`);
  }
  getHistoriaClinica(): Observable<HistoriaClinica> {
    return this.httpClient.get<HistoriaClinica>(this.url + 'Medicina/HistoriaClinica');
  }
  getTipoExamen(): Observable<TipoExamen> {
    return this.httpClient.get<TipoExamen>(this.url + 'Medicina/TipoExamen');
  }
  getAntecedente(IdHistoriaClinica): Observable<Antecedente> {
    return this.httpClient.get<any>(this.url + 'Medicina/Antecedente/' + this.query + 'HistoriaClinica.Id:' + `${IdHistoriaClinica}` + '&limit=-1');
  }
}