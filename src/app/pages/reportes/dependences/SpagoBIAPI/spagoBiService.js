import { environment } from '../../../../../environments/environment';
import {sdk} from '../SpagoBIAPI/spagoBISDK/sbisdk-all-production'

const  SPAGOBI  = environment.KNOWAGE;


function setBaseUrl(config){
	sdk.services.setBaseUrl(config);
}

function authenticate(config){
      sdk.api.authenticate(config);
}

function getDocumentHtml(config){
      var html = sdk.api.getDocumentHtml(config);
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
