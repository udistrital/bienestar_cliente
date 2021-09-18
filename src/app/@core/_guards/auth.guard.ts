import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import Swal from 'sweetalert2';
import { ListService } from '../store/list.service';
import { RolesConstanst } from '../../shared/constants/roles.constants';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router, private listService:ListService,private translate: TranslateService,) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

      let valid: boolean =  false;      
      const roles = route.data['roles'] as Array<string>;
      const id_token = window.localStorage.getItem('id_token').split('.');
      const payload = JSON.parse(atob(id_token[1]));
      
      if (payload && payload.role) {
        valid=this.validRole(payload,roles);
      }else if(payload && payload.role===undefined && RolesConstanst.ROLES_EMAIL.length>0){
        payload.role = RolesConstanst.ROLES_EMAIL;
        valid=this.validRole(payload,roles);
      }      

      if (!valid) {
        this.router.navigate(['/']);
        return valid;
      }
      return valid;
      
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
      return this.canActivate(route, state);
  }

  private validRole(payload,roles){
    for ( let i = 0; i < payload.role.length; i++) {
      for ( let j = 0; j < roles.length; j++) {
          if ( payload.role[i] === roles[j]) {
              console.log("paso?");
              return true;
          }
      }
    }
    return false;
  }



}
