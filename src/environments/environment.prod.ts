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
      USERNAME: 'bienestar',
      PASS: 'bienestarud',
    },
  },
  CLIENTE_APOYO: 'apoyo-alimentario',
  CLIENTE_SALUD: 'citas',
  APOYO_ALIMENTARIO: "https://autenticacion.portaloas.udistrital.edu.co/apioas/apoyo_alimentario_mongo_crud/",
  MEDICINA: "https://inteligenciainstitucional.portaloas.udistrital.edu.co/go_api/medicina_crud/v1/",
  PSICOLOGIA: "https://inteligenciainstitucional.portaloas.udistrital.edu.co/go_api/psicologia_crud/v1/",
  ODONTOLOGIA: "https://inteligenciainstitucional.portaloas.udistrital.edu.co/go_api/odontologia_crud/v1/",
  ACCESO_HISTORIA: "https://inteligenciainstitucional.portaloas.udistrital.edu.co/go_api/acceso_historia_crud/v1/",
  CITA: "https://inteligenciainstitucional.portaloas.udistrital.edu.co/go_api/citas_crud/v1/",
  ACADEMICA: 'https://autenticacion.portaloas.udistrital.edu.co/apioas/academica_jbpm/v1/',
  AUTENTICACION_MID: 'https://autenticacion.portaloas.udistrital.edu.co/apioas/autenticacion_mid/v1/',
  UBICACIONES: 'https://autenticacion.portaloas.udistrital.edu.co/apioas/ubicaciones_crud/v1/ ',
  OIKOS_SERVICE: 'https://autenticacion.portaloas.udistrital.edu.co/apioas/oikos_crud_api/v1/',
  OIKOS_SERVICE_2: 'https://autenticacion.portaloas.udistrital.edu.co/apioas/oikos_crud_api/v2/',
  CONFIGURACION_SERVICE: 'https://autenticacion.portaloas.udistrital.edu.co/apioas/configuracion_crud_api/v1/',
  CONF_MENU_SERVICE: 'https://autenticacion.portaloas.udistrital.edu.co/apioas/configuracion_crud_api/v1/menu_opcion_padre/ArbolMenus/',
  TERCEROS_CRUD_SERVICE: 'https://autenticacion.portaloas.udistrital.edu.co/apioas/terceros_crud/v1/',
  PARAMETROS: "https://autenticacion.portaloas.udistrital.edu.co/apioas/parametros/v1/",
  SOLICITUD_CRUD_SERVICE: 'https://autenticacion.portaloas.udistrital.edu.co/apioas/solicitudes_crud/v1/',
  NUXEO_2020: 'https://autenticacion.portaloas.udistrital.edu.co/apioas/nuxeo_api/v1/',
  DOCUMENTO_SERVICE: 'https://autenticacion.portaloas.udistrital.edu.co/apioas/documento_crud/v2/',
  PARAMETRIAS: 'https://autenticacion.portaloas.udistrital.edu.co/apioas/parametros/v1/',
  GESTOR_DOCUMENTAL: 'https://autenticacion.portaloas.udistrital.edu.co/apioas/gestor_documental_mid/v1/',


  IDS: {
    IDTIPOPARAMETRO: 21,
    IDTIPOSOLICITUD: 9,
    IDINSCRIPCIONES: 685,
    IDSERVICIOAPOYO: 686,
    IDCIERREPERIODO: 687,
    IDSOLICITUDRADICADA: 23,
    IDSOLICITUDACEPTADA: 28,
    IDSOLICITUDNOACEPTADA: 29,
    IDSOLICITUDPREPARADA: 30,
    IDENFERMERIA: 678,
    IDMEDICINA: 679,
    IDPSICOLOGIA: 680,
    IDODONTOLOGIA: 681,
    IDFISIOTERAPIA: 682,
    IDHORARIOINICIO: 683,
    IDHORARIOFINAL: 684,
    IDESTADOSOLICITUDESPERA: 31,
    IDESTADOSOLICITUDAGENDADA: 46,
  },
  SMMLV: 1000000,

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
    CLIENTE_ID: 'OupisOB1RipVe7jLSp8VS5NYmWga',
    RESPONSE_TYPE: 'id_token token',
    SCOPE: 'openid email role',
    REDIRECT_URL: 'https://bienestar.portaloas.udistrital.edu.co',
    SIGN_OUT_URL: 'https://autenticacion.portaloas.udistrital.edu.co/oidc/logout',
    SIGN_OUT_REDIRECT_URL: 'https://bienestar.portaloas.udistrital.edu.co',
  },
};
