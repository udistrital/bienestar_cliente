import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HistoriaClinica } from '../../../../../shared/models/Salud/historiaClinica.model';
import { HojaHistoria } from '../../../../../shared/models/Salud/hojaHistoria.model';
import { Odontograma } from '../../../../../shared/models/Salud/odontograma';
import { TipoOdontograma } from '../../../../../shared/models/Salud/tipoOdontograma';
import { EstudiantesService } from '../../../../../shared/services/estudiantes.service';
import { SaludService } from '../../../../../shared/services/salud.service';

@Component({
  selector: 'ngx-odontograma-linguales',
  templateUrl: './odontograma-linguales.component.html',
  styleUrls: ['../../odontograma.css']
})
export class OdontogramaLingualesComponent implements OnInit {
  @Output('odontograma') odontogramaOutput = new EventEmitter<any>();
  paciente: string;
  terceroId: any;
  Historia: HistoriaClinica;
  HojaHistoria: HojaHistoria;
  odontograma: Odontograma;
  tipoOdontograma: TipoOdontograma;
  odontogramaForm: FormGroup = this.fb.group({
    observaciones: [null],
  });
  color: number = 1;
  dientesArriba1: any[] = [
    { diente: 0, dienteLabel: 18, classArriba: 'diente', classIzquierda: 'diente', classDerecha: 'diente', classCentro: 'diente', classAbajo: 'diente', ausente: 'invisible', rotado: 'invisible', retenido: 'invisible', coronaDestruida: 'invisible', fracturado: 'invisible', erupcionado: 'invisible', sellanteDesadaptado: 'invisible', sano: 'invisible', corona: 'invisible', endodoncia: 'invisible', implante: 'invisible', endodonciaIndicada: 'invisible', coronaDesadaptada: 'invisible', exodonciaIndicada: 'invisible', sellante: 'invisible' },
    { diente: 1, dienteLabel: 17, classArriba: 'diente', classIzquierda: 'diente', classDerecha: 'diente', classCentro: 'diente', classAbajo: 'diente', ausente: 'invisible', rotado: 'invisible', retenido: 'invisible', coronaDestruida: 'invisible', fracturado: 'invisible', erupcionado: 'invisible', sellanteDesadaptado: 'invisible', sano: 'invisible', corona: 'invisible', endodoncia: 'invisible', implante: 'invisible', endodonciaIndicada: 'invisible', coronaDesadaptada: 'invisible', exodonciaIndicada: 'invisible', sellante: 'invisible' },
    { diente: 2, dienteLabel: 16, classArriba: 'diente', classIzquierda: 'diente', classDerecha: 'diente', classCentro: 'diente', classAbajo: 'diente', ausente: 'invisible', rotado: 'invisible', retenido: 'invisible', coronaDestruida: 'invisible', fracturado: 'invisible', erupcionado: 'invisible', sellanteDesadaptado: 'invisible', sano: 'invisible', corona: 'invisible', endodoncia: 'invisible', implante: 'invisible', endodonciaIndicada: 'invisible', coronaDesadaptada: 'invisible', exodonciaIndicada: 'invisible', sellante: 'invisible' },
    { diente: 3, dienteLabel: 15, classArriba: 'diente', classIzquierda: 'diente', classDerecha: 'diente', classCentro: 'diente', classAbajo: 'diente', ausente: 'invisible', rotado: 'invisible', retenido: 'invisible', coronaDestruida: 'invisible', fracturado: 'invisible', erupcionado: 'invisible', sellanteDesadaptado: 'invisible', sano: 'invisible', corona: 'invisible', endodoncia: 'invisible', implante: 'invisible', endodonciaIndicada: 'invisible', coronaDesadaptada: 'invisible', exodonciaIndicada: 'invisible', sellante: 'invisible' },
    { diente: 4, dienteLabel: 14, classArriba: 'diente', classIzquierda: 'diente', classDerecha: 'diente', classCentro: 'diente', classAbajo: 'diente', ausente: 'invisible', rotado: 'invisible', retenido: 'invisible', coronaDestruida: 'invisible', fracturado: 'invisible', erupcionado: 'invisible', sellanteDesadaptado: 'invisible', sano: 'invisible', corona: 'invisible', endodoncia: 'invisible', implante: 'invisible', endodonciaIndicada: 'invisible', coronaDesadaptada: 'invisible', exodonciaIndicada: 'invisible', sellante: 'invisible' },
    { diente: 5, dienteLabel: 13, classArriba: 'diente', classIzquierda: 'diente', classDerecha: 'diente', classCentro: 'diente', classAbajo: 'diente', ausente: 'invisible', rotado: 'invisible', retenido: 'invisible', coronaDestruida: 'invisible', fracturado: 'invisible', erupcionado: 'invisible', sellanteDesadaptado: 'invisible', sano: 'invisible', corona: 'invisible', endodoncia: 'invisible', implante: 'invisible', endodonciaIndicada: 'invisible', coronaDesadaptada: 'invisible', exodonciaIndicada: 'invisible', sellante: 'invisible' },
    { diente: 6, dienteLabel: 12, classArriba: 'diente', classIzquierda: 'diente', classDerecha: 'diente', classCentro: 'diente', classAbajo: 'diente', ausente: 'invisible', rotado: 'invisible', retenido: 'invisible', coronaDestruida: 'invisible', fracturado: 'invisible', erupcionado: 'invisible', sellanteDesadaptado: 'invisible', sano: 'invisible', corona: 'invisible', endodoncia: 'invisible', implante: 'invisible', endodonciaIndicada: 'invisible', coronaDesadaptada: 'invisible', exodonciaIndicada: 'invisible', sellante: 'invisible' },
    { diente: 7, dienteLabel: 11, classArriba: 'diente', classIzquierda: 'diente', classDerecha: 'diente', classCentro: 'diente', classAbajo: 'diente', ausente: 'invisible', rotado: 'invisible', retenido: 'invisible', coronaDestruida: 'invisible', fracturado: 'invisible', erupcionado: 'invisible', sellanteDesadaptado: 'invisible', sano: 'invisible', corona: 'invisible', endodoncia: 'invisible', implante: 'invisible', endodonciaIndicada: 'invisible', coronaDesadaptada: 'invisible', exodonciaIndicada: 'invisible', sellante: 'invisible' },
    { diente: 8, dienteLabel: 21, classArriba: 'diente', classIzquierda: 'diente', classDerecha: 'diente', classCentro: 'diente', classAbajo: 'diente', ausente: 'invisible', rotado: 'invisible', retenido: 'invisible', coronaDestruida: 'invisible', fracturado: 'invisible', erupcionado: 'invisible', sellanteDesadaptado: 'invisible', sano: 'invisible', corona: 'invisible', endodoncia: 'invisible', implante: 'invisible', endodonciaIndicada: 'invisible', coronaDesadaptada: 'invisible', exodonciaIndicada: 'invisible', sellante: 'invisible' },
    { diente: 9, dienteLabel: 22, classArriba: 'diente', classIzquierda: 'diente', classDerecha: 'diente', classCentro: 'diente', classAbajo: 'diente', ausente: 'invisible', rotado: 'invisible', retenido: 'invisible', coronaDestruida: 'invisible', fracturado: 'invisible', erupcionado: 'invisible', sellanteDesadaptado: 'invisible', sano: 'invisible', corona: 'invisible', endodoncia: 'invisible', implante: 'invisible', endodonciaIndicada: 'invisible', coronaDesadaptada: 'invisible', exodonciaIndicada: 'invisible', sellante: 'invisible' },
    { diente: 10, dienteLabel: 23, classArriba: 'diente', classIzquierda: 'diente', classDerecha: 'diente', classCentro: 'diente', classAbajo: 'diente', ausente: 'invisible', rotado: 'invisible', retenido: 'invisible', coronaDestruida: 'invisible', fracturado: 'invisible', erupcionado: 'invisible', sellanteDesadaptado: 'invisible', sano: 'invisible', corona: 'invisible', endodoncia: 'invisible', implante: 'invisible', endodonciaIndicada: 'invisible', coronaDesadaptada: 'invisible', exodonciaIndicada: 'invisible', sellante: 'invisible' },
    { diente: 11, dienteLabel: 24, classArriba: 'diente', classIzquierda: 'diente', classDerecha: 'diente', classCentro: 'diente', classAbajo: 'diente', ausente: 'invisible', rotado: 'invisible', retenido: 'invisible', coronaDestruida: 'invisible', fracturado: 'invisible', erupcionado: 'invisible', sellanteDesadaptado: 'invisible', sano: 'invisible', corona: 'invisible', endodoncia: 'invisible', implante: 'invisible', endodonciaIndicada: 'invisible', coronaDesadaptada: 'invisible', exodonciaIndicada: 'invisible', sellante: 'invisible' },
    { diente: 12, dienteLabel: 25, classArriba: 'diente', classIzquierda: 'diente', classDerecha: 'diente', classCentro: 'diente', classAbajo: 'diente', ausente: 'invisible', rotado: 'invisible', retenido: 'invisible', coronaDestruida: 'invisible', fracturado: 'invisible', erupcionado: 'invisible', sellanteDesadaptado: 'invisible', sano: 'invisible', corona: 'invisible', endodoncia: 'invisible', implante: 'invisible', endodonciaIndicada: 'invisible', coronaDesadaptada: 'invisible', exodonciaIndicada: 'invisible', sellante: 'invisible' },
    { diente: 13, dienteLabel: 26, classArriba: 'diente', classIzquierda: 'diente', classDerecha: 'diente', classCentro: 'diente', classAbajo: 'diente', ausente: 'invisible', rotado: 'invisible', retenido: 'invisible', coronaDestruida: 'invisible', fracturado: 'invisible', erupcionado: 'invisible', sellanteDesadaptado: 'invisible', sano: 'invisible', corona: 'invisible', endodoncia: 'invisible', implante: 'invisible', endodonciaIndicada: 'invisible', coronaDesadaptada: 'invisible', exodonciaIndicada: 'invisible', sellante: 'invisible' },
    { diente: 14, dienteLabel: 27, classArriba: 'diente', classIzquierda: 'diente', classDerecha: 'diente', classCentro: 'diente', classAbajo: 'diente', ausente: 'invisible', rotado: 'invisible', retenido: 'invisible', coronaDestruida: 'invisible', fracturado: 'invisible', erupcionado: 'invisible', sellanteDesadaptado: 'invisible', sano: 'invisible', corona: 'invisible', endodoncia: 'invisible', implante: 'invisible', endodonciaIndicada: 'invisible', coronaDesadaptada: 'invisible', exodonciaIndicada: 'invisible', sellante: 'invisible' },
    { diente: 15, dienteLabel: 28, classArriba: 'diente', classIzquierda: 'diente', classDerecha: 'diente', classCentro: 'diente', classAbajo: 'diente', ausente: 'invisible', rotado: 'invisible', retenido: 'invisible', coronaDestruida: 'invisible', fracturado: 'invisible', erupcionado: 'invisible', sellanteDesadaptado: 'invisible', sano: 'invisible', corona: 'invisible', endodoncia: 'invisible', implante: 'invisible', endodonciaIndicada: 'invisible', coronaDesadaptada: 'invisible', exodonciaIndicada: 'invisible', sellante: 'invisible'},
  ];
  dientesAbajo1: any[] = [
    { diente: 0, dienteLabel: 55, classArriba: 'diente', classIzquierda: 'diente', classDerecha: 'diente', classCentro: 'diente', classAbajo: 'diente', ausente: 'invisible', rotado: 'invisible', retenido: 'invisible', coronaDestruida: 'invisible', fracturado: 'invisible', erupcionado: 'invisible', sellanteDesadaptado: 'invisible', sano: 'invisible', corona: 'invisible', endodoncia: 'invisible', implante: 'invisible', endodonciaIndicada: 'invisible', coronaDesadaptada: 'invisible', exodonciaIndicada: 'invisible', sellante: 'invisible' },
    { diente: 1, dienteLabel: 54, classArriba: 'diente', classIzquierda: 'diente', classDerecha: 'diente', classCentro: 'diente', classAbajo: 'diente', ausente: 'invisible', rotado: 'invisible', retenido: 'invisible', coronaDestruida: 'invisible', fracturado: 'invisible', erupcionado: 'invisible', sellanteDesadaptado: 'invisible', sano: 'invisible', corona: 'invisible', endodoncia: 'invisible', implante: 'invisible', endodonciaIndicada: 'invisible', coronaDesadaptada: 'invisible', exodonciaIndicada: 'invisible', sellante: 'invisible' },
    { diente: 2, dienteLabel: 53, classArriba: 'diente', classIzquierda: 'diente', classDerecha: 'diente', classCentro: 'diente', classAbajo: 'diente', ausente: 'invisible', rotado: 'invisible', retenido: 'invisible', coronaDestruida: 'invisible', fracturado: 'invisible', erupcionado: 'invisible', sellanteDesadaptado: 'invisible', sano: 'invisible', corona: 'invisible', endodoncia: 'invisible', implante: 'invisible', endodonciaIndicada: 'invisible', coronaDesadaptada: 'invisible', exodonciaIndicada: 'invisible', sellante: 'invisible' },
    { diente: 3, dienteLabel: 52, classArriba: 'diente', classIzquierda: 'diente', classDerecha: 'diente', classCentro: 'diente', classAbajo: 'diente', ausente: 'invisible', rotado: 'invisible', retenido: 'invisible', coronaDestruida: 'invisible', fracturado: 'invisible', erupcionado: 'invisible', sellanteDesadaptado: 'invisible', sano: 'invisible', corona: 'invisible', endodoncia: 'invisible', implante: 'invisible', endodonciaIndicada: 'invisible', coronaDesadaptada: 'invisible', exodonciaIndicada: 'invisible', sellante: 'invisible' },
    { diente: 4, dienteLabel: 51, classArriba: 'diente', classIzquierda: 'diente', classDerecha: 'diente', classCentro: 'diente', classAbajo: 'diente', ausente: 'invisible', rotado: 'invisible', retenido: 'invisible', coronaDestruida: 'invisible', fracturado: 'invisible', erupcionado: 'invisible', sellanteDesadaptado: 'invisible', sano: 'invisible', corona: 'invisible', endodoncia: 'invisible', implante: 'invisible', endodonciaIndicada: 'invisible', coronaDesadaptada: 'invisible', exodonciaIndicada: 'invisible', sellante: 'invisible' },
    { diente: 5, dienteLabel: 61, classArriba: 'diente', classIzquierda: 'diente', classDerecha: 'diente', classCentro: 'diente', classAbajo: 'diente', ausente: 'invisible', rotado: 'invisible', retenido: 'invisible', coronaDestruida: 'invisible', fracturado: 'invisible', erupcionado: 'invisible', sellanteDesadaptado: 'invisible', sano: 'invisible', corona: 'invisible', endodoncia: 'invisible', implante: 'invisible', endodonciaIndicada: 'invisible', coronaDesadaptada: 'invisible', exodonciaIndicada: 'invisible', sellante: 'invisible' },
    { diente: 6, dienteLabel: 62, classArriba: 'diente', classIzquierda: 'diente', classDerecha: 'diente', classCentro: 'diente', classAbajo: 'diente', ausente: 'invisible', rotado: 'invisible', retenido: 'invisible', coronaDestruida: 'invisible', fracturado: 'invisible', erupcionado: 'invisible', sellanteDesadaptado: 'invisible', sano: 'invisible', corona: 'invisible', endodoncia: 'invisible', implante: 'invisible', endodonciaIndicada: 'invisible', coronaDesadaptada: 'invisible', exodonciaIndicada: 'invisible', sellante: 'invisible' },
    { diente: 7, dienteLabel: 63, classArriba: 'diente', classIzquierda: 'diente', classDerecha: 'diente', classCentro: 'diente', classAbajo: 'diente', ausente: 'invisible', rotado: 'invisible', retenido: 'invisible', coronaDestruida: 'invisible', fracturado: 'invisible', erupcionado: 'invisible', sellanteDesadaptado: 'invisible', sano: 'invisible', corona: 'invisible', endodoncia: 'invisible', implante: 'invisible', endodonciaIndicada: 'invisible', coronaDesadaptada: 'invisible', exodonciaIndicada: 'invisible', sellante: 'invisible' },
    { diente: 8, dienteLabel: 64, classArriba: 'diente', classIzquierda: 'diente', classDerecha: 'diente', classCentro: 'diente', classAbajo: 'diente', ausente: 'invisible', rotado: 'invisible', retenido: 'invisible', coronaDestruida: 'invisible', fracturado: 'invisible', erupcionado: 'invisible', sellanteDesadaptado: 'invisible', sano: 'invisible', corona: 'invisible', endodoncia: 'invisible', implante: 'invisible', endodonciaIndicada: 'invisible', coronaDesadaptada: 'invisible', exodonciaIndicada: 'invisible', sellante: 'invisible' },
    { diente: 9, dienteLabel: 65, classArriba: 'diente', classIzquierda: 'diente', classDerecha: 'diente', classCentro: 'diente', classAbajo: 'diente', ausente: 'invisible', rotado: 'invisible', retenido: 'invisible', coronaDestruida: 'invisible', fracturado: 'invisible', erupcionado: 'invisible', sellanteDesadaptado: 'invisible', sano: 'invisible', corona: 'invisible', endodoncia: 'invisible', implante: 'invisible', endodonciaIndicada: 'invisible', coronaDesadaptada: 'invisible', exodonciaIndicada: 'invisible', sellante: 'invisible' },
  ];
  defaultArriba1 = this.dientesArriba1;
  defaultAbajo1 = this.dientesAbajo1;

