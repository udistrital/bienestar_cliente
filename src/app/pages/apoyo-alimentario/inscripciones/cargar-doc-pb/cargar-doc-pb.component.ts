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
import { Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import Swal from 'sweetalert2';

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

    
    /*  */
  }


  ngOnInit() {  

    this.listService.disparadorDeDocumentos.subscribe((res)=>{
      // Segun la llamada hace y devuleve un valor
      if(res.data=="validar"){ 
        // Validación de documentos
        let val =this.validarDocs();
      }else if(res.data=="carga"){ 
        // Guardar los documentos
        this.solicitud=res.newSol;
        this.guardarDoc();
      }
      else{
        // LLamada errada
      }
    });

  }

  validarDocs():boolean{
    const form =this.formApoyo.documentosAdjuntos;
    const style = "color: #ff0000; font-weight: bold; font-size: 1.2em;"
    let valid:boolean
    // Valida que se agreguen docs
    if(form==undefined){
      this.utilsService.showSwAlertError("Documentos vacios","Por favor asegurese de subir todos los documentos antes de hacer el envio.");
      valid=false;
    }else if(!this.documentos.valid){
      // Valida que lso docs agregados sean validos.
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
        msj= msj+" Horario Académico,"
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
      // Respuesta de docs, validos.
      valid=true;
    }
    this.disparadorDeValidacion.emit(valid);
    return valid;
  }


  guardarDoc():boolean{
    /* Variable que almacena los documentos agregados al formulario*/
    const docsAdd =this.formApoyo.documentosAdjuntos;

    if(this.validarDocs()){
      Swal.fire({
        title: "Ya casi! Por favor espere",
        html: `Cargando los documentos ingresados`,
        allowOutsideClick: false,
        showConfirmButton: false,
      });
      Swal.showLoading();
      this.listService.findPaqueteSolicitudBySolicitud(this.solicitud.Id).then((paqSol)=>{
        if(paqSol.PaqueteId!=undefined){
          //Actualiza documentos de una solicitud          
          let newSupps=[];  //Documentos no existentes
          let updateSupps=[]; // Documentos a actualizar
          this.cargarDocs(paqSol).then((result)=>{
            const docs=result;
            /** Se validan  si existian documentos subidos */
            if(Object.keys(docs).length>0){
              // Revisa todos los documentos que subio el usuario        
              for(let i = 0; i < Object.keys(docsAdd).length; i++){
                // Revisa todos los documentos ya existentes de una solicitud para actualizar. 
                docs.some(doc => {
                  // Compara si ya existia un documento del mismo tipo. 
                  if(docsAdd[i].IdDocumento==doc.TipoDocumento.Id){
                    return docsAdd[i].documento=doc.Id;
                  }else{
                    //console.log("No hay news documents");
                  }    
                });

                // Separa los que se crean y los que se actualizan.
                if(docsAdd[i].documento==undefined){
                    newSupps.push(docsAdd[i]);
                }else{
                    updateSupps.push(docsAdd[i]);
                }
                     
              } 
              // El documento queda con el mismo ID para no cambiar el soporte.
              // Es decir solo se cambia el File (archivo) de ese documento.
              if(docsAdd!=undefined){
                this.nuxeoService.updateDocument$(updateSupps, this.documentoService).subscribe((res) => { 
                  if(newSupps.length==Object.keys(res).length){
                  }            
                });
              }else{
                 /** Si no hay archivos nuevos no se actualiza */
                Swal.close();
                return true;    
              }
             
              // Agrega los nuevos documentos que no existian o no tenian soporte.
              if(newSupps.length>0){
                this.nuxeoService.getDocumentos$(newSupps, this.documentoService).subscribe((res) => {
                  if(newSupps.length==Object.keys(res).length){
                    let contnewSupps=0;
                    // Crea los soportes de los nuevos documentos.
                    for (let i = 0; i < Object.keys(res).length; i++) {
                      let docCreate=Object.values(res)[i];
                      let soporte: SoportePaquete= new SoportePaquete();

                      soporte.Descripcion=docCreate.TipoDocumento.Nombre;
                      soporte.PaqueteId=paqSol.PaqueteId;
                      soporte.DocumentoId=docCreate.Id;

                      this.listService.crearSoportePaquete(soporte).then((resSopPaq)=>{
                         /** Respuesta de la creación del nuevo soporte */
                         contnewSupps+=1;
                         if(contnewSupps==Object.keys(resSopPaq).length){
                           Swal.close();
                           window.location.reload();
                           return true;
                         }
                      }).catch((err)=>{
                        console.error(err);
                        Swal.close();
                        window.location.reload();
                        return true;
                      }); 
                      
                    }
                    Swal.close();
                    return true;
                  }
                });
              }else{
                window.location.reload();
                Swal.close();
                return true;
              }       

            }else{
              Swal.close();
              return false;
            }
          }).catch((err)=>{
            Swal.close();
            this.utilsService.showSwAlertError('No se pudieron cargar los documentos',err);
            return false;
          }); 
        }else{
          this.nuxeoService.getDocumentos$(docsAdd, this.documentoService).subscribe((res) => {
              /** Se crearon y guardaron los nuevos documentos en nuxeo */

              if(docsAdd.length==Object.keys(res).length){        
                this.formApoyo.documentosCargados = res;
        
                let paquete: Paquete = new Paquete();
                paquete.Nombre = "Documentos apoyo alimentario"
                /** Se crea nuevo paquete */
                this.listService.crearPaquete(paquete).then((idPaq) => {
                  paquete.Id = idPaq;
                  let paqueteSolicitud: PaqueteSolicitud = new PaqueteSolicitud();
                  paqueteSolicitud.SolicitudId = this.solicitud;
                  paqueteSolicitud.EstadoTipoSolicitudId = this.solicitud.EstadoTipoSolicitudId;
                  paqueteSolicitud.PaqueteId = paquete;
                  
                  /** Se crea relacion de nuevo paquete y solicitud*/
                  this.listService.crearPaqueteSolicitud(paqueteSolicitud).then((respPaqSol) => {
                    let contSupp=0;
                    /** Se crean soportes de los documentos del paquete*/
                    for (let i = 0; i < Object.keys(res).length; i++) {
                      let documento=Object.values(res)[i];
                      let soporte: SoportePaquete= new SoportePaquete();

                      soporte.Descripcion=documento.TipoDocumento.Nombre;
                      soporte.PaqueteId=paquete;
                      soporte.DocumentoId=documento.Id;

                      this.listService.crearSoportePaquete(soporte).then((resSopPaq)=>{
                        contSupp+=1;
                        if(contSupp==Object.keys(res).length){
                          Swal.close();
                          window.location.reload();
                          return true;
                        }
                      }).catch((err)=>{
                        this.utilsService.showSwAlertError("Crear Soporte Paquete",err);
                        Swal.close();
                        return false;
                      });
                    }
                  }).catch((err) =>{
                    this.utilsService.showSwAlertError("Crear Paquete Solicitud",err);
                    Swal.close();
                    return false;
                  });
                  
                }).catch((err) => {
                  this.utilsService.showSwAlertError("Crear Paquete",err);
                  Swal.close();
                  return false;
                }); 
        
              }
          });
        }
      }).catch((err)=>{
        Swal.close();
        this.utilsService.showSwAlertError('No se encontraron documentos',err); 
        return false;
      });
    }else{
      Swal.close();
      return false;
    }   
  }

  cargarDocs(paqSol): Promise<any> {
    return new Promise((resolve) => {
      /*Busca soportes de la solicitud existente*/
      this.listService.findSoportePaqueteByIdPaquete(paqSol.PaqueteId.Id).then((soportes)=>{
        let ids=[];
        let docs=[];
        //obtiene ids de los documentos de los soportes
        for (let i = 0; i < Object.keys(soportes).length; i++) {
          let element = soportes[i];
          ids.push(element.DocumentoId);
        }
        /*Obtiene el objeto (documento) de esos soportes para hacer la comparación.*/
        ids.forEach(element => {
          this.listService.findDocumentoBySoporte(element).then((res)=>{
            docs.push(res);
            if(docs.length==ids.length){
              resolve(docs);
            }
          });
          
        });
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

  loadSolicitud(idSol:number){
    /* Cargamos una solicitud */
    this.listService.loadSolicitud(idSol).then((respSolicitud) => {
      if(Object.values(respSolicitud).length>0){
        this.solicitud = respSolicitud;
      }  
    }).catch((error) => console.error("Solicitud no encontrada", error));
  }

}
