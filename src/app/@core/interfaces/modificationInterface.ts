import { ArbolRubroApropiacionInterface } from './arbolRubroApropiacionInterface';

export interface ModType {
    Id: any;
    Nombre: string;
    Label: string;
    Params: object;
}

export interface ModApropiationData {
    Tipo: ModType;
    CuentaCredito: ArbolRubroApropiacionInterface;
    CuentaContraCredito?: ArbolRubroApropiacionInterface;
    Valor: number;
}
