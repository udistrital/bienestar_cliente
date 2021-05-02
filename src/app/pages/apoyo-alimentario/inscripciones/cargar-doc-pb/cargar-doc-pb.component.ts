import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DocumentoService } from '../../../../@core/data/documento.service';
import { Paquete } from '../../../../@core/data/models/solicitud/paquete';
import { PaqueteSolicitud } from '../../../../@core/data/models/solicitud/paquete-solicitud';
import { Solicitud } from '../../../../@core/data/models/solicitud/solicitud';
import { SoportePaquete } from '../../../../@core/data/models/solicitud/soporte-paquete';
import { NuxeoApiHelper } from '../../../../@core/helpers/reliquidacion/nuxeoApiHelper';
import { PopUpManager } from '../../../../@core/managers/popUpManager';
import { ListService } from '../../../../@core/store/list.service';
import { NuxeoService } from '../../../../@core/utils/nuxeo.service';
import { ApiConstanst } from '../../../../shared/constants/api.constans';

@Component({
  selector: 'ngx-cargar-doc-pb',
  templateUrl: './cargar-doc-pb.component.html',
  styleUrls: ['./cargar-doc-pb.component.scss']
})
export class CargarDocPbComponent implements OnInit {

  panelErrores: any = {
    basica: {},
    socioeconomica: {},
    documentoIdentificacion: {},
    escolar: {},
    residencia: {},
    fortuita: {},
    reliquidacion: {},
    ingresos: {},
    cargo: {},
    hijos: {},
    desplazado: {},
    reciboPago: {},
    otrosDoc: {},
  };
  mostrar: any = {};
  deshabilitar: any = {};
  formulario: FormGroup;
  formularioReliquidacion: any = {
    documentosCargados: {}
  };
  APP_CONSTANTS = ApiConstanst;
  solicitud: Solicitud;

  constructor(
    public nuxeoHelper: NuxeoApiHelper,
    private pUpManager: PopUpManager,
    private nuxeoService: NuxeoService,
    private documentoService: DocumentoService,
    private listService: ListService
  ) {
    this.formulario = new FormGroup({});
    this.mostrar.resubir = false;
    this.mostrar.verObservaciones = false;

    /* Cargamos una solicitud */
    this.listService.loadSolicitud(645).then((respSolicitud) => {
      this.solicitud = respSolicitud;
    }).catch((error) => console.error("Solicitud no encontrada", error));
  }

  ngOnInit() {
  }
  guardarDoc() {
    console.log("vamo a guardar");
    console.log(this.formularioReliquidacion.documentosAdjuntos);

    this.nuxeoService.getDocumentos$(this.formularioReliquidacion.documentosAdjuntos, this.documentoService).subscribe((res) => {
      console.log(res);
      /* res.forEach(documento=>{
        console.log(documento.Nombre);
      }); */
/* 
        this.formularioReliquidacion.documentosCargados = res;

        let paquete: Paquete = new Paquete();
        paquete.Nombre = "Documentos apoyo alimentario"

        this.listService.crearPaquete(paquete).then((idPaq) => {
          paquete.Id = idPaq;
          let paqueteSolicitud: PaqueteSolicitud = new PaqueteSolicitud();
          paqueteSolicitud.SolicitudId = this.solicitud;
          paqueteSolicitud.EstadoTipoSolicitudId = this.solicitud.EstadoTipoSolicitudId;
          paqueteSolicitud.PaqueteId = paquete;
          

          this.listService.crearPaqueteSolicitud(paqueteSolicitud).then((respPaqSol) => {
            console.log("Se creo el paquete solicitud");
          }).catch((err) => console.error(err));

          for (const documento of res) {
            console.log("Subimos documento");
            let soporte: SoportePaquete= new SoportePaquete;
            soporte.Descripcion=documento.Descripcion;
            soporte.PaqueteId=paquete;
            soporte.DocumentoId=documento.Id
            this.listService.crearSoportePaquete(soporte).then((resSopPaq)=>{
              console.log("Se creo soporte paquete");
            }).catch((err)=>console.error(err));
          }
          
        }).catch((err) => console.error(err)
        ); */
        
      
    });




  }

  visualizarArchivo(archivo) {
    this.pUpManager.showInfoAlert(`Se esta descargando el archivo ${archivo.Nombre}`);
    this.nuxeoService.getDocumentoById$([archivo], this.documentoService).subscribe((res: Object) => {
      if (res[archivo.key]) {
        window.open(res[archivo.key]);
      }
    })
  }

}
