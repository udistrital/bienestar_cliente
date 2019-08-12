/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
export const environment = {
    production: true,
    NUXEO: {
      PATH: 'https://documental.udistrital.edu.co/nuxeo/',
    },
    WSO2_SERVICE: 'https://autenticacion.udistrital.edu.co/apioas/',
    PLAN_CUENTAS_CRUD_SERVICE: 'https://autenticacion.udistrital.edu.co/apioas/plan_cuentas_crud/v1/',
    PLAN_CUENTAS_MID_SERVICE: 'https://autenticacion.udistrital.edu.co/apioas/plan_cuentas_mid/v1/',
    PLAN_CUENTAS_MONGO_SERVICE: 'https://autenticacion.udistrital.edu.co/apioas/plan_cuentas_mongo_crud/v1/',
    CONFIGURACION_SERVICE: 'https://autenticacion.udistrital.edu.co/apioas/configuracion_crud_api/v1/',
    NOTIFICACION_SERVICE: 'wss://autenticacion.udistrital.edu.co/apioas/notificacion_ws/v1/',
    CONF_MENU_SERVICE: 'http://10.20.0.254/configuracion_api/v1/menu_opcion_padre/ArbolMenus/',
    TOKEN: {
      AUTORIZATION_URL: 'https://autenticacion.udistrital.edu.co/oauth2/authorize',
      CLIENTE_ID: 'RK_DeZGAH6_F3JlPd5N1soJ7bYUa',
      RESPONSE_TYPE: 'id_token token',
      SCOPE: 'openid email role',
      REDIRECT_URL: 'http://10.20.0.254/presupuesto_cliente/',
      SIGN_OUT_URL: 'https://autenticacion.udistrital.edu.co/oidc/logout',
      SIGN_OUT_REDIRECT_URL: 'http://10.20.0.254/presupuesto_cliente/',
    },

};
