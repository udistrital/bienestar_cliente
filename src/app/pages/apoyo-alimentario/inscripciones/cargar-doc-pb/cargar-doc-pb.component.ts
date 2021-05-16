import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
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
import { Validators } from '@angular/forms';
import { Output } from '@angular/core';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'ngx-cargar-doc-pb',
  templateUrl: './cargar-doc-pb.component.html',
  styleUrls: ['./cargar-doc-pb.component.scss']
})
export class CargarDocPbComponent implements OnInit {

  @Output() disparadorDeValidacion: EventEmitter<any> = new EventEmitter();

  mostrar: any = {};
  deshabilitar: any = {};

  documentos: FormGroup;

  formApoyo: any = {
    documentosCargados: {}
  };

  APP_CONSTANTS = ApiConstanst;
  solicitud: Solicitud=null;

  constructor(
    public nuxeoHelper: NuxeoApiHelper,
    private pUpManager: PopUpManager,
    private nuxeoService: NuxeoService,
    private documentoService: DocumentoService,
    private listService: ListService,
    private utilsService: UtilService,
  ) {
    this.documentos = new FormGroup({});
    this.mostrar.resubir = false;
    this.mostrar.verObservaciones = false;

    /* Cargamos una solicitud */
    this.listService.loadSolicitud(654).then((respSolicitud) => {
      console.log("Carga componenete de solicitud de Docs");
      
      if(Object.values(respSolicitud).length>0){
        this.solicitud = respSolicitud;
      }  
    }).catch((error) => console.error("Solicitud no encontrada", error));
  }

  ngOnInit() {  

    this.listService.disparadorDeDocumentos.subscribe((res)=>{
      console.log("recibo :",res);
      if(res.data=="validar"){ 
        console.log("Guauuu validando");
        let val =this.validarDocs();
        console.log(val);
      }else if(res.data=="carga"){ 
        console.log("guuuarfandinggg");
        this.guardarDoc();
      }
      else{
        console.log("Paila papi F");
      }
    });

  }

  validarDocs():boolean{
    const form =this.formApoyo.documentosAdjuntos;
    const style = "color: #ff0000; font-weight: bold; font-size: 1.2em;"
    let valid:boolean
    if(form==undefined){
      this.utilsService.showSwAlertError("Documentos vacios","Por favor asegurese de subir todos los documentos antes de hacer el envio.");
      valid=false;
    }else if(!this.documentos.valid){
      let msj="";
      if(!this.documentos.controls.documentoIdentidad.valid){
        msj= msj+" Documento de Identidad,"
      }
      if(!this.documentos.controls.formularioSIGUD.valid){
        msj= msj+" Formulario SIGUD,"
      }
      if(!this.documentos.controls.cartaBienestar.valid){
        msj= msj+" Carta a Bienestar,"
      }
      if(!this.documentos.controls.reciboPublico.valid){
        msj= msj+" Recibo Público,"
      }
      if(!this.documentos.controls.reciboMatricula.valid){
        msj= msj+" Recibo matricula,"
      }
      if(!this.documentos.controls.horarioAcademico.valid){
        msj= msj+" Carta a Bienestar,"
      }
      if(!this.documentos.controls.certificadoIngresos.valid){
        msj= msj+" Certificado de Ingresos,"
      }
      if(msj!=""){
        msj = msj.slice(0, -1);
        this.utilsService.showSwAlertError('Faltan Documentos',`<p> Los documentos con ( <span style="${style}">*</span> ) es obligatorio subirlos. <br> Hacen falta los siguientes documentos:  <strong> ${msj} </strong><p>`);
      }else{
        this.utilsService.showSwAlertError('Faltan Documentos',`<p> Todos los documentos con ( <span style="${style}">*</span> ) es obligatorio subirlos. <p>`);
      }
      valid=false;
    }else{
      console.log("Docs validos");
      valid=true;
    }
    this.disparadorDeValidacion.emit(valid);
    return valid;
  }


