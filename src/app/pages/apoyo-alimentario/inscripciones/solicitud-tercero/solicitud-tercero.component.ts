import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { environment } from '../../../../../environments/environment';
import { Periodo } from '../../../../@core/data/models/parametro/periodo';
import { ListService } from '../../../../@core/store/list.service';
import { IAppState } from '../../../../@core/store/app.state';
import { Store } from '@ngrx/store';
import { ParametroPeriodo } from '../../../../@core/data/models/parametro/parametro_periodo';
import { delay, switchMap } from 'rxjs/operators';
import { Solicitud } from '../../../../@core/data/models/solicitud/solicitud';
import { ImplicitAutenticationService } from '../../../../@core/utils/implicit_autentication.service';
import { Tercero } from '../../../../@core/data/models/terceros/tercero';
import { TercerosService } from '../../../../@core/data/terceros.service';
import { SolicitudService } from '../../../../@core/data/solicitud.service';
import { Solicitante } from '../../../../@core/data/models/solicitud/solicitante';
import { ReferenciaSolicitud } from '../../../../@core/data/models/solicitud/referencia-solicitud'
import { DatePipe } from '@angular/common';


@Component({
  selector: 'ngx-solicitud-tercero',
  templateUrl: './solicitud-tercero.component.html',
  styleUrls: ['./solicitud-tercero.component.scss']
})
export class SolicitudTerceroComponent implements OnInit {
  tercero: Tercero = null;
  solicitud: Solicitud = null;
  periodo: Periodo = null;
  username: string = ''
  private autenticacion = new ImplicitAutenticationService;
  referenciaSolicitud: ReferenciaSolicitud= null;


  constructor(private router: Router,
    private listService: ListService,
    private tercerosService: TercerosService,
    private solicitudService: SolicitudService,
    private datePipe: DatePipe,
    private store: Store<IAppState>) {
    
    this.loadPeriodoSp()

  }
  public loadSolicitud() {
    this.store.select((state) => state).subscribe(
      (list) => {
        const listSolicitudTer = list.listSolicitudTercero;
        if (listSolicitudTer.length > 0) {
          console.info("Tercero")
          console.info(listSolicitudTer)
          this.solicitud = listSolicitudTer[0];
        }
      },
    );

  }
  public loadTercero() {
    this.store.select((state) => state).subscribe(
      (list) => {
        const listTerceroLog = list.listTerceroLog;
        if (listTerceroLog.length > 0) {
          console.info("Tercero")
          console.info(listTerceroLog)
          this.tercero = listTerceroLog[0];
          /* this.listService.findSolicitudTercero(this.tercero.Id); */
          this.solicitud = this.listService.findSolicitudTerceroSp(this.tercero.Id);
          /* this.loadSolicitud(); */
        }
      },
    );
  }
  public loadPeriodoSp() {
    this.listService.findParametroPeriodoSp(environment.IDS.IDINSCRIPCIONES)
      .subscribe(
        (result: any[]) => {
          console.info('Entro')
          if (result['Data'].length > 0) {
            this.periodo = result['Data'][0].PeriodoId;
            this.loadTerceroSp();
          }
        },
        error => {
          this.periodo = null;
        },
      );
  }

  public loadTerceroSp() {
    let autenticacion = new ImplicitAutenticationService;
    if (autenticacion.live()) {
      const usuarioWSO2 = (autenticacion.getPayload()).email
        ? ((autenticacion.getPayload()).email.split('@')).shift()
        : (autenticacion.getPayload()).sub;
      console.info(`Login de ${usuarioWSO2}`);
      this.tercerosService.get(`tercero?query=UsuarioWSO2:${usuarioWSO2}`)
        .subscribe(
          (result: any[]) => {
            console.info('Entro buscando tercero')
            console.info(result)
            let tercero: Tercero;
            for (tercero of result) {
              console.info(tercero);
              this.tercero = tercero;
              this.loadSolicitudSp();
              break;
            }
          },
          error => {
          },
        );


    }
  }

  public loadSolicitudSp() {
    this.solicitudService.get(`solicitante?query=TerceroId:${this.tercero.Id}`)
      .subscribe(
        (result: any[]) => {
          let solicitante: Solicitante;
          if (result.length > 0) {
            for (solicitante of result) {
              const sol: Solicitud = solicitante.SolicitudId;
              if (sol.EstadoTipoSolicitudId.Id === environment.IDS.IDSOLICITUDRADICADA) {
                let refSol: ReferenciaSolicitud;
                try {
                  refSol = JSON.parse(sol.Referencia);
                  if (refSol != null ) {
                    if(refSol.Periodo===this.periodo.Nombre){
                      this.solicitud = sol;
                      this.referenciaSolicitud=refSol;
                    }
                  }
                } catch (error) {
                  console.error(error);
                }
              }
            }
          }
          else {
            this.solicitud = null;
          }
          //this.solicitud=null
        },
        error => {
          this.solicitud = null;
        },
      );

  }

  public loadPeriodo() {
    this.store.select((state) => state).subscribe(
      (list) => {
        const listaParam = list.listParametros;
        if (listaParam.length > 0 && this.periodo === null) {
          console.info("Periodo")
          console.info(listaParam)
          let parametros = <Array<ParametroPeriodo>>listaParam[0]['Data'];
          parametros.forEach(element => {
            if (element.Activo) {
              console.log(element)
              this.periodo = element.PeriodoId
              this.listService.findTerceroEmail();
              this.loadTercero();
            }
          });

        }
      },
    );
  }

  ngOnInit() {
  }

  registrar() {
    /* var codigoValue = (<HTMLInputElement>document.getElementById("codigo")).value; */
    Swal.fire({
      title: 'Está seguro?',
      text: `Desea solicitar apoyo alimentario para ${this.tercero.NombreCompleto}`,
      type: 'question',
      showConfirmButton: true,
      showCancelButton: true
    }
    ).then(async resp => {
      if (resp.value) {

        Swal.fire({
          title: 'Espere',
          text: 'Procesando su solicitud',
          type: 'question',
          allowOutsideClick: false,
        });
        Swal.showLoading();

        if (this.solicitud == null) {
          console.log("Se crea solicitud")
          let refSol: ReferenciaSolicitud = new ReferenciaSolicitud();

          console.log("Se creo la referencia")
          console.log(this.periodo.Nombre);
          console.log(refSol.Periodo);
          refSol.Periodo = this.periodo.Nombre;
          console.log("Se tiene el periodo en la referencia");
          this.listService.crearSolicitudApoyoAlimentario(+this.tercero.Id, refSol);
        } else {
          console.log("ya existe no se crea")
        }

        Swal.fire({
          title: "titulo",
          text: 'Se cargaron los datos de forma correcta',
          type: 'success'
        });

      }
    });
    return false;
  }
  private update() {
    console.log("Update");
    console.log(this.solicitud);
  }

}
