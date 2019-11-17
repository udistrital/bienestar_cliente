import { Component, OnInit } from '@angular/core';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { MenuItem } from './menu-item';
import { MENU_ITEMS } from './pages-menu';
import { MenuService } from '../@core/data/menu.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ImplicitAutenticationService } from './../@core/utils/implicit_autentication.service';
import Swal from 'sweetalert2';
import 'style-loader!angular2-toaster/toaster.css';

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

  constructor(
    public menuws: MenuService,
    private translate: TranslateService,
    private autenticacion: ImplicitAutenticationService) { }

  ngOnInit() {
    if (this.autenticacion.live()) {
      this.roles = (JSON.parse(atob(localStorage.getItem('id_token').split('.')[1])).role)
        .filter((data: any) => (data.indexOf('/') === -1));
      this.menuws.get(this.roles + '/presupuesto_kronos').subscribe(
        data => {
          this.dataMenu = <any>data;
          for (let i = 0; i < this.dataMenu.length; i++) {
            if (this.dataMenu[i].TipoOpcion === 'Menú') {
              if (!this.dataMenu[i].Opciones) {
                if (!this.dataMenu[i].Url.indexOf('http')) {
                  this.object = {
                    title: this.dataMenu[i].Nombre,
                    icon: '',
                    url: this.dataMenu[i].Url,
                    home: false,
                    key: this.dataMenu[i].Nombre,
                  };
                } else {
                  this.object = {
                    title: this.dataMenu[i].Nombre,
                    icon: '',
                    link: this.dataMenu[i].Url,
                    home: false,
                    key: this.dataMenu[i].Nombre,
                  };
                }
                if (i === 0) {
                  this.object.title = 'Dashboard';
                  this.object.icon = 'home-outline';
                  this.object.home = true;
                }
              } else {
                if (!this.dataMenu[i].Url.indexOf('http')) {
                  this.object = {
                    title: this.dataMenu[i].Nombre,
                    icon: '',
                    url: this.dataMenu[i].Url,
                    home: false,
                    key: this.dataMenu[i].Nombre,
                    children: [],
                  };
                } else {
                  this.object = {
                    title: this.dataMenu[i].Nombre,
                    icon: 'file-text',
                    link: this.dataMenu[i].Url,
                    home: false,
                    key: this.dataMenu[i].Nombre,
                    children: [],
                  };
                }
                if (i === 0) {
                  this.object.title = 'Dashboard';
                  this.object.icon = 'home-outline';
                  this.object.home = true;
                }
                for (let j = 0; j < this.dataMenu[i].Opciones.length; j++) {
                  if (this.dataMenu[i].TipoOpcion === 'Menú') {
                    if (!this.dataMenu[i].Opciones[j].Opciones) {
                      if (!this.dataMenu[i].Opciones[j].Url.indexOf('http')) {
                        this.hijo = {
                          title: this.dataMenu[i].Opciones[j].Nombre,
                          icon: '',
                          url: this.dataMenu[i].Opciones[j].Url,
                          home: false,
                          key: this.dataMenu[i].Opciones[j].Nombre,
                        };
                      } else {
                        this.hijo = {
                          title: this.dataMenu[i].Opciones[j].Nombre,
                          icon: '',
                          link: this.dataMenu[i].Opciones[j].Url,
                          home: false,
                          key: this.dataMenu[i].Opciones[j].Nombre,
                        };
                      }
                    }
                    this.object.children.push(this.hijo);
                  }
                }
              }
              this.results.push(this.object);
            }
          }
          this.menu = this.results;
          this.translateMenu();
        },
        (error: HttpErrorResponse) => {
          Swal.fire({
            type: 'error',
            title: error.status + '',
            text: this.translate.instant('ERROR.' + error.status),
            footer: this.translate.instant('GLOBAL.cargar') + '-' +
              this.translate.instant('GLOBAL.menu'),
            confirmButtonText: this.translate.instant('GLOBAL.aceptar'),
          });
          this.menu = MENU_ITEMS;
          this.translateMenu();
        });
    } else {
      this.rol = 'PUBLICO';
      // console.info(' Menu PUBLICO');
      this.menu = MENU_ITEMS;
      this.translateMenu();
    }
    this.translateMenu();
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => { // Live reload
      this.translateMenu();
    });
  }

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
