/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
export const environment = {
  production: false,
  NUXEO: {
    PATH: 'https://documental.udistrital.edu.co/nuxeo/',
  },
  WSO2_SERVICE: 'https://autenticacion.udistrital.edu.co/apioas/',
  PLAN_CUENTAS_CRUD_SERVICE: 'http://localhost:8080/v1/',
  PLAN_CUENTAS_MID_SERVICE: 'https://localhost:8084/v1/',
  PLAN_CUENTAS_MONGO_SERVICE: 'http://localhost:8082/v1/',
  OIKOS_SERVICE: 'http://10.20.0.254/oikos_api/v1/',
  CONFIGURACION_SERVICE: 'http://10.20.0.254/configuracion_api/v1/',
  NOTIFICACION_SERVICE: 'ws://10.20.0.254/notificacionws/ws/join',
  CONF_MENU_SERVICE: 'http://10.20.0.254/configuracion_api/v1/menu_opcion_padre/ArbolMenus/',
  TOKEN: {
    AUTORIZATION_URL: 'https://autenticacion.udistrital.edu.co/oauth2/authorize',
    CLIENTE_ID: 'DUh_Oz9ONEccBjTzA9X7948hyZYa',
    RESPONSE_TYPE: 'id_token token',
    SCOPE: 'openid email role',
    REDIRECT_URL: 'http://localhost:4200/presupuesto/',
    SIGN_OUT_URL: 'https://autenticacion.udistrital.edu.co/oidc/logout',
    SIGN_OUT_REDIRECT_URL: 'http://localhost:4200/presupuesto/',
  },

};