  guardarDoc() {
    console.log("vamo que vamo");
    /* Variable que almacena lso documentos agregados al formulario*/
    
    const docsAdd =this.formApoyo.documentosAdjuntos;
    //console.log(docsAdd);
    if(this.validarDocs()){
      this.listService.findPaqueteSolicitudBySolicitud(this.solicitud.Id).then((paqSol)=>{
        if(paqSol.PaqueteId!=undefined){
          //Actualiza documentos de una solicitud
          console.log(paqSol.PaqueteId);
          
          let newSupps=[];  //Documentos no existentes
          let updateSupps=[]; // Documentos a actualizar
          this.cargarDocs(paqSol).then((result)=>{
            console.log(result);
            const docs=result;
            console.log("vamo a actualizar");
            if(Object.keys(docs).length>0){
              console.log("LLENANDO");
              console.log(docs);  
              // Revisa todos los documentos que subio el usuario        
              for(let i = 0; i < Object.keys(docsAdd).length; i++){
                console.log("agrega",docsAdd[i].IdDocumento);
                // Revisa todos los documentos ya existentes de una solicitud para. 
                docs.some(doc => {
                  console.log("update",doc.TipoDocumento.Id);
                  // Compara si ya existia un documento del mismo tipo. 
                  if(docsAdd[i].IdDocumento==doc.TipoDocumento.Id){
                    return docsAdd[i].documento=doc.Id;
                  }else{
                    console.log("No hay news documents");
                  }    
                });

                // Separa los que se crean y los que se actualizan.
                if(docsAdd[i].documento==undefined){
                    newSupps.push(docsAdd[i]);
                }else{
                    updateSupps.push(docsAdd[i]);
                }
                     
              } 
              console.log("DOCS -->",docsAdd);
              console.log("NEW SUPPS -->",newSupps);
              console.log("UPDATE SUPPS -->",updateSupps);

              // El documento queda con el mismo ID para no cambiar el soporte.
              // Es decir solo se cambia el File (archivo) de ese documento.
              if(docsAdd!=undefined){
                console.log("Lo logro señor");   
                this.nuxeoService.updateDocument$(updateSupps, this.documentoService).subscribe((res) => {
                  console.log(res);                 
                });
              }else{
                console.log("UPDATE SIN DATOS");      
              }
             
              // Agrega los nuevos documentos que no existian o no tenian soporte.
              if(newSupps.length>0){
                console.log("Agrega los new supps");
                this.nuxeoService.getDocumentos$(newSupps, this.documentoService).subscribe((res) => {
                  console.log(res);
                  if(newSupps.length==Object.keys(res).length){
                    console.log("termine de crear los documentos");
                    // Crea los soportes de los nuevos documentos.
                    for (let i = 0; i < Object.keys(res).length; i++) {
                      console.log("soporte -->",Object.values(res)[i]);
                      let docCreate=Object.values(res)[i];
                      
                      console.log("Subimos documento");
                      let soporte: SoportePaquete= new SoportePaquete();
                      soporte.Descripcion=docCreate.TipoDocumento.Nombre;
                      soporte.PaqueteId=paqSol.PaqueteId;
                      soporte.DocumentoId=docCreate.Id;
                      console.log("soporte",soporte);
                      this.listService.crearSoportePaquete(soporte).then((resSopPaq)=>{
                        console.log("Se creo soporte paquete");
                      }).catch((err)=>console.error(err)); 
                      
                    }
                  }
                });
              }         

            } 
          }).catch((err)=>this.utilsService.showSwAlertError('No se pudieron cargar los documentos',err)); 
        }else{
          console.log("vamo a guardar");
          this.nuxeoService.getDocumentos$(docsAdd, this.documentoService).subscribe((res) => {
              console.log(res);
              for(let i = 0; i < Object.keys(res).length; i++){
                console.log(Object.values(res)[i].Nombre);         
              } 
        
              if(docsAdd.length==Object.keys(res).length){
                
                this.formApoyo.documentosCargados = res;
        
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
                      soporte.Descripcion=documento.TipoDocumento.Nombre;
                      soporte.PaqueteId=paquete;
                      soporte.DocumentoId=documento.Id;
                      console.log("soporte",soporte);
                      this.listService.crearSoportePaquete(soporte).then((resSopPaq)=>{
                        console.log("Se creo soporte paquete");
                      }).catch((err)=>{
                        console.error(err);
                        this.utilsService.showSwAlertError("Crear Soporte Paquete",err);
                      });
                    }
          
                  }).catch((err) =>{
                    console.error(err);
                    
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
      /*Busca soportes de la solicitud existente*/
      this.listService.findSoportePaqueteByIdPaquete(paqSol.PaqueteId.Id).then((soportes)=>{
        //console.log("entra=>",soportes);
        let ids=[];
        let docs=[];
        for (let i = 0; i < Object.keys(soportes).length; i++) {
          let element = soportes[i];
          ids.push(element.DocumentoId);
        }
        console.log(ids);
        /*Obtiene el objeto (documento) de esos soportes para hacer la comparación.*/
        ids.forEach(element => {
          this.listService.findDocumentoBySoporte(element).then((res)=>{
            docs.push(res);
            if(docs.length==ids.length){
              resolve(docs);
            }
          });
          
        });
        
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
