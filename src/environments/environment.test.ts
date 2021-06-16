/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
export const environment = {
  production: true,
  NUXEO: {
    PATH: 'https://documental.portaloas.udistrital.edu.co/nuxeo/',
    CREDENTIALS: {
      USERNAME: 'desarrollooas',
      PASS: 'desarrollooas2019',
    },
  },
  CLIENTE_APOYO: 'apoyo-alimentario',
  ACADEMICA_JBPM_SERVICE: 'https://autenticacion.portaloas.udistrital.edu.co/apioas/academica_jbpm/v1/',
  CLIENTE_PRESUPUESTO: '/pages/plan-cuentas',
  CLIENTE_CONTABILIDAD: 'https://pruebascontabilidad.portaloas.udistrital.edu.co/pages',
  WSO2_SERVICE: 'https://autenticacion.portaloas.udistrital.edu.co/apioas/',
  NECESIDADES_CRUD_SERVICE: 'https://autenticacion.portaloas.udistrital.edu.co/apioas/necesidades_crud/v1/',
  ADMINISTRATIVA_PRUEBAS_SERVICE: 'https://autenticacion.portaloas.udistrital.edu.co/apioas/administrativa_amazon_api/v1/',
  PLAN_CUENTAS_MONGO_SERVICE: 'https://autenticacion.portaloas.udistrital.edu.co/apioas/plan_cuentas_mongo_crud/v1/',
  PLAN_CUENTAS_MID_SERVICE: 'https://autenticacion.portaloas.udistrital.edu.co/apioas/plan_cuentas_mid/v1/',
  PLAN_ADQUISICION_SERVICE: 'https://autenticacion.portaloas.udistrital.edu.co/apioas/bodega_jbpm/v1/',
  MOVIMIENTOS_CRUD_SERVICE: 'https://autenticacion.portaloas.udistrital.edu.co/apioas/movimientos_crud/v1/',
  ADMINISTRATIVA_SERVICE: 'https://autenticacion.portaloas.udistrital.edu.co/apioas/necesidades_crud/v1/',
  OIKOS_SERVICE: 'https://autenticacion.portaloas.udistrital.edu.co/apioas/oikos_crud_api/v2/',
  CONFIGURACION_SERVICE: 'https://autenticacion.portaloas.udistrital.edu.co/apioas/configuracion_crud_api/v1/',
  CORE_SERVICE: 'https://autenticacion.portaloas.udistrital.edu.co/apioas/core_api/v1/',
  CORE_AMAZON_SERVICE: 'https://autenticacion.portaloas.udistrital.edu.co/apioas/core_amazon_crud/v1/',
  NOTIFICACION_SERVICE: 'wss://autenticacion.portaloas.udistrital.edu.co/apioas/notificacion_ws/v1/',
  CONF_MENU_SERVICE: 'https://autenticacion.portaloas.udistrital.edu.co/apioas/configuracion_crud_api/v1/menu_opcion_padre/ArbolMenus/',
  TERCEROS_CRUD_SERVICE: 'https://autenticacion.portaloas.udistrital.edu.co/apioas/terceros_crud/v1/',
  NUXEO_2020:'https://autenticacion.portaloas.udistrital.edu.co/apioas/nuxeo_api/v1/',
  DOCUMENTO_SERVICE: 'https://autenticacion.portaloas.udistrital.edu.co/apioas/documento_crud/v2/',
  SOLICITUD_CRUD_SERVICE: 'https://autenticacion.portaloas.udistrital.edu.co/apioas/solicitudes_crud/v1/',
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
  KNOWAGE: {
    PROTOCOL: 'https',
    HOST: 'tuleap.udistrital.edu.co',
    PORT: '',
    CONTEXTPATH: 'knowage',
    USER: 'bidev',
    PASSWORD: 'bidev',
},
  TOKEN: {
    AUTORIZATION_URL: 'https://autenticacion.portaloas.udistrital.edu.co/oauth2/authorize',
    CLIENTE_ID: 'aWFPYYJ5gP2JdDP390gFP7gU1dYa',
    RESPONSE_TYPE: 'id_token token',
    SCOPE: 'openid email role',
    REDIRECT_URL: 'https://pruebaspresupuesto.portaloas.udistrital.edu.co',
    SIGN_OUT_URL: 'https://autenticacion.portaloas.udistrital.edu.co/oidc/logout',
    SIGN_OUT_REDIRECT_URL: 'https://pruebaspresupuesto.portaloas.udistrital.edu.co',
  },
  INFO_USER: 'https://autenticacion.portaloas.udistrital.edu.co/apioas/autenticacion_mid/v1/',
  PARAMETRIAS: 'https://autenticacion.portaloas.udistrital.edu.co/apioas/parametros/v1/'
};
