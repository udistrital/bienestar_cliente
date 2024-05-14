import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { HojaHistoria } from '../models/Salud/hojaHistoria.model';
import { ConsultaFisioterapia } from '../models/Salud/consultaFisioterapia.model';
import { Examen } from '../models/Salud/examen.model';
import { Diagnostico } from '../models/Salud/diagnostico.model';
import { Sistemas } from '../models/Salud/sistemas.model';
import { HistoriaClinica } from '../models/Salud/historiaClinica.model';
import { Antecedente } from '../models/Salud/antecedente.model';
import { ComposicionFamiliar } from '../models/Salud/composicionFamiliar.model';
import { Limites } from '../models/Salud/limites.model';
import { AntecedentePsicologia } from '../models/Salud/antecedentePsicologia.model';
import { ValoracionInterpersonal } from '../models/Salud/valoracionInterpersonal.model';
import { ComportamientoConsulta } from '../models/Salud/comportamientoConsulta.model';
import { DiagnosticoPsicologia } from '../models/Salud/DiagnosticoPsicologia.model';
import { Anamnesis } from '../models/Salud/ananmesis.model';
import { ExamenDental } from '../models/Salud/examenDental.model';
import { ExamenEstomatologico } from '../models/Salud/examenEstomatologico';
import { DiagnosticoOdontologia } from '../models/Salud/diagnosticoOdontologia';
import { Odontograma } from '../models/Salud/odontograma';
import { Especialidad } from '../models/Salud/especialidad.model';
import { TipoOdontograma } from '../models/Salud/tipoOdontograma';
import { Enfermeria } from '../models/Salud/enfermeria.model';
import { ExamenesComplementarios } from '../models/Salud/examenesComplementarios';
import { AccesoHistoria } from '../models/Salud/accesoHistoria.model';

@Injectable({
  providedIn: 'root'
})
export class SaludService {
  url = environment.MEDICINA;
  url2 = environment.PSICOLOGIA;
  url3 = environment.ODONTOLOGIA;
  url4 = environment.ACCESO_HISTORIA;
  url5 = environment.CITA;
  urlDocumentos = environment.GESTOR_DOCUMENTAL;
  query = '?query=';
  paciente = '';
  IdPersona: number;
  historia: any;
  hojaHistoria: any;
  falloPsico: boolean = false;
  falloMedicina: boolean = false;
  terceroId: number;
  constructor(private httpClient: HttpClient) { }

