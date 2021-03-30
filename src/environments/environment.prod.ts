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
  WSO2_SERVICE: 'https://autenticacion.portaloas.udistrital.edu.co/apioas/',
  PLAN_CUENTAS_CRUD_SERVICE: 'https://autenticacion.portaloas.udistrital.edu.co/apioas/plan_cuentas_crud/v1/',
  PLAN_CUENTAS_MID_SERVICE: 'https://autenticacion.portaloas.udistrital.edu.co/apioas/plan_cuentas_mid/v1/',
  PLAN_CUENTAS_MONGO_SERVICE: 'https://autenticacion.portaloas.udistrital.edu.co/apioas/plan_cuentas_mongo_crud/v1/',
  CONFIGURACION_SERVICE: 'https://autenticacion.portaloas.udistrital.edu.co/apioas/configuracion_crud_api/v1/',
  NOTIFICACION_SERVICE: 'wss://autenticacion.portaloas.udistrital.edu.co/apioas/notificacion_ws/v1/',
  CORE_SERVICE: 'http://pruebasapi.intranetoas.udistrital.edu.co:8092/v1/',
  CORE_AMAZON_SERVICE: 'https://autenticacion.portaloas.udistrital.edu.co/apioas/core_amazon_crud/v1/',
  CONF_MENU_SERVICE:
  'https://autenticacion.portaloas.udistrital.edu.co/apioas/configuracion_crud_api/v1/menu_opcion_padre/ArbolMenus/',
  TERCEROS_CRUD_SERVICE: 'https://autenticacion.portaloas.udistrital.edu.co/apioas/terceros_crud/v1/',
  NUXEO_2020:'https://autenticacion.portaloas.udistrital.edu.co/apioas/nuxeo_api/v1/',
  DOCUMENTO_SERVICE: 'https://autenticacion.portaloas.udistrital.edu.co/apioas/documento_crud/v2/',
  SOLICITUD_CRUD_SERVICE: 'https://autenticacion.portaloas.udistrital.edu.co/apioas/solicitudes_crud/v1/',
  TOKEN: {
    AUTORIZATION_URL: 'https://autenticacion.portaloas.udistrital.edu.co/oauth2/authorize',
    CLIENTE_ID: 'TJ43YHyy3T29GrlTx9l0j7J7Cl8a',
    RESPONSE_TYPE: 'id_token token',
    SCOPE: 'openid email role',
    REDIRECT_URL: 'http://10.20.0.254/presupuesto_cliente/',
    SIGN_OUT_URL: 'https://autenticacion.portaloas.udistrital.edu.co/oidc/logout',
    SIGN_OUT_REDIRECT_URL: 'http://10.20.0.254/presupuesto_cliente/',
  },
  INFO_USER: 'https://autenticacion.portaloas.udistrital.edu.co/apioas/autenticacion_mid/v1/',
  PARAMETRIAS: 'https://autenticacion.portaloas.udistrital.edu.co/apioas/parametros/v1/'
};