  dientesArriba: any[] = [
    { diente: 0, dienteLabel: 85, classArriba: 'diente', classIzquierda: 'diente', classDerecha: 'diente', classCentro: 'diente', classAbajo: 'diente', ausente: 'invisible', rotado: 'invisible', retenido: 'invisible', coronaDestruida: 'invisible', fracturado: 'invisible', erupcionado: 'invisible', sellanteDesadaptado: 'invisible', sano: 'invisible', corona: 'invisible', endodoncia: 'invisible', implante: 'invisible', endodonciaIndicada: 'invisible', coronaDesadaptada: 'invisible', exodonciaIndicada: 'invisible', sellante: 'invisible' },
    { diente: 1, dienteLabel: 84, classArriba: 'diente', classIzquierda: 'diente', classDerecha: 'diente', classCentro: 'diente', classAbajo: 'diente', ausente: 'invisible', rotado: 'invisible', retenido: 'invisible', coronaDestruida: 'invisible', fracturado: 'invisible', erupcionado: 'invisible', sellanteDesadaptado: 'invisible', sano: 'invisible', corona: 'invisible', endodoncia: 'invisible', implante: 'invisible', endodonciaIndicada: 'invisible', coronaDesadaptada: 'invisible', exodonciaIndicada: 'invisible', sellante: 'invisible' },
    { diente: 2, dienteLabel: 83, classArriba: 'diente', classIzquierda: 'diente', classDerecha: 'diente', classCentro: 'diente', classAbajo: 'diente', ausente: 'invisible', rotado: 'invisible', retenido: 'invisible', coronaDestruida: 'invisible', fracturado: 'invisible', erupcionado: 'invisible', sellanteDesadaptado: 'invisible', sano: 'invisible', corona: 'invisible', endodoncia: 'invisible', implante: 'invisible', endodonciaIndicada: 'invisible', coronaDesadaptada: 'invisible', exodonciaIndicada: 'invisible', sellante: 'invisible' },
    { diente: 3, dienteLabel: 82, classArriba: 'diente', classIzquierda: 'diente', classDerecha: 'diente', classCentro: 'diente', classAbajo: 'diente', ausente: 'invisible', rotado: 'invisible', retenido: 'invisible', coronaDestruida: 'invisible', fracturado: 'invisible', erupcionado: 'invisible', sellanteDesadaptado: 'invisible', sano: 'invisible', corona: 'invisible', endodoncia: 'invisible', implante: 'invisible', endodonciaIndicada: 'invisible', coronaDesadaptada: 'invisible', exodonciaIndicada: 'invisible', sellante: 'invisible' },
    { diente: 4, dienteLabel: 81, classArriba: 'diente', classIzquierda: 'diente', classDerecha: 'diente', classCentro: 'diente', classAbajo: 'diente', ausente: 'invisible', rotado: 'invisible', retenido: 'invisible', coronaDestruida: 'invisible', fracturado: 'invisible', erupcionado: 'invisible', sellanteDesadaptado: 'invisible', sano: 'invisible', corona: 'invisible', endodoncia: 'invisible', implante: 'invisible', endodonciaIndicada: 'invisible', coronaDesadaptada: 'invisible', exodonciaIndicada: 'invisible', sellante: 'invisible' },
    { diente: 5, dienteLabel: 71, classArriba: 'diente', classIzquierda: 'diente', classDerecha: 'diente', classCentro: 'diente', classAbajo: 'diente', ausente: 'invisible', rotado: 'invisible', retenido: 'invisible', coronaDestruida: 'invisible', fracturado: 'invisible', erupcionado: 'invisible', sellanteDesadaptado: 'invisible', sano: 'invisible', corona: 'invisible', endodoncia: 'invisible', implante: 'invisible', endodonciaIndicada: 'invisible', coronaDesadaptada: 'invisible', exodonciaIndicada: 'invisible', sellante: 'invisible' },
    { diente: 6, dienteLabel: 72, classArriba: 'diente', classIzquierda: 'diente', classDerecha: 'diente', classCentro: 'diente', classAbajo: 'diente', ausente: 'invisible', rotado: 'invisible', retenido: 'invisible', coronaDestruida: 'invisible', fracturado: 'invisible', erupcionado: 'invisible', sellanteDesadaptado: 'invisible', sano: 'invisible', corona: 'invisible', endodoncia: 'invisible', implante: 'invisible', endodonciaIndicada: 'invisible', coronaDesadaptada: 'invisible', exodonciaIndicada: 'invisible', sellante: 'invisible' },
    { diente: 7, dienteLabel: 73, classArriba: 'diente', classIzquierda: 'diente', classDerecha: 'diente', classCentro: 'diente', classAbajo: 'diente', ausente: 'invisible', rotado: 'invisible', retenido: 'invisible', coronaDestruida: 'invisible', fracturado: 'invisible', erupcionado: 'invisible', sellanteDesadaptado: 'invisible', sano: 'invisible', corona: 'invisible', endodoncia: 'invisible', implante: 'invisible', endodonciaIndicada: 'invisible', coronaDesadaptada: 'invisible', exodonciaIndicada: 'invisible', sellante: 'invisible' },
    { diente: 8, dienteLabel: 74, classArriba: 'diente', classIzquierda: 'diente', classDerecha: 'diente', classCentro: 'diente', classAbajo: 'diente', ausente: 'invisible', rotado: 'invisible', retenido: 'invisible', coronaDestruida: 'invisible', fracturado: 'invisible', erupcionado: 'invisible', sellanteDesadaptado: 'invisible', sano: 'invisible', corona: 'invisible', endodoncia: 'invisible', implante: 'invisible', endodonciaIndicada: 'invisible', coronaDesadaptada: 'invisible', exodonciaIndicada: 'invisible', sellante: 'invisible' },
    { diente: 9, dienteLabel: 75, classArriba: 'diente', classIzquierda: 'diente', classDerecha: 'diente', classCentro: 'diente', classAbajo: 'diente', ausente: 'invisible', rotado: 'invisible', retenido: 'invisible', coronaDestruida: 'invisible', fracturado: 'invisible', erupcionado: 'invisible', sellanteDesadaptado: 'invisible', sano: 'invisible', corona: 'invisible', endodoncia: 'invisible', implante: 'invisible', endodonciaIndicada: 'invisible', coronaDesadaptada: 'invisible', exodonciaIndicada: 'invisible', sellante: 'invisible' },
  ];
  dientesAbajo: any[] = [
    { diente: 0, dienteLabel: 48, classArriba: 'diente', classIzquierda: 'diente', classDerecha: 'diente', classCentro: 'diente', classAbajo: 'diente', ausente: 'invisible', rotado: 'invisible', retenido: 'invisible', coronaDestruida: 'invisible', fracturado: 'invisible', erupcionado: 'invisible', sellanteDesadaptado: 'invisible', sano: 'invisible', corona: 'invisible', endodoncia: 'invisible', implante: 'invisible', endodonciaIndicada: 'invisible', coronaDesadaptada: 'invisible', exodonciaIndicada: 'invisible', sellante: 'invisible' },
    { diente: 1, dienteLabel: 47, classArriba: 'diente', classIzquierda: 'diente', classDerecha: 'diente', classCentro: 'diente', classAbajo: 'diente', ausente: 'invisible', rotado: 'invisible', retenido: 'invisible', coronaDestruida: 'invisible', fracturado: 'invisible', erupcionado: 'invisible', sellanteDesadaptado: 'invisible', sano: 'invisible', corona: 'invisible', endodoncia: 'invisible', implante: 'invisible', endodonciaIndicada: 'invisible', coronaDesadaptada: 'invisible', exodonciaIndicada: 'invisible', sellante: 'invisible' },
    { diente: 2, dienteLabel: 46, classArriba: 'diente', classIzquierda: 'diente', classDerecha: 'diente', classCentro: 'diente', classAbajo: 'diente', ausente: 'invisible', rotado: 'invisible', retenido: 'invisible', coronaDestruida: 'invisible', fracturado: 'invisible', erupcionado: 'invisible', sellanteDesadaptado: 'invisible', sano: 'invisible', corona: 'invisible', endodoncia: 'invisible', implante: 'invisible', endodonciaIndicada: 'invisible', coronaDesadaptada: 'invisible', exodonciaIndicada: 'invisible', sellante: 'invisible' },
    { diente: 3, dienteLabel: 45, classArriba: 'diente', classIzquierda: 'diente', classDerecha: 'diente', classCentro: 'diente', classAbajo: 'diente', ausente: 'invisible', rotado: 'invisible', retenido: 'invisible', coronaDestruida: 'invisible', fracturado: 'invisible', erupcionado: 'invisible', sellanteDesadaptado: 'invisible', sano: 'invisible', corona: 'invisible', endodoncia: 'invisible', implante: 'invisible', endodonciaIndicada: 'invisible', coronaDesadaptada: 'invisible', exodonciaIndicada: 'invisible', sellante: 'invisible' },
    { diente: 4, dienteLabel: 44, classArriba: 'diente', classIzquierda: 'diente', classDerecha: 'diente', classCentro: 'diente', classAbajo: 'diente', ausente: 'invisible', rotado: 'invisible', retenido: 'invisible', coronaDestruida: 'invisible', fracturado: 'invisible', erupcionado: 'invisible', sellanteDesadaptado: 'invisible', sano: 'invisible', corona: 'invisible', endodoncia: 'invisible', implante: 'invisible', endodonciaIndicada: 'invisible', coronaDesadaptada: 'invisible', exodonciaIndicada: 'invisible', sellante: 'invisible' },
    { diente: 5, dienteLabel: 43, classArriba: 'diente', classIzquierda: 'diente', classDerecha: 'diente', classCentro: 'diente', classAbajo: 'diente', ausente: 'invisible', rotado: 'invisible', retenido: 'invisible', coronaDestruida: 'invisible', fracturado: 'invisible', erupcionado: 'invisible', sellanteDesadaptado: 'invisible', sano: 'invisible', corona: 'invisible', endodoncia: 'invisible', implante: 'invisible', endodonciaIndicada: 'invisible', coronaDesadaptada: 'invisible', exodonciaIndicada: 'invisible', sellante: 'invisible' },
    { diente: 6, dienteLabel: 42, classArriba: 'diente', classIzquierda: 'diente', classDerecha: 'diente', classCentro: 'diente', classAbajo: 'diente', ausente: 'invisible', rotado: 'invisible', retenido: 'invisible', coronaDestruida: 'invisible', fracturado: 'invisible', erupcionado: 'invisible', sellanteDesadaptado: 'invisible', sano: 'invisible', corona: 'invisible', endodoncia: 'invisible', implante: 'invisible', endodonciaIndicada: 'invisible', coronaDesadaptada: 'invisible', exodonciaIndicada: 'invisible', sellante: 'invisible' },
    { diente: 7, dienteLabel: 41, classArriba: 'diente', classIzquierda: 'diente', classDerecha: 'diente', classCentro: 'diente', classAbajo: 'diente', ausente: 'invisible', rotado: 'invisible', retenido: 'invisible', coronaDestruida: 'invisible', fracturado: 'invisible', erupcionado: 'invisible', sellanteDesadaptado: 'invisible', sano: 'invisible', corona: 'invisible', endodoncia: 'invisible', implante: 'invisible', endodonciaIndicada: 'invisible', coronaDesadaptada: 'invisible', exodonciaIndicada: 'invisible', sellante: 'invisible' },
    { diente: 8, dienteLabel: 31, classArriba: 'diente', classIzquierda: 'diente', classDerecha: 'diente', classCentro: 'diente', classAbajo: 'diente', ausente: 'invisible', rotado: 'invisible', retenido: 'invisible', coronaDestruida: 'invisible', fracturado: 'invisible', erupcionado: 'invisible', sellanteDesadaptado: 'invisible', sano: 'invisible', corona: 'invisible', endodoncia: 'invisible', implante: 'invisible', endodonciaIndicada: 'invisible', coronaDesadaptada: 'invisible', exodonciaIndicada: 'invisible', sellante: 'invisible' },
    { diente: 9, dienteLabel: 32, classArriba: 'diente', classIzquierda: 'diente', classDerecha: 'diente', classCentro: 'diente', classAbajo: 'diente', ausente: 'invisible', rotado: 'invisible', retenido: 'invisible', coronaDestruida: 'invisible', fracturado: 'invisible', erupcionado: 'invisible', sellanteDesadaptado: 'invisible', sano: 'invisible', corona: 'invisible', endodoncia: 'invisible', implante: 'invisible', endodonciaIndicada: 'invisible', coronaDesadaptada: 'invisible', exodonciaIndicada: 'invisible', sellante: 'invisible' },
    { diente: 10, dienteLabel: 33, classArriba: 'diente', classIzquierda: 'diente', classDerecha: 'diente', classCentro: 'diente', classAbajo: 'diente', ausente: 'invisible', rotado: 'invisible', retenido: 'invisible', coronaDestruida: 'invisible', fracturado: 'invisible', erupcionado: 'invisible', sellanteDesadaptado: 'invisible', sano: 'invisible', corona: 'invisible', endodoncia: 'invisible', implante: 'invisible', endodonciaIndicada: 'invisible', coronaDesadaptada: 'invisible', exodonciaIndicada: 'invisible', sellante: 'invisible' },
    { diente: 11, dienteLabel: 34, classArriba: 'diente', classIzquierda: 'diente', classDerecha: 'diente', classCentro: 'diente', classAbajo: 'diente', ausente: 'invisible', rotado: 'invisible', retenido: 'invisible', coronaDestruida: 'invisible', fracturado: 'invisible', erupcionado: 'invisible', sellanteDesadaptado: 'invisible', sano: 'invisible', corona: 'invisible', endodoncia: 'invisible', implante: 'invisible', endodonciaIndicada: 'invisible', coronaDesadaptada: 'invisible', exodonciaIndicada: 'invisible', sellante: 'invisible' },
    { diente: 12, dienteLabel: 35, classArriba: 'diente', classIzquierda: 'diente', classDerecha: 'diente', classCentro: 'diente', classAbajo: 'diente', ausente: 'invisible', rotado: 'invisible', retenido: 'invisible', coronaDestruida: 'invisible', fracturado: 'invisible', erupcionado: 'invisible', sellanteDesadaptado: 'invisible', sano: 'invisible', corona: 'invisible', endodoncia: 'invisible', implante: 'invisible', endodonciaIndicada: 'invisible', coronaDesadaptada: 'invisible', exodonciaIndicada: 'invisible', sellante: 'invisible' },
    { diente: 13, dienteLabel: 36, classArriba: 'diente', classIzquierda: 'diente', classDerecha: 'diente', classCentro: 'diente', classAbajo: 'diente', ausente: 'invisible', rotado: 'invisible', retenido: 'invisible', coronaDestruida: 'invisible', fracturado: 'invisible', erupcionado: 'invisible', sellanteDesadaptado: 'invisible', sano: 'invisible', corona: 'invisible', endodoncia: 'invisible', implante: 'invisible', endodonciaIndicada: 'invisible', coronaDesadaptada: 'invisible', exodonciaIndicada: 'invisible', sellante: 'invisible' },
    { diente: 14, dienteLabel: 37, classArriba: 'diente', classIzquierda: 'diente', classDerecha: 'diente', classCentro: 'diente', classAbajo: 'diente', ausente: 'invisible', rotado: 'invisible', retenido: 'invisible', coronaDestruida: 'invisible', fracturado: 'invisible', erupcionado: 'invisible', sellanteDesadaptado: 'invisible', sano: 'invisible', corona: 'invisible', endodoncia: 'invisible', implante: 'invisible', endodonciaIndicada: 'invisible', coronaDesadaptada: 'invisible', exodonciaIndicada: 'invisible', sellante: 'invisible' },
    { diente: 15, dienteLabel: 38, classArriba: 'diente', classIzquierda: 'diente', classDerecha: 'diente', classCentro: 'diente', classAbajo: 'diente', ausente: 'invisible', rotado: 'invisible', retenido: 'invisible', coronaDestruida: 'invisible', fracturado: 'invisible', erupcionado: 'invisible', sellanteDesadaptado: 'invisible', sano: 'invisible', corona: 'invisible', endodoncia: 'invisible', implante: 'invisible', endodonciaIndicada: 'invisible', coronaDesadaptada: 'invisible', exodonciaIndicada: 'invisible', sellante: 'invisible' },
  ];
  defaultArriba = this.dientesArriba;
  defaultAbajo = this.dientesAbajo;
  
