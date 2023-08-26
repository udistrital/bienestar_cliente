
/**import {Calendario}from "../evento/calendario_evento";**/
export class ActividadCultural{
    Id: number; 
    /**IdCalendario:Calendario;**/
    Nombre:String;
    Descripcion: String;
    Estado:number;
    FechaCreacion: Date ;
    FechaInicio: Date ;
    FechaFin: Date ;
    FechaModificacion: Date ;//porque text
    LugarActividad:String;
    NecesitaInscripcion:number;
    MayorInf: number;
    UsuarioCreador: String;    
    VersionRecord: number;
}