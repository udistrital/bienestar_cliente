import { TipoRegistro } from './tipo_registro';
import { ProyectoId } from './proyecto_id';

export class NuevoRegistro {
    Activo: Boolean;
    NumeroActoAdministrativo: number;
    AnoActoAdministrativoId: string;
    FechaCreacionActoAdministrativo: string;
    VigenciaActoAdministrativo: string;
    VencimientoActoAdministrativo: string;
    EnlaceActo: string;
    ProyectoAcademicoInstitucionId: ProyectoId;
    TipoRegistroId: TipoRegistro;
}