  convencionesPrimero: any[] = [
    { nombre: 'Sin Clasificar', color: 'Lavender', estado: 1, borde: 'none' },
    { nombre: 'Sano (✓)', color: '#709f51', estado: 16, borde: 'none' },
    { nombre: 'Implante (│)', color: '#CC66CC', estado: 2, borde: 'none' },
    { nombre: 'Ausente (▬)', color: 'black', estado: 3, borde: 'none' },
    { nombre: 'Resina', color: '#709f51', estado: 4, borde: 'none' },
    { nombre: 'Resina Desadaptada', color: '#709f51', estado: 6, borde: 'red' },
    { nombre: 'Caries', color: 'red', estado: 5, borde: 'none' },
  ];
  convencionesSegundo: any[] = [
    { nombre: 'Corona Existente (O)', color: '#5b9bd5', estado: 7, borde: 'none' },
    { nombre: 'Corona Desadaptada (O)', color: '#5b9bd5', estado: 19, borde: 'red' },
    { nombre: 'Corona Indicada (■)', color: 'white', estado: 15, borde: 'red' },
    { nombre: 'Retenido (\\)', color: 'black', estado: 8, borde: 'none' },
    { nombre: 'Fracturado (⚡)', color: 'black', estado: 9, borde: 'none' },
    { nombre: 'Rotado (↳)', color: 'black', estado: 10, borde: 'none' },
    { nombre: 'Endodoncia Existente (Δ)', color: 'black', estado: 11, borde: 'none' },
  ];
  convencionesTercero: any[] = [
    { nombre: 'Endodoncia Indicada (Δ)', color: 'red', estado: 18, borde: 'none' },
    { nombre: 'Amalgama', color: '#555e7a', estado: 12, borde: 'none' },
    { nombre: 'Amalgama Desadaptada', color: '#555e7a', estado: 17, borde: 'red' },
    { nombre: 'Erupcionado (🠉)', color: 'black', estado: 13, borde: 'none' },
    { nombre: 'Exodoncia Indicada (X)', color: 'red', estado: 20, borde: 'none' },
    { nombre: 'Sellante (S)', color: '#5b9bd5', estado: 21, borde: 'none' },
    { nombre: 'Sellante Desadaptado (S)', color: 'red', estado: 14, borde: 'none' },
  ];

