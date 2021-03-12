import {Metodologia} from './metodologia'
import {NivelFormacion} from './nivel_formacion'

export class ProyectoAcademicoInstitucion {
    Id: number;
    Codigo: string;
    Nombre: string;
    CodigoSnies: string;
    Duracion: number;
    CorreoElectronico: string;
    NumeroCreditos: number;
    CiclosPropedeuticos: boolean;
    NumeroActoAdministrativo: number;
    EnlaceActoAdministrativo: string;
    Competencias: string;
    CodigoAbreviacion: string;
    Activo: boolean;
    Oferta: boolean;
    UnidadTiempoId: number;
    AnoActoAdministrativoId: string;
    DependenciaId: number;
    FacultadId: number;
    AreaConocimientoId: number;
    NucleoBaseId: number;
    MetodologiaId: Metodologia;
    NivelFormacionId: NivelFormacion;
    AnoActoAdministrativo: string;
    ProyectoPadreId: ProyectoAcademicoInstitucion;
}