  getExamen(IdHojaHistoria): Observable<Examen> {
    return this.httpClient.get<Examen>(this.url + 'Examen/' + this.query + 'HojaHistoria.Id:' + `${IdHojaHistoria}` + '&limit=-1');
  }
  getDiagnostico(IdHojaHistoria): Observable<Diagnostico> {
    return this.httpClient.get<Diagnostico>(this.url + 'Diagnostico/' + this.query + 'HojaHistoria.Id:' + `${IdHojaHistoria}`);
  }
  getSistema(IdHojaHistoria): Observable<Sistemas> {
    return this.httpClient.get<Sistemas>(this.url + 'Sistema/' + this.query + 'HojaHistoria.Id:' + `${IdHojaHistoria}` + '&limit=-1');
  }
  getHojaHistoria(IdTercero, IdEspecialidad): Observable<HojaHistoria> {
    return this.httpClient.get<HojaHistoria>(this.url + 'HojaHistoria/' + this.query + 'HistoriaClinica.Tercero:' + `${IdTercero}` + ',Especialidad:' + `${IdEspecialidad}` + '&sortby=Id&order=desc');
  }
  getHojaHistoriaEspecifica(IdHojaHistoria): Observable<HojaHistoria> {
    return this.httpClient.get<HojaHistoria>(this.url + 'HojaHistoria/' + `${IdHojaHistoria}`);
  }
  getHistoriaClinica(IdTercero): Observable<HistoriaClinica> {
    return this.httpClient.get<HistoriaClinica>(this.url + 'HistoriaClinica/' + this.query + 'Tercero:' + `${IdTercero}`);
  }
  getAntecedente(IdHistoriaClinica): Observable<Antecedente> {
    return this.httpClient.get<any>(this.url + 'Antecedente/' + this.query + 'HistoriaClinica.Id:' + `${IdHistoriaClinica}` + '&limit=-1');
  }
  // Fisioterapia
  getConsultaFisioterapia(IdHojaHistoria): Observable<ConsultaFisioterapia> {
    return this.httpClient.get<ConsultaFisioterapia>(this.url + 'ConsultaFisioterapia/' + this.query + 'HojaHistoria.Id:' + `${IdHojaHistoria}`);
  }
  //Psicología
  getComposicionFamiliar(IdHojaHistoria): Observable<ComposicionFamiliar> {
    return this.httpClient.get<ComposicionFamiliar>(this.url2 + 'ComposicionFamiliar/' + this.query + 'HojaHistoriaId:' + `${IdHojaHistoria}`);
  }
  getLimites(IdHojaHistoria): Observable<Limites> {
    return this.httpClient.get<Limites>(this.url2 + 'Limites/' + this.query + 'HojaHistoriaId:' + `${IdHojaHistoria}`);
  }
  getAntecedentesPsicologicos(IdHistoriaClinica): Observable<AntecedentePsicologia> {
    return this.httpClient.get<AntecedentePsicologia>(this.url2 + 'Antecedente/' + this.query + 'HistoriaClinicaId:' + `${IdHistoriaClinica}`);
  }
  getValoracionInterpersonal(IdHojaHistoria): Observable<ValoracionInterpersonal> {
    return this.httpClient.get<ValoracionInterpersonal>(this.url2 + 'ValoracionInterpersonal/' + this.query + 'HojaHistoriaId:' + `${IdHojaHistoria}`);
  }
  getComportamientoConslta(IdHojaHistoria): Observable<ComportamientoConsulta> {
    return this.httpClient.get<ComportamientoConsulta>(this.url2 + 'ComportamientoConsulta/' + this.query + 'HojaHistoriaId:' + `${IdHojaHistoria}`);
  }
  getDiagnosticoPsicologia(IdHojaHistoria): Observable<DiagnosticoPsicologia> {
    return this.httpClient.get<DiagnosticoPsicologia>(this.url2 + 'Diagnostico/' + this.query + 'HojaHistoriaId:' + `${IdHojaHistoria}`);
  }
  //Odontologia
  getAnanmesis(IdHistoriaClinica): Observable<Antecedente> {
    return this.httpClient.get<Anamnesis>(this.url3 + 'Anamnesis/' + this.query + 'HistoriaClinicaId:' + `${IdHistoriaClinica}`);
  }
  getExamenDental(IdHistoriaClinica): Observable<ExamenDental> {
    return this.httpClient.get<ExamenDental>(this.url3 + 'ExamenDental/' + this.query + 'HojaHistoriaId:' + `${IdHistoriaClinica}`);
  }
  getExamenEstomatologico(IdHistoriaClinica): Observable<ExamenEstomatologico> {
    return this.httpClient.get<ExamenEstomatologico>(this.url3 + 'ExamenEstomatologico/' + this.query + 'HojaHistoriaId:' + `${IdHistoriaClinica}`);
  }
  getExamenesComplementarios(IdHistoriaClinica): Observable<ExamenesComplementarios> {
    return this.httpClient.get<ExamenesComplementarios>(this.url3 + 'ExamenesComplementarios/' + this.query + 'HojaHistoriaId:' + `${IdHistoriaClinica}`);
  }
  getDiagnosticoOdontologia(IdHistoriaClinica): Observable<DiagnosticoOdontologia> {
    return this.httpClient.get<DiagnosticoOdontologia>(this.url3 + 'Diagnostico/' + this.query + 'HojaHistoriaId:' + `${IdHistoriaClinica}`);
  }
  getOdontograma(IdHojaHistoria, IdTipo): Observable<Odontograma> {
    return this.httpClient.get<Odontograma>(this.url3 + 'Odontograma/' + this.query + 'IdHojaHistoria:' + `${IdHojaHistoria}` + ',IdTipoOdontograma.Id:' + `${IdTipo}`);
  }
  getOdontogramas(IdHistoriaClinica, IdTipo): Observable<Odontograma> {
    return this.httpClient.get<Odontograma>(this.url3 + 'Odontograma/' + this.query + 'HistoriaClinicaId:' + `${IdHistoriaClinica}` + ',IdTipoOdontograma.Id:' + `${IdTipo}` + '&sortby=Id&order=desc');
  }
  getTipoOdontograma(IdTipo): Observable<TipoOdontograma> {
    return this.httpClient.get<TipoOdontograma>(this.url3 + 'TipoOdontograma/' + `${IdTipo}`);
  }
  getEspecialidad(IdEspecialidad): Observable<Especialidad> {
    return this.httpClient.get<Especialidad>(this.url + 'Especialidad/' + `${IdEspecialidad}`);
  }
  getEnfermeria(IdHistoriaClinica): Observable<Enfermeria> {
    return this.httpClient.get<Enfermeria>(this.url + 'NotasEnfermeria/' + this.query + 'HojaHistoria.Id:' + `${IdHistoriaClinica}`);
  }
  getAllEnfermeria(IdHistoriaClinica): Observable<Enfermeria> {
    return this.httpClient.get<Enfermeria>(this.url + 'NotasEnfermeria/' + this.query + 'HistoriaClinica.Id:' + `${IdHistoriaClinica}` + '&sortby=FechaCreacion&order=desc');
  }

