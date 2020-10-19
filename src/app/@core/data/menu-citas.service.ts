import { Injectable } from '@angular/core';
import { MENU_ITEMS } from '../../@core/data/bienestar-simulated-data/menu-items'
import { ROLES_MAP } from '../data/bienestar-simulated-data/roles-map'

@Injectable({
  providedIn: 'root'
})
export class MenuCitasService {

  constructor() { }

  getMenu(){
    let menu = [];
    let payload = JSON.parse(atob(localStorage.getItem('id_token').split('.')[1]));
    //Inicio mapeo roles
    this.mapearRoles(payload);
    //Fin mapeo roles
    let roles = payload.role;
    for(let i in MENU_ITEMS[0].children){
      for(let j in MENU_ITEMS[0].children[i].data.rolesPermitidos){
        if (roles.indexOf(MENU_ITEMS[0].children[i].data.rolesPermitidos[j])!=-1){
          menu.push(MENU_ITEMS[0].children[i]);
          break;
        }
      }
    }
    MENU_ITEMS[0].children = menu;
    return MENU_ITEMS;
  }

  mapearRoles(payload){
    for (let i = 0; i < payload.role.length; i++){
      for (let j in ROLES_MAP){
        if (payload.role[i] == ROLES_MAP[j].RolOrigin){
          payload.role[i] = ROLES_MAP[j].RolBienestar;
        }
      }
    }
  }
}
