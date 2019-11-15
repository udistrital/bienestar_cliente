import { RequestManager } from '../../managers/requestManager';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { PopUpManager } from '../../managers/popUpManager';

@Injectable({
    providedIn: 'root',
})
export class CRPHelper {

    constructor(
        private rqManager: RequestManager,
        private pUpManager: PopUpManager,
    ) { }

    public getSolicitudesCRP(id?: any) {
        this.rqManager.setPath('PLAN_CUENTAS_MONGO_SERVICE');

        return this.rqManager.get('solicitudesCRP/' + id).pipe(
            map(
                (res) => {
                    if (res === 'error') {
                        this.pUpManager.showErrorAlert('No se pudo consultar los crps');
                        return undefined;
                    } else {
                        return res;
                    }

                },
            ),
        );

    }

    public getInfoCDP(consecutivoCDP) {
        this.rqManager.setPath('PLAN_CUENTAS_MONGO_SERVICE');
        return this.rqManager.get('solicitudesCDP/').pipe(
            map(
                res_crp => {
                    if (res_crp['Type'] === 'error') {
                        this.pUpManager.showErrorAlert('No se pudo cargar el CDP');
                        return undefined;
                    } else {
                        return res_crp.filter(n => n.infoCdp !== null && n.infoCdp.consecutivo === consecutivoCDP)[0];
                    }
                }
            )
        );
    }


    public getCompromisos() {
        this.rqManager.setPath('CORE_SERVICE');
        return this.rqManager.get('tipo_documento/').pipe(
            map(
                res_tCompromiso => {
                    console.info(res_tCompromiso);
                    return res_tCompromiso.filter(n => n.DominioTipoDocumento !== null && n.DominioTipoDocumento.Id === 4);
                }
            )
        );
    }
    /**
       * CRP register
       * If the response has errors in the OAS API it should show a popup message with an error.
       * If the response suceed, it returns the data of the updated object.
       * @param solCrpData object to save in the DB
       * @returns  <Observable> data of the object registered at the DB. undefined if the request has errors
       */
    public solCrpRegister(solCrpData) {
        this.rqManager.setPath('PLAN_CUENTAS_MONGO_SERVICE');
        const objSolCrp = <any>{};
        objSolCrp.consecutivo = 4; // Tomar la unidad ejecutora del token cuando este definido.
        objSolCrp.consecutivoCdp = solCrpData.ConsecutivoCDP;
        objSolCrp.vigencia = solCrpData.Vigencia;
        objSolCrp.beneficiario = solCrpData.Beneficiario;
        objSolCrp.valor = solCrpData.Valor;
        objSolCrp.compromiso = {
            'numeroCompromiso': solCrpData.Compromiso.NumeroCompromiso,
            'tipoCompromiso': solCrpData.Compromiso.TipoCompromiso
        };
        objSolCrp.activo = true;
        objSolCrp.fechaCreacion = solCrpData.FechaCreacion;
        objSolCrp.fechaModificacion = solCrpData.FechaCreacion;
        console.info(objSolCrp);
        return this.rqManager.post(`solicitudesCRP/`, objSolCrp).pipe(
            map(
                (res) => {
                    if (res['Type'] === 'error') {
                        this.pUpManager.showErrorAlert('No se pudo registrar el CRP');
                        return undefined;
                    }
                    return res;
                },
            ),
        );

    }

    /**
     * CRP update
     * If the response has errors in the OAS API it should show a popup message with an error.
     * If the response is successs, it returns the data of the updated object.
     * @param crpData fields to update
     * @returns  <Observable> object updated information. undefined if the proccess has errors.
     */
    public solCrpUpdate(crpData) {
        console.info(crpData);
        this.rqManager.setPath('PLAN_CUENTAS_MONGO_SERVICE');
        /*         cdpData.UnidadEjecutora = 1; // Tomar la unidad ejecutora del token cuando este definido.
                cdpData.Organizacion = 1;
                cdpData.Vigencia = cdpData.Vigencia.vigencia;
                cdpData.activo = true;
                cdpData.Codigo = cdpData.Codigo.toString();
                cdpData.NumeroDocumento = cdpData.NumeroDocumento.toString();
                cdpData.TipoDocumento = cdpData.TipoDocumento.Valor; */
        return this.rqManager.put('solicitudesCRP/', crpData, crpData.Codigo).pipe(
            map(
                (res) => {

                    if (res['Type'] === 'error') {
                        this.pUpManager.showErrorAlert('No Se Pudo Actualizar el CRP, Compruebe que no exista un crp con el mismo Código.');
                        return undefined;
                    }
                    return res;
                },
            ),
        );

    }


    public getFullNecesidad(idnecesidad) {
        this.rqManager.setPath('PLAN_CUENTAS_MID_SERVICE');
        return this.rqManager.get(`necesidad/getfullnecesidad/` + idnecesidad).pipe(
            map(
                res_mid => {
                    if (res_mid.status > 300) {
                        this.pUpManager.showErrorAlert('Error al obtener la necesidad');
                        return undefined;
                    } else {
                        return res_mid;
                    }
                }
            ));
    }

    /**
     * getInfoNaturalJuridica
     * If the response has errors in the OAS API it should show a popup message with an error.
     * If the response is successs, it returns the data of the updated object.
     * @param id of the provider
     * @returns  Object
     */
    public getInfoNaturalJuridica(id){
        this.rqManager.setPath('ADMINISTRATIVA_PRUEBAS_SERVICE');
        return this.rqManager.get('informacion_proveedor/?query=NumDocumento:' + id).pipe(
            map(
                res_persona => {
                    if (res_persona.status > 300) {
                        this.pUpManager.showErrorAlert('No se encuentra un beneficiario con ese número de identificación');
                        return undefined;
                    } else {
                        return res_persona;
                    }
                }
            ));
            }
        
        
        
        
    //     subscribe(res => {
    //         if (res != undefined) {
    //             console.info(res[0])
    //             return res[0];
    //         } else {
    //             this.pUpManager.showErrorAlert('No se encuentra un beneficiario con ese número de identificación');
    //             return {};
    //         }
    //     });

    // }


}
