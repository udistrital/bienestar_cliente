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

@Injectable({
  providedIn: 'root'
})
export class SaludService {
  url = environment.SALUD;
  constructor(private httpClient: HttpClient) { }

  getConsultaFisioterapia(): Observable<ConsultaFisioterapia> {
    return this.httpClient.get<ConsultaFisioterapia>(this.url + 'Medicina/ConsultaFisioterapia');
  }
  getExamen(): Observable<Examen> {
    return this.httpClient.get<Examen>(this.url + 'Medicina/Examen');
  }
  getDiagnostico(): Observable<Diagnostico> {
    return this.httpClient.get<Diagnostico>(this.url + 'Medicina/Diagnostico');
  }
  getTipoAntecedente(): Observable<TipoAntecedente> {
    return this.httpClient.get<TipoAntecedente>(this.url + 'Medicina/TipoAntecedente');
  }
  getSistemas(): Observable<Sistemas> {
    return this.httpClient.get<Sistemas>(this.url + 'Medicina/Sistemas');
  }
  getHojaHistoria(id_persona): Observable<HojaHistoria> {
    return this.httpClient.get<HojaHistoria>(this.url + 'Medicina/HojaHistoria/' + ',id_persona' + id_persona);

  }
  getHistoriaClinica(): Observable<HistoriaClinica> {
    return this.httpClient.get<HistoriaClinica>(this.url + 'Medicina/HistoriaClinica');
  }
  getTipoExamen(): Observable<TipoExamen> {
    return this.httpClient.get<TipoExamen>(this.url + 'Medicina/TipoExamen');
  }
  getAntecedente(): Observable<any> {
    return this.httpClient.get<any>(this.url + 'Medicina/Antecedente');
  }
}
