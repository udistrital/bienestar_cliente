
import { ProyectoId } from './proyecto_id';


export class Coordinador {
    PersonaId: number;
    DependenciaId: number;
    RolId: number;
    ResolucionAsignacionId: number;
    Activo: boolean;
    FechaInicio: string;
    ProyectoAcademicoInstitucionId: ProyectoId;

}
