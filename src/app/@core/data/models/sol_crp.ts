import { Compromiso } from './compromiso';

export class SolicitudCrp {
    ConsecutivoCDP: number;
    Vigencia: string;
    Beneficiario: string;
    Valor: number;
    Compromiso: Compromiso;
    FechaCreacion: Date;
    FechaInicialVigencia: Date;
    FechaFinalVigencia: Date;
}
