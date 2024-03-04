
/**import {Calendario}from "../evento/calendario_evento";**/
export class ActividadCultural{
    IdActividadCultural: number; 
    Nombre:string;
    IdTipoActividad:number;
    Descripcion: string;
    Estado:number;
    FechaCreacion: string;//verificar si la api funciona con Strings las fechas
    FechaInicio: string;
    FechaFin: string;
    FechaModificacion: string;//porque text
    LugarActividad: string;
    NecesitaInscripcion: number;//Debe ser el campo para almacenar el enlace de inscripciòn 
    MayorInf: number;//Debe ser el campo para almacenar el enlace de mayor informaciòn
    UsuarioCreador: string;    
    
}