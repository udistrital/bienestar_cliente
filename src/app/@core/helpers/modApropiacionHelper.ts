import { ModType } from '../interfaces/modificationInterface';

export class ModApropiacionHelper {
    public static async getModTypes() {
        let modTypes: Array<ModType>;
        modTypes = [
            {
                Id: 0,
                Nombre: 'traslado',
                Label: 'Traslado',
                Params: {
                    CuentaContraCredito: true,
                },
            },
            {
                Id: 1,
                Nombre: 'adicion',
                Label: 'Adición',
                Params: {
                    CuentaContraCredito: false,
                },
            },
            {
                Id: 2,
                Nombre: 'reduccion',
                Label: 'Reducción',
                Params: {
                    CuentaContraCredito: false,
                },
            },
            {
                Id: 3,
                Nombre: 'suspension',
                Label: 'Suspensión',
                Params: {
                    CuentaContraCredito: false,
                },
            },
        ];
        return modTypes;
    }
}