  tipoDiente(est: number) {
    this.color = est;
  }
  cambiarColorAbajo(diente: number, posicion: String) {
    if (posicion === "Arriba") {
      if (this.color == 1) {
        this.limpiarEspecialesAbajo(diente);
        this.dientesAbajo[diente].classArriba = 'diente';
      }
      else if (this.color == 2) {
        this.limpiarAbajo(diente);
        this.dientesAbajo[diente].implante = 'marcadoMorado';
      }
      else if (this.color == 3) {
        this.limpiarAbajo(diente);
        this.dientesAbajo[diente].ausente = 'marcadoNegroLleno';
      }
      else if (this.color == 4) {
        this.limpiarEspecialesAbajo(diente);
        this.dientesAbajo[diente].classArriba = 'marcadoMarron';
      }
      else if (this.color == 5) {
        this.limpiarEspecialesAbajo(diente);
        this.dientesAbajo[diente].classArriba = 'marcadoRojo';
      }
      else if (this.color == 6) {
        this.limpiarEspecialesAbajo(diente);
        this.dientesAbajo[diente].classArriba = 'marcadoVerdeRojo';
      }
      else if (this.color == 7) {
        this.limpiarAbajo(diente);
        this.dientesAbajo[diente].corona = 'marcadoAzul';
      }
      else if (this.color == 8) {
        this.limpiarAbajo(diente);
        this.dientesAbajo[diente].retenido = 'marcadoNegroLleno';

      }
      else if (this.color == 9) {
        this.limpiarAbajo(diente);
        this.dientesAbajo[diente].fracturado = 'marcadoNegroLleno';

      }
      else if (this.color == 10) {
        this.limpiarAbajo(diente);
        this.dientesAbajo[diente].rotado = 'marcadoNegroLleno';

      }
      else if (this.color == 11) {
        this.limpiarAbajo(diente);
        this.dientesAbajo[diente].endodoncia = 'marcadoNegroLleno';

      }
      else if (this.color == 12) {
        this.limpiarEspecialesAbajo(diente);
        this.dientesAbajo[diente].classArriba = 'marcadoGris';
      }
      else if (this.color == 13) {
        this.limpiarAbajo(diente);
        this.dientesAbajo[diente].erupcionado = 'marcadoNegroLleno';
      }
      else if (this.color == 14) {
        this.limpiarAbajo(diente);
        this.dientesAbajo[diente].sellanteDesadaptado = 'marcadoRojo';
      }
      else if (this.color == 15) {
        this.limpiarAbajo(diente);
        this.dientesAbajo[diente].coronaDestruida = 'marcadoMagenta';
      }
      else if (this.color == 16) {
        this.limpiarAbajo(diente);
        this.dientesAbajo[diente].sano = 'marcadoMarron';
      }
      else if (this.color == 17) {
        this.limpiarEspecialesAbajo(diente);
        this.dientesAbajo[diente].classArriba = 'marcadoGrisRojo';
      }
      else if (this.color == 18) {
        this.limpiarAbajo(diente);
        this.dientesAbajo[diente].endodonciaIndicada = 'marcadoRojo';
      }
      else if (this.color == 19) {
        this.limpiarAbajo(diente);
        this.dientesAbajo[diente].coronaDesadaptada = 'marcadoAzulRojo';
      }
      else if (this.color == 20) {
        this.limpiarAbajo(diente);
        this.dientesAbajo[diente].exodonciaIndicada = 'marcadoRojo';
      }
      else if (this.color == 21) {
        this.limpiarAbajo(diente);
        this.dientesAbajo[diente].sellante = 'marcadoAzul';
      }
    }
    else if (posicion === "Derecha") {
      if (this.color == 1) {
        this.limpiarEspecialesAbajo(diente);
        this.dientesAbajo[diente].classDerecha = 'diente';
      }
      else if (this.color == 2) {
        this.limpiarAbajo(diente);
        this.dientesAbajo[diente].implante = 'marcadoMorado';
      }
      else if (this.color == 3) {
        this.limpiarAbajo(diente);
        this.dientesAbajo[diente].ausente = 'marcadoNegroLleno';
      }
      else if (this.color == 4) {
        this.limpiarEspecialesAbajo(diente);
        this.dientesAbajo[diente].classDerecha = 'marcadoMarron';
      }
      else if (this.color == 5) {
        this.limpiarEspecialesAbajo(diente);
        this.dientesAbajo[diente].classDerecha = 'marcadoRojo';
      }
      else if (this.color == 6) {
        this.limpiarEspecialesAbajo(diente);
        this.dientesAbajo[diente].classDerecha = 'marcadoVerdeRojo';
      }
      else if (this.color == 7) {
        this.limpiarAbajo(diente);
        this.dientesAbajo[diente].corona = 'marcadoAzul';
      }
      else if (this.color == 8) {
        this.limpiarAbajo(diente);
        this.dientesAbajo[diente].retenido = 'marcadoNegroLleno';

      }
      else if (this.color == 9) {
        this.limpiarAbajo(diente);
        this.dientesAbajo[diente].fracturado = 'marcadoNegroLleno';

      }
      else if (this.color == 10) {
        this.limpiarAbajo(diente);
        this.dientesAbajo[diente].rotado = 'marcadoNegroLleno';

      }
      else if (this.color == 11) {
        this.limpiarAbajo(diente);
        this.dientesAbajo[diente].endodoncia = 'marcadoNegroLleno';

      }
      else if (this.color == 12) {
        this.limpiarEspecialesAbajo(diente);
        this.dientesAbajo[diente].classDerecha = 'marcadoGris';
      }
      else if (this.color == 13) {
        this.limpiarAbajo(diente);
        this.dientesAbajo[diente].erupcionado = 'marcadoNegroLleno';
      }
      else if (this.color == 14) {
        this.limpiarAbajo(diente);
        this.dientesAbajo[diente].sellanteDesadaptado = 'marcadoRojo';
      }
      else if (this.color == 15) {
        this.limpiarAbajo(diente);
        this.dientesAbajo[diente].coronaDestruida = 'marcadoMagenta';
      }
      else if (this.color == 16) {
        this.limpiarAbajo(diente);
        this.dientesAbajo[diente].sano = 'marcadoMarron';
      }
      else if (this.color == 17) {
        this.limpiarEspecialesAbajo(diente);
        this.dientesAbajo[diente].classDerecha = 'marcadoGrisRojo';
      }
      else if (this.color == 18) {
        this.limpiarAbajo(diente);
        this.dientesAbajo[diente].endodonciaIndicada = 'marcadoRojo';
      }
      else if (this.color == 19) {
        this.limpiarAbajo(diente);
        this.dientesAbajo[diente].coronaDesadaptada = 'marcadoAzulRojo';
      }
      else if (this.color == 20) {
        this.limpiarAbajo(diente);
        this.dientesAbajo[diente].exodonciaIndicada = 'marcadoRojo';
      }
      else if (this.color == 21) {
        this.limpiarAbajo(diente);
        this.dientesAbajo[diente].sellante = 'marcadoAzul';
      }
    }
    else if (posicion === "Izquierda") {
      if (this.color == 1) {
        this.limpiarEspecialesAbajo(diente);
        this.dientesAbajo[diente].classIzquierda = 'diente';
      }
      else if (this.color == 2) {
        this.limpiarAbajo(diente);
        this.dientesAbajo[diente].implante = 'marcadoMorado';
      }
      else if (this.color == 3) {
        this.limpiarAbajo(diente);
        this.dientesAbajo[diente].ausente = 'marcadoNegroLleno';
      }
      else if (this.color == 4) {
        this.limpiarEspecialesAbajo(diente);
        this.dientesAbajo[diente].classIzquierda = 'marcadoMarron';
      }
      else if (this.color == 5) {
        this.limpiarEspecialesAbajo(diente);
        this.dientesAbajo[diente].classIzquierda = 'marcadoRojo';
      }
      else if (this.color == 6) {
        this.limpiarEspecialesAbajo(diente);
        this.dientesAbajo[diente].classIzquierda = 'marcadoVerdeRojo';
      }
      else if (this.color == 7) {
        this.limpiarAbajo(diente);
        this.dientesAbajo[diente].corona = 'marcadoAzul';
      }
      else if (this.color == 8) {
        this.limpiarAbajo(diente);
        this.dientesAbajo[diente].retenido = 'marcadoNegroLleno';

      }
      else if (this.color == 9) {
        this.limpiarAbajo(diente);
        this.dientesAbajo[diente].fracturado = 'marcadoNegroLleno';

      }
      else if (this.color == 10) {
        this.limpiarAbajo(diente);
        this.dientesAbajo[diente].rotado = 'marcadoNegroLleno';

      }
      else if (this.color == 11) {
        this.limpiarAbajo(diente);
        this.dientesAbajo[diente].endodoncia = 'marcadoNegroLleno';

      }
      else if (this.color == 12) {
        this.limpiarEspecialesAbajo(diente);
        this.dientesAbajo[diente].classIzquierda = 'marcadoGris';
      }
      else if (this.color == 13) {
        this.limpiarAbajo(diente);
        this.dientesAbajo[diente].erupcionado = 'marcadoNegroLleno';
      }
      else if (this.color == 14) {
        this.limpiarAbajo(diente);
        this.dientesAbajo[diente].sellanteDesadaptado = 'marcadoRojo';
      }
      else if (this.color == 15) {
        this.limpiarAbajo(diente);
        this.dientesAbajo[diente].coronaDestruida = 'marcadoMagenta';
      }
      else if (this.color == 16) {
        this.limpiarAbajo(diente);
        this.dientesAbajo[diente].sano = 'marcadoMarron';
      }
      else if (this.color == 17) {
        this.limpiarEspecialesAbajo(diente);
        this.dientesAbajo[diente].classIzquierda = 'marcadoGrisRojo';
      }
      else if (this.color == 18) {
        this.limpiarAbajo(diente);
        this.dientesAbajo[diente].endodonciaIndicada = 'marcadoRojo';
      }
      else if (this.color == 19) {
        this.limpiarAbajo(diente);
        this.dientesAbajo[diente].coronaDesadaptada = 'marcadoAzulRojo';
      }
      else if (this.color == 20) {
        this.limpiarAbajo(diente);
        this.dientesAbajo[diente].exodonciaIndicada = 'marcadoRojo';
      }
      else if (this.color == 21) {
        this.limpiarAbajo(diente);
        this.dientesAbajo[diente].sellante = 'marcadoAzul';
      }
    }
    else if (posicion === "Centro") {
      if (this.color == 1) {
        this.limpiarEspecialesAbajo(diente);
        this.dientesAbajo[diente].classCentro = 'diente';
      }
      else if (this.color == 2) {
        this.limpiarAbajo(diente);
        this.dientesAbajo[diente].implante = 'marcadoMorado';
      }
      else if (this.color == 3) {
        this.limpiarAbajo(diente);
        this.dientesAbajo[diente].ausente = 'marcadoNegroLleno';
      }
      else if (this.color == 4) {
        this.limpiarEspecialesAbajo(diente);
        this.dientesAbajo[diente].classCentro = 'marcadoMarron';
      }
      else if (this.color == 5) {
        this.limpiarEspecialesAbajo(diente);
        this.dientesAbajo[diente].classCentro = 'marcadoRojo';
      }
      else if (this.color == 6) {
        this.limpiarEspecialesAbajo(diente);
        this.dientesAbajo[diente].classCentro = 'marcadoVerdeRojo';
      }
      else if (this.color == 7) {
        this.limpiarAbajo(diente);
        this.dientesAbajo[diente].corona = 'marcadoAzul';
      }
      else if (this.color == 8) {
        this.limpiarAbajo(diente);
        this.dientesAbajo[diente].retenido = 'marcadoNegroLleno';

      }
      else if (this.color == 9) {
        this.limpiarAbajo(diente);
        this.dientesAbajo[diente].fracturado = 'marcadoNegroLleno';

      }
      else if (this.color == 10) {
        this.limpiarAbajo(diente);
        this.dientesAbajo[diente].rotado = 'marcadoNegroLleno';

      }
      else if (this.color == 11) {
        this.limpiarAbajo(diente);
        this.dientesAbajo[diente].endodoncia = 'marcadoNegroLleno';

      }
      else if (this.color == 12) {
        this.limpiarEspecialesAbajo(diente);
        this.dientesAbajo[diente].classCentro = 'marcadoGris';
      }
      else if (this.color == 13) {
        this.limpiarAbajo(diente);
        this.dientesAbajo[diente].erupcionado = 'marcadoNegroLleno';
      }
      else if (this.color == 14) {
        this.limpiarAbajo(diente);
        this.dientesAbajo[diente].sellanteDesadaptado = 'marcadoRojo';
      }
      else if (this.color == 15) {
        this.limpiarAbajo(diente);
        this.dientesAbajo[diente].coronaDestruida = 'marcadoMagenta';
      }
      else if (this.color == 16) {
        this.limpiarAbajo(diente);
        this.dientesAbajo[diente].sano = 'marcadoMarron';
      }
      else if (this.color == 17) {
        this.limpiarEspecialesAbajo(diente);
        this.dientesAbajo[diente].classCentro = 'marcadoGrisRojo';
      }
      else if (this.color == 18) {
        this.limpiarAbajo(diente);
        this.dientesAbajo[diente].endodonciaIndicada = 'marcadoRojo';
      }
      else if (this.color == 19) {
        this.limpiarAbajo(diente);
        this.dientesAbajo[diente].coronaDesadaptada = 'marcadoAzulRojo';
      }
      else if (this.color == 20) {
        this.limpiarAbajo(diente);
        this.dientesAbajo[diente].exodonciaIndicada = 'marcadoRojo';
      }
      else if (this.color == 21) {
        this.limpiarAbajo(diente);
        this.dientesAbajo[diente].sellante = 'marcadoAzul';
      }
    }
    else if (posicion === "Abajo") {
      if (this.color == 1) {
        this.limpiarEspecialesAbajo(diente);
        this.dientesAbajo[diente].classAbajo = 'diente';
      }
      else if (this.color == 2) {
        this.limpiarAbajo(diente);
        this.dientesAbajo[diente].implante = 'marcadoMorado';
      }
      else if (this.color == 3) {
        this.limpiarAbajo(diente);
        this.dientesAbajo[diente].ausente = 'marcadoNegroLleno';
      }
      else if (this.color == 4) {
        this.limpiarEspecialesAbajo(diente);
        this.dientesAbajo[diente].classAbajo = 'marcadoMarron';
      }
      else if (this.color == 5) {
        this.limpiarEspecialesAbajo(diente);
        this.dientesAbajo[diente].classAbajo = 'marcadoRojo';
      }
      else if (this.color == 6) {
        this.limpiarEspecialesAbajo(diente);
        this.dientesAbajo[diente].classAbajo = 'marcadoVerdeRojo';
      }
      else if (this.color == 7) {
        this.limpiarAbajo(diente);
        this.dientesAbajo[diente].corona = 'marcadoAzul';
      }
      else if (this.color == 8) {
        this.limpiarAbajo(diente);
        this.dientesAbajo[diente].retenido = 'marcadoNegroLleno';

      }
      else if (this.color == 9) {
        this.limpiarAbajo(diente);
        this.dientesAbajo[diente].fracturado = 'marcadoNegroLleno';

      }
      else if (this.color == 10) {
        this.limpiarAbajo(diente);
        this.dientesAbajo[diente].rotado = 'marcadoNegroLleno';

      }
      else if (this.color == 11) {
        this.limpiarAbajo(diente);
        this.dientesAbajo[diente].endodoncia = 'marcadoNegroLleno';

      }
      else if (this.color == 12) {
        this.limpiarEspecialesAbajo(diente);
        this.dientesAbajo[diente].classAbajo = 'marcadoGris';
      }
      else if (this.color == 13) {
        this.limpiarAbajo(diente);
        this.dientesAbajo[diente].erupcionado = 'marcadoNegroLleno';
      }
      else if (this.color == 14) {
        this.limpiarAbajo(diente);
        this.dientesAbajo[diente].sellanteDesadaptado = 'marcadoRojo';
      }
      else if (this.color == 15) {
        this.limpiarAbajo(diente);
        this.dientesAbajo[diente].coronaDestruida = 'marcadoMagenta';
      }
      else if (this.color == 16) {
        this.limpiarAbajo(diente);
        this.dientesAbajo[diente].sano = 'marcadoMarron';
      }
      else if (this.color == 17) {
        this.limpiarEspecialesAbajo(diente);
        this.dientesAbajo[diente].classAbajo = 'marcadoGrisRojo';
      }
      else if (this.color == 18) {
        this.limpiarAbajo(diente);
        this.dientesAbajo[diente].endodonciaIndicada = 'marcadoRojo';
      }
      else if (this.color == 19) {
        this.limpiarAbajo(diente);
        this.dientesAbajo[diente].coronaDesadaptada = 'marcadoAzulRojo';
      }
      else if (this.color == 20) {
        this.limpiarAbajo(diente);
        this.dientesAbajo[diente].exodonciaIndicada = 'marcadoRojo';
      }
      else if (this.color == 21) {
        this.limpiarAbajo(diente);
        this.dientesAbajo[diente].sellante = 'marcadoAzul';
      }
    }
    let json: {} = {};
    json['dientesArriba'] = this.dientesArriba;
    json['dientesAbajo'] = this.dientesAbajo;
    let jsonOdontograma = JSON.stringify(json);
    this.odontogramaOutput.emit(jsonOdontograma);
  }
  cambiarColorArriba(diente: number, posicion: String) {
    if (posicion === "Arriba") {
      if (this.color == 1) {
        this.limpiarEspecialesArriba(diente);
        this.dientesArriba[diente].classArriba = 'diente';
      }
      else if (this.color == 2) {
        this.limpiarArriba(diente);
        this.dientesArriba[diente].implante = 'marcadoMorado';
      }
      else if (this.color == 3) {
        this.limpiarArriba(diente);
        this.dientesArriba[diente].ausente = 'marcadoNegroLleno';
      }
      else if (this.color == 4) {
        this.limpiarEspecialesArriba(diente);
        this.dientesArriba[diente].classArriba = 'marcadoMarron';
      }
      else if (this.color == 5) {
        this.limpiarEspecialesArriba(diente);
        this.dientesArriba[diente].classArriba = 'marcadoRojo';
      }
      else if (this.color == 6) {
        this.limpiarEspecialesArriba(diente);
        this.dientesArriba[diente].classArriba = 'marcadoVerdeRojo';
      }
      else if (this.color == 7) {
        this.limpiarArriba(diente);
        this.dientesArriba[diente].corona = 'marcadoAzul';
      }
      else if (this.color == 8) {
        this.limpiarArriba(diente);
        this.dientesArriba[diente].retenido = 'marcadoNegroLleno';

      }
      else if (this.color == 9) {
        this.limpiarArriba(diente);
        this.dientesArriba[diente].fracturado = 'marcadoNegroLleno';

      }
      else if (this.color == 10) {
        this.limpiarArriba(diente);
        this.dientesArriba[diente].rotado = 'marcadoNegroLleno';

      }
      else if (this.color == 11) {
        this.limpiarArriba(diente);
        this.dientesArriba[diente].endodoncia = 'marcadoNegroLleno';

      }
      else if (this.color == 12) {
        this.limpiarEspecialesArriba(diente);
        this.dientesArriba[diente].classArriba = 'marcadoGris';
      }
      else if (this.color == 13) {
        this.limpiarArriba(diente);
        this.dientesArriba[diente].erupcionado = 'marcadoNegroLleno';
      }
      else if (this.color == 14) {
        this.limpiarArriba(diente);
        this.dientesArriba[diente].sellanteDesadaptado = 'marcadoRojo';
      }
      else if (this.color == 15) {
        this.limpiarArriba(diente);
        this.dientesArriba[diente].coronaDestruida = 'marcadoMagenta';
      }
      else if (this.color == 16) {
        this.limpiarArriba(diente);
        this.dientesArriba[diente].sano = 'marcadoMarron';
      }
      else if (this.color == 17) {
        this.limpiarEspecialesArriba(diente);
        this.dientesArriba[diente].classArriba = 'marcadoGrisRojo';
      }
      else if (this.color == 18) {
        this.limpiarArriba(diente);
        this.dientesArriba[diente].endodonciaIndicada = 'marcadoRojo';
      }
      else if (this.color == 19) {
        this.limpiarArriba(diente);
        this.dientesArriba[diente].coronaDesadaptada = 'marcadoAzulRojo';
      }
      else if (this.color == 20) {
        this.limpiarArriba(diente);
        this.dientesArriba[diente].exodonciaIndicada = 'marcadoRojo';
      }
      else if (this.color == 21) {
        this.limpiarArriba(diente);
        this.dientesArriba[diente].sellante = 'marcadoAzul';
      }
    }
    else if (posicion === "Derecha") {
      if (this.color == 1) {
        this.limpiarEspecialesArriba(diente);
        this.dientesArriba[diente].classDerecha = 'diente';
      }
      else if (this.color == 2) {
        this.limpiarArriba(diente);
        this.dientesArriba[diente].implante = 'marcadoMorado';
      }
      else if (this.color == 3) {
        this.limpiarArriba(diente);
        this.dientesArriba[diente].ausente = 'marcadoNegroLleno';
      }
      else if (this.color == 4) {
        this.limpiarEspecialesArriba(diente);
        this.dientesArriba[diente].classDerecha = 'marcadoMarron';
      }
      else if (this.color == 5) {
        this.limpiarEspecialesArriba(diente);
        this.dientesArriba[diente].classDerecha = 'marcadoRojo';
      }
      else if (this.color == 6) {
        this.limpiarEspecialesArriba(diente);
        this.dientesArriba[diente].classDerecha = 'marcadoVerdeRojo';
      }
      else if (this.color == 7) {
        this.limpiarArriba(diente);
        this.dientesArriba[diente].corona = 'marcadoAzul';
      }
      else if (this.color == 8) {
        this.limpiarArriba(diente);
        this.dientesArriba[diente].retenido = 'marcadoNegroLleno';

      }
      else if (this.color == 9) {
        this.limpiarArriba(diente);
        this.dientesArriba[diente].fracturado = 'marcadoNegroLleno';

      }
      else if (this.color == 10) {
        this.limpiarArriba(diente);
        this.dientesArriba[diente].rotado = 'marcadoNegroLleno';

      }
      else if (this.color == 11) {
        this.limpiarArriba(diente);
        this.dientesArriba[diente].endodoncia = 'marcadoNegroLleno';

      }
      else if (this.color == 12) {
        this.limpiarEspecialesArriba(diente);
        this.dientesArriba[diente].classDerecha = 'marcadoGris';
      }
      else if (this.color == 13) {
        this.limpiarArriba(diente);
        this.dientesArriba[diente].erupcionado = 'marcadoNegroLleno';
      }
      else if (this.color == 14) {
        this.limpiarArriba(diente);
        this.dientesArriba[diente].sellanteDesadaptado = 'marcadoRojo';
      }
      else if (this.color == 15) {
        this.limpiarArriba(diente);
        this.dientesArriba[diente].coronaDestruida = 'marcadoMagenta';
      }
      else if (this.color == 16) {
        this.limpiarArriba(diente);
        this.dientesArriba[diente].sano = 'marcadoMarron';
      }
      else if (this.color == 17) {
        this.limpiarEspecialesArriba(diente);
        this.dientesArriba[diente].classDerecha = 'marcadoGrisRojo';
      }
      else if (this.color == 18) {
        this.limpiarArriba(diente);
        this.dientesArriba[diente].endodonciaIndicada = 'marcadoRojo';
      }
      else if (this.color == 19) {
        this.limpiarArriba(diente);
        this.dientesArriba[diente].coronaDesadaptada = 'marcadoAzulRojo';
      }
      else if (this.color == 20) {
        this.limpiarArriba(diente);
        this.dientesArriba[diente].exodonciaIndicada = 'marcadoRojo';
      }
      else if (this.color == 21) {
        this.limpiarArriba(diente);
        this.dientesArriba[diente].sellante = 'marcadoAzul';
      }
    }
    else if (posicion === "Izquierda") {
      if (this.color == 1) {
        this.limpiarEspecialesArriba(diente);
        this.dientesArriba[diente].classIzquierda = 'diente';
      }
      else if (this.color == 2) {
        this.limpiarArriba(diente);
        this.dientesArriba[diente].implante = 'marcadoMorado';
      }
      else if (this.color == 3) {
        this.limpiarArriba(diente);
        this.dientesArriba[diente].ausente = 'marcadoNegroLleno';
      }
      else if (this.color == 4) {
        this.limpiarEspecialesArriba(diente);
        this.dientesArriba[diente].classIzquierda = 'marcadoMarron';
      }
      else if (this.color == 5) {
        this.limpiarEspecialesArriba(diente);
        this.dientesArriba[diente].classIzquierda = 'marcadoRojo';
      }
      else if (this.color == 6) {
        this.limpiarEspecialesArriba(diente);
        this.dientesArriba[diente].classIzquierda = 'marcadoVerdeRojo';
      }
      else if (this.color == 7) {
        this.limpiarArriba(diente);
        this.dientesArriba[diente].corona = 'marcadoAzul';
      }
      else if (this.color == 8) {
        this.limpiarArriba(diente);
        this.dientesArriba[diente].retenido = 'marcadoNegroLleno';

      }
      else if (this.color == 9) {
        this.limpiarArriba(diente);
        this.dientesArriba[diente].fracturado = 'marcadoNegroLleno';

      }
      else if (this.color == 10) {
        this.limpiarArriba(diente);
        this.dientesArriba[diente].rotado = 'marcadoNegroLleno';

      }
      else if (this.color == 11) {
        this.limpiarArriba(diente);
        this.dientesArriba[diente].endodoncia = 'marcadoNegroLleno';

      }
      else if (this.color == 12) {
        this.limpiarEspecialesArriba(diente);
        this.dientesArriba[diente].classIzquierda = 'marcadoGris';
      }
      else if (this.color == 13) {
        this.limpiarArriba(diente);
        this.dientesArriba[diente].erupcionado = 'marcadoNegroLleno';
      }
      else if (this.color == 14) {
        this.limpiarArriba(diente);
        this.dientesArriba[diente].sellanteDesadaptado = 'marcadoRojo';
      }
      else if (this.color == 15) {
        this.limpiarArriba(diente);
        this.dientesArriba[diente].coronaDestruida = 'marcadoMagenta';
      }
      else if (this.color == 16) {
        this.limpiarArriba(diente);
        this.dientesArriba[diente].sano = 'marcadoMarron';
      }
      else if (this.color == 17) {
        this.limpiarEspecialesArriba(diente);
        this.dientesArriba[diente].classIzquierda = 'marcadoGrisRojo';
      }
      else if (this.color == 18) {
        this.limpiarArriba(diente);
        this.dientesArriba[diente].endodonciaIndicada = 'marcadoRojo';
      }
      else if (this.color == 19) {
        this.limpiarArriba(diente);
        this.dientesArriba[diente].coronaDesadaptada = 'marcadoAzulRojo';
      }
      else if (this.color == 20) {
        this.limpiarArriba(diente);
        this.dientesArriba[diente].exodonciaIndicada = 'marcadoRojo';
      }
      else if (this.color == 21) {
        this.limpiarArriba(diente);
        this.dientesArriba[diente].sellante = 'marcadoAzul';
      }
    }
    else if (posicion === "Centro") {
      if (this.color == 1) {
        this.limpiarEspecialesArriba(diente);
        this.dientesArriba[diente].classCentro = 'diente';
      }
      else if (this.color == 2) {
        this.limpiarArriba(diente);
        this.dientesArriba[diente].implante = 'marcadoMorado';
      }
      else if (this.color == 3) {
        this.limpiarArriba(diente);
        this.dientesArriba[diente].ausente = 'marcadoNegroLleno';
      }
      else if (this.color == 4) {
        this.limpiarEspecialesArriba(diente);
        this.dientesArriba[diente].classCentro = 'marcadoMarron';
      }
      else if (this.color == 5) {
        this.limpiarEspecialesArriba(diente);
        this.dientesArriba[diente].classCentro = 'marcadoRojo';
      }
      else if (this.color == 6) {
        this.limpiarEspecialesArriba(diente);
        this.dientesArriba[diente].classCentro = 'marcadoVerdeRojo';
      }
      else if (this.color == 7) {
        this.limpiarArriba(diente);
        this.dientesArriba[diente].corona = 'marcadoAzul';
      }
      else if (this.color == 8) {
        this.limpiarArriba(diente);
        this.dientesArriba[diente].retenido = 'marcadoNegroLleno';

      }
      else if (this.color == 9) {
        this.limpiarArriba(diente);
        this.dientesArriba[diente].fracturado = 'marcadoNegroLleno';

      }
      else if (this.color == 10) {
        this.limpiarArriba(diente);
        this.dientesArriba[diente].rotado = 'marcadoNegroLleno';

      }
      else if (this.color == 11) {
        this.limpiarArriba(diente);
        this.dientesArriba[diente].endodoncia = 'marcadoNegroLleno';

      }
      else if (this.color == 12) {
        this.limpiarEspecialesArriba(diente);
        this.dientesArriba[diente].classCentro = 'marcadoGris';
      }
      else if (this.color == 13) {
        this.limpiarArriba(diente);
        this.dientesArriba[diente].erupcionado = 'marcadoNegroLleno';
      }
      else if (this.color == 14) {
        this.limpiarArriba(diente);
        this.dientesArriba[diente].sellanteDesadaptado = 'marcadoRojo';
      }
      else if (this.color == 15) {
        this.limpiarArriba(diente);
        this.dientesArriba[diente].coronaDestruida = 'marcadoMagenta';
      }
      else if (this.color == 16) {
        this.limpiarArriba(diente);
        this.dientesArriba[diente].sano = 'marcadoMarron';
      }
      else if (this.color == 17) {
        this.limpiarEspecialesArriba(diente);
        this.dientesArriba[diente].classCentro = 'marcadoGrisRojo';
      }
      else if (this.color == 18) {
        this.limpiarArriba(diente);
        this.dientesArriba[diente].endodonciaIndicada = 'marcadoRojo';
      }
      else if (this.color == 19) {
        this.limpiarArriba(diente);
        this.dientesArriba[diente].coronaDesadaptada = 'marcadoAzulRojo';
      }
      else if (this.color == 20) {
        this.limpiarArriba(diente);
        this.dientesArriba[diente].exodonciaIndicada = 'marcadoRojo';
      }
      else if (this.color == 21) {
        this.limpiarArriba(diente);
        this.dientesArriba[diente].sellante = 'marcadoAzul';
      }
    }
    else if (posicion === "Abajo") {
      if (this.color == 1) {
        this.limpiarEspecialesArriba(diente);
        this.dientesArriba[diente].classAbajo = 'diente';
      }
      else if (this.color == 2) {
        this.limpiarArriba(diente);
        this.dientesArriba[diente].implante = 'marcadoMorado';
      }
      else if (this.color == 3) {
        this.limpiarArriba(diente);
        this.dientesArriba[diente].ausente = 'marcadoNegroLleno';
      }
      else if (this.color == 4) {
        this.limpiarEspecialesArriba(diente);
        this.dientesArriba[diente].classAbajo = 'marcadoMarron';
      }
      else if (this.color == 5) {
        this.limpiarEspecialesArriba(diente);
        this.dientesArriba[diente].classAbajo = 'marcadoRojo';
      }
      else if (this.color == 6) {
        this.limpiarEspecialesArriba(diente);
        this.dientesArriba[diente].classAbajo = 'marcadoVerdeRojo';
      }
      else if (this.color == 7) {
        this.limpiarArriba(diente);
        this.dientesArriba[diente].corona = 'marcadoAzul';
      }
      else if (this.color == 8) {
        this.limpiarArriba(diente);
        this.dientesArriba[diente].retenido = 'marcadoNegroLleno';

      }
      else if (this.color == 9) {
        this.limpiarArriba(diente);
        this.dientesArriba[diente].fracturado = 'marcadoNegroLleno';

      }
      else if (this.color == 10) {
        this.limpiarArriba(diente);
        this.dientesArriba[diente].rotado = 'marcadoNegroLleno';

      }
      else if (this.color == 11) {
        this.limpiarArriba(diente);
        this.dientesArriba[diente].endodoncia = 'marcadoNegroLleno';

      }
      else if (this.color == 12) {
        this.limpiarEspecialesArriba(diente);
        this.dientesArriba[diente].classAbajo = 'marcadoGris';
      }
      else if (this.color == 13) {
        this.limpiarArriba(diente);
        this.dientesArriba[diente].erupcionado = 'marcadoNegroLleno';
      }
      else if (this.color == 14) {
        this.limpiarArriba(diente);
        this.dientesArriba[diente].sellanteDesadaptado = 'marcadoRojo';
      }
      else if (this.color == 15) {
        this.limpiarArriba(diente);
        this.dientesArriba[diente].coronaDestruida = 'marcadoMagenta';
      }
      else if (this.color == 16) {
        this.limpiarArriba(diente);
        this.dientesArriba[diente].sano = 'marcadoMarron';
      }
      else if (this.color == 17) {
        this.limpiarEspecialesArriba(diente);
        this.dientesArriba[diente].classAbajo = 'marcadoGrisRojo';
      }
      else if (this.color == 18) {
        this.limpiarArriba(diente);
        this.dientesArriba[diente].endodonciaIndicada = 'marcadoRojo';
      }
      else if (this.color == 19) {
        this.limpiarArriba(diente);
        this.dientesArriba[diente].coronaDesadaptada = 'marcadoAzulRojo';
      }
      else if (this.color == 20) {
        this.limpiarArriba(diente);
        this.dientesArriba[diente].exodonciaIndicada = 'marcadoRojo';
      }
      else if (this.color == 21) {
        this.limpiarArriba(diente);
        this.dientesArriba[diente].sellante = 'marcadoAzul';
      }
    }
    let json: {} = {};
    json['dientesArriba'] = this.dientesArriba;
    json['dientesAbajo'] = this.dientesAbajo;
    let jsonOdontograma = JSON.stringify(json);
    this.odontogramaOutput.emit(jsonOdontograma);
  }
  limpiarArriba(diente: number) {
    this.dientesArriba[diente].classArriba = 'diente';
    this.dientesArriba[diente].classAbajo = 'diente';
    this.dientesArriba[diente].classIzquierda = 'diente';
    this.dientesArriba[diente].classDerecha = 'diente';
    this.dientesArriba[diente].classCentro = 'diente';
    this.dientesArriba[diente].implante = 'invisible';
    this.dientesArriba[diente].ausente = 'invisible';
    this.dientesArriba[diente].corona = 'invisible';
    this.dientesArriba[diente].retenido = 'invisible';
    this.dientesArriba[diente].fracturado = 'invisible';
    this.dientesArriba[diente].rotado = 'invisible';
    this.dientesArriba[diente].endodoncia = 'invisible';
    this.dientesArriba[diente].erupcionado = 'invisible';
    this.dientesArriba[diente].sellanteDesadaptado = 'invisible';
    this.dientesArriba[diente].coronaDestruida = 'invisible';
    this.dientesArriba[diente].coronaDesadaptada = 'invisible';
    this.dientesArriba[diente].sano = 'invisible';
    this.dientesArriba[diente].endodonciaIndicada = 'invisible';
    this.dientesArriba[diente].exodonciaIndicada = 'invisible';
    this.dientesArriba[diente].sellante = 'invisible';
    this.dientesArriba1[diente].classArriba = 'diente';
    this.dientesArriba1[diente].classAbajo = 'diente';
    this.dientesArriba1[diente].classIzquierda = 'diente';
    this.dientesArriba1[diente].classDerecha = 'diente';
    this.dientesArriba1[diente].classCentro = 'diente';
    this.dientesArriba1[diente].implante = 'invisible';
    this.dientesArriba1[diente].ausente = 'invisible';
    this.dientesArriba1[diente].corona = 'invisible';
    this.dientesArriba1[diente].retenido = 'invisible';
    this.dientesArriba1[diente].fracturado = 'invisible';
    this.dientesArriba1[diente].rotado = 'invisible';
    this.dientesArriba1[diente].endodoncia = 'invisible';
    this.dientesArriba1[diente].erupcionado = 'invisible';
    this.dientesArriba1[diente].sellanteDesadaptado = 'invisible';
    this.dientesArriba1[diente].coronaDestruida = 'invisible';
    this.dientesArriba1[diente].coronaDesadaptada = 'invisible';
    this.dientesArriba1[diente].sano = 'invisible';
    this.dientesArriba1[diente].endodonciaIndicada = 'invisible';
    this.dientesArriba1[diente].exodonciaIndicada = 'invisible';
    this.dientesArriba1[diente].sellante = 'invisible';
  }
  limpiarEspecialesArriba(diente: number) {
    this.dientesArriba[diente].implante = 'invisible';
    this.dientesArriba[diente].ausente = 'invisible';
    this.dientesArriba[diente].corona = 'invisible';
    this.dientesArriba[diente].retenido = 'invisible';
    this.dientesArriba[diente].fracturado = 'invisible';
    this.dientesArriba[diente].rotado = 'invisible';
    this.dientesArriba[diente].endodoncia = 'invisible';
    this.dientesArriba[diente].erupcionado = 'invisible';
    this.dientesArriba[diente].sellanteDesadaptado = 'invisible';
    this.dientesArriba[diente].coronaDestruida = 'invisible';
    this.dientesArriba[diente].sano = 'invisible';
    this.dientesArriba[diente].endodonciaIndicada = 'invisible';
    this.dientesArriba[diente].coronaDesadaptada = 'invisible';
    this.dientesArriba[diente].exodonciaIndicada = 'invisible';
    this.dientesArriba[diente].sellante = 'invisible';
  }
  limpiarAbajo(diente: number) {
    this.dientesAbajo[diente].classArriba = 'diente';
    this.dientesAbajo[diente].classAbajo = 'diente';
    this.dientesAbajo[diente].classIzquierda = 'diente';
    this.dientesAbajo[diente].classDerecha = 'diente';
    this.dientesAbajo[diente].classCentro = 'diente';
    this.dientesAbajo[diente].implante = 'invisible';
    this.dientesAbajo[diente].ausente = 'invisible';
    this.dientesAbajo[diente].corona = 'invisible';
    this.dientesAbajo[diente].retenido = 'invisible';
    this.dientesAbajo[diente].fracturado = 'invisible';
    this.dientesAbajo[diente].rotado = 'invisible';
    this.dientesAbajo[diente].endodoncia = 'invisible';
    this.dientesAbajo[diente].erupcionado = 'invisible';
    this.dientesAbajo[diente].sellanteDesadaptado = 'invisible';
    this.dientesAbajo[diente].coronaDestruida = 'invisible';
    this.dientesAbajo[diente].sano = 'invisible';
    this.dientesAbajo[diente].endodonciaIndicada = 'invisible';
    this.dientesAbajo[diente].coronaDesadaptada = 'invisible';
    this.dientesAbajo[diente].exodonciaIndicada = 'invisible';
    this.dientesAbajo[diente].sellante = 'invisible';
  }
  limpiarEspecialesAbajo(diente: number) {
    this.dientesAbajo[diente].implante = 'invisible';
    this.dientesAbajo[diente].ausente = 'invisible';
    this.dientesAbajo[diente].corona = 'invisible';
    this.dientesAbajo[diente].retenido = 'invisible';
    this.dientesAbajo[diente].fracturado = 'invisible';
    this.dientesAbajo[diente].rotado = 'invisible';
    this.dientesAbajo[diente].endodoncia = 'invisible';
    this.dientesAbajo[diente].erupcionado = 'invisible';
    this.dientesAbajo[diente].sellanteDesadaptado = 'invisible';
    this.dientesAbajo[diente].coronaDestruida = 'invisible';
    this.dientesAbajo[diente].sano = 'invisible';
    this.dientesAbajo[diente].endodonciaIndicada = 'invisible';
    this.dientesAbajo[diente].coronaDesadaptada = 'invisible';
    this.dientesAbajo[diente].exodonciaIndicada = 'invisible';
    this.dientesAbajo[diente].sellante = 'invisible';
  }
  
