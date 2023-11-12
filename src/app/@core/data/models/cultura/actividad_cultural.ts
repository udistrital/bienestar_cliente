
/**import {Calendario}from "../evento/calendario_evento";**/
export class ActividadCultural{
    IdActividadCultural: number; 
    /**IdCalendario:Calendario;**/
    Nombre:String;
    IdTipoActividad:number;
    Descripcion: String;
    Estado:number;
    FechaCreacion: Date ;//verificar si la api funciona con Strings las fechas
    FechaInicio: Date ;
    FechaFin: Date ;
    FechaModificacion: Date ;//porque text
    LugarActividad:String;
    NecesitaInscripcion:number;//Debe ser el campo para almacenar el enlace de inscripciòn 
    MayorInf: number;//Debe ser el campo para almacenar el enlace de mayor informaciòn
    UsuarioCreador: String;    
    
}