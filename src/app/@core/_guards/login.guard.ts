import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ImplicitAutenticationService } from '../utils/implicit_autentication.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {
  constructor(private router: Router, private authService: ImplicitAutenticationService) {
  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      const access_token = this.authService.live();
      if (!access_token) {
        this.authService.logout();
        this.router.navigate(['/']);
        return access_token;
      }
    return access_token;
  }
  
}
