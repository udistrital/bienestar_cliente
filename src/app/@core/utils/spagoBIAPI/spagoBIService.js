import { environment } from '../../../../environments/environment';

const { SPAGOBI } = environment;

function setBaseUrl(config){
	Sbi.sdk.services.setBaseUrl(config);
}

function authenticate(config){
      Sbi.sdk.api.authenticate(config);
}

function getDocumentHtml(config){
      var html = Sbi.sdk.api.getDocumentHtml(config);
      return html;
}

function getReport(scope, callbackFunction){
      const baseUrl = {
            protocol: SPAGOBI.PROTOCOL, 
            host: SPAGOBI.HOST, 
            port: SPAGOBI.PORT, 
            contextPath: SPAGOBI.CONTEXTPATH, 
            controllerPath: 'servlet/AdapterHTTP'
      };
      const authConf = {
            params: {
                  user: SPAGOBI.USER,
                  password: SPAGOBI.PASSWORD
            },
            callback: {
                  fn: callbackFunction,
                  scope: scope
            }
      };
      setBaseUrl(baseUrl);
      authenticate(authConf);
}

var spagoBIService = {};

/*
spagoBIService.setBaseUrl = setBaseUrl;
spagoBIService.getDocumentHtml = getDocumentHtml;
spagoBIService.authenticate = authenticate;
*/

spagoBIService.getReport = getReport;
spagoBIService.getDocumentHtml = getDocumentHtml;

export {spagoBIService};

