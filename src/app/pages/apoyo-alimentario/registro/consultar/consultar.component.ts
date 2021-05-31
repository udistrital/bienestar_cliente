import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { environment } from '../../../../../environments/environment';
import { ApoyoAlimentario } from '../../../../@core/data/models/apoyo-alimentario';
import { ParametroPeriodo } from '../../../../@core/data/models/parametro/parametro_periodo';
import { ReferenciaSolicitud } from '../../../../@core/data/models/solicitud/referencia-solicitud';
import { ListService } from '../../../../@core/store/list.service';
import { UtilService } from '../../../../shared/services/utilService';

@Component({
  selector: 'ngx-consultar',
  templateUrl: './consultar.component.html',
  styleUrls: ['./consultar.component.scss']
})
export class ConsultarComponent implements OnInit {


  registros: ApoyoAlimentario[] = [];
  parametros: ParametroPeriodo[] = [];
  periodo: number = null;
  sedesAcceso: any[];
  sede: number = null;
  codigoEstudiante: number = undefined;
  itemOffSet: number = 0;
  limite: number = 10;
  itemsLim: number[] = [1,3, 5, 10, 25, 50, 100, 250, 500, 1000, 2500];
  pagina: number = 1;
  hasNext: boolean = true


  constructor(
    private listService: ListService,
    private utilService: UtilService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.listService.findParametrosByPeriodoTipoEstado(null, environment.IDS.IDSERVICIOAPOYO, null).then((respParam) => {
      if (respParam.length > 0) {
        if (Object.keys(respParam[0]).length > 0) {
          this.parametros = respParam;
        }
        if (this.parametros.length > 0) {
          this.periodo = 0;
        }
      }
    });
    this.listService.cargarSedesApoyo()
      .then((sedes) => {
        this.sedesAcceso = sedes
      })
      .catch((error) => {
        /* Swal.close(); */
        this.utilService.showSwAlertError("Error interno", "No se pudo conectar para cargar las sedes")
      });

  }

  ngOnInit() {
  }

  buscar(numPg) {
    if(numPg<this.pagina || numPg==1){
      this.hasNext=true;
    }
    if(this.limite==-1){
      this.hasNext=false;
    }
    this.pagina=numPg;
    let offset = this.itemOffSet;
    if(numPg>1){
      offset += (numPg-1)*this.limite
    }
    if (offset <= 0) {
      offset = null
    }
    if (this.codigoEstudiante != undefined) {
      this.listService.loadTerceroByDocumento(this.codigoEstudiante.toString()).then((respTer) => {
        let tercero = respTer;
        if (tercero !== undefined) {
          this.listService.findApoyoAlimentario(tercero.Id, null, this.sede, this.periodo, this.limite, offset).then((result) => {
            if (result) {
              this.registros = result;
              if(this.registros.length<this.limite){
                this.hasNext=false;
              }
            } else {
              if(this.pagina>1){
                this.pagina-=1;
                this.hasNext=false;
              }else{
                this.utilService.showSwAlertError("Sin resultados", "No se encontraron registros con los parametos seleccionados")
              }
            }
          }).catch((err) => this.utilService.showSwAlertError("Error al consultar", err));

        } else {
          this.utilService.showSwAlertError("Estudiante no encontrado", 'No se encuentra el tercero');
        }
      }).catch(
        (error) => {
          this.utilService.showSwAlertError("Estudiante no encontrado", `<p>${error}</p>`);
          /* Swal.fire("Error",
            `<p>${error}</p>`, "error"); */
        }
      );

    } else {
      this.listService.findApoyoAlimentario(null, null, this.sede, this.periodo, this.limite, offset).then((result) => {
        if (result) {
          this.registros = result;
          if(this.registros.length<this.limite){
            this.hasNext=false;
          }
        } else {
          if(this.pagina>1){
            this.pagina-=1;
            this.hasNext=false;
          }else{
            this.utilService.showSwAlertError("Sin resultados", "No se encontraron registros con los parametos seleccionados")
          }
        }
      }).catch((err) => this.utilService.showSwAlertError("Error al consultar", err));
    }
  }

  getNombrePeriodo(idPerido: number) {
    for (const parametro of this.parametros) {
      if (parametro.PeriodoId.Id == idPerido) {
        return parametro.ParametroId.Nombre
      }
    }
    return 'Indefinido';
  }

  getSedeAccesso(idSede: number) {
    for (const sede of this.sedesAcceso) {
      if (sede.Id == idSede) {
        return sede.Nombre
      }
    }
    return 'Indefinido';
  }

  verEstudiante(index) {
    let terceroId = this.registros[index].terceroId
    this.listService.loadTercero(terceroId).then((respTer) => {
      let tercero = respTer;
      if (tercero !== undefined) {

        this.listService.loadFacultadProyectoTercero(tercero.Id).then((nomFacultad) => {
          let facultad = nomFacultad[0];
          let proyectoCurricular = nomFacultad[1];
          Swal.fire({
            html: `<h3>Estudiante</h3>
            <p><b>Nombre:</b> ${tercero.NombreCompleto}</p>
            <p><b>Fecha nacimiento:</b> ${tercero.FechaNacimiento}</p>
            <p><b>Faculta</b>d: ${facultad}</p>
            <p><b>Proyecto curricular:</b> ${proyectoCurricular}</p>`
          });

        });
      } else {
        this.utilService.showSwAlertError("Estudiante no encontrado", 'No se encuentra el tercero');
      }
    }).catch(
      (error) => {
        this.utilService.showSwAlertError("Estudiante no encontrado", `<p>${error}</p>`);
        /* Swal.fire("Error",
          `<p>${error}</p>`, "error"); */
      }
    );

  }

  verSolicitud(index) {
    let solicitudId = this.registros[index].solicitudId

    this.listService.loadSolicitud(solicitudId).then((respSolicitud) => {
      if (respSolicitud != undefined) {
        console.log(respSolicitud)
        let solicitud = respSolicitud;
        let ref: ReferenciaSolicitud = JSON.parse(solicitud.Referencia);
        Swal.fire({
          showCloseButton: true,
          showDenyButton: true,
          confirmButtonText: `Ver solicitud completa`,
          denyButtonText: `Volver`,
          html: `<h3>Solicitud ${solicitud.Id}</h3>
          <p><b>Estado:</b> ${solicitud.EstadoTipoSolicitudId.EstadoId.Nombre}</p>
          <p><b>Periodo:</b> ${ref.Periodo}</p>
          <p><b>Puntaje</b>d: ${ref.Puntaje}</p>`
        }).then((result)=>{
          if(result.isConfirmed){
            this.router.navigate([`../../inscripciones/solicitudes/${solicitudId}`], { relativeTo: this.route });
            /* this.router.navigateByUrl('/asd/'); */
            
          }
        });
      } else {
        this.utilService.showSwAlertError("Solicitud no encontrada", "No se encontro la solicitud para el periodo actual");
      }
    }).catch((error) => this.utilService.showSwAlertError("Solicitud no encontrada", error));


  }
}
