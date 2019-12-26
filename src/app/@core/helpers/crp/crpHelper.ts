import { RequestManager } from '../../managers/requestManager';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { PopUpManager } from '../../managers/popUpManager';
import { CDPHelper } from '../cdp/cdpHelper';

@Injectable({
    providedIn: 'root',
})
export class CRPHelper {
    router: any;

    constructor(
        private rqManager: RequestManager,
        private pUpManager: PopUpManager,
        private cdpHelper: CDPHelper,
    ) { }

    public getSolicitudesCRP(id?: any, query?: string) {
        this.rqManager.setPath('PLAN_CUENTAS_MONGO_SERVICE');
        return this.rqManager.get('solicitudesCRP/' + (id ? id : '?query=' + query)).pipe(
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

    public getSolicitudCRP(id) {
        this.rqManager.setPath('PLAN_CUENTAS_MONGO_SERVICE');

        return this.rqManager.get('solicitudesCRP/?query=consecutivo:' + id).pipe(
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
 /**
   * expedir CRP
   * dispara la funcion para expedicion del CRP
   * inforcdp si  todo ok, alerta si falla.
   * @param id identificador de solicitud de crp
   * @returns  <Observable> objeto creado en la solicitud de crp. undefined if the request has errors
   */
  public getFullCRP() {
      this.rqManager.setPath('PLAN_CUENTAS_MID_SERVICE');
        return this.rqManager.get(`crp/getFullCrp/`).pipe(
            map(
                res_mid => {
                    if (res_mid.status > 300) {
                        this.pUpManager.showErrorAlert('Error al listar CRP');
                        return undefined;
                    } else {
                        return res_mid;
                    }
                }
            )
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

    public getInfoCDP(vigencia, consecutivoCDP) {
        this.rqManager.setPath('PLAN_CUENTAS_MONGO_SERVICE');
        return this.rqManager.get('documento_presupuestal/' + vigencia + '/1?query=consecutivo:' + consecutivoCDP + ',tipo:cdp').pipe(
            map(
                res_crp => {
                    if (res_crp['Type'] === 'error') {
                        this.pUpManager.showErrorAlert('No se pudo cargar el CDP');
                        return undefined;
                    } else {
                        return res_crp[0];
                    }
                }
            )
        );
    }

    public getInfoCdpPC(id) {
        this.rqManager.setPath('PLAN_CUENTAS_MONGO_SERVICE');
        return this.rqManager.get('solicitudesCDP/' + id).pipe(
            map(
                res_crp => {
                    if (res_crp['Type'] === 'error') {
                        this.pUpManager.showErrorAlert('No se pudo cargar el CDP');
                        return undefined;
                    } else {
                        return res_crp;
                    }
                }
            )
        );
    }

    public getInfoCRP(id?: any) {
        this.rqManager.setPath('PLAN_CUENTAS_MONGO_SERVICE');
        let ObjN: object;
        let TrCDP: object;
        let TrSolcrp: object;
        this.rqManager.get('solicitudesCRP/?query=consecutivo:' + id).subscribe(async res => {
            TrSolcrp = res[0];
            await this.cdpHelper.getCDP(TrSolcrp['consecutivoCdp']).subscribe(async res2 => {
                TrCDP = res2[0];
                await this.cdpHelper.getFullNecesidad(TrCDP['necesidad']).toPromise().then(response => { ObjN = response; });
                return [TrSolcrp, TrCDP, ObjN];
            });

        });


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

    public getCompromiso(id) {
        this.rqManager.setPath('CORE_SERVICE');
        return this.rqManager.get('tipo_documento/' + id).pipe(
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
        objSolCrp.fechaFinalVigencia = solCrpData.FechaFinalVigencia;

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
                        return res_persona[0];
                    }
                }
            ));
    }

    public getContratista(id) {
        this.rqManager.setPath('ADMINISTRATIVA_PRUEBAS_SERVICE');
        return this.rqManager.get('informacion_proveedor/' + id).pipe(
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

    /**
      * Contratos Get
      * If the response has errors in the OAS API it should show a popup message with an error.
      * If the response is successs, it returns the object's data.
      * @returns  <Observable> data of the object registered at the DB. undefined if the request has errors
      */
    public getContratoSuscrito(contrato, vigencia) {
        this.rqManager.setPath('ADMINISTRATIVA_PRUEBAS_SERVICE');
        return this.rqManager.get('contrato_suscrito/?query=Vigencia:' + vigencia + ',NumeroContrato.Id:' + contrato).pipe(
            map(
                (res) => {
                    if (res === 'error') {
                        this.pUpManager.showErrorAlert('No se pudo consultar el contrato suscrito');
                        return undefined;
                    }
                    return res;
                },
            ),
        );
    }

    public getContratoDisponibilidad(contrato) {
        this.rqManager.setPath('ADMINISTRATIVA_PRUEBAS_SERVICE');
        return this.rqManager.get('contrato_disponibilidad/?query=NumeroContrato:' + contrato).pipe(
            map(
                (res) => {
                    if (res === 'error') {
                        this.pUpManager.showErrorAlert('No se pudo consultar el contrato disponibilidad');
                        return undefined;
                    }
                    return res;
                },
            ),
        );
    }

    public getContratoGeneral(contrato, vigencia) {
        this.rqManager.setPath('ADMINISTRATIVA_PRUEBAS_SERVICE');
        return this.rqManager.get('contrato_general/?query=ContratoSuscrito.NumeroContrato:' + contrato + ',ContratoSuscrito.Vigencia:' + vigencia).pipe(
            map(
                (res) => {
                    if (res === 'error') {
                        this.pUpManager.showErrorAlert('No se pudo consultar el contrato general');
                        return undefined;
                    }
                    return res;
                },
            ),
        );
    }

    public getInfoContrato(contrato, vigencia): object {
        const objContrato = { NumeroContrato: undefined, Vigencia: undefined, NumeroCdp: undefined, NombreBeneficiario: undefined, DocBeneficiario: undefined };
        this.getContratoSuscrito(contrato, vigencia).subscribe(resCS => {
            if (resCS[0]) {
                objContrato.NumeroContrato = resCS[0].NumeroContrato.Id;
                objContrato.Vigencia = resCS[0].Vigencia;
                this.getContratoDisponibilidad(resCS[0].NumeroContrato.Id).subscribe(resCD => {// se obtiene la información del CDP de ese contrato
                    if (resCD[0]) {
                        objContrato.NumeroCdp = resCD[0].NumeroCdp;
                        this.getContratoGeneral(resCD[0].NumeroContrato, resCD[0].Vigencia).subscribe(resCG => {

                            if (resCG) {
                                this.getContratista(resCG[0].Contratista).subscribe(resIP => {
                                    if (resIP) {
                                        objContrato.NombreBeneficiario = resIP.NomProveedor;
                                        objContrato.DocBeneficiario = resIP.NumDocumento;
                                        return objContrato;
                                    }
                                });
                            }
                        });
                    }
                });
            } else {
                return[];
            }
        });
        return objContrato;
    }
}



