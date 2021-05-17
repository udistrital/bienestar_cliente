import { Component, OnInit } from '@angular/core';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { MenuItem } from './menu-item';
import { MenuService } from '../@core/data/menu.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ImplicitAutenticationService } from './../@core/utils/implicit_autentication.service';
import { environment } from '../../environments/environment';
import Swal from 'sweetalert2';
import 'style-loader!angular2-toaster/toaster.css';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'ngx-pages',
  template: `
    <ngx-one-column-layout>
    <nb-menu [items]="menu"></nb-menu>
      <router-outlet></router-outlet>
    </ngx-one-column-layout>
  `,
})

export class PagesComponent implements OnInit {

  public menu = [];
  public results = [];
  object: MenuItem;
  hijo: MenuItem;
  hijo2: MenuItem;
  rol: String;
  dataMenu: any;
  roles: any;

  url_apoyo  = environment.CLIENTE_APOYO;
  url_presupuesto  = environment.CLIENTE_PRESUPUESTO;
  url_contabilidad = environment.CLIENTE_CONTABILIDAD;
  application_conf = 'presupuesto_kronos';

  constructor(
    public  menuws: MenuService,
    private translate: TranslateService,
    private autenticacion: ImplicitAutenticationService
  ) { }

  ngOnInit() {
    console.log('init page');
    
    if (this.autenticacion.live()) {
      console.log('authentico correcto');
      const temp = (JSON.parse(atob(localStorage.getItem('id_token').split('.')[1])).role)
      if(temp==undefined){
        this.roles=['ESTUDIANTE']
      }else{
        this.roles=temp.filter((data: any) => (data.indexOf('/') === -1));
      }
      /* icons */
      /* https://akveo.github.io/eva-icons/#/ */
      console.log("roles↓↓↓");
      console.log(this.roles);
      console.log('-------------');
      if(this.roles.includes("ESTUDIANTE")){
        const urlSIBUD = this.replaceUrlNested('${url_apoyo}/inscripciones/solicitud');       
        this.object   = {
          title: 'Solicitud apoyo alimentario',
          icon:  'file-text',
          link:  `${urlSIBUD}`,
          home:  false,
          key:   "no se que poner",
          children: this.mapMenuChildrenObject(null)
        };
        this.menu.push(this.object)
      }
      if(this.roles.includes("ADMIN_NECESIDADES")){
        const urlSIBUD = this.replaceUrlNested('${url_apoyo}/registro/diario');   
        console.log(urlSIBUD);     
        this.object   = {
          title: 'Registro diario',
          icon:  'calendar-outline',
          link:  `${urlSIBUD}`,
          home:  false,
          key:   "no se que poner :C",
          children: this.mapMenuChildrenObject(null)
        };
        this.menu.push(this.object)
        console.log('hay un estudiante');
      }

      if(this.roles.includes("ADMIN_NECESIDADES")){
        let objMenu= {
          Url: '${url_apoyo}/inscripciones/solicitudes',
          Nombre: 'Listado solicitudes',
          Opciones: null
        }
        const urlSIBUD = this.replaceUrlNested('');  
        let childs= []
        var child1 = {
          Url: '${url_apoyo}/inscripciones/solicitudes',
          Nombre: 'Listado solicitudes',
          Opciones: null
        }; 
        var child2 = {
          Url: '${url_apoyo}/inscripciones/buscarSolicitud',
          Nombre: 'Buscar solicitudes',
          Opciones: null
        }; 
        childs.push(child1)
        childs.push(child2)
        
        this.object   = {
          title: 'Inscripciones',
          icon:  'file-text',
          link:  ``,
          home:  false,
          key:   "no se que poner :C",
          children: this.mapMenuChildrenObject(childs)
        };
        this.menu.push(this.object)
        console.log('hay un estudiante');
      }
      
      /* toca activarlo */
      /* this.menuws.get(this.roles + '/' + this.application_conf).subscribe(
        data => {
          this.dataMenu = <any>data;
          this.mapMenuByObjects(this.dataMenu);
          this.translateMenu();
        },
        (error: HttpErrorResponse) => {
          Swal.fire({
            icon: 'error',
            title: error.status + '',
            text: this.translate.instant('ERROR.' + error.status),
            footer: this.translate.instant('GLOBAL.cargar') + '-' +
              this.translate.instant('GLOBAL.menu'),
            confirmButtonText: this.translate.instant('GLOBAL.aceptar'),
          });
          this.menu = [];
          this.translateMenu();
        }); */
    } else {
      console.log('Publico');
      
      this.rol = 'PUBLICO';
      this.menu = [];
      this.translateMenu();
    }
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => { // Live reload
      this.translateMenu();
    });
  }

  /**
   * Map the menu on objects
   *  @param menuArray
   */
   mapMenuByObjects(menuArray) {
    menuArray.map( itemMenu => {
      const urlNested = this.replaceUrlNested(itemMenu.Url);
      this.object   = {
        title: itemMenu.Nombre,
        icon:  'file-text',
        link:  `${urlNested}`,
        home:  true,
        key:   itemMenu.Nombre,
        children: this.mapMenuChildrenObject(itemMenu.Opciones)
      };
      this.menu.push(this.object);
    });
  }

  /**
   * Take the Array from options submenu
   *  @param opcionesMenu
   */
  mapMenuChildrenObject(opcionesMenu) {
    if (opcionesMenu) {
      const submenu = [];
      opcionesMenu.map(itemChild => {
        const urlNested = this.replaceUrlNested(itemChild.Url);
        this.object = {
          title: itemChild.Nombre,
          icon:  '',
          link:  `${urlNested}`,
          home:  false,
          key:   itemChild.Nombre,
          children: this.mapMenuChildrenObject(itemChild.Opciones)
        };
        submenu.push(this.object);
      });
      return submenu;
    }
  }

  /**
   * Looks for the variable on environments to replace it dinamically throught clients
   *  @param urlNested
   */
  replaceUrlNested(urlNested) {
    return urlNested.replace('${url_apoyo}', this.url_apoyo)
                    .replace('${url_presupuesto}', this.url_presupuesto);
  }

  /**
   * Translate all menu
   */
  private translateMenu(): void {
    this.menu.forEach((menuItem: MenuItem) => {
      this.translateMenuTitle(menuItem);
    });
  }

  /**
   * Translates one root menu item and every nested children
   * @param menuItem
   * @param prefix
   */
  private translateMenuTitle(menuItem: MenuItem, prefix: string = ''): void {
    let key = '';
    try {
      key = (prefix !== '')
        ? PagesComponent.getMenuItemKey(menuItem, prefix)
        : PagesComponent.getMenuItemKey(menuItem);
    } catch (e) {
      // Key not found, don't change the menu item
      return;
    }

    this.translate.get(key).subscribe((translation: string) => {
      menuItem.title = translation;
    });
    if (menuItem.children != null) {
      // apply same on every child
      menuItem.children.forEach((childMenuItem: MenuItem) => {
        // We remove the nested key and then use it as prefix for every child
        this.translateMenuTitle(childMenuItem, PagesComponent.trimLastSelector(key));
      });
    }
  }

  /**
   * Resolves the translation key for a menu item. The prefix must be supplied for every child menu item
   * @param menuItem
   * @param prefix
   * @returns {string}
   */
  private static getMenuItemKey(menuItem: MenuItem, prefix: string = 'MENU'): string {
    if (menuItem.key == null) {
      throw new Error('Key not found');
    }

    const key = menuItem.key.toLowerCase();
    if (menuItem.children != null) {
      return prefix + '.' + key + '.' + key; // Translation is nested
    }
    return prefix + '.' + key;
  }

  /**
   * Used to remove the nested key for translations
   * @param key
   * @returns {string}
   */
  private static trimLastSelector(key: string): string {
    const keyParts = key.split('.');
    keyParts.pop();
    return keyParts.join('.');
  }
}
