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
import { CustomLoginService } from '../shared/services/custom-login.service';

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

  url_apoyo = environment.CLIENTE_APOYO;
  url_presupuesto = environment.CLIENTE_PRESUPUESTO;
  url_contabilidad = environment.CLIENTE_CONTABILIDAD;
  application_conf = 'presupuesto_kronos';

  constructor(
    public menuws: MenuService,
    private translate: TranslateService,
    private autenticacion: ImplicitAutenticationService,
    private readonly customLogin: CustomLoginService
  ) { }

  ngOnInit() {
    if (this.autenticacion.live()) {

      const temp = (JSON.parse(atob(localStorage.getItem('id_token').split('.')[1])).role)
      if (temp == undefined) {
        this.roles = ['ESTUDIANTE']
      } else {
        this.roles = temp.filter((data: any) => (data.indexOf('/') === -1));
      }

      console.log("roles↓↓↓");
      console.log(this.roles);
      this.object = {
        title: 'Home',
        icon: 'home-outline',
        link: `home`,
        home: true,
        key: "Home",
        children: this.mapMenuChildrenObject(null)
      };
      this.menu.push(this.object)

      if (this.roles.includes("ESTUDIANTE")) {
        const urlSIBUD = this.replaceUrlNested('${url_apoyo}/solicitud');
        this.object = {
          title: 'Solicitud apoyo alimentario',
          icon: 'clipboard-outline',
          link: `${urlSIBUD}`,
          home: false,
          key: "Solicitud apoyo alimentario",
          children: this.mapMenuChildrenObject(null)
        };
        this.menu.push(this.object)
      }
      if (this.roles.includes("ADMIN_NECESIDADES")) {

        let childs = []
        var child1 = {
          Url: '${url_apoyo}/registro/diario',
          Nombre: 'Registro Diario',
          Icon: 'checkmark-circle-outline',
          Opciones: null,
        };
        var child2 = {
          Url: '${url_apoyo}/registro/consultar',
          Nombre: 'Consultar Registro',
          Icon: 'book-open-outline',
          Opciones: null
        };

        childs.push(child1);
        childs.push(child2);

        this.object = {
          title: 'Registro beneficiarios',
          icon: 'person-done-outline',
          link: ``,
          home: false,
          key: "Registro beneficiarios",
          children: this.mapMenuChildrenObject(childs)
        };
        this.menu.push(this.object)
      }

      if (this.roles.includes("ADMIN_NECESIDADES")) {
        /* let objMenu= {
          Url: '${url_apoyo}/inscripciones/solicitudes',
          Nombre: 'Listado solicitudes',
          Opciones: null
        }
        const urlSIBUD = this.replaceUrlNested('');   */
        let childs = []
        var child3 = {
          Url: '${url_apoyo}/inscripciones/solicitudes',
          Nombre: 'Listado solicitudes',
          Icon: 'list-outline',
          Opciones: null
        };
        var child4 = {
          Url: '${url_apoyo}/inscripciones/buscarSolicitud',
          Nombre: 'Buscar solicitud',
          Icon: 'search-outline',
          Opciones: null
        };
        var child5 = {
          Url: '${url_apoyo}/inscripciones/evaluacion-masiva',
          Nombre: 'Evaluacion masiva',
          Icon: 'layers-outline',
          Opciones: null
        };
        childs.push(child3)
        childs.push(child4)
        childs.push(child5)

        this.object = {
          title: 'Inscripciones',
          icon: 'person-add-outline',
          link: ``,
          home: false,
          key: "Inscripciones",
          children: this.mapMenuChildrenObject(childs)
        };
        this.menu.push(this.object)
      }

      if (this.roles.includes("ADMIN_NECESIDADES")) {

        let childs = []
        var child6 = {
          Url: '${url_apoyo}/informes/diario',
          Nombre: 'Diario',
          Icon: 'calendar-outline',
          Opciones: null
        };
        var child7 = {
          Url: '${url_apoyo}/informes/periodo',
          Nombre: 'Periodo',
          Icon: 'file-text-outline',
          Opciones: null
        };
        var child8 = {
          Url: '${url_apoyo}/informes/estudiante-periodo',
          Nombre: 'Estudiante',
          Icon: 'people-outline',
          Opciones: null
        };
        childs.push(child6);
        childs.push(child7);
        childs.push(child8);

        /* let objMenu= {
          Url: '',
          Nombre: 'Informes',
          Opciones: childs
        }

        this.mapMenuByObjects([objMenu]) */

        this.object = {
          title: 'Informes',
          icon: 'archive-outline',
          link: ``,
          home: false,
          key: "Informes",
          children: this.mapMenuChildrenObject(childs)
        };
        this.menu.push(this.object)
      }

      if (this.roles.includes("ADMIN_NECESIDADES")) {

        let childs = []
        var child9 = {
          Url: '${url_apoyo}/administracion/periodos',
          Nombre: 'Periodos',
          Icon: 'clock-outline',
          Opciones: null
        };

        childs.push(child9);

        /* let objMenu= {
          Url: '',
          Nombre: 'Informes',
          Opciones: childs
        }

        this.mapMenuByObjects([objMenu]) */

        this.object = {
          title: 'Administracion',
          icon: 'briefcase-outline',
          link: ``,
          home: false,
          key: "Administracion",
          children: this.mapMenuChildrenObject(childs)
        };
        this.menu.push(this.object)
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
    menuArray.map(itemMenu => {
      const urlNested = this.replaceUrlNested(itemMenu.Url);
      this.object = {
        title: itemMenu.Nombre,
        icon: 'file-text-outline',
        link: `${urlNested}`,
        home: true,
        key: itemMenu.Nombre,
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
          icon: itemChild.Icon,
          link: `${urlNested}`,
          home: false,
          key: itemChild.Nombre,
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
