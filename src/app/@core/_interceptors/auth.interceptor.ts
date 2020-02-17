import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

import { tap } from 'rxjs/operators';
import { PopUpManager } from '../managers/popUpManager';
import { TranslateService } from '@ngx-translate/core';


@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private router: Router,
    private pUpManager: PopUpManager,
    private translate: TranslateService,
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    // Get the auth token from the service.
    const acces_token = window.localStorage.getItem('access_token');

    if (acces_token) {
      // Clone the request and replace the original headers with
      // cloned headers, updated with the authorization.
      const authReq = req.clone({
        headers: req.headers.set('authorization', `Bearer ${acces_token}`),
      });
      // send cloned request with header to the next handler.
      return next.handle(authReq).pipe(
        tap(event => {
          // There may be other events besides the response.
          if (event instanceof HttpErrorResponse) {
            // cache.put(req, event); // Update the cache.
            this.router.navigate(['/']);
            this.pUpManager.showErrorToast(this.translate.instant(`ERROR.${event['status']}`));
          }
        },
          (error: any) => {
            console.info(error);
            this.pUpManager.showErrorToast(this.translate.instant(`ERROR.${error['status']}`));
          },
        ));
    } else {
      return next.handle(req).pipe(
        tap(event => {
          // There may be other events besides the response.
          if (event instanceof HttpErrorResponse) {
            // cache.put(req, event); // Update the cache.
            // this.snackBar.open('test', undefined, { duration: 5000 });
            this.pUpManager.showErrorToast(this.translate.instant(`ERROR.${event['status']}`));
          }
        },
          (error: any) => {
            console.info(error);
            // this.snackBar.open('Error en el Servidor', undefined, { duration: 5000 });
            this.pUpManager.showErrorToast(this.translate.instant(`ERROR.${error['status']}`));
          },
        ));
    }
  }
}
