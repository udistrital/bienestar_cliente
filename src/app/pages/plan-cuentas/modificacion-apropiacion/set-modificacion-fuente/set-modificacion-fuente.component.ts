import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TypeGeneral } from '../../../../@core/interfaces/TypeGeneralInterface';
import { ModFuenteData } from '../../../../@core/interfaces/modificationInterface';
import { ModFuenteHelper } from '../../../../@core/helpers/modificaciones/modFuenteHelper';

@Component({
  selector: 'ngx-set-modificacion-fuente',
  templateUrl: './set-modificacion-fuente.component.html',
  styleUrls: ['./set-modificacion-fuente.component.scss']
})
export class SetModificacionFuenteComponent implements OnInit {
  @Input() movAfectation: Array<ModFuenteData>;
  @Output() setStepValidationEvent: EventEmitter<any> = new EventEmitter();
  modValueForm: FormGroup;
  modTypes: Array<TypeGeneral>;
  selectedType: any;
  constructor(private modHelper: ModFuenteHelper) { }

  async ngOnInit() {
     await this.cleanData();
    this.movAfectation = [];
    this.modHelper.getModTypes().subscribe((res) => {
        this.modTypes = res;
    });
  }

  public getDataEvent(changeStep) {
    this.setStepValidationEvent.emit({
      afectation: this.movAfectation,
      // balanced: this.balanceado, si se necesita un booleano para este proceso se activa
      changeStep,
    });
  }
  public async cleanData(){
    this.selectedType = undefined;
  }
}
