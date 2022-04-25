
import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import * as auth from 'oidc-auth/index.js';
import { BehaviorSubject, of } from 'rxjs';
@Injectable({
    providedIn: 'root',
})
export class ImplicitAutenticationService {
    bearer: { headers: HttpHeaders; };

    init(): void {
    }
    environment: any;
    public session = null;
    public payload: any;
    logoutUrl: any;

    private logoutSubject = new BehaviorSubject('');
    public logout$ = this.logoutSubject.asObservable();

    constructor() {
        this.bearer = {
            headers: new HttpHeaders({
                'Accept': 'application/json',
                'authorization': 'Bearer ' + window.localStorage.getItem('access_token'),
            }),
        };
        auth.setGeneral(environment.TOKEN);
    }

    public logout() {
        auth.logout();
        this.clearStorage();
    }
    public clearStorage() {
        window.localStorage.removeItem('access_token');
        window.localStorage.removeItem('id_token');
        window.localStorage.removeItem('expires_in');
        window.localStorage.removeItem('state');
        window.localStorage.removeItem('expires_at');
        window.localStorage.removeItem('menu');
        window.localStorage.removeItem('user');
        window.localStorage.removeItem('apps_menu');

    }
    getPayload() {
        return auth.getPayload();
    }

    public live() {
      if (auth.live(true)) {
        auth.liveToken();
        return true;
      } else {
        return false;
      }
    }

    public getAuthorizationUrl(button): string {
        return  auth.live(button);
    }

}