  cambiarColorAbajo1(diente: number, posicion: String) {
    if (posicion === "Arriba") {
      if (this.color == 1) {
        this.limpiarEspecialesAbajo1(diente);
        this.dientesAbajo1[diente].classArriba = 'diente';
      }
      else if (this.color == 2) {
        this.limpiarAbajo1(diente);
        this.dientesAbajo1[diente].implante = 'marcadoMorado';
      }
      else if (this.color == 3) {
        this.limpiarAbajo1(diente);
        this.dientesAbajo1[diente].ausente = 'marcadoNegroLleno';
      }
      else if (this.color == 4) {
        this.limpiarEspecialesAbajo1(diente);
        this.dientesAbajo1[diente].classArriba = 'marcadoMarron';
      }
      else if (this.color == 5) {
        this.limpiarEspecialesAbajo1(diente);
        this.dientesAbajo1[diente].classArriba = 'marcadoRojo';
      }
      else if (this.color == 6) {
        this.limpiarEspecialesAbajo1(diente);
        this.dientesAbajo1[diente].classArriba = 'marcadoVerdeRojo';
      }
      else if (this.color == 7) {
        this.limpiarAbajo1(diente);
        this.dientesAbajo1[diente].corona = 'marcadoAzul';
      }
      else if (this.color == 8) {
        this.limpiarAbajo1(diente);
        this.dientesAbajo1[diente].retenido = 'marcadoNegroLleno';

      }
      else if (this.color == 9) {
        this.limpiarAbajo1(diente);
        this.dientesAbajo1[diente].fracturado = 'marcadoNegroLleno';

      }
      else if (this.color == 10) {
        this.limpiarAbajo1(diente);
        this.dientesAbajo1[diente].rotado = 'marcadoNegroLleno';

      }
      else if (this.color == 11) {
        this.limpiarAbajo1(diente);
        this.dientesAbajo1[diente].endodoncia = 'marcadoNegroLleno';

      }
      else if (this.color == 12) {
        this.limpiarEspecialesAbajo1(diente);
        this.dientesAbajo1[diente].classArriba = 'marcadoGris';
      }
      else if (this.color == 13) {
        this.limpiarAbajo1(diente);
        this.dientesAbajo1[diente].erupcionado = 'marcadoNegroLleno';
      }
      else if (this.color == 14) {
        this.limpiarAbajo1(diente);
        this.dientesAbajo1[diente].sellanteDesadaptado = 'marcadoRojo';
      }
      else if (this.color == 15) {
        this.limpiarAbajo1(diente);
        this.dientesAbajo1[diente].coronaDestruida = 'marcadoMagenta';
      }
      else if (this.color == 16) {
        this.limpiarAbajo1(diente);
        this.dientesAbajo1[diente].sano = 'marcadoMarron';
      }
      else if (this.color == 17) {
        this.limpiarEspecialesAbajo1(diente);
        this.dientesAbajo1[diente].classArriba = 'marcadoGrisRojo';
      }
      else if (this.color == 18) {
        this.limpiarAbajo1(diente);
        this.dientesAbajo1[diente].endodonciaIndicada = 'marcadoRojo';
      }
      else if (this.color == 19) {
        this.limpiarAbajo1(diente);
        this.dientesAbajo1[diente].coronaDesadaptada = 'marcadoAzulRojo';
      }
      else if (this.color == 20) {
        this.limpiarAbajo1(diente);
        this.dientesAbajo1[diente].exodonciaIndicada = 'marcadoRojo';
      }
      else if (this.color == 21) {
        this.limpiarAbajo1(diente);
        this.dientesAbajo1[diente].sellante = 'marcadoAzul';
      }
    }
    else if (posicion === "Derecha") {
      if (this.color == 1) {
        this.limpiarEspecialesAbajo1(diente);
        this.dientesAbajo1[diente].classDerecha = 'diente';
      }
      else if (this.color == 2) {
        this.limpiarAbajo1(diente);
        this.dientesAbajo1[diente].implante = 'marcadoMorado';
      }
      else if (this.color == 3) {
        this.limpiarAbajo1(diente);
        this.dientesAbajo1[diente].ausente = 'marcadoNegroLleno';
      }
      else if (this.color == 4) {
        this.limpiarEspecialesAbajo1(diente);
        this.dientesAbajo1[diente].classDerecha = 'marcadoMarron';
      }
      else if (this.color == 5) {
        this.limpiarEspecialesAbajo1(diente);
        this.dientesAbajo1[diente].classDerecha = 'marcadoRojo';
      }
      else if (this.color == 6) {
        this.limpiarEspecialesAbajo1(diente);
        this.dientesAbajo1[diente].classDerecha = 'marcadoVerdeRojo';
      }
      else if (this.color == 7) {
        this.limpiarAbajo1(diente);
        this.dientesAbajo1[diente].corona = 'marcadoAzul';
      }
      else if (this.color == 8) {
        this.limpiarAbajo1(diente);
        this.dientesAbajo1[diente].retenido = 'marcadoNegroLleno';

      }
      else if (this.color == 9) {
        this.limpiarAbajo1(diente);
        this.dientesAbajo1[diente].fracturado = 'marcadoNegroLleno';

      }
      else if (this.color == 10) {
        this.limpiarAbajo1(diente);
        this.dientesAbajo1[diente].rotado = 'marcadoNegroLleno';

      }
      else if (this.color == 11) {
        this.limpiarAbajo1(diente);
        this.dientesAbajo1[diente].endodoncia = 'marcadoNegroLleno';

      }
      else if (this.color == 12) {
        this.limpiarEspecialesAbajo1(diente);
        this.dientesAbajo1[diente].classDerecha = 'marcadoGris';
      }
      else if (this.color == 13) {
        this.limpiarAbajo1(diente);
        this.dientesAbajo1[diente].erupcionado = 'marcadoNegroLleno';
      }
      else if (this.color == 14) {
        this.limpiarAbajo1(diente);
        this.dientesAbajo1[diente].sellanteDesadaptado = 'marcadoRojo';
      }
      else if (this.color == 15) {
        this.limpiarAbajo1(diente);
        this.dientesAbajo1[diente].coronaDestruida = 'marcadoMagenta';
      }
      else if (this.color == 16) {
        this.limpiarAbajo1(diente);
        this.dientesAbajo1[diente].sano = 'marcadoMarron';
      }
      else if (this.color == 17) {
        this.limpiarEspecialesAbajo1(diente);
        this.dientesAbajo1[diente].classDerecha = 'marcadoGrisRojo';
      }
      else if (this.color == 18) {
        this.limpiarAbajo1(diente);
        this.dientesAbajo1[diente].endodonciaIndicada = 'marcadoRojo';
      }
      else if (this.color == 19) {
        this.limpiarAbajo1(diente);
        this.dientesAbajo1[diente].coronaDesadaptada = 'marcadoAzulRojo';
      }
      else if (this.color == 20) {
        this.limpiarAbajo1(diente);
        this.dientesAbajo1[diente].exodonciaIndicada = 'marcadoRojo';
      }
      else if (this.color == 21) {
        this.limpiarAbajo1(diente);
        this.dientesAbajo1[diente].sellante = 'marcadoAzul';
      }
    }
    else if (posicion === "Izquierda") {
      if (this.color == 1) {
        this.limpiarEspecialesAbajo1(diente);
        this.dientesAbajo1[diente].classIzquierda = 'diente';
      }
      else if (this.color == 2) {
        this.limpiarAbajo1(diente);
        this.dientesAbajo1[diente].implante = 'marcadoMorado';
      }
      else if (this.color == 3) {
        this.limpiarAbajo1(diente);
        this.dientesAbajo1[diente].ausente = 'marcadoNegroLleno';
      }
      else if (this.color == 4) {
        this.limpiarEspecialesAbajo1(diente);
        this.dientesAbajo1[diente].classIzquierda = 'marcadoMarron';
      }
      else if (this.color == 5) {
        this.limpiarEspecialesAbajo1(diente);
        this.dientesAbajo1[diente].classIzquierda = 'marcadoRojo';
      }
      else if (this.color == 6) {
        this.limpiarEspecialesAbajo1(diente);
        this.dientesAbajo1[diente].classIzquierda = 'marcadoVerdeRojo';
      }
      else if (this.color == 7) {
        this.limpiarAbajo1(diente);
        this.dientesAbajo1[diente].corona = 'marcadoAzul';
      }
      else if (this.color == 8) {
        this.limpiarAbajo1(diente);
        this.dientesAbajo1[diente].retenido = 'marcadoNegroLleno';

      }
      else if (this.color == 9) {
        this.limpiarAbajo1(diente);
        this.dientesAbajo1[diente].fracturado = 'marcadoNegroLleno';

      }
      else if (this.color == 10) {
        this.limpiarAbajo1(diente);
        this.dientesAbajo1[diente].rotado = 'marcadoNegroLleno';

      }
      else if (this.color == 11) {
        this.limpiarAbajo1(diente);
        this.dientesAbajo1[diente].endodoncia = 'marcadoNegroLleno';

      }
      else if (this.color == 12) {
        this.limpiarEspecialesAbajo1(diente);
        this.dientesAbajo1[diente].classIzquierda = 'marcadoGris';
      }
      else if (this.color == 13) {
        this.limpiarAbajo1(diente);
        this.dientesAbajo1[diente].erupcionado = 'marcadoNegroLleno';
      }
      else if (this.color == 14) {
        this.limpiarAbajo1(diente);
        this.dientesAbajo1[diente].sellanteDesadaptado = 'marcadoRojo';
      }
      else if (this.color == 15) {
        this.limpiarAbajo1(diente);
        this.dientesAbajo1[diente].coronaDestruida = 'marcadoMagenta';
      }
      else if (this.color == 16) {
        this.limpiarAbajo1(diente);
        this.dientesAbajo1[diente].sano = 'marcadoMarron';
      }
      else if (this.color == 17) {
        this.limpiarEspecialesAbajo1(diente);
        this.dientesAbajo1[diente].classIzquierda = 'marcadoGrisRojo';
      }
      else if (this.color == 18) {
        this.limpiarAbajo1(diente);
        this.dientesAbajo1[diente].endodonciaIndicada = 'marcadoRojo';
      }
      else if (this.color == 19) {
        this.limpiarAbajo1(diente);
        this.dientesAbajo1[diente].coronaDesadaptada = 'marcadoAzulRojo';
      }
      else if (this.color == 20) {
        this.limpiarAbajo1(diente);
        this.dientesAbajo1[diente].exodonciaIndicada = 'marcadoRojo';
      }
      else if (this.color == 21) {
        this.limpiarAbajo1(diente);
        this.dientesAbajo1[diente].sellante = 'marcadoAzul';
      }
    }
    else if (posicion === "Centro") {
      if (this.color == 1) {
        this.limpiarEspecialesAbajo1(diente);
        this.dientesAbajo1[diente].classCentro = 'diente';
      }
      else if (this.color == 2) {
        this.limpiarAbajo1(diente);
        this.dientesAbajo1[diente].implante = 'marcadoMorado';
      }
      else if (this.color == 3) {
        this.limpiarAbajo1(diente);
        this.dientesAbajo1[diente].ausente = 'marcadoNegroLleno';
      }
      else if (this.color == 4) {
        this.limpiarEspecialesAbajo1(diente);
        this.dientesAbajo1[diente].classCentro = 'marcadoMarron';
      }
      else if (this.color == 5) {
        this.limpiarEspecialesAbajo1(diente);
        this.dientesAbajo1[diente].classCentro = 'marcadoRojo';
      }
      else if (this.color == 6) {
        this.limpiarEspecialesAbajo1(diente);
        this.dientesAbajo1[diente].classCentro = 'marcadoVerdeRojo';
      }
      else if (this.color == 7) {
        this.limpiarAbajo1(diente);
        this.dientesAbajo1[diente].corona = 'marcadoAzul';
      }
      else if (this.color == 8) {
        this.limpiarAbajo1(diente);
        this.dientesAbajo1[diente].retenido = 'marcadoNegroLleno';

      }
      else if (this.color == 9) {
        this.limpiarAbajo1(diente);
        this.dientesAbajo1[diente].fracturado = 'marcadoNegroLleno';

      }
      else if (this.color == 10) {
        this.limpiarAbajo1(diente);
        this.dientesAbajo1[diente].rotado = 'marcadoNegroLleno';

      }
      else if (this.color == 11) {
        this.limpiarAbajo1(diente);
        this.dientesAbajo1[diente].endodoncia = 'marcadoNegroLleno';

      }
      else if (this.color == 12) {
        this.limpiarEspecialesAbajo1(diente);
        this.dientesAbajo1[diente].classCentro = 'marcadoGris';
      }
      else if (this.color == 13) {
        this.limpiarAbajo1(diente);
        this.dientesAbajo1[diente].erupcionado = 'marcadoNegroLleno';
      }
      else if (this.color == 14) {
        this.limpiarAbajo1(diente);
        this.dientesAbajo1[diente].sellanteDesadaptado = 'marcadoRojo';
      }
      else if (this.color == 15) {
        this.limpiarAbajo1(diente);
        this.dientesAbajo1[diente].coronaDestruida = 'marcadoMagenta';
      }
      else if (this.color == 16) {
        this.limpiarAbajo1(diente);
        this.dientesAbajo1[diente].sano = 'marcadoMarron';
      }
      else if (this.color == 17) {
        this.limpiarEspecialesAbajo1(diente);
        this.dientesAbajo1[diente].classCentro = 'marcadoGrisRojo';
      }
      else if (this.color == 18) {
        this.limpiarAbajo1(diente);
        this.dientesAbajo1[diente].endodonciaIndicada = 'marcadoRojo';
      }
      else if (this.color == 19) {
        this.limpiarAbajo1(diente);
        this.dientesAbajo1[diente].coronaDesadaptada = 'marcadoAzulRojo';
      }
      else if (this.color == 20) {
        this.limpiarAbajo1(diente);
        this.dientesAbajo1[diente].exodonciaIndicada = 'marcadoRojo';
      }
      else if (this.color == 21) {
        this.limpiarAbajo1(diente);
        this.dientesAbajo1[diente].sellante = 'marcadoAzul';
      }
    }
    else if (posicion === "Abajo") {
      if (this.color == 1) {
        this.limpiarEspecialesAbajo1(diente);
        this.dientesAbajo1[diente].classAbajo = 'diente';
      }
      else if (this.color == 2) {
        this.limpiarAbajo1(diente);
        this.dientesAbajo1[diente].implante = 'marcadoMorado';
      }
      else if (this.color == 3) {
        this.limpiarAbajo1(diente);
        this.dientesAbajo1[diente].ausente = 'marcadoNegroLleno';
      }
      else if (this.color == 4) {
        this.limpiarEspecialesAbajo1(diente);
        this.dientesAbajo1[diente].classAbajo = 'marcadoMarron';
      }
      else if (this.color == 5) {
        this.limpiarEspecialesAbajo1(diente);
        this.dientesAbajo1[diente].classAbajo = 'marcadoRojo';
      }
      else if (this.color == 6) {
        this.limpiarEspecialesAbajo1(diente);
        this.dientesAbajo1[diente].classAbajo = 'marcadoVerdeRojo';
      }
      else if (this.color == 7) {
        this.limpiarAbajo1(diente);
        this.dientesAbajo1[diente].corona = 'marcadoAzul';
      }
      else if (this.color == 8) {
        this.limpiarAbajo1(diente);
        this.dientesAbajo1[diente].retenido = 'marcadoNegroLleno';

      }
      else if (this.color == 9) {
        this.limpiarAbajo1(diente);
        this.dientesAbajo1[diente].fracturado = 'marcadoNegroLleno';

      }
      else if (this.color == 10) {
        this.limpiarAbajo1(diente);
        this.dientesAbajo1[diente].rotado = 'marcadoNegroLleno';

      }
      else if (this.color == 11) {
        this.limpiarAbajo1(diente);
        this.dientesAbajo1[diente].endodoncia = 'marcadoNegroLleno';

      }
      else if (this.color == 12) {
        this.limpiarEspecialesAbajo1(diente);
        this.dientesAbajo1[diente].classAbajo = 'marcadoGris';
      }
      else if (this.color == 13) {
        this.limpiarAbajo1(diente);
        this.dientesAbajo1[diente].erupcionado = 'marcadoNegroLleno';
      }
      else if (this.color == 14) {
        this.limpiarAbajo1(diente);
        this.dientesAbajo1[diente].sellanteDesadaptado = 'marcadoRojo';
      }
      else if (this.color == 15) {
        this.limpiarAbajo1(diente);
        this.dientesAbajo1[diente].coronaDestruida = 'marcadoMagenta';
      }
      else if (this.color == 16) {
        this.limpiarAbajo1(diente);
        this.dientesAbajo1[diente].sano = 'marcadoMarron';
      }
      else if (this.color == 17) {
        this.limpiarEspecialesAbajo1(diente);
        this.dientesAbajo1[diente].classAbajo = 'marcadoGrisRojo';
      }
      else if (this.color == 18) {
        this.limpiarAbajo1(diente);
        this.dientesAbajo1[diente].endodonciaIndicada = 'marcadoRojo';
      }
      else if (this.color == 19) {
        this.limpiarAbajo1(diente);
        this.dientesAbajo1[diente].coronaDesadaptada = 'marcadoAzulRojo';
      }
      else if (this.color == 20) {
        this.limpiarAbajo1(diente);
        this.dientesAbajo1[diente].exodonciaIndicada = 'marcadoRojo';
      }
      else if (this.color == 21) {
        this.limpiarAbajo1(diente);
        this.dientesAbajo1[diente].sellante = 'marcadoAzul';
      }
    }
    let json: {} = {};
    json['dientesArriba1'] = this.dientesArriba1;
    json['dientesAbajo1'] = this.dientesAbajo1;
    let jsonOdontograma = JSON.stringify(json);
    this.odontogramaOutput.emit(jsonOdontograma);
  }
  cambiarColorArriba1(diente: number, posicion: String) {
    if (posicion === "Arriba") {
      if (this.color == 1) {
        this.limpiarEspecialesArriba1(diente);
        this.dientesArriba1[diente].classArriba = 'diente';
      }
      else if (this.color == 2) {
        this.limpiarArriba1(diente);
        this.dientesArriba1[diente].implante = 'marcadoMorado';
      }
      else if (this.color == 3) {
        this.limpiarArriba1(diente);
        this.dientesArriba1[diente].ausente = 'marcadoNegroLleno';
      }
      else if (this.color == 4) {
        this.limpiarEspecialesArriba1(diente);
        this.dientesArriba1[diente].classArriba = 'marcadoMarron';
      }
      else if (this.color == 5) {
        this.limpiarEspecialesArriba1(diente);
        this.dientesArriba1[diente].classArriba = 'marcadoRojo';
      }
      else if (this.color == 6) {
        this.limpiarEspecialesArriba1(diente);
        this.dientesArriba1[diente].classArriba = 'marcadoVerdeRojo';
      }
      else if (this.color == 7) {
        this.limpiarArriba1(diente);
        this.dientesArriba1[diente].corona = 'marcadoAzul';
      }
      else if (this.color == 8) {
        this.limpiarArriba1(diente);
        this.dientesArriba1[diente].retenido = 'marcadoNegroLleno';

      }
      else if (this.color == 9) {
        this.limpiarArriba1(diente);
        this.dientesArriba1[diente].fracturado = 'marcadoNegroLleno';

      }
      else if (this.color == 10) {
        this.limpiarArriba1(diente);
        this.dientesArriba1[diente].rotado = 'marcadoNegroLleno';

      }
      else if (this.color == 11) {
        this.limpiarArriba1(diente);
        this.dientesArriba1[diente].endodoncia = 'marcadoNegroLleno';

      }
      else if (this.color == 12) {
        this.limpiarEspecialesArriba1(diente);
        this.dientesArriba1[diente].classArriba = 'marcadoGris';
      }
      else if (this.color == 13) {
        this.limpiarArriba1(diente);
        this.dientesArriba1[diente].erupcionado = 'marcadoNegroLleno';
      }
      else if (this.color == 14) {
        this.limpiarArriba1(diente);
        this.dientesArriba1[diente].sellanteDesadaptado = 'marcadoRojo';
      }
      else if (this.color == 15) {
        this.limpiarArriba1(diente);
        this.dientesArriba1[diente].coronaDestruida = 'marcadoMagenta';
      }
      else if (this.color == 16) {
        this.limpiarArriba1(diente);
        this.dientesArriba1[diente].sano = 'marcadoMarron';
      }
      else if (this.color == 17) {
        this.limpiarEspecialesArriba1(diente);
        this.dientesArriba1[diente].classArriba = 'marcadoGrisRojo';
      }
      else if (this.color == 18) {
        this.limpiarArriba1(diente);
        this.dientesArriba1[diente].endodonciaIndicada = 'marcadoRojo';
      }
      else if (this.color == 19) {
        this.limpiarArriba1(diente);
        this.dientesArriba1[diente].coronaDesadaptada = 'marcadoAzulRojo';
      }
      else if (this.color == 20) {
        this.limpiarArriba1(diente);
        this.dientesArriba1[diente].exodonciaIndicada = 'marcadoRojo';
      }
      else if (this.color == 21) {
        this.limpiarArriba1(diente);
        this.dientesArriba1[diente].sellante = 'marcadoAzul';
      }
    }
    else if (posicion === "Derecha") {
      if (this.color == 1) {
        this.limpiarEspecialesArriba1(diente);
        this.dientesArriba1[diente].classDerecha = 'diente';
      }
      else if (this.color == 2) {
        this.limpiarArriba1(diente);
        this.dientesArriba1[diente].implante = 'marcadoMorado';
      }
      else if (this.color == 3) {
        this.limpiarArriba1(diente);
        this.dientesArriba1[diente].ausente = 'marcadoNegroLleno';
      }
      else if (this.color == 4) {
        this.limpiarEspecialesArriba1(diente);
        this.dientesArriba1[diente].classDerecha = 'marcadoMarron';
      }
      else if (this.color == 5) {
        this.limpiarEspecialesArriba1(diente);
        this.dientesArriba1[diente].classDerecha = 'marcadoRojo';
      }
      else if (this.color == 6) {
        this.limpiarEspecialesArriba1(diente);
        this.dientesArriba1[diente].classDerecha = 'marcadoVerdeRojo';
      }
      else if (this.color == 7) {
        this.limpiarArriba1(diente);
        this.dientesArriba1[diente].corona = 'marcadoAzul';
      }
      else if (this.color == 8) {
        this.limpiarArriba1(diente);
        this.dientesArriba1[diente].retenido = 'marcadoNegroLleno';

      }
      else if (this.color == 9) {
        this.limpiarArriba1(diente);
        this.dientesArriba1[diente].fracturado = 'marcadoNegroLleno';

      }
      else if (this.color == 10) {
        this.limpiarArriba1(diente);
        this.dientesArriba1[diente].rotado = 'marcadoNegroLleno';

      }
      else if (this.color == 11) {
        this.limpiarArriba1(diente);
        this.dientesArriba1[diente].endodoncia = 'marcadoNegroLleno';

      }
      else if (this.color == 12) {
        this.limpiarEspecialesArriba1(diente);
        this.dientesArriba1[diente].classDerecha = 'marcadoGris';
      }
      else if (this.color == 13) {
        this.limpiarArriba1(diente);
        this.dientesArriba1[diente].erupcionado = 'marcadoNegroLleno';
      }
      else if (this.color == 14) {
        this.limpiarArriba1(diente);
        this.dientesArriba1[diente].sellanteDesadaptado = 'marcadoRojo';
      }
      else if (this.color == 15) {
        this.limpiarArriba1(diente);
        this.dientesArriba1[diente].coronaDestruida = 'marcadoMagenta';
      }
      else if (this.color == 16) {
        this.limpiarArriba1(diente);
        this.dientesArriba1[diente].sano = 'marcadoMarron';
      }
      else if (this.color == 17) {
        this.limpiarEspecialesArriba1(diente);
        this.dientesArriba1[diente].classDerecha = 'marcadoGrisRojo';
      }
      else if (this.color == 18) {
        this.limpiarArriba1(diente);
        this.dientesArriba1[diente].endodonciaIndicada = 'marcadoRojo';
      }
      else if (this.color == 19) {
        this.limpiarArriba1(diente);
        this.dientesArriba1[diente].coronaDesadaptada = 'marcadoAzulRojo';
      }
      else if (this.color == 20) {
        this.limpiarArriba1(diente);
        this.dientesArriba1[diente].exodonciaIndicada = 'marcadoRojo';
      }
      else if (this.color == 21) {
        this.limpiarArriba1(diente);
        this.dientesArriba1[diente].sellante = 'marcadoAzul';
      }
    }
    else if (posicion === "Izquierda") {
      if (this.color == 1) {
        this.limpiarEspecialesArriba1(diente);
        this.dientesArriba1[diente].classIzquierda = 'diente';
      }
      else if (this.color == 2) {
        this.limpiarArriba1(diente);
        this.dientesArriba1[diente].implante = 'marcadoMorado';
      }
      else if (this.color == 3) {
        this.limpiarArriba1(diente);
        this.dientesArriba1[diente].ausente = 'marcadoNegroLleno';
      }
      else if (this.color == 4) {
        this.limpiarEspecialesArriba1(diente);
        this.dientesArriba1[diente].classIzquierda = 'marcadoMarron';
      }
      else if (this.color == 5) {
        this.limpiarEspecialesArriba1(diente);
        this.dientesArriba1[diente].classIzquierda = 'marcadoRojo';
      }
      else if (this.color == 6) {
        this.limpiarEspecialesArriba1(diente);
        this.dientesArriba1[diente].classIzquierda = 'marcadoVerdeRojo';
      }
      else if (this.color == 7) {
        this.limpiarArriba1(diente);
        this.dientesArriba1[diente].corona = 'marcadoAzul';
      }
      else if (this.color == 8) {
        this.limpiarArriba1(diente);
        this.dientesArriba1[diente].retenido = 'marcadoNegroLleno';

      }
      else if (this.color == 9) {
        this.limpiarArriba1(diente);
        this.dientesArriba1[diente].fracturado = 'marcadoNegroLleno';

      }
      else if (this.color == 10) {
        this.limpiarArriba1(diente);
        this.dientesArriba1[diente].rotado = 'marcadoNegroLleno';

      }
      else if (this.color == 11) {
        this.limpiarArriba1(diente);
        this.dientesArriba1[diente].endodoncia = 'marcadoNegroLleno';

      }
      else if (this.color == 12) {
        this.limpiarEspecialesArriba1(diente);
        this.dientesArriba1[diente].classIzquierda = 'marcadoGris';
      }
      else if (this.color == 13) {
        this.limpiarArriba1(diente);
        this.dientesArriba1[diente].erupcionado = 'marcadoNegroLleno';
      }
      else if (this.color == 14) {
        this.limpiarArriba1(diente);
        this.dientesArriba1[diente].sellanteDesadaptado = 'marcadoRojo';
      }
      else if (this.color == 15) {
        this.limpiarArriba1(diente);
        this.dientesArriba1[diente].coronaDestruida = 'marcadoMagenta';
      }
      else if (this.color == 16) {
        this.limpiarArriba1(diente);
        this.dientesArriba1[diente].sano = 'marcadoMarron';
      }
      else if (this.color == 17) {
        this.limpiarEspecialesArriba1(diente);
        this.dientesArriba1[diente].classIzquierda = 'marcadoGrisRojo';
      }
      else if (this.color == 18) {
        this.limpiarArriba1(diente);
        this.dientesArriba1[diente].endodonciaIndicada = 'marcadoRojo';
      }
      else if (this.color == 19) {
        this.limpiarArriba1(diente);
        this.dientesArriba1[diente].coronaDesadaptada = 'marcadoAzulRojo';
      }
      else if (this.color == 20) {
        this.limpiarArriba1(diente);
        this.dientesArriba1[diente].exodonciaIndicada = 'marcadoRojo';
      }
      else if (this.color == 21) {
        this.limpiarArriba1(diente);
        this.dientesArriba1[diente].sellante = 'marcadoAzul';
      }
    }
    else if (posicion === "Centro") {
      if (this.color == 1) {
        this.limpiarEspecialesArriba1(diente);
        this.dientesArriba1[diente].classCentro = 'diente';
      }
      else if (this.color == 2) {
        this.limpiarArriba1(diente);
        this.dientesArriba1[diente].implante = 'marcadoMorado';
      }
      else if (this.color == 3) {
        this.limpiarArriba1(diente);
        this.dientesArriba1[diente].ausente = 'marcadoNegroLleno';
      }
      else if (this.color == 4) {
        this.limpiarEspecialesArriba1(diente);
        this.dientesArriba1[diente].classCentro = 'marcadoMarron';
      }
      else if (this.color == 5) {
        this.limpiarEspecialesArriba1(diente);
        this.dientesArriba1[diente].classCentro = 'marcadoRojo';
      }
      else if (this.color == 6) {
        this.limpiarEspecialesArriba1(diente);
        this.dientesArriba1[diente].classCentro = 'marcadoVerdeRojo';
      }
      else if (this.color == 7) {
        this.limpiarArriba1(diente);
        this.dientesArriba1[diente].corona = 'marcadoAzul';
      }
      else if (this.color == 8) {
        this.limpiarArriba1(diente);
        this.dientesArriba1[diente].retenido = 'marcadoNegroLleno';

      }
      else if (this.color == 9) {
        this.limpiarArriba1(diente);
        this.dientesArriba1[diente].fracturado = 'marcadoNegroLleno';

      }
      else if (this.color == 10) {
        this.limpiarArriba1(diente);
        this.dientesArriba1[diente].rotado = 'marcadoNegroLleno';

      }
      else if (this.color == 11) {
        this.limpiarArriba1(diente);
        this.dientesArriba1[diente].endodoncia = 'marcadoNegroLleno';

      }
      else if (this.color == 12) {
        this.limpiarEspecialesArriba1(diente);
        this.dientesArriba1[diente].classCentro = 'marcadoGris';
      }
      else if (this.color == 13) {
        this.limpiarArriba1(diente);
        this.dientesArriba1[diente].erupcionado = 'marcadoNegroLleno';
      }
      else if (this.color == 14) {
        this.limpiarArriba1(diente);
        this.dientesArriba1[diente].sellanteDesadaptado = 'marcadoRojo';
      }
      else if (this.color == 15) {
        this.limpiarArriba1(diente);
        this.dientesArriba1[diente].coronaDestruida = 'marcadoMagenta';
      }
      else if (this.color == 16) {
        this.limpiarArriba1(diente);
        this.dientesArriba1[diente].sano = 'marcadoMarron';
      }
      else if (this.color == 17) {
        this.limpiarEspecialesArriba1(diente);
        this.dientesArriba1[diente].classCentro = 'marcadoGrisRojo';
      }
      else if (this.color == 18) {
        this.limpiarArriba1(diente);
        this.dientesArriba1[diente].endodonciaIndicada = 'marcadoRojo';
      }
      else if (this.color == 19) {
        this.limpiarArriba1(diente);
        this.dientesArriba1[diente].coronaDesadaptada = 'marcadoAzulRojo';
      }
      else if (this.color == 20) {
        this.limpiarArriba1(diente);
        this.dientesArriba1[diente].exodonciaIndicada = 'marcadoRojo';
      }
      else if (this.color == 21) {
        this.limpiarArriba1(diente);
        this.dientesArriba1[diente].sellante = 'marcadoAzul';
      }
    }
    else if (posicion === "Abajo") {
      if (this.color == 1) {
        this.limpiarEspecialesArriba1(diente);
        this.dientesArriba1[diente].classAbajo = 'diente';
      }
      else if (this.color == 2) {
        this.limpiarArriba1(diente);
        this.dientesArriba1[diente].implante = 'marcadoMorado';
      }
      else if (this.color == 3) {
        this.limpiarArriba1(diente);
        this.dientesArriba1[diente].ausente = 'marcadoNegroLleno';
      }
      else if (this.color == 4) {
        this.limpiarEspecialesArriba1(diente);
        this.dientesArriba1[diente].classAbajo = 'marcadoMarron';
      }
      else if (this.color == 5) {
        this.limpiarEspecialesArriba1(diente);
        this.dientesArriba1[diente].classAbajo = 'marcadoRojo';
      }
      else if (this.color == 6) {
        this.limpiarEspecialesArriba1(diente);
        this.dientesArriba1[diente].classAbajo = 'marcadoVerdeRojo';
      }
      else if (this.color == 7) {
        this.limpiarArriba1(diente);
        this.dientesArriba1[diente].corona = 'marcadoAzul';
      }
      else if (this.color == 8) {
        this.limpiarArriba1(diente);
        this.dientesArriba1[diente].retenido = 'marcadoNegroLleno';

      }
      else if (this.color == 9) {
        this.limpiarArriba1(diente);
        this.dientesArriba1[diente].fracturado = 'marcadoNegroLleno';

      }
      else if (this.color == 10) {
        this.limpiarArriba1(diente);
        this.dientesArriba1[diente].rotado = 'marcadoNegroLleno';

      }
      else if (this.color == 11) {
        this.limpiarArriba1(diente);
        this.dientesArriba1[diente].endodoncia = 'marcadoNegroLleno';

      }
      else if (this.color == 12) {
        this.limpiarEspecialesArriba1(diente);
        this.dientesArriba1[diente].classAbajo = 'marcadoGris';
      }
      else if (this.color == 13) {
        this.limpiarArriba1(diente);
        this.dientesArriba1[diente].erupcionado = 'marcadoNegroLleno';
      }
      else if (this.color == 14) {
        this.limpiarArriba1(diente);
        this.dientesArriba1[diente].sellanteDesadaptado = 'marcadoRojo';
      }
      else if (this.color == 15) {
        this.limpiarArriba1(diente);
        this.dientesArriba1[diente].coronaDestruida = 'marcadoMagenta';
      }
      else if (this.color == 16) {
        this.limpiarArriba1(diente);
        this.dientesArriba1[diente].sano = 'marcadoMarron';
      }
      else if (this.color == 17) {
        this.limpiarEspecialesArriba1(diente);
        this.dientesArriba1[diente].classAbajo = 'marcadoGrisRojo';
      }
      else if (this.color == 18) {
        this.limpiarArriba1(diente);
        this.dientesArriba1[diente].endodonciaIndicada = 'marcadoRojo';
      }
      else if (this.color == 19) {
        this.limpiarArriba1(diente);
        this.dientesArriba1[diente].coronaDesadaptada = 'marcadoAzulRojo';
      }
      else if (this.color == 20) {
        this.limpiarArriba1(diente);
        this.dientesArriba1[diente].exodonciaIndicada = 'marcadoRojo';
      }
      else if (this.color == 21) {
        this.limpiarArriba1(diente);
        this.dientesArriba1[diente].sellante = 'marcadoAzul';
      }
    }
    let json: {} = {};
    json['dientesArriba1'] = this.dientesArriba1;
    json['dientesAbajo1'] = this.dientesAbajo1;
    let jsonOdontograma = JSON.stringify(json);
    this.odontogramaOutput.emit(jsonOdontograma);
  }
  limpiarArriba1(diente: number) {
    this.dientesArriba1[diente].classArriba = 'diente';
    this.dientesArriba1[diente].classAbajo = 'diente';
    this.dientesArriba1[diente].classIzquierda = 'diente';
    this.dientesArriba1[diente].classDerecha = 'diente';
    this.dientesArriba1[diente].classCentro = 'diente';
    this.dientesArriba1[diente].implante = 'invisible';
    this.dientesArriba1[diente].ausente = 'invisible';
    this.dientesArriba1[diente].corona = 'invisible';
    this.dientesArriba1[diente].retenido = 'invisible';
    this.dientesArriba1[diente].fracturado = 'invisible';
    this.dientesArriba1[diente].rotado = 'invisible';
    this.dientesArriba1[diente].endodoncia = 'invisible';
    this.dientesArriba1[diente].erupcionado = 'invisible';
    this.dientesArriba1[diente].sellanteDesadaptado = 'invisible';
    this.dientesArriba1[diente].coronaDestruida = 'invisible';
    this.dientesArriba1[diente].coronaDesadaptada = 'invisible';
    this.dientesArriba1[diente].sano = 'invisible';
    this.dientesArriba1[diente].endodonciaIndicada = 'invisible';
    this.dientesArriba1[diente].exodonciaIndicada = 'invisible';
    this.dientesArriba1[diente].sellante = 'invisible';
  }
  limpiarEspecialesArriba1(diente: number) {
    this.dientesArriba1[diente].implante = 'invisible';
    this.dientesArriba1[diente].ausente = 'invisible';
    this.dientesArriba1[diente].corona = 'invisible';
    this.dientesArriba1[diente].retenido = 'invisible';
    this.dientesArriba1[diente].fracturado = 'invisible';
    this.dientesArriba1[diente].rotado = 'invisible';
    this.dientesArriba1[diente].endodoncia = 'invisible';
    this.dientesArriba1[diente].erupcionado = 'invisible';
    this.dientesArriba1[diente].sellanteDesadaptado = 'invisible';
    this.dientesArriba1[diente].coronaDestruida = 'invisible';
    this.dientesArriba1[diente].sano = 'invisible';
    this.dientesArriba1[diente].endodonciaIndicada = 'invisible';
    this.dientesArriba1[diente].coronaDesadaptada = 'invisible';
    this.dientesArriba1[diente].exodonciaIndicada = 'invisible';
    this.dientesArriba1[diente].sellante = 'invisible';
  }
  limpiarAbajo1(diente: number) {
    this.dientesAbajo1[diente].classArriba = 'diente';
    this.dientesAbajo1[diente].classAbajo = 'diente';
    this.dientesAbajo1[diente].classIzquierda = 'diente';
    this.dientesAbajo1[diente].classDerecha = 'diente';
    this.dientesAbajo1[diente].classCentro = 'diente';
    this.dientesAbajo1[diente].implante = 'invisible';
    this.dientesAbajo1[diente].ausente = 'invisible';
    this.dientesAbajo1[diente].corona = 'invisible';
    this.dientesAbajo1[diente].retenido = 'invisible';
    this.dientesAbajo1[diente].fracturado = 'invisible';
    this.dientesAbajo1[diente].rotado = 'invisible';
    this.dientesAbajo1[diente].endodoncia = 'invisible';
    this.dientesAbajo1[diente].erupcionado = 'invisible';
    this.dientesAbajo1[diente].sellanteDesadaptado = 'invisible';
    this.dientesAbajo1[diente].coronaDestruida = 'invisible';
    this.dientesAbajo1[diente].sano = 'invisible';
    this.dientesAbajo1[diente].endodonciaIndicada = 'invisible';
    this.dientesAbajo1[diente].coronaDesadaptada = 'invisible';
    this.dientesAbajo1[diente].exodonciaIndicada = 'invisible';
    this.dientesAbajo1[diente].sellante = 'invisible';
  }
  limpiarEspecialesAbajo1(diente: number) {
    this.dientesAbajo1[diente].implante = 'invisible';
    this.dientesAbajo1[diente].ausente = 'invisible';
    this.dientesAbajo1[diente].corona = 'invisible';
    this.dientesAbajo1[diente].retenido = 'invisible';
    this.dientesAbajo1[diente].fracturado = 'invisible';
    this.dientesAbajo1[diente].rotado = 'invisible';
    this.dientesAbajo1[diente].endodoncia = 'invisible';
    this.dientesAbajo1[diente].erupcionado = 'invisible';
    this.dientesAbajo1[diente].sellanteDesadaptado = 'invisible';
    this.dientesAbajo1[diente].coronaDestruida = 'invisible';
    this.dientesAbajo1[diente].sano = 'invisible';
    this.dientesAbajo1[diente].endodonciaIndicada = 'invisible';
    this.dientesAbajo1[diente].coronaDesadaptada = 'invisible';
    this.dientesAbajo1[diente].exodonciaIndicada = 'invisible';
    this.dientesAbajo1[diente].sellante = 'invisible';
  }
  guardarOdontograma() {
    let json: {} = {};
    json['dientesArriba1'] = this.dientesArriba1;
    json['dientesAbajo1'] = this.dientesAbajo1;
    let jsonOdontograma = JSON.stringify(json);
    if (!this.odontograma) {
      const odontograma: Odontograma = {
        HistoriaClinicaId: this.Historia.Id,
        IdHojaHistoria: this.HojaHistoria.Id,
        Id: 0,
        Observaciones: this.odontogramaForm.controls.observaciones.value,
        IdTipoOdontograma: this.tipoOdontograma,
        Diagrama: jsonOdontograma,
        FechaCreacion: new Date(),
        FechaModificacion: new Date(),
        Activo: true
      };
      this.saludService.postOdontograma(odontograma).subscribe(data => {
        console.log('Lingual: ' + data['Data']);
        this.saludService.falloPsico = false;
      }, error => {
        this.saludService.falloPsico = true;
      });
    }
    if (this.odontograma) {
      const odontograma: Odontograma = {
        HistoriaClinicaId: this.Historia.Id,
        IdHojaHistoria: this.HojaHistoria.Id,
        Id: this.odontograma.Id,
        Observaciones: this.odontogramaForm.controls.observaciones.value,
        IdTipoOdontograma: this.tipoOdontograma,
        Diagrama: jsonOdontograma,
        FechaCreacion: this.odontograma.FechaCreacion,
        FechaModificacion: new Date(),
        Activo: true
      };
      this.saludService.putOdontograma(odontograma.Id, odontograma).subscribe(data => {
        console.log('Lingual: ' + data['Data']);
        this.saludService.falloPsico = false;
      }, error => {
        this.saludService.falloPsico = true;
      });
    }
    if (this.saludService.falloPsico === false) {
      this.toastr.success(`Ha registrado con éxito el odontograma lingual infantil para: ${this.paciente}`, '¡Guardado!');
      // window.location.reload();
    } else {
      this.toastr.error('Ha ocurrido un error al guardar el odontograma', 'Error');
    }
  }
  getOdontogramaEspecifico(HojaHistoriaId) {
    this.saludService.getOdontograma(HojaHistoriaId, 3).subscribe(data => {
      this.odontograma = data['Data'][0];
      // console.log(this.odontograma);
      if (this.odontograma) {
        let json = JSON.parse(this.odontograma.Diagrama);
        this.dientesArriba = json.dientesArriba1;
        this.dientesAbajo = json.dientesAbajo1;
        this.dientesArriba1 = json.dientesArriba1;
        this.dientesAbajo1 = json.dientesAbajo1;
        
      }
      let json: {} = {};
      json['dientesArriba'] = this.dientesArriba;
      json['dientesAbajo'] = this.dientesAbajo;
      json['dientesArriba1'] = this.dientesArriba1;
      json['dientesAbajo1'] = this.dientesAbajo1;
      let jsonOdontograma = JSON.stringify(json);
      this.odontogramaOutput.emit(jsonOdontograma);
    });
  }

