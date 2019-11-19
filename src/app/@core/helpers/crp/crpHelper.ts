import { RequestManager } from '../../managers/requestManager';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { PopUpManager } from '../../managers/popUpManager';

@Injectable({
    providedIn: 'root',
})
export class CRPHelper {
    router: any;

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

    public getListaCRP(id?: any) {
        this.rqManager.setPath('PLAN_CUENTAS_MONGO_SERVICE');
        return this.rqManager.get('solicitudesCRP/' + id).pipe(
            map(
                (res) => {
                    if (res === 'error') {
                        this.pUpManager.showErrorAlert('No se pudo consultar los crps');
                        return undefined;
                    }
                    return res ?

                        res.filter(
                            e => e.infoCrp !== null).map(
                                e => {
                                    return {
                                        ...e,
                                        consecutivo_crp: e.infoCrp.consecutivo,
                                        estado_crp: e.infoCrp.estado,
                                        fecha_crp: e.infoCrp.fechaExpedicion,
                                    };
                                }
                            )
                        : undefined;
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
                    return res_tCompromiso.filter(n => n.DominioTipoDocumento !== null && n.DominioTipoDocumento.Id === 4);
                }
            )
        );
    }

    public getCompromiso(id){
        this.rqManager.setPath('CORE_SERVICE');
        return this.rqManager.get('tipo_documento/'+id).pipe(
            map(
                res_tCompromiso => {
                    return res_tCompromiso;
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
        this.rqManager.setPath('PLAN_CUENTAS_MID_SERVICE');
        const objSolCrp = <any>{};
        objSolCrp.consecutivoCdp = solCrpData.ConsecutivoCDP;
        objSolCrp.vigencia = solCrpData.Vigencia;
        objSolCrp.beneficiario = solCrpData.Beneficiario;
        objSolCrp.monto = solCrpData.Valor;
        objSolCrp.compromiso = {
            'numeroCompromiso': solCrpData.Compromiso.NumeroCompromiso,
            'tipoCompromiso': solCrpData.Compromiso.TipoCompromiso
        };

        return this.rqManager.post(`crp/solicitarCRP/`, objSolCrp).pipe(
            map(
                (res) => {
                    if (res['Type'] === 'error') {
                        this.pUpManager.showErrorAlert('No se pudo registrar el CRP');
                        return undefined;
                    } else {

                        return res;
                    }

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
        this.rqManager.setPath('PLAN_CUENTAS_MONGO_SERVICE');
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


    /**
     * getInfoNaturalJuridica
     * If the response has errors in the OAS API it should show a popup message with an error.
     * If the response is successs, it returns the data of the updated object.
     * @param id of the provider
     * @returns  Object
     */
    public getInfoNaturalJuridica(id) {
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

     /**
    * expedir CRP
    * dispara la funcion para expedicion del CRP
    * inforcdp si  todo ok, alerta si falla.
    * @param id identificador de solicitud de crp
    * @returns  <Observable> objeto creado en la solicitud de crp. undefined if the request has errors
    */
   public expedirCRP(id) {
    this.rqManager.setPath('PLAN_CUENTAS_MID_SERVICE');
    return this.rqManager.get(`crp/expedirCRP/` + id).pipe(
        map(
            res_mid => {
                if (res_mid.status > 300) {
                    this.pUpManager.showErrorAlert('Error al expedir CRP');
                    return undefined;
                } else {
                    return res_mid;
                }
            }
        )
    );


}


}
