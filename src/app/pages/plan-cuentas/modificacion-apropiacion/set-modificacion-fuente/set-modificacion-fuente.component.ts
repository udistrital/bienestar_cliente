import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { TypeGeneral } from '../../../../@core/interfaces/TypeGeneralInterface';
import { ModFuenteData } from '../../../../@core/interfaces/modificationInterface';
import { ModFuenteHelper } from '../../../../@core/helpers/modificaciones/modFuenteHelper';
import { FuenteFinanciamientoInterface } from '../../../../@core/interfaces/fuenteFinanciamientoInterface';
import { FormManager } from '../../../../@core/managers/formManager';
import { CommonHelper } from '../../../../@core/helpers/commonHelper';
import { FuenteHelper } from '../../../../@core/helpers/fuentes/fuenteHelper';
import { PopUpManager } from '../../../../@core/managers/popUpManager';
import { ArbolRubroApropiacionInterface } from '../../../../@core/interfaces/arbolRubroApropiacionInterface';
import { ApropiacionHelper } from '../../../../@core/helpers/apropiaciones/apropiacionHelper';


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
  modDinamicValueForm: FormGroup;
  modTypes: Array<TypeGeneral>;
  movOrigen: FuenteFinanciamientoInterface;
  cuentaCredito: ArbolRubroApropiacionInterface;
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
  localtabActived: boolean;
  viewMovAuxActived: boolean;
  rubrosPlanAdquisicionFuente: any;
  rubrosAllPlanAdquisicionFuente: any;
  totalCurrentMov: any;
  constructor(private modHelper: ModFuenteHelper,
    private comnHelper: CommonHelper, private fuenteHelper: FuenteHelper,
    private popManager: PopUpManager, private formBuilder: FormBuilder,
    private apHelper: ApropiacionHelper) {
    this.viewItemSelected = true;
  }

  async ngOnInit() {
    await this.cleanData();
    this.buildFormRubros();
    this.movAfectation = [];
    this.modHelper.getModTypes().subscribe((res) => {

      this.modTypes = res.filter(str => str.Acronimo.match('fuente'));
    });
  }

  get f() { return this.modDinamicValueForm.controls; }
  get target() { return this.f.rubros_array as FormArray; }

  public getDataEvent(changeStep) {
    this.setStepValidationEvent.emit({
      afectation: this.movAfectation,
      balanced: this.limitSumFuentes, // si se necesita un booleano para este proceso se activa
      changeStep,
    });
  }
  public async cleanData() {
    this.selectedType = undefined;
    this.showResumenTab = false;
    this.showMovSelection = false;
    this.cuentaCredito = undefined;
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
      }
      this.modTypeSelected = selected;
      if (this.modTypeSelected) {
        if (selected.Parametros['MovOriginRubro']) {
          this.modValueForm = FormManager.addFormControl(this.modValueForm, {
            cuentaCredito: true,
          });
          this.modValueForm.controls['cuentaCredito'].disable();

        } else {
          this.modValueForm.removeControl('cuentaCredito');
          this.cuentaCredito = undefined;
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
    const withVigencia = $event.Vigencia !== 0 ? true : false;
    if (withVigencia) {

      switch (this.sourceTypeSelected) {
        case 'origen':
          this.movOrigen = $event;
          console.info(this.movOrigen.Codigo);
          this.modValueForm.controls['movimientoOrigen'].patchValue(`${this.movOrigen.Codigo} / ${this.movOrigen.Nombre}`);
          for (const key in this.movOrigen.Rubros) {
            const element = this.movOrigen.Rubros[key];
            if (element.Tipo === 'INGRESO') {
              this.apHelper.getFullArbolByNode(key, this.movOrigen.Vigencia).subscribe((response) => {
                if (response) {
                  this.cuentaCredito = response[0].data;
                  this.modValueForm.controls['cuentaCredito'].patchValue(`${this.cuentaCredito.Codigo} / ${this.cuentaCredito.Nombre}`);
                }
              })
            }
          }

        default:
          break;
      }
      this.showMovSelection = false;
    }
  }
  public async addModToList() {
    this.desfaseSaldo = 0;
    const modType = JSON.parse(JSON.stringify(this.modValueForm.value['modType']));

    modType['Parametros'] = modType['Parametros'] ? JSON.stringify(modType['Parametros']) : undefined;
    const currentMovData: ModFuenteData = {
      Tipo: modType,
      MovimientoOrigen: this.movOrigen,
      CuentaCredito: this.cuentaCredito,
      Valor: this.modValueForm.value['value']
    };

    if (currentMovData.MovimientoOrigen !== undefined) {
      this.fuenteHelper.getPlanAdquisicionByFuente(this.vigenciaActual.toString(), currentMovData.MovimientoOrigen.Codigo).subscribe((response) => {
        if (response.fuente_financiamiento) {

          let saldoFuente = this.calculateTotalValue(currentMovData, response.fuente_financiamiento.total_saldo_fuente);
          if (saldoFuente < currentMovData.Valor && currentMovData.Tipo.Acronimo === 'rd_fuente') {
            this.limitSumFuentes = false;
            this.infoSaldoSuperado = 'La fuente: ' + currentMovData.MovimientoOrigen.Nombre + ' se desfasa por un valor de: ';
            this.desfaseSaldo = currentMovData.Valor - saldoFuente;
          } else {
            this.limitSumFuentes = true;
            this.movAfectation.push(currentMovData);
            this.rubrosAllPlanAdquisicionFuente = response.fuente_financiamiento.rubros; //TODO: para cuando este definido el plan de adquisiciones
            this.rubrosPlanAdquisicionFuente = this.getUnique(response.fuente_financiamiento.rubros, 'rubro');
            this.totalCurrentMov = this.modValueForm.value['value'];
            this.returnToMovRubros();
            this.eventChange.emit(true);
          }
        } else {
          this.popManager.showErrorAlert("La fuente no esta distribuida");
        }
      });
    }
  }

  public async buildFormRubros() {
    this.modDinamicValueForm = this.formBuilder.group({
      numberOfRubro: ['', Validators.required],
      rubros_array: this.formBuilder.array([])
    });
  }
  public async addModRbToList(gasto) {
    console.info(gasto);
    const modType = JSON.parse(JSON.stringify(this.modValueForm.value['modType']));
    modType['Parametros'] = modType['Parametros'] ? JSON.stringify(modType['Parametros']) : undefined;
    const currentMovData: ModFuenteData = {
      Tipo: modType,
      CuentaCredito: gasto.objCuentaCredito ? gasto.objCuentaCredito : undefined,
      Valor: gasto.value
    };
    console.info(currentMovData);
    if (this.totalCurrentMov >= currentMovData.Valor) {
      this.movAfectation.push(currentMovData);
      this.totalCurrentMov -= currentMovData.Valor;
    }
    else {
      this.popManager.showErrorAlert("El valor del rubro supera el agregado para la fuente");
    }
  }

  //usado para limpiar array de datos repetidos por propiedad
  getUnique(arr, comp) {

    //store the comparison  values in array
    const unique = arr.map(e => e[comp]).
      // store the keys of the unique objects
      map((e, i, final) => final.indexOf(e) === i && i)
      // eliminate the dead keys & return unique objects
      .filter((e) => arr[e]).map(e => arr[e]);

    return unique

  }

  public async checkedGasto($event, item, index) {
    /*     this.modValueFormStruct.cuentaCredito = true;
        this.movimientoValidator = FormManager.BuildGroupForm(this.movimientoFormStruct);
        this.modValueForm = FormManager.BuildGroupForm(this.modValueFormStruct); */
    this.rubrosPlanAdquisicionFuente[index]['checked'] = $event;
    console.info(item);
    console.info(this.rubrosPlanAdquisicionFuente);
    if (item.checked) {
      this.apHelper.getFullArbolByNode(item.rubro, this.vigenciaActual).subscribe((response) => {
        if (response) {
          item.rubroData = response[0].data;
          this.target.push(this.formBuilder.group({
            objCuentaCredito: [item.rubroData,],
            cuentaCredito: [{ value: `${item.rubroData.Codigo} / ${item.rubroData.Nombre}`, disabled: true }, Validators.required],
            value: ['', Validators.required],
            valorActual: [{ value: `${item.rubroData.ValorActual}`, disabled: true },]
          }));
        }
      })
    } else {
      this.target.removeAt(index);
    }
  }

  calculateTotalValue(movData, totalPlanAdquisiciones) {
    let totalValue
    switch (movData.Tipo.Acronimo) {
      case 'ad_fuente':
        totalValue = movData.MovimientoOrigen.ValorActual - totalPlanAdquisiciones + movData.Valor;
        break;
      case 'rd_fuente':
        totalValue = movData.MovimientoOrigen.ValorActual - totalPlanAdquisiciones - movData.Valor;
        break;
      default:
        break;
    }
    return totalValue;

  }

  returnToAdd() {
    this.localtabActived = false;
    this.cleanData();
  }

  returnToResume() {
    this.localtabActived = true;
  }

  returnToMovRubros() {
    this.localtabActived = true;
    this.viewMovAuxActived = true;
  }
}