  getInfoOdontograma() {
    this.saludService.getTipoOdontograma(3).subscribe((data: any) => {
      this.tipoOdontograma = data['Data'];
    });
    this.saludService.getHistoriaClinica(this.terceroId).subscribe((data: any) => {
      this.Historia = data['Data'][0];
      this.saludService.getHojaHistoria(this.terceroId, 3).subscribe(data => {//Reemplazar por terceroId
        //console.log(data);
        if (JSON.stringify(data['Data'][0]) === '{}') {
          let json: {} = {};
          json['dientesArriba'] = this.dientesArriba;
          json['dientesAbajo'] = this.dientesAbajo;
          json['dientesArriba1'] = this.dientesArriba1;
          json['dientesAbajo1'] = this.dientesAbajo1;
          let jsonOdontograma = JSON.stringify(json);
          this.odontogramaOutput.emit(jsonOdontograma);
        } else {
          this.saludService.getOdontogramas(this.Historia.Id, 3).subscribe(data => {
            this.odontograma = data['Data'][0];
            // console.log(this.odontograma);
            if (this.odontograma) {
              let json = JSON.parse(this.odontograma.Diagrama);
              this.dientesArriba1 = json.dientesArriba1;
              this.dientesAbajo1 = json.dientesAbajo1;
            }
            let json: {} = {};
            json['dientesArriba1'] = this.dientesArriba1;
            json['dientesAbajo1'] = this.dientesAbajo1;
            json['dientesArriba'] = this.dientesArriba1;
            json['dientesAbajo'] = this.dientesAbajo1;
            let jsonOdontograma = JSON.stringify(json);
            this.odontogramaOutput.emit(jsonOdontograma);
          });
        }
      });
    });
  }
  limpiarOdontograma(){
    this.dientesArriba1 = this.defaultArriba;
    this.dientesAbajo1 = this.defaultAbajo;
    let json: {} = {};
    json['dientesArriba1'] = this.dientesArriba1;
    json['dientesAbajo1'] = this.dientesAbajo1;
    json['dientesArriba'] = this.dientesArriba1;
    json['dientesAbajo'] = this.dientesAbajo1;
    let jsonOdontograma = JSON.stringify(json);
    this.odontogramaOutput.emit(jsonOdontograma);
  }
  ngOnInit(): void {
    this.terceroId = this.aRoute.snapshot.paramMap.get('terceroId');
    this.personaService.getEstudiante(this.saludService.IdPersona).subscribe((data: any) => {
      var paciente = data.datosEstudianteCollection.datosBasicosEstudiante[0];
      this.paciente = paciente.nombre;
    });
    this.getInfoOdontograma();
  }
  constructor(private fb: FormBuilder, private toastr: ToastrService, private personaService: EstudiantesService, private saludService: SaludService, private aRoute: ActivatedRoute)
   {

  };



}