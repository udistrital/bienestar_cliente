import { IAppState } from './app.state';
import { ActionReducerMap } from '@ngrx/store';
import { ListReducer } from './reducers/list.reducer';

export const rootReducer: ActionReducerMap<IAppState> = {
  listGenero: ListReducer.ListReducerGenero,
  listGrupoSanguineo: ListReducer.ListReducerGrupoSanguineo,
  listFactorRh: ListReducer.ListReducerFactorRH,
  listEPS: ListReducer.ListReducerEPS,
  listICFES: ListReducer.ListReducerTipoICFES,
  listClasificacionNivelIdioma: ListReducer.ListReducerClasificacionNivelIdioma,
  listEstadoInscripcion: ListReducer.ListReducerEstadoInscripcion,
  listEstadoCivil: ListReducer.ListReducerEstadoCivil,
  listGrupoEtnico: ListReducer.ListReducerGrupoEtnico,
  listIdioma: ListReducer.ListReducerIdioma,
  listLineaInvestigacion: ListReducer.ListReducerLineaInvestigacion,
  listPais: ListReducer.ListReducerPais,
  listCiudad: ListReducer.ListReducerCiudad,
  listLugar: ListReducer.ListReducerLugar,
  listMetodologia: ListReducer.ListReducerMetodologia,
  listNivelFormacion: ListReducer.ListReducerNivelFormacion,
  listNivelIdioma: ListReducer.ListReducerNivelIdioma,
  listProgramaAcademico: ListReducer.ListReducerProgramaAcademico,
  listTipoContacto: ListReducer.ListReducerTipoContacto,
  listTipoDiscapacidad: ListReducer.ListReducerTipoDiscapacidad,
  listTipoLugar: ListReducer.ListReducerTipoLugar,
  listTitulacion: ListReducer.ListReducerTitulacion,
  listTipoIdentificacion: ListReducer.ListReducerTipoIdentificacion,
  listTipoProyecto: ListReducer.ListReducerTipoProyecto,
  listGrupoInvestigacion: ListReducer.ListReducerGrupoInvestigacion,
  listPeriodoAcademico: ListReducer.ListReducerPeriodoAcademico,
  listLocalidadesBogota: ListReducer.ListReducerLocalidadesBogota,
  listTipoColegio: ListReducer.ListReducerTipoColegio,
  listSemestresSinEstudiar: ListReducer.ListReducerSemestresSinEstudiar,
  listMediosEnteroUniversidad: ListReducer.ListReducerMediosEnteroUniversidad,
  listSePresentaAUniversidadPor: ListReducer.ListReducerSePresentaAUniversidadPor,
  listTipoInscripcionUniversidad: ListReducer.ListReducerTipoInscripcionUniversidad,
  listTipoDedicacion: ListReducer.ListReducerTipoDedicacion,
  listTipoVinculacion: ListReducer.ListReducerTipoVinculacion,
  listCargo: ListReducer.ListReducerCargo,
  listTipoOrganizacion: ListReducer.ListReducerTipoOrganizacion,
  listDocumentoPrograma: ListReducer.ListReducerDocumentoPrograma,
  listDescuentoDependencia: ListReducer.ListReducerDescuentoDependencia,
  // listTipoPublicacionLibro: ListReducer.listReducerTipoPublicacionLibro,
}
