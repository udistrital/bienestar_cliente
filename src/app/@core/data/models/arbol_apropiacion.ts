import { Rubro } from './rubro';
import { Producto } from './producto';

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
    Productos: Array<Producto>;
}
