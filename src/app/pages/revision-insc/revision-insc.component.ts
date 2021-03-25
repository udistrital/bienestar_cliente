import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Util } from 'leaflet';
import { Observable } from 'rxjs/Observable';
import { ReliquidacionHelper } from '../../@core/helpers/reliquidacion/reliquidacionHelper';
import { ImplicitAutenticationService } from '../../@core/utils/implicit_autentication.service';
import { ApiConstanst } from '../../shared/constants/api.constans';
import { UtilsService } from '../../shared/services/utils.service';



@Component({
  selector: 'ngx-revision-insc',
  templateUrl: './revision-insc.component.html',
  styleUrls: ['./revision-insc.component.scss']
})
export class RevisionInscComponent implements OnInit {

  uuidReadFieldName: string;
  uuidDeleteFieldName: string;

  deleteConfirmMessage: string;
  deleteMessage: string;
  loadDataFunction: (...params) => Observable<any>;
  deleteDataFunction: (...params) => Observable<any>;
  formEntity: any;
  formTittle: string;
  updateMessage: string;
  createMessage: string;
  updateConfirmMessage: string;
  createConfirmMessage: string;
  isOnlyCrud: boolean;
  loadFormDataFunction: (...params) => Observable<any>;
  updateEntityFunction: (...params) => Observable<any>;
  createEntityFunction: (...params) => Observable<any>;
  listColumns: object;
  settings: object = {};

  params: any = {};
  terceros: any = {};
  rolesActivos: any = [];
  esRevisionEstudiante: boolean;
  estudiante: any;
  page = 0;
  limit = 10;
  offset= 0;
  recargarTabla: boolean = false;

  constructor(
    private translate: TranslateService,
    private reliquidacionHelper: ReliquidacionHelper,
    private datePipe: DatePipe,
    private route: Router,
    private router: ActivatedRoute,
    private autenticacion: ImplicitAutenticationService,
  ) { }

  ngOnInit() {
    this.uuidReadFieldName = '_id';
    this.uuidDeleteFieldName = '_id';
    this.isOnlyCrud = true;
    this.deleteConfirmMessage = 'PRODUCTO.confirmacion_eliminar';
    this.deleteMessage = 'PRODUCTO.mensaje_eliminar';
    this.loadDataFunction = (...evento) => this.obtenerRegistros(evento);
    //this.deleteDataFunction = this.productoHelper.productoDelete;
    //    this.formEntity = FORM_PRODUCTO;
    this.formTittle = 'RUBRO.add-producto';
    this.updateMessage = 'PRODUCTO.mensaje_actualizar';
    this.createMessage = 'PRODUCTO.mensaje_registrar';
    this.updateConfirmMessage = 'PRODUCTO.confirmacion_actualizacion';
    this.createConfirmMessage = 'PRODUCTO.confirmacion_creacion';
    //this.loadFormDataFunction = this.productoHelper.getProductos;
    //this.updateEntityFunction = this.productoHelper.productoUpdate;
    //this.createEntityFunction = this.productoHelper.productoRegister;
    this.listColumns = {
      Fecha: {
        title: 'Fecha de radicación',
        valuePrepareFunction: (cell, dato) => {
          return this.datePipe.transform(UtilsService.parseDate(dato.SolicitudId.FechaRadicacion), 'yyyy-MM-dd');
        },
      },
      Estado: {
        title: 'Estado',
        // type: 'string;',
        valuePrepareFunction: (cell, dato) => {
          return dato.EstadoTipoSolicitudId.EstadoId.Nombre;
        },
      },
      Estudiante: {
        title: 'Estudiante',
        // type: 'string;',
        valuePrepareFunction: (cell, dato) => {
          const dato2 = JSON.parse(dato.SolicitudId.Referencia);
          if (dato2.TerceroId) {
            return dato2.TerceroId.NombreCompleto;
          }
          return 'No se encontro estudiante';
        },
      },
    };

    this.settings = {
      actions: {
        add: false,
        edit: false,
        delete: false,
        custom: [
          { 
            name: 'custom', 
            title: '<i class="nb-search" title="Revisar reliquidación"></i>', 
            customFunction: (evento) => this.showReliquidacion(evento) 
          },
          { 
            name: 'custom', 
            title: '<i class="nb-compose" title="Ver documentos adjuntos reliquidación"></i>', 
            customFunction: (evento) => this.showDocumentsReliquidacion(evento) 
          },
          { 
            name: 'custom', 
            title: '<i class="nb-arrow-retweet" title="Cambiar estado reliquidación"></i>', 
            customFunction: (evento) => this.updateReliquidacion(evento) 
          }
        ],
        position: 'right'
      },
      mode: 'external',
      columns: this.listColumns,
    };

    this.obtenerRolesYDatos();
  }

  obtenerRolesYDatos() {
    if (this.router.snapshot.data['roles']) {
            for (const rol of this.router.snapshot.data['roles']) {
                this.rolesActivos[rol] = true;
            }
        }
        if (this.router.snapshot.data['esRevisionEstudiante']) {
            this.esRevisionEstudiante = true;
            this.obtenerDatosEstudiante();
        }
  }

  showReliquidacion(evento?: any) {
    if(evento){
      const data = JSON.parse(evento.SolicitudId.Referencia);
      this.route.navigate([`pages/revision/${data.Id}`], { queryParams: {codSolicitud: evento.SolicitudId.Id}});
    }
  }

  updateReliquidacion(evento?: any) {
    console.log(evento);
  }

  showDocumentsReliquidacion(evento?: any) {
    console.log(evento);
  }

  onChange(event) {

  }

  obtenerDatosEstudiante(){
    this.reliquidacionHelper.getEstudiante(this.autenticacion.getPayload().sub).subscribe((res) => {
      this.estudiante = res[0].TerceroId;
      this.estudiante.documento = this.autenticacion.getPayload().documento;
      this.estudiante.documento_compuesto = this.autenticacion.getPayload().documento_compuesto;
  });
  }

  obtenerRegistros(evento): any {
    this.params.query = `EstadoTipoSolicitudId.TipoSolicitud.Id:${ApiConstanst.SOLICITUDES.TIPO_SOLICITUD_RELIQUDIACION}`;
    if(this.estudiante){
      //this.params.query = `${this.params.query}&TerceroId9759`
    }
    if(evento){
      console.log(evento);
      this.params.offset = this.offset;
      this.params.limit = this.limit;
    }
    this.params.order='desc';
    this.params.sortby='Id';
    return this.reliquidacionHelper.getSolicitudes(this.params);
  }
}
