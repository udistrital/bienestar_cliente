import { ArbolRubroApropiacionInterface } from './arbolRubroApropiacionInterface';
import { TypeGeneral } from './TypeGeneralInterface';

export interface ModType {
    Id: any;
    Nombre: string;
    Label: string;
    Params: object;
}

export interface ModApropiationData {
    Tipo: TypeGeneral;
    CuentaCredito: ArbolRubroApropiacionInterface;
    CuentaContraCredito?: ArbolRubroApropiacionInterface;
    Valor: number;
}
