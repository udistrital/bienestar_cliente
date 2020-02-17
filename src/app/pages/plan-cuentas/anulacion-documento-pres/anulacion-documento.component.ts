import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import locales from '@angular/common/locales/es-CO';
import { ModApropiacionHelper } from '../../../@core/helpers/modApropiacionHelper';
import { MovimientosHelper } from '../../../@core/helpers/movimientos/movimientosHelper';
import { PopUpManager } from '../../../@core/managers/popUpManager';
import { TranslateService } from '@ngx-translate/core';
registerLocaleData(locales, 'co');

@Component({
  selector: 'ngx-anulacion-documento',
  templateUrl: './anulacion-documento.component.html',
  styleUrls: ['./anulacion-documento.component.scss'],
})
export class AnulacionDocumentoComponent implements OnInit {

  @Input() documentData: { _id: string, ValorActual: number };
  @Input() vigencia: string;
  @Input() centroGestor: string;
  @Input() movTypeToCreate: string;
  @Input() modIdType: string;

  @Output() saved: EventEmitter<boolean> = new EventEmitter();

  documentAfectationARr: Array<any>;
  anulationTypes: Array<{
    Nombre: string,
  }>;
  typeSelected: string;
  anulationOriginSelected: any = {};
  originSelectedFlag: boolean;
  descriptionValue: string;
  anulationValue: number;
  tittle: string;

  constructor(
    private modApropiacionHelper: ModApropiacionHelper,
    private movimientosHelper: MovimientosHelper,
    private popManager: PopUpManager,
    private translateService: TranslateService,
  ) {
    this.originSelectedFlag = false;
  }


  ngOnInit() {

    this.anulationTypes = [
      {
        Nombre: 'Parcial',
      },
      {
        Nombre: 'Total',
      }
    ];

    this.loadAnulationData();
  }

  loadAnulationData() {
    this.modApropiacionHelper.getModificacionesAfectation(
      this.documentData._id,
      { vigencia: this.vigencia, cg: this.centroGestor },
      'fatherInfoLevel=apropiacion').subscribe(res => {
        this.documentAfectationARr = res;
      });

    this.tittle = this.translateService.instant(
      'GLOBAL.proceso_anulacion') +
      ' para ' +
      this.translateService.instant('GLOBAL.' + this.documentData['Tipo']) +
      ' No ' +
      this.documentData['Consecutivo'] +
      ' de ' +
      this.vigencia;
  }

  setAnulationOrigin(origin: any) {
    this.anulationOriginSelected = origin;
    this.originSelectedFlag = true;
  }

  setAnulationType(anulType: string) {
    this.typeSelected = anulType;
  }

  sendAnulationData() {
    const dataToSend = this.buildMovimientoData();
    if (this.typeSelected === 'Parcial' && !this.anulationValue) {
      this.popManager.showErrorAlert('Debe ingresar un valor para la anulación');
    } else {
      this.popManager.showAlert('warning', 'Registrar anulación', 'esta seguro?')
        .then((result) => {
          this.movimientosHelper.postMovimiento(dataToSend).subscribe(res => {
            this.popManager.showAlert('success', 'Anulación registrada', ' Se registro la anulación con el consecutivo ' + res['DocInfo']['Consecutivo']);
            this.saved.emit(true);
            this.loadAnulationData();
            this.originSelectedFlag = false;
            this.movTypeToCreate = undefined;
            this.descriptionValue = undefined;
            this.typeSelected = undefined;
          });
        });
    }


  }

  buildMovimientoData(): object {
    const movimiento = {
      Data: { 'descripcion': this.descriptionValue, 'tipo_anulacion': this.typeSelected },
      Tipo: this.movTypeToCreate,
      Vigencia: parseInt(this.vigencia, 0),
      CentroGestor: this.centroGestor + '',
      AfectacionMovimiento: []
    };

    movimiento.AfectacionMovimiento.push(
      {
        MovimientoProcesoExternoId: {
          TipoMovimientoId: {
            Id: parseInt(this.modIdType, 0),
            Acronimo: this.movTypeToCreate
          }
        },
        DocumentoPadre: this.anulationOriginSelected._id,
        Valor: this.anulationValue ? this.anulationValue : this.anulationOriginSelected.ValorActual,
        Descripcion: this.descriptionValue,
      }
    );
    return movimiento;
  }
}
