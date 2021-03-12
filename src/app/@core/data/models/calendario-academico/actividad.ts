export class Actividad {
    Nombre: string;
    Descripcion: string;
    FechaInicio: string;
    FechaFin: string;
    Activo: boolean;
    responsable: number;
    TipoEventoId: {Id: number}; // id del proceso
    actividadId: number;
}
