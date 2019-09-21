import { Component, OnDestroy, OnInit } from '@angular/core';
import { NbMediaBreakpointsService, NbMenuService, NbSidebarService, NbThemeService } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { UserData } from '../../../@core/data/users';
import { LayoutService } from '../../../@core/utils';
import { map, takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { ImplicitAutenticationService } from '../../../@core/utils/implicit_autentication.service';

@Component({
  selector: 'ngx-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit, OnDestroy {

  private destroy$: Subject<void> = new Subject<void>();
  itemClick: Subscription;
  liveTokenValue: boolean = false;
  username = '';
  private autenticacion = new ImplicitAutenticationService;
  userPictureOnly: boolean = false;
  user: any;

  themes = [
    {
      value: 'default',
      name: 'Light',
    },
    {
      value: 'dark',
      name: 'Dark',
    },
    {
      value: 'cosmic',
      name: 'Cosmic',
    },
    {
      value: 'corporate',
      name: 'Corporate',
    },
  ];

  currentTheme = 'default';

  userMenu = [{ title: 'Profile' }, { title: 'Log out' }];

  constructor(private sidebarService: NbSidebarService,
    private menuService: NbMenuService,
    private themeService: NbThemeService,
    private userService: UserData,
    private router: Router,
    private layoutService: LayoutService,
    private breakpointService: NbMediaBreakpointsService,
    public translate: TranslateService) {
    this.translate = translate;
    this.itemClick = this.menuService.onItemClick()
      .subscribe((event) => {
        this.onContecxtItemSelection(event.item.title);
      });

    this.liveToken();
  }

  ngOnInit() {
    this.currentTheme = this.themeService.currentTheme;

    this.userService.getUsers()
      .pipe(takeUntil(this.destroy$))
      .subscribe((users: any) => this.user = users.nick);

    const { xl } = this.breakpointService.getBreakpointsMap();
    this.themeService.onMediaQueryChange()
      .pipe(
        map(([, currentBreakpoint]) => currentBreakpoint.width < xl),
        takeUntil(this.destroy$),
      )
      .subscribe((isLessThanXl: boolean) => this.userPictureOnly = isLessThanXl);

    this.themeService.onThemeChange()
      .pipe(
        map(({ name }) => name),
        takeUntil(this.destroy$),
      )
      .subscribe(themeName => this.currentTheme = themeName);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  changeTheme(themeName: string) {
    this.themeService.changeTheme(themeName);
  }

  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, 'menu-sidebar');
    this.layoutService.changeLayoutSize();

    return false;
  }

  navigateHome() {
    this.router.navigate(['/pages/plan-cuentas/rubros']);
    // this.menuService.navigateHome();
    return false;
  }
  login() {
    window.location.replace(this.autenticacion.getAuthorizationUrl(true));
  }
  logout() {
    this.autenticacion.logout();
    // this.liveTokenValue = auth.live(true);
  }
  liveToken() {
    if (this.autenticacion.live()) {
      this.liveTokenValue = this.autenticacion.live();
      this.username = (this.autenticacion.getPayload()).sub;
    }
    return this.autenticacion.live();
  }

  onContecxtItemSelection(title) {
    if (title === 'ver todas') {
      this.router.navigate(['/pages/notificacion/listado']);
    }
  }
  goToHome() {
    this.menuService.navigateHome();
  }
  changeStateNoView(): void {
    // this.notificacionService.changeStateNoView(this.username);
  }
  toggleNotifications(): boolean {
    this.sidebarService.toggle(false, 'notifications-sidebar');
    this.changeStateNoView();
    return false;
  }
}
