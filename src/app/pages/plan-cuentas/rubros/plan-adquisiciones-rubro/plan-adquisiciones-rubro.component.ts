import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ApropiacionHelper } from '../../../../@core/helpers/apropiaciones/apropiacionHelper';
import { PopUpManager } from '../../../../@core/managers/popUpManager';


@Component({
  selector: 'ngx-plan-adquisiciones-rubro',
  templateUrl: './plan-adquisiciones-rubro.component.html',
  styleUrls: ['./plan-adquisiciones-rubro.component.scss'],
})
export class PlanAdquisicionesRubroComponent implements OnInit {
  ngOnInit() {

  }
}