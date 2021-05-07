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
import { UtilService } from '../../../../shared/services/utilService';
import { TipoDocumento } from '../../../../@core/data/models/terceros/tipo_documento';
import { forEach } from 'jszip';

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
    private listService: ListService,
    private utilsService: UtilService,
  ) {
    this.formulario = new FormGroup({});
    this.mostrar.resubir = false;
    this.mostrar.verObservaciones = false;

    /* Cargamos una solicitud */
    this.listService.loadSolicitud(654).then((respSolicitud) => {
      this.solicitud = respSolicitud;
    }).catch((error) => console.error("Solicitud no encontrada", error));
  }

  ngOnInit() {
  }
  guardarDoc() {
    console.log("vamo a guardar");
    /* Variable que almacena lso documentos agregados al formulario*/
    const docsAdd =this.formularioReliquidacion.documentosAdjuntos;
    //console.log(docsAdd);
    if(docsAdd==undefined){
      console.log("Docs vacios");
    }
    else{
      this.listService.findPaqueteSolicitudBySolicitud(this.solicitud.Id).then((paqSol)=>{
        if(paqSol.PaqueteId!=undefined){
          console.log(paqSol.PaqueteId);
          console.log("Entre mal");
  
          this.cargarDocs(paqSol).then((docs)=>{
            if(Object.keys(docs).length>0){
              console.log("LLENANDO");
              console.log(docs);
              for(let j = 0; j < Object.keys(docsAdd).length; j++){
                console.log("agrega",docsAdd[j].IdDocumento);
                docs.forEach(doc => {
                  console.log("update",doc.TipoDocumento.Id);
                  if(docsAdd[j].IdDocumento==doc.TipoDocumento.Id){
                    console.log("Si esss");
                    docsAdd[j].documento=doc.Id;
                    console.log(docsAdd[j]," asdasd",doc.Id);
                  }else{
                    console.log("No hay news documents");
                  }    
                });          
              } 
      
              if(docsAdd!=undefined){
                console.log("Lo logro señor");   
                this.nuxeoService.updateDocument$(docsAdd, this.documentoService).subscribe((res) => {
                  console.log(res);
                });
              }else{
                console.log("UPDATE SIN DATOS");      
              }
              
            }
          }); 
        }else{
           this.nuxeoService.getDocumentos$(docsAdd, this.documentoService).subscribe((res) => {
      console.log(res);
      for(let i = 0; i < Object.keys(res).length; i++){
        console.log(Object.values(res)[i].Nombre);         
      } 

      if(docsAdd.length==Object.keys(res).length){
        
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
  
            for (let i = 0; i < Object.keys(res).length; i++) {
              let documento=Object.values(res)[i];
              console.log("Subimos documento");
              let soporte: SoportePaquete= new SoportePaquete();
              soporte.Descripcion=documento.TipoDocumento.Descripcion;
              soporte.PaqueteId=paquete;
              soporte.DocumentoId=documento.Id;
              console.log("soporte",soporte);
              this.listService.crearSoportePaquete(soporte).then((resSopPaq)=>{
                console.log("Se creo soporte paquete");
              }).catch((err)=>console.error(err));
            }
  
          }).catch((err) =>{
            console.error(err);
            this.utilsService.showSwAlertError("Crear Paquete Solicitud",err);
          });
          
        }).catch((err) => {
          console.error(err);
          this.utilsService.showSwAlertError("Crear Paquete",err);
        }); 

      }
    });
        }
      }).catch((err)=>this.utilsService.showSwAlertError('No se encontraron documentos',err));

    }

   
    
  }

  cargarDocs(paqSol): Promise<any> {
    return new Promise((resolve) => {

      this.listService.findSoportePaqueteByIdPaquete(paqSol.PaqueteId.Id).then((soportes)=>{
        //console.log("entra=>",soportes);
        let ids=[];
        let docs=[];
        for (let i = 0; i < Object.keys(soportes).length; i++) {
          let element = soportes[i];
          ids.push(element.DocumentoId);
        }
        console.log(ids);

        ids.forEach(element => {
          this.listService.findDocumentoBySoporte(element).then((res)=>{
            docs.push(res);
            console.log(docs.length);
            console.log(ids.length);
            if(docs.length==ids.length){
              console.log("Sera?");
              resolve(docs);
            }
          });
          
        });
        
        
        /* console.log(doc.PaqueteId.); */
        //Cambiaar id de soportes

        console.log("Actualiseishon");
      });
      
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
