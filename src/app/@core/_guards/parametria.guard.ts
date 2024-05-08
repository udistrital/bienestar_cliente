import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { ApiConstanst } from '../../shared/constants/api.constans';
import { ParametriasService } from '../../shared/services/parametrias.service';

@Injectable({
  providedIn: 'root'
})
export class ParametriaGuard implements CanActivate {

  constructor(private parametriasService: ParametriasService) {
  }

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

      let valid: boolean =  false;
      let data = await this.parametriasService.getParametriaPeriodo(ApiConstanst.PARAMETRIAS.FORMULARIO_RELIQUIDACION);
      if(data.Data && data.Data.InicioVigencia && data.Data.FinVigencia){
        let dateInicio = new Date(data.Data.InicioVigencia);
        let dateFin = new Date(data.Data.FinVigencia);
        let fechaActual = new Date();
        if(dateInicio.getTime()<=fechaActual.getTime() && fechaActual.getTime() <=dateFin.getTime() ){
          valid = true;
        }
      }
      return valid;
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
      return this.canActivate(route, state);
  }
}
