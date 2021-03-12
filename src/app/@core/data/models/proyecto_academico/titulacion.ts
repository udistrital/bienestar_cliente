import { ProyectoAcademicoInstitucion } from './proyecto_academico_institucion';
import { TipoTitulacion } from './tipo_titulacion';

export class Titulacion {
    Id: number;
    Nombre: string;
    Activo: boolean;
    TipoTitulacionId: TipoTitulacion;
    ProyectoAcademicoInstitucionId: ProyectoAcademicoInstitucion;
}
