import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TypeGeneral } from '../../../../@core/interfaces/TypeGeneralInterface';
import { ModFuenteData } from '../../../../@core/interfaces/modificationInterface';
import { ModFuenteHelper } from '../../../../@core/helpers/modificaciones/modFuenteHelper';
import { FuenteFinanciamientoInterface } from '../../../../@core/interfaces/fuenteFinanciamientoInterface';
import { FormManager } from '../../../../@core/managers/formManager';
import { CommonHelper } from '../../../../@core/helpers/commonHelper';
import { FuenteHelper } from '../../../../@core/helpers/fuentes/fuenteHelper';
import { PopUpManager } from '../../../../@core/managers/popUpManager';


@Component({
  selector: 'ngx-set-modificacion-fuente',
  templateUrl: './set-modificacion-fuente.component.html',
  styleUrls: ['./set-modificacion-fuente.component.scss']
})
export class SetModificacionFuenteComponent implements OnInit {
  @Input() movAfectation: Array<ModFuenteData>;
  @Output() setStepValidationEvent: EventEmitter<any> = new EventEmitter();
  @Output() eventChange = new EventEmitter();
  modValueForm: FormGroup;
  movimientoValidator: FormGroup;
  modTypes: Array<TypeGeneral>;
  movOrigen: FuenteFinanciamientoInterface;
  movDestino: FuenteFinanciamientoInterface;
  sourceTypeSelected: string;
  showMovSelection: boolean;
  selectedType: any;
  showResumenTab: boolean;
  viewItemSelected: boolean;
  vigenciaActual: number;
  modTypeSelected: TypeGeneral;
  movimientoFormStruct: any = {
    valid: true,
  };

  modValueFormStruct: any = {
    modType: true,
    movimientoOrigen: true,
    value: true,
  };
  limitSumFuentes: boolean;
  infoSaldoSuperado: string;
  desfaseSaldo: number;
  sumaMovimientosFuente: any;
  constructor(private modHelper: ModFuenteHelper, 
    private comnHelper: CommonHelper, private fuenteHelper: FuenteHelper,
    private popManager: PopUpManager) {
    this.viewItemSelected = true;
   }

  async ngOnInit() {
    await this.cleanData();
    this.movAfectation = [];
    this.modHelper.getModTypes().subscribe((res) => {

      this.modTypes = res.filter(str => str.Acronimo.match('fuente'));
    });
  }

  public getDataEvent(changeStep) {
    this.setStepValidationEvent.emit({
      afectation: this.movAfectation,
       balanced: this.limitSumFuentes,// si se necesita un booleano para este proceso se activa
      changeStep,
    });
  }
  public async cleanData() {
    this.selectedType = undefined;
    this.showResumenTab = false;
    this.showMovSelection = false;
    this.movDestino = undefined;
    this.movOrigen = undefined;
    this.movimientoValidator = FormManager.BuildGroupForm(this.movimientoFormStruct);
    this.modValueForm = FormManager.BuildGroupForm(this.modValueFormStruct);
    this.modValueForm.controls['movimientoOrigen'].disable();
    this.sourceTypeSelected = '';
    this.comnHelper.geCurrentVigencia().subscribe(res => {
      this.vigenciaActual = res;
    });
    this.modValueForm.controls['modType'].valueChanges.subscribe((selected: TypeGeneral) => {
      if (selected.Parametros) {
        selected.Parametros = JSON.parse(selected.Parametros);
        console.info(selected.Parametros);
      }
      console.info(selected);
      this.modTypeSelected = selected;
      if (this.modTypeSelected) {
        if (selected.Parametros['MovimientoDestino']) {
          this.modValueForm = FormManager.addFormControl(this.modValueForm, {
            movimientoDestino: true,
          });
          this.modValueForm.controls['movimientoDestino'].disable();

        } else {
          this.modValueForm.removeControl('movimientoDestino');
          this.movDestino = undefined;
        }
      }
    });

  }

  public sourceSelection(mov: string) {
    this.sourceTypeSelected = mov;
    this.showMovSelection = true;
  }
  public selectFuenteElemntEvent($event: FuenteFinanciamientoInterface) {
    console.info($event);
    const withVigencia = $event.Vigencia != 0 ? true : false;
    if (withVigencia) {

      switch (this.sourceTypeSelected) {
        case 'origen':
          this.movOrigen = $event;
          console.info(this.movOrigen.Codigo);
          this.modValueForm.controls['movimientoOrigen'].patchValue(`${this.movOrigen.Codigo} / ${this.movOrigen.Nombre}`);
          break;
        case 'destino':
          this.movDestino = $event;
          this.modValueForm.controls['movimientoDestino'].patchValue(`${this.movDestino.Codigo} / ${this.movDestino.Nombre}`);
          break;

        default:
          break;
      }
      this.showMovSelection = false;
    }
  }
  public async addModToList() {
    const modType = JSON.parse(JSON.stringify(this.modValueForm.value['modType']));

    modType['Parametros'] = modType['Parametros'] ? JSON.stringify(modType['Parametros']) : undefined;
    const currentMovData: ModFuenteData = {
      Tipo: modType,
      MovimientoOrigen: this.movOrigen,
      MovimientoDestino: this.movDestino ? this.movDestino : undefined, 
      Valor: this.modValueForm.value['value']
    };

    if (currentMovData.MovimientoOrigen !== undefined) {

      this.fuenteHelper.getPlanAdquisicionByFuente(this.vigenciaActual.toString(), currentMovData.MovimientoOrigen.Codigo).subscribe((res) => {
        if (res) {
          let saldoFuente = res.fuente_financiamiento.total_saldo_fuente;
          saldoFuente += this.sumaMovimientosFuente; 
          if(saldoFuente< currentMovData.Valor && this.movDestino !== undefined) {
            this.limitSumFuentes = false;
            this.infoSaldoSuperado = "La fuente: "+ currentMovData.MovimientoOrigen.Nombre + " se desfasa por un valor de: ";
            this.desfaseSaldo = currentMovData.Valor - saldoFuente;         
          } else {
            this.limitSumFuentes = true;
            this.movAfectation.push(currentMovData);
            this.eventChange.emit(true);
          }
  
        }
      })
    }
    
  }
}
