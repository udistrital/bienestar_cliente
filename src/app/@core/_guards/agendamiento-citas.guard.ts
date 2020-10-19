import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { MenuCitasService } from '../data/menu-citas.service'

@Injectable({
  providedIn: 'root'
})
export class AgendamientoCitasGuard implements CanActivate {
  constructor(
    private router: Router,
    private menuCitas: MenuCitasService
    ){}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      let valid: boolean =  false;
      const roles = next.firstChild.data['rolesPermitidos'] as Array<string>;
      const id_token = window.localStorage.getItem('id_token').split('.');
      const payload = JSON.parse(atob(id_token[1]));
      if (payload && payload.role) {
        //Inicio mapeo roles
        this.menuCitas.mapearRoles(payload);
        //Fin mapeo roles
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
  
}
