import { Rubro } from './rubro';

export class ArbolApropiacion {
    Rubro: Rubro;
    Vigencia: number;
    ValorInicial: number;
    Estado: string;
    ApropiacionAnterior: number;
    Codigo: string;
    Nombre: string;
    Descripcion: string;
    UnidadEjecutora: string;
    Padre: string;
    Hijos: Array<string>;
}