  //Guardar y actualizar
  postFisioterapia(consultaFisioterapia: ConsultaFisioterapia): Observable<ConsultaFisioterapia> {
    return this.httpClient.post<ConsultaFisioterapia>(this.url + 'ConsultaFisioterapia', consultaFisioterapia);
  }
  putFisioterapia(IdHojaHistoria: number, consultaFisioterapia: ConsultaFisioterapia): Observable<ConsultaFisioterapia> {
    return this.httpClient.put<ConsultaFisioterapia>(this.url + `ConsultaFisioterapia/${IdHojaHistoria}`, consultaFisioterapia);
  }
  postAntecedentePsicologia(antecedentePsicologia: AntecedentePsicologia): Observable<AntecedentePsicologia> {
    return this.httpClient.post<AntecedentePsicologia>(this.url2 + 'Antecedente', antecedentePsicologia);
  }
  putAntecedentePsicologia(IdAntecedente: number, antecedentePsicologia: AntecedentePsicologia): Observable<AntecedentePsicologia> {
    return this.httpClient.put<AntecedentePsicologia>(this.url2 + `Antecedente/${IdAntecedente}`, antecedentePsicologia);
  }
  postComportamientoConsulta(comportamientoConsulta: ComportamientoConsulta): Observable<ComportamientoConsulta> {
    return this.httpClient.post<ComportamientoConsulta>(this.url2 + 'ComportamientoConsulta', comportamientoConsulta);
  }
  putComportamientoConsulta(IdComportamientoConsulta: number, comportamientoConsulta: ComportamientoConsulta): Observable<ComportamientoConsulta> {
    return this.httpClient.put<ComportamientoConsulta>(this.url2 + `ComportamientoConsulta/${IdComportamientoConsulta}`, comportamientoConsulta);
  }
  postComposicionFamiliar(composicionFamiliar: ComposicionFamiliar): Observable<ComposicionFamiliar> {
    return this.httpClient.post<ComposicionFamiliar>(this.url2 + 'ComposicionFamiliar', composicionFamiliar);
  }
  putComposicionFamiliar(IdComposicionFamiliar: number, composicionFamiliar: ComposicionFamiliar): Observable<ComposicionFamiliar> {
    return this.httpClient.put<ComposicionFamiliar>(this.url2 + `ComposicionFamiliar/${IdComposicionFamiliar}`, composicionFamiliar);
  }
  postDiagnosticoPsicologia(diagnosticoPsicologia: DiagnosticoPsicologia): Observable<DiagnosticoPsicologia> {
    return this.httpClient.post<DiagnosticoPsicologia>(this.url2 + 'Diagnostico', diagnosticoPsicologia);
  }
  putDiagnosticoPsicologia(IdDiagnostico: number, diagnosticoPsicologia: DiagnosticoPsicologia): Observable<DiagnosticoPsicologia> {
    return this.httpClient.put<DiagnosticoPsicologia>(this.url2 + `Diagnostico/${IdDiagnostico}`, diagnosticoPsicologia);
  }
  postLimites(limites: Limites): Observable<Limites> {
    return this.httpClient.post<Limites>(this.url2 + 'Limites', limites);
  }
  putLimites(IdLimites: number, limites: Limites): Observable<Limites> {
    return this.httpClient.put<Limites>(this.url2 + `Limites/${IdLimites}`, limites);
  }
  postValoracionInterpersonal(valoracionInterpersonal: ValoracionInterpersonal): Observable<ValoracionInterpersonal> {
    return this.httpClient.post<ValoracionInterpersonal>(this.url2 + 'ValoracionInterpersonal', valoracionInterpersonal);
  }
  putValoracionInterpersonal(IdValoracionInterpersonal: number, valoracionInterpersonal: ValoracionInterpersonal): Observable<ValoracionInterpersonal> {
    return this.httpClient.put<ValoracionInterpersonal>(this.url2 + `ValoracionInterpersonal/${IdValoracionInterpersonal}`, valoracionInterpersonal);
  }
  postSistema(sistema: Sistemas): Observable<Sistemas> {
    return this.httpClient.post<Sistemas>(this.url + 'Sistema', sistema);
  }
  putSistema(IdSistema: number, sistema: any): Observable<Sistemas> {
    return this.httpClient.put<Sistemas>(this.url + `Sistema/${IdSistema}`, sistema);
  }
  postExamen(examen: Examen): Observable<Examen> {
    return this.httpClient.post<Examen>(this.url + 'Examen', examen);
  }
  putExamen(IdExamen: number, examen: Examen): Observable<Examen> {
    return this.httpClient.put<Examen>(this.url + `Examen/${IdExamen}`, examen);
  }
  postDiagnostico(diagnostico: Diagnostico): Observable<Diagnostico> {
    return this.httpClient.post<Diagnostico>(this.url + 'Diagnostico', diagnostico);
  }
  putDiagnostico(IdDiagnostico: number, diagnostico: Diagnostico): Observable<Diagnostico> {
    return this.httpClient.put<Diagnostico>(this.url + `Diagnostico/${IdDiagnostico}`, diagnostico);
  }
  postHojaHistoria(hojaHistoria: HojaHistoria): Observable<HojaHistoria> {
    return this.httpClient.post<HojaHistoria>(this.url + 'HojaHistoria', hojaHistoria);
  }
  putHojaHistoria(IdHojaHistoria: number, hojaHistoria: HojaHistoria): Observable<HojaHistoria> {
    return this.httpClient.put<HojaHistoria>(this.url + `HojaHistoria/${IdHojaHistoria}`, hojaHistoria);
  }
  postHistoriaClinica(historiaClinica: HistoriaClinica): Observable<HistoriaClinica> {
    return this.httpClient.post<HistoriaClinica>(this.url + 'HistoriaClinica', historiaClinica);
  }
  postAntecedente(antecedente: Antecedente): Observable<Antecedente> {
    return this.httpClient.post<Antecedente>(this.url + 'Antecedente', antecedente);
  }
  putAntecedente(IdAntecedente: number, antecedente: Antecedente): Observable<Antecedente> {
    return this.httpClient.put<Antecedente>(this.url + `Antecedente/${IdAntecedente}`, antecedente);
  }
  postAnamnesis(anamnesis: Anamnesis): Observable<Antecedente> {
    return this.httpClient.post<Anamnesis>(this.url3 + 'Anamnesis/', anamnesis);
  }
  putAnamnesis(IdAnamnesis: number, anamnesis: Anamnesis): Observable<Antecedente> {
    return this.httpClient.put<Anamnesis>(this.url3 + `Anamnesis/${IdAnamnesis}`, anamnesis);
  }
  postExamenDental(examenDental: ExamenDental): Observable<ExamenDental> {
    return this.httpClient.post<ExamenDental>(this.url3 + 'ExamenDental/', examenDental);
  }
  putExamenDental(IdExamenDental: number, examenDental: ExamenDental): Observable<ExamenDental> {
    return this.httpClient.put<ExamenDental>(this.url3 + `ExamenDental/${IdExamenDental}`, examenDental);
  }
  postExamenEstomatologico(examenEstomatologico: ExamenEstomatologico): Observable<ExamenEstomatologico> {
    return this.httpClient.post<ExamenEstomatologico>(this.url3 + 'ExamenEstomatologico/', examenEstomatologico);
  }
  putExamenEstomatologico(IdExamenEstomatologico: number, examenEstomatologico: ExamenEstomatologico): Observable<ExamenEstomatologico> {
    return this.httpClient.put<ExamenEstomatologico>(this.url3 + `ExamenEstomatologico/${IdExamenEstomatologico}`, examenEstomatologico);
  }
  postExamenesComplementarios(examenesComplementarios: ExamenesComplementarios): Observable<ExamenesComplementarios> {
    return this.httpClient.post<ExamenesComplementarios>(this.url3 + 'ExamenesComplementarios/', examenesComplementarios);
  }
  putExamenesComplementarios(IdExamenesComplementarios: number, examenesComplementarios: ExamenesComplementarios): Observable<ExamenesComplementarios> {
    return this.httpClient.put<ExamenesComplementarios>(this.url3 + `ExamenesComplementarios/${IdExamenesComplementarios}`, examenesComplementarios);
  }
  postDiagnosticoOdontologia(diagnostico: DiagnosticoOdontologia): Observable<DiagnosticoOdontologia> {
    return this.httpClient.post<DiagnosticoOdontologia>(this.url3 + 'Diagnostico/', diagnostico);
  }
  putDiagnosticoOdontologia(IdDiagnostico: number, diagnostico: DiagnosticoOdontologia): Observable<DiagnosticoOdontologia> {
    return this.httpClient.put<DiagnosticoOdontologia>(this.url3 + `Diagnostico/${IdDiagnostico}`, diagnostico);
  }
  postOdontograma(odontograma: Odontograma): Observable<Odontograma> {
    return this.httpClient.post<Odontograma>(this.url3 + 'Odontograma/', odontograma);
  }
  putOdontograma(IdOdontograma: number, odontograma: Odontograma): Observable<Odontograma> {
    return this.httpClient.put<Odontograma>(this.url3 + `Odontograma/${IdOdontograma}`, odontograma);
  }
  postEnfermeria(enfermeria: Enfermeria): Observable<Enfermeria> {
    return this.httpClient.post<Enfermeria>(this.url + 'NotasEnfermeria/', enfermeria);
  }
  putEnfermeria(IdEnfermeria: number, enfermeria: Enfermeria): Observable<Odontograma> {
    return this.httpClient.put<Odontograma>(this.url + `NotasEnfermeria/${IdEnfermeria}`, enfermeria);
  }
  postAccesoHistoria(accesoHistoria: AccesoHistoria): Observable<AccesoHistoria> {
    return this.httpClient.post<AccesoHistoria>(this.url4 + 'AccesoHistoria/', accesoHistoria);
  }
  postCita(cita) {
    return this.httpClient.post(this.url5 + 'Cita/', cita);
  }
  getCita(codTercero) {
    return this.httpClient.get(this.url5 + 'Cita/?query=IdPaciente:' + codTercero + '&sortby=Fecha,Hora&order=asc,asc');
  }
  getCitaEspecialista(codTercero) {
    return this.httpClient.get(this.url5 + 'Cita/?query=IdProfesional:' + codTercero + '&sortby=Fecha,Hora&order=asc,asc');
  }
  postDocumento(documento) {
    return this.httpClient.post(this.urlDocumentos + 'document/upload', documento);
  }
  getDocumento(idDocumento) {
    return this.httpClient.get(this.urlDocumentos + 'document/' + idDocumento);
  }
}
