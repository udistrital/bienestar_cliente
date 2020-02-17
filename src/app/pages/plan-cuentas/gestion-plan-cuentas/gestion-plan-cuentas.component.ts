import { Component, OnInit } from '@angular/core';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';

@Component({

  selector: 'ngx-gestion-plan-cuentas',
  templateUrl: './gestion-plan-cuentas.component.html',
  styleUrls: ['./gestion-plan-cuentas.component.scss'],
})
export class GestionPlanCuentasComponent implements OnInit {
  tabs: any[] = [
    {
      title: 'Rubros',
      route: '/pages/plan-cuentas/rubros',
    },
    {
      title: 'Apropiaciones',
      route: '/pages/plan-cuentas/apropiaciones',
    },
    {
      title: 'fuentes',
      route: '/pages/plan-cuentas/fuentes',
    },
  ];


  selectedOption: any;
  vigencias: any[] = [
    {vigencia: 2019},
    {vigencia: 2017},
    {vigencia: 2016},
  ];
  VigenciaActual: any;
  op_plan_cuentas: any[] = [
    { option: 'Rubros' },
    { option: 'Apropiaciones' },
    { option: 'Fuentes de Financiamiento' }];
  constructor(private translate: TranslateService) {
    this.selectedOption = '';
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
    });
   }

  ngOnInit() {}

  useLanguage(language: string) {
    this.translate.use(language);
  }

  onSelect(selectedItem: any) {
    console.info('Opcion Seleccionada es: ', selectedItem);
  }

  onChangeTab($event) {
    console.info($event.tabTitle);
    this.selectedOption = $event.tabTitle;
  }

}

// definicion de tabs
