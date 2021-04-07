import { Component, OnInit } from '@angular/core';
import { NgForm } from "@angular/forms";
import { IAppState } from '../../../../@core/store/app.state';
import { Store } from '@ngrx/store';
import { ListService } from '../../../../@core/store/list.service';
import { Periodo } from '../../../../@core/data/models/parametro/periodo';
import { TercerosService } from '../../../../@core/data/terceros.service';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';
import { SolicitudService } from '../../../../@core/data/solicitud.service';
import { Solicitante } from '../../../../@core/data/models/solicitud/solicitante';
import { Solicitud } from '../../../../@core/data/models/solicitud/solicitud';
import { environment } from '../../../../../environments/environment';
import { ReferenciaSolicitud } from '../../../../@core/data/models/solicitud/referencia-solicitud';
import { Tercero } from '../../../../@core/data/models/terceros/tercero';
import { Router } from '@angular/router'

@Component({
  selector: 'ngx-buscar-solicitud',
  templateUrl: './buscar-solicitud.component.html',
  styleUrls: ['./buscar-solicitud.component.scss']
})
export class BuscarSolicitudComponent implements OnInit {

  periodos = [];
  periodo : number = 0;
  codigo = "";

  constructor(
    private router: Router,
    private store: Store<IAppState>,
    private listService: ListService,
    private tercerosService: TercerosService,
    private solicitudService: SolicitudService,
    private translate: TranslateService
  ) {
    this.listService.findPeriodosAcademico();
    this.loadLists();
  }

  public loadLists() {
    this.store.select((state) => state).subscribe(
      (list) => {
        const listPA = list.listPeriodoAcademico
        if (listPA.length > 0 && this.periodos.length === 0) {
          const periodos = <Array<Periodo>>listPA[0]['Data'];
          periodos.forEach(element => {
            this.periodos.push(element);
          })
        }
      },
    );
  }

  ngOnInit() {
  }

  buscar(form: NgForm) {
    if (form.invalid || this.periodos.length === 0) {
      Object.values(form.controls).forEach((control) => {
        control.markAsTouched();
      });
      return;
    }
    this.loadTerceroByDocumento(this.codigo).then((resp) => {
      const terceroReg: Tercero = resp;

      if (terceroReg !== undefined) {
        this.loadSolicitudPeriodo(terceroReg.Id, this.periodos[this.periodo].Nombre).then((sol) => {
          this.router.navigate(['/pages/apoyo-alimentario/inscripciones/solicitudes/'+sol.Id],);
        }).catch(
          (err) => Swal.fire("Error",
          `<p>${err}</p>`,"error")
        );
      } else {
        Swal.fire("Error",
        `<p>No se encuentra el tercero</p>`,"error");
      }

    }

    ).catch(
      (error) => {
        Swal.fire("Error",
        `<p>${error}</p>`,"error");
      }
    );

  }


  private loadTerceroByDocumento(documento: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.tercerosService
        .get(`datos_identificacion?query=Numero:${documento}`)
        .subscribe(
          (result) => {
            resolve(result[0].TerceroId);
          },
          (error: HttpErrorResponse) => {
            Swal.fire({
              icon: "error",
              title: error.status + "",
              text: this.translate.instant("ERROR." + error.status),
              footer:
                this.translate.instant("GLOBAL.cargar") +
                "-" +
                this.translate.instant("GLOBAL.info_complementaria"),
              confirmButtonText: this.translate.instant("GLOBAL.aceptar"),
            });
            reject(error);
          }
        );
    });
  }

  /* Carga informacion un tercero */
  public loadSolicitudPeriodo(terceroId : number, nomPeriodo : String): Promise<any> {
    return new Promise((resolve, reject) => {
      /* Cargamos solicitud */
      this.solicitudService
        .get(`solicitante?query=TerceroId:${terceroId}`)
        .subscribe(
          (result: any[]) => {
            let solicitante: Solicitante;
            if (Object.keys(result[0]).length > 0) {
              /* Consultamos las solicitudes de un solicitante */
              for (solicitante of result) {
                const sol: Solicitud = solicitante.SolicitudId;
                /* Se busca una solicitud radicada */
                if (
                  sol.EstadoTipoSolicitudId.Id ===
                  environment.IDS.IDSOLICITUDRADICADA
                ) {
                  /* Se busca una referencia correspondiente al periodo actual */
                  let refSol: ReferenciaSolicitud;
                  try {
                    refSol = JSON.parse(sol.Referencia);
                    if (refSol != null) {
                      if (refSol.Periodo === nomPeriodo) {
                        resolve(sol);
                      }
                    }
                  } catch (error) {
                    reject(error);
                  }
                }

              }
              reject("No se encontro ningunas solicitud asociada al "+nomPeriodo);

            }else{
              reject("El usuario no tiene solicitudes");
            }
          });
    });
  }
}


