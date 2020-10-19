import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EstudianteGuardGuard implements CanActivate {
  roles = (JSON.parse(atob(localStorage.getItem('id_token').split('.')[1])).role)
  .filter((data: any) => (data.indexOf('/') === -1));  

  constructor(private router: Router){}

  canActivate(): boolean{
    if(this.roles.indexOf('CONTRATISTA') != -1){
      return true;
    }else{
      this.router.navigateByUrl('pages/dashboard');
    }  
  }
  
  
}
