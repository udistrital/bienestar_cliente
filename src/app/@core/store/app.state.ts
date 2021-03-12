import { TipoLugar } from '../data/models/lugar/tipo_lugar';
import { TipoDiscapacidad } from '../data/models/informacion/tipo_discapacidad';
import { TipoContacto } from '../data/models/informacion/tipo_contacto';
import { ProgramaAcademico } from '../data/models/proyecto_academico/programa_academico';
import { NivelIdioma } from '../data/models/idioma/nivel_idioma';
import { NivelFormacion } from '../data/models/proyecto_academico/nivel_formacion';
import { Metodologia } from '../data/models/proyecto_academico/metodologia';
import { Lugar } from '../data/models/lugar/lugar';
import { LineaInvestigacion } from '../data/models/investigacion/linea_investigacion';
import { Idioma } from '../data/models/idioma/idioma';
import { GrupoEtnico } from '../data/models/informacion/grupo_etnico';
import { EstadoCivil } from '../data/models/informacion/estado_civil';
import { EstadoInscripcion } from '../data/models/inscripcion/estado_inscripcion';
import { ClasificacionNivelIdioma } from '../data/models/idioma/clasificacion_idioma';
import { Genero } from '../data/models/informacion/genero';
import { Titulacion } from '../data/models/inscripcion/titulacion';
import { TipoIdentificacion } from '../data/models/informacion/tipo_identificacion';
import { TipoProyecto } from '../data/models/investigacion/tipo_proyecto';
import { GrupoInvestigacion } from '../data/models/investigacion_cidc/grupo_investigacion';
import { PeriodoAcademico } from '../data/models/periodo/periodo_academico';
import { InfoComplementaria } from '../data/models/terceros/info_complementaria';
// import { TipoPublicacionLibro } from '../data/models/tipo_publicacion_libro';

export interface IAppState {
  listGenero: Genero[],
  listClasificacionNivelIdioma: ClasificacionNivelIdioma[],
  listEstadoInscripcion: EstadoInscripcion[],
  listEstadoCivil: EstadoCivil[],
  listGrupoSanguineo: Genero[] ,
  listFactorRh: Genero [],
  listICFES: Genero [],
  listEPS: Genero [],
  listGrupoEtnico: GrupoEtnico[],
  listIdioma: Idioma[],
  listLineaInvestigacion: LineaInvestigacion[],
  listPais: Lugar[],
  listCiudad: Lugar[],
  listLugar: Lugar[],
  listMetodologia: Metodologia[],
  listNivelFormacion: NivelFormacion[],
  listNivelIdioma: NivelIdioma[],
  listProgramaAcademico: ProgramaAcademico[],
  listTipoContacto: TipoContacto[],
  listTipoDiscapacidad: TipoDiscapacidad[],
  listTipoLugar: TipoLugar[],
  listTitulacion: Titulacion[],
  listTipoIdentificacion: TipoIdentificacion[],
  listTipoProyecto: TipoProyecto[],
  listGrupoInvestigacion: GrupoInvestigacion[],
  listPeriodoAcademico: PeriodoAcademico[],
  listLocalidadesBogota: InfoComplementaria[],
  listTipoColegio: InfoComplementaria[],
  listSemestresSinEstudiar: InfoComplementaria[],
  listMediosEnteroUniversidad: InfoComplementaria[],
  listSePresentaAUniversidadPor: InfoComplementaria[],
  listTipoInscripcionUniversidad: InfoComplementaria[],
  listTipoDedicacion: InfoComplementaria[],
  listTipoVinculacion: InfoComplementaria[],
  listCargo: InfoComplementaria[],
  listTipoOrganizacion: InfoComplementaria[],
  listDocumentoPrograma: any[],
  listDescuentoDependencia: any[],
  // listTipoPublicacionLibro: TipoPublicacionLibro[],
}
