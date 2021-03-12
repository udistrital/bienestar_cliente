import { Component, OnInit } from '@angular/core';
import { PeriodoModel } from '../../modelos/perido.model'
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
import { Observable } from 'rxjs';
import { PeriodosService } from '../../servicios/periodos.service'
import { ActivatedRoute, Router } from '@angular/router';
import { ListService } from '../../../../@core/store/list.service';
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
  periodo: number;
  inscripcion: number;
  periodos: any;
  constructor(private periodosService: PeriodosService,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<IAppState>,
    private listService: ListService) {
      this.listService.findPeriodoAcademico();
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
        this.periodos=list;
      },
    );
  }

  ngOnInit(): void {
    /* const id = this.route.snapshot.paramMap.get('id');
    if (id !== "nuevo") {
      this.periodosService.getPeriodo(id)
        .subscribe((resp: PeriodoModel) => {
          this.periodo = resp;
        });
    } */

  }
 /*  getIndexForm(nombre: String): number {
    for (let index = 0; index < this.formDocumentoPrograma.campos.length; index++) {
      const element = this.formDocumentoPrograma.campos[index];
      if (element.nombre === nombre) {
        return index
      }
    }
    return 0;
  } */

 /*  guardar(form: NgForm) {
    if (form.invalid) {
      Object.values(form.controls).forEach(control => {
        control.markAsTouched();
      });
      return;
    }

    let peticion: Observable<any>;

    if (this.periodo.id) {
      peticion = this.periodosService.actualizar(this.periodo);
    } else {
      peticion = this.periodosService.crearPeriodo(this.periodo);
    }


    peticion.subscribe(resp => {
      this.router.navigateByUrl('/periodos');
           
    });

  } */

}
