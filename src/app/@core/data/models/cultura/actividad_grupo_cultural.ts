import {GrupoCultural}from "./grupo_cultural";
import {ActividadCultural}from "./actividad_cultural";

export class ActividadGrupoCultural{
    IdActividadGrupo: number;
    IdActividadCultural: ActividadCultural;
    IdGrupoCultural: GrupoCultural;
    Activo: any;
    FechaCreacion: string;
    FechaModificacion: string;
}