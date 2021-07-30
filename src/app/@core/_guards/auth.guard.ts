import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { RolesConstanst } from '../../shared/constants/roles.constants';
import { CustomLoginService } from '../../shared/services/custom-login.service';
import { ImplicitAutenticationService } from '../utils/implicit_autentication.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router, private authService: ImplicitAutenticationService, private readonly customLogin: CustomLoginService) {
  }

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

      let valid: boolean =  false;
      const roles = route.data['roles'] as Array<string>;
      const id_token = window.localStorage.getItem('id_token').split('.');
      const payload = JSON.parse(atob(id_token[1]));
      if(payload && payload.role===undefined){
        let data = await this.customLogin.getRolesUser(payload);
        payload.role = data.role;
      }
      if (payload && payload.role) {
        for ( let i = 0; i < payload.role.length; i++) {
          for ( let j = 0; j < roles.length; j++) {
              if ( payload.role[i] === roles[j]) {
                  valid = true;
                  break;
              }
          }
        }
      }

      if (!valid) {
        // not logged in so redirect to login page with the return url
        // or not exist role return url
       
        this.router.navigate(['/']);
      }
      return valid;
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
      return this.canActivate(route, state);
  }

}
