import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
<<<<<<< Updated upstream
export class AuthGuard implements CanActivate {
=======

export class AuthGuard implements CanActivate {

>>>>>>> Stashed changes
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return true;
  }

<<<<<<< Updated upstream
}n
=======
}
>>>>>>> Stashed changes
