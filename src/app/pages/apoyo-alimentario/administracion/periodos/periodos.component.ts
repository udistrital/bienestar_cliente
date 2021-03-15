import { Component, OnInit } from '@angular/core';

import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
import { Observable } from 'rxjs';
import { PeriodosService } from '../../servicios/periodos.service'
import { ActivatedRoute, Router } from '@angular/router';
import { ListService } from '../../../../@core/store/list.service';
import { Periodo } from '../../../../@core/data/models/parametro/periodo'
import { IAppState } from '../../../../@core/store/app.state';
import { Store } from '@ngrx/store';
import { ToasterService, ToasterConfig, Toast, BodyOutputType } from 'angular2-toaster';


@Component({
  selector: 'ngx-periodos',
  templateUrl: './periodos.component.html',
  styleUrls: ['./periodos.component.scss']
})
export class PeriodosComponent implements OnInit {
  config: ToasterConfig;
  documento_programa_id: number;
  filesUp: any;
  Documento: any;
  persona: number;
  programa: number;
  inscripcion: number;
  periodos: Periodo []=[]
  constructor(private periodosService: PeriodosService,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<IAppState>,
    private listService: ListService) {
      this.listService.findPeriodosAcademico();
      this.loadLists();
  }
  /* public loadLists() {
    this.store.select((state) => state).subscribe(
      (list) => {
        if (list.listDocumentoPrograma[0]) {
          this.formDocumentoPrograma.campos[this.getIndexForm('DocumentoProgramaId')].opciones = list.listDocumentoPrograma[0].map((documentoPrograma) => {
            return {
              Id: documentoPrograma.Id,
              Nombre: documentoPrograma.TipoDocumentoProgramaId.Id + '. ' + documentoPrograma.TipoDocumentoProgramaId.Nombre,
            }
          });
        }
      },
   );
  } */
  public loadLists() {
    this.store.select((state) => state).subscribe(
      (list) => {
        const listPA=list.listPeriodoAcademico
        if ( listPA.length > 0){
          /* console.info(listPA[0]['Data']) */
          const periodos = <Array<Periodo>>listPA[0]['Data'];
          periodos.forEach(element => {
             this.periodos.push(element);
         });
          /* const periodos = <Array<any>>listPA[0];
          console.info(periodos['Data']) */
        }
      },
    );
  }

  ngOnInit(): void {
    
  }
  iniciarInscripciones (periodo: Periodo, i: number ){
 
    Swal.fire({
      title: 'Está seguro?',
      text: `Está seguro que desea iniciar ${ periodo.Nombre }`,
      type: 'question',
      showConfirmButton: true,
      showCancelButton: true}
    ).then(resp =>{
      if( resp.value ){
        this.listService.inciarInscripcionesPeriodo(periodo)
        /* this.periodos[i].estado= "activo";
        this.periodosService.actualizar(this.periodos[i]).subscribe(); */
      }
    });
  }

}
