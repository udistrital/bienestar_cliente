import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Rubro } from '../../../@core/data/models/rubro';
import { ApropiacionHelper } from '../../../@core/helpers/apropiaciones/apropiacionHelper';
import { CommonHelper } from '../../../@core/helpers/commonHelper';

@Component({
  selector: 'ngx-consulta-vigencia',
  templateUrl: './consulta-vigencia.component.html',
  styleUrls: ['./consulta-vigencia.component.scss'],
})
export class ConsultaVigenciaComponent implements OnInit {

  @Input() vigenciaSeleccionada;
  @Output() eventChange = new EventEmitter();
  vigenciaChange: string;
  rubroSeleccionado: any;
  valorApropiacion: number;
  vigenciaSel: any;
  clean = false;
  opcion: string;
  VigenciaActual = '2019';
  optionView: string;
  balanceado: boolean;
  vigencias: any[];
  CentroGestor: string;
  AreaFuncional: string;

  constructor(
    private apHelper: ApropiacionHelper,
    private commonHelper: CommonHelper,
  ) {
    this.vigenciaSel = '2019';
    this.optionView = 'ApropiacionesEstado';

    this.rubroSeleccionado = {
      Id: 0,
      Codigo: '',
      Nombre: '',
      Descripcion: '',
      Hijos: '',
      Padre: '',
      ApropiacionInicial: 0,
      UnidadEjecutora: null,
      _id: '',
    };


  }


  ngOnInit() {
    this.apHelper.getVigenciasList().subscribe(res => {
      if (res) {
        this.vigencias = res;
      }
    });
    this.commonHelper.geCurrentVigencia().subscribe(res => {
      if (res) {
        this.vigenciaSel = res + '';
      }
    });
  }

  onSelect(selectedItem: any) {
    this.vigenciaSel = selectedItem;
    // this.eventChange.emit(true);
    console.info(this.vigenciaSel);
  }

  receiveMessage($event) {
    this.rubroSeleccionado = <Rubro>$event;
    console.info(this.rubroSeleccionado);
    this.rubroSeleccionado.Id = parseInt(this.rubroSeleccionado.Id, 0);
    this.rubroSeleccionado.Nombre = this.rubroSeleccionado.Nombre;
    this.CentroGestor = '230';
    this.AreaFuncional = '0' + this.rubroSeleccionado.UnidadEjecutora + '-Rector';
    this.rubroSeleccionado.UnidadEjecutora = parseInt(
      this.rubroSeleccionado.UnidadEjecutora,
      0,
    );
    this.rubroSeleccionado.ApropiacionInicial = parseInt(this.rubroSeleccionado.ApropiacionInicial, 0);

  }
}
