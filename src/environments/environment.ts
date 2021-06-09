/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
export const environment = {

    production: false,
    NUXEO: {
        PATH: 'https://documental.portaloas.udistrital.edu.co/nuxeo/',
        CREDENTIALS: {
          USERNAME: 'desarrollooas',
          PASS: 'desarrollooas2019',
        },
      },
    CLIENTE_PRESUPUESTO: '/pages/plan-cuentas',
    CLIENTE_APOYO: 'apoyo-alimentario',
    CLIENTE_SALUD: 'citas',
    APOYO_ALIMENTARIO: "http://localhost:8080/",
    ACADEMICA: 'https://autenticacion.portaloas.udistrital.edu.co/apioas/academica_jbpm/v1/',
    UBICACIONES: 'https://autenticacion.portaloas.udistrital.edu.co/apioas/ubicaciones_crud/v1/ ',
    CLIENTE_CONTABILIDAD: 'https://pruebascontabilidad.portaloas.udistrital.edu.co/pages',
    WSO2_SERVICE: 'https://autenticacion.portaloas.udistrital.edu.co/apioas/',
    NECESIDADES_CRUD_SERVICE: 'http://pruebasapi.intranetoas.udistrital.edu.co:8201/v1/',
    PLAN_ADQUISICION_SERVICE: 'https://autenticacion.portaloas.udistrital.edu.co/apioas/bodega_jbpm/v1/',
    // MOVIMIENTOS_CRUD_SERVICE: 'http://localhost:8085/v1/',
    ADMINISTRATIVA_PRUEBAS_SERVICE: 'http://pruebasapi.intranetoas.udistrital.edu.co:8104/v1/',
    // PLAN_CUENTAS_MID_SERVICE: 'http://localhost:8084/v1/',
    // PLAN_CUENTAS_MONGO_SERVICE: 'http://localhost:8082/v1/',
    PLAN_CUENTAS_MONGO_SERVICE: 'http://pruebasapi.intranetoas.udistrital.edu.co:8203/v1/',
    PLAN_CUENTAS_MID_SERVICE:   'http://pruebasapi.intranetoas.udistrital.edu.co:8204/v1/',
    ADMINISTRATIVA_SERVICE: 'http://pruebasapi.intranetoas.udistrital.edu.co:8090/v1/',
    ADMINISTRATIVA_JBPM_SERVICE: 'https://autenticacion.portaloas.udistrital.edu.co/apioas/administrativa_jbpm/v1/',
    // NECESIDADES_CRUD_SERVICE: 'https://autenticacion.udistrital.edu.co/apioas/necesidades_crud/v1/',
    // MOVIMIENTOS_CRUD_SERVICE: 'https://autenticacion.portaloas.udistrital.edu.co/apioas/movimientos_crud/v1/',
    // MOVIMIENTOS_CRUD_SERVICE: 'http://localhost:8085/v1/',
    MOVIMIENTOS_CRUD_SERVICE: 'http://pruebasapi.intranetoas.udistrital.edu.co:8202/v1/',
    // MOVIMIENTOS_CRUD_SERVICE: 'https://autenticacion.udistrital.edu.co/apioas/movimientos_crud/v1/',
    // ADMINISTRATIVA_SERVICE: 'http://pruebasapi.intranetoas.udistrital.edu.co:8201/v1/',
    OIKOS_SERVICE: 'https://autenticacion.portaloas.udistrital.edu.co/apioas/oikos_crud_api/v2/',
    //CORE_SERVICE: 'https://autenticacion.portaloas.udistrital.edu.co/apioas/core_crud/v2/',
    CORE_SERVICE: 'http://localhost:8080/',
    CORE_AMAZON_SERVICE: 'https://autenticacion.portaloas.udistrital.edu.co/apioas/core_amazon_crud/v1/',
    CONFIGURACION_SERVICE: 'https://autenticacion.portaloas.udistrital.edu.co/apioas/configuracion_crud_api/v1/',
    CONF_MENU_SERVICE: 'https://autenticacion.portaloas.udistrital.edu.co/apioas/configuracion_crud_api/v1/menu_opcion_padre/ArbolMenus/',
    ACADEMICA_JBPM_SERVICE: 'https://autenticacion.portaloas.udistrital.edu.co/apioas/academica_jbpm/v1/',
    TERCEROS_CRUD_SERVICE: 'https://autenticacion.portaloas.udistrital.edu.co/apioas/terceros_crud/v1/',
    PARAMETROS: "https://autenticacion.portaloas.udistrital.edu.co/apioas/parametros/v1/",
    SOLICITUD: "https://autenticacion.portaloas.udistrital.edu.co/apioas/solicitudes_crud/v1/",
    
    IDS:{
        IDTIPOPARAMETRO: 21,
        IDTIPOSOLICITUD: 9,
        IDINSCRIPCIONES: 347,
        IDSERVICIOAPOYO: 348,
        IDCIERREPERIODO: 356,
        IDSOLICITUDRADICADA: 23,
        IDSOLICITUDACEPTADA: 28,
        IDSOLICITUDNOACEPTADA: 29,
        IDSOLICITUDPREPARADA: 30,

    },

    NUXEO_2020:'https://autenticacion.portaloas.udistrital.edu.co/apioas/nuxeo_api/v1/',
    DOCUMENTO_SERVICE: 'https://autenticacion.portaloas.udistrital.edu.co/apioas/documento_crud/v2/',
    SOLICITUD_CRUD_SERVICE: 'https://autenticacion.portaloas.udistrital.edu.co/apioas/solicitudes_crud/v1/',
  
    KNOWAGE: {
        PROTOCOL: 'https',
        HOST: 'inteligenciainstitucional.portaloas.udistrital.edu.co',
        PORT: '',
        CONTEXTPATH: 'knowage',
        USER: 'bidev',
        PASSWORD: 'bidev',
    },
    TOKEN: {
        AUTORIZATION_URL: 'https://autenticacion.portaloas.udistrital.edu.co/oauth2/authorize',
        CLIENTE_ID: 'e36v1MPQk2jbz9KM4SmKhk8Cyw0a',
        RESPONSE_TYPE: 'id_token token',
        SCOPE: 'openid email role',
        REDIRECT_URL: 'http://localhost:4200/',
        SIGN_OUT_URL: 'https://autenticacion.portaloas.udistrital.edu.co/oidc/logout',
        SIGN_OUT_REDIRECT_URL: 'http://localhost:4200/',
    },
    INFO_USER: 'https://autenticacion.portaloas.udistrital.edu.co/apioas/autenticacion_mid/v1/',
    PARAMETRIAS: 'https://autenticacion.portaloas.udistrital.edu.co/apioas/parametros/v1/'
};
