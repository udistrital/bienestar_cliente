import { ProyectoAcademicoInstitucion } from './proyecto_academico_institucion';
import { RegistroCalificadoAcreditacion } from './registro_calificado_acreditacion';
import { InstitucionEnfasis } from './institucion_enfasis';
import { Titulacion } from './titulacion';
import { TrDependenciaPadre } from '../oikos/tr_dependencia_padre';
// import { Dependencia } from '../oikos/dependencia';

export class ProyectoAcademicoPost {
    ProyectoAcademicoInstitucion: ProyectoAcademicoInstitucion
    Registro: RegistroCalificadoAcreditacion[];
    Enfasis: InstitucionEnfasis[];
    Titulaciones: Titulacion[];
    Oikos: TrDependenciaPadre;
    // Oikos: Dependnecia;
}
