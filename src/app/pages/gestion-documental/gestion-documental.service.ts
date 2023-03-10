import * as Nuxeo from 'nuxeo';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from './../../../environments/environment';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Documento } from '../../shared/models/Salud/documento.model';
import { DocumentoGestion } from '../../@core/data/models/documento/documento_Gestion';
import { ApiRestService } from './api-rest.service';
import { NbComponentStatus, NbToastrService } from '@nebular/theme';
import { AlertToastService } from './alert-toast.service';

@Injectable({
    providedIn: 'root'
  })


export class GestionService {
    static nuxeo: Nuxeo;
   

    static documentoSubido: DocumentoGestion;
    documentos = [];
    private documentos$ = new Subject<Documento[]>();
    
    constructor( private http: HttpClient, public toastrService: AlertToastService ) {
        GestionService.nuxeo = new Nuxeo({
            baseURL: environment.NUXEO.PATH,
            auth: {
                method: 'basic',
                username: environment.NUXEO.CREDENTIALS.USERNAME,
                password: environment.NUXEO.CREDENTIALS.PASS,
            },
        });
    }
    
    // Agrega documento al API
    addDocumento(documento: DocumentoGestion, apiRestService: ApiRestService){
        apiRestService.post(this.crearBody(documento));
    }
    
    // Modifica documento del API
    editDocumento(documento: DocumentoGestion, apiRestService: ApiRestService){
        apiRestService.update(this.crearBody(documento), documento.IdApi);
    }
    deletDocumento(documento: DocumentoGestion, apiRestService: ApiRestService){
        apiRestService.delete(documento.IdApi);
    }
    
    //Generea un json para enviarlo al API
    crearBody(documento: DocumentoGestion){
        return {
            Id: documento.Id,
            Nombre: documento.Nombre,
            Tipo: documento.Tipo,
            Serie: documento.Serie,
            SubSerie: documento.SubSerie,
            Descripcion: documento.Descripcion,
            Enlace: documento.Enlace,
            Fecha: documento.Fecha,
        };
    }

    // Convierte el documetno recibido en DocumentoGestion 
    convertirDocumento(documento){
        let array = Object.entries(documento);
        let id, idApi, tipo, nombre, serie, subSerie, fecha, descripcion, enlace, archivo;
        array.forEach(dato=>{
            if(dato[0]==='Nombre'){
              nombre=dato[1];
            }
            if(dato[0]==='Tipo'){
              tipo=dato[1];
            }
            if(dato[0]==='Serie'){
              serie=dato[1];
            }
            if(dato[0]==='Id'){
                id=dato[1];
            }
            if(dato[0]==='_id'){
                idApi=dato[1];
            }
            if(dato[0]==='SubSerie'){
                subSerie=dato[1];
            }
            if(dato[0]==='Fecha'){
                fecha=dato[1];
            }
            if(dato[0]==='Descripcion'){
                descripcion=dato[1];
            }
            if(dato[0]==='Enlace'){
                enlace=dato[1];
            }
          });
        
          return new DocumentoGestion (id, idApi, tipo, nombre, serie, subSerie, fecha, descripcion, enlace, archivo);
    }

    // Carga el documento a nux
    crearDocumento(documento: DocumentoGestion, gestionService: GestionService, apiRestService: ApiRestService){
        const file = documento.Archivo;
        const documentoCons = documento;
        GestionService.nuxeo.connect().
            then(function(client){
                GestionService.nuxeo.operation('Document.Create')
                    .params({
                        type: 'File',
                        name: documento.Nombre,
                        description: documento.Descripcion,
                        properties: 'dc:title='+documento.Nombre
                        //properties: 'dc:title='+documento.Nombre+' \ndc:description=Documento para probar creacion'
                    })
                    .input('/'+'desarrollo'+'/'+'workspaces'+'/'+'pruebas'+'/'+'GestionDocumental')
                    .execute()
                    .then(function(res) {
                        const blob = new Nuxeo.Blob({ content: file });
                        GestionService.nuxeo.batchUpload()
                            .upload(blob)
                            .then(function (response) {
                                GestionService.nuxeo.operation('Blob.AttachOnDocument')
                                    .param('document',res.uid)
                                    .input(response.blob)
                                    .execute();
                                documentoCons.Enlace=res.path;
                                documentoCons.Id=res.uid;
                                gestionService.addDocumento(documentoCons, apiRestService);
                                gestionService.toastrService.mostrarAlerta('Se ha creado el documento '+documento.Nombre);
                            }).catch(function (error) {
                                gestionService.toastrService.mostrarAlerta('Error creando el documento '+documento.Nombre+', error:'+error);
                                console.log(error);
                                return error;
                            });
                    })
            });
    }

    // Actualizacion del documento en el API y en nuxeo
    actualizarDocumento(documento: DocumentoGestion, gestionService: GestionService, apiRestService: ApiRestService, actualizarArchivo: Boolean){
        const file = documento.Archivo;
        const documentoCons = documento;
        
        if(actualizarArchivo){
            console.log('hace nuxeo')
            this.editDocumento(documento,apiRestService);
            const nuxeoBlob = new Nuxeo.Blob({content: documento.Archivo});
            GestionService.nuxeo.connect();
            GestionService.nuxeo.batchUpload()
                .upload(nuxeoBlob)
                .then(function (response){
                    GestionService.nuxeo.operation('Blob.AttachOnDocument')
                        .params({
                            type: 'File',
                            name: documento.Nombre,
                            description: documento.Descripcion,
                            properties: 'dc:title='+documento.Nombre
                        })
                        .param('document', documento.Enlace)
                        .input(response.blob)
                        .execute()
                        .then(function (respuesta) {
                            respuesta.blob()
                                .then(function (responseblob) {
                                    const url = URL.createObjectURL(responseblob);
                                    gestionService.toastrService.mostrarAlerta('El documento '+documento.Nombre+' ha sido actualizado');
                                });
                        })
                        .catch(function(error){
                            gestionService.toastrService.mostrarAlerta('Error actualizando el documento '+documento.Nombre+', error: '+error);
                        });
                        
                });
        }else{
            this.editDocumento(documento,apiRestService);
        }
    }

    eliminarDocumento(documento: DocumentoGestion, gestionService: GestionService, apiRestService: ApiRestService){
        GestionService.nuxeo.header('X-NXDocumentProperties', '*');
        GestionService.nuxeo.request('/id/'+documento.Id)
            .get()
            .then(function(res){
                GestionService.nuxeo.operation('Document.Delete')
                .input(res)
                .execute()
                .then(function (del){
                    gestionService.deletDocumento(documento, apiRestService);
                    gestionService.toastrService.mostrarAlerta('El documento '+documento.Nombre+' ha sido eliminado');
                })
                .catch(function(error) {
                    gestionService.toastrService.mostrarAlerta('Documento no encontrado: ' + error, 'warning');
                    throw new Error(error);
                });
            })
            .catch(function(error) {
                gestionService.toastrService.mostrarAlerta('Documento no encontrado: ' + error, 'warning');
                throw new Error(error);
            });
    }
    // Consulta en documeto en Nuxeo y si lo encuentra genera 
    // una URL para mostrarlo
    async obtenerDocumento(id, gestionService){
        let url;
        GestionService.nuxeo.header('X-NXDocumentProperties', '*');
        await GestionService.nuxeo.request('/id/'+id)
        .get()
        .then(async function(res) {
            await res.fetchBlob()
            .then(async function(blob){
                await blob.blob()
                .then(function (responseblob) {
                    url = URL.createObjectURL(responseblob);
                    //window.open(url);
                    gestionService.toastrService.mostrarAlerta('Se ha obtenido el documento satisfactoriamente');
                });
            }).catch(function (error) {
                gestionService.toastrService.mostrarAlerta('Error generando el documento: ' + error, 'danger');
                throw new Error(error);
            });
        })
        .catch(function(error) {
            gestionService.toastrService.mostrarAlerta('Documento no encontrado: ' + error, 'warning');
            throw new Error(error);
        });
        return url;
    }
    //funcion para encontar el nombre de n documento por medio de la id
    async obtenerNombreDocumento(id, gestionService){
        let nombre;
        GestionService.nuxeo.header('X-NXDocumentProperties', '*');
        await GestionService.nuxeo.request('/id/'+id)
        .get()
        .then(async function(res) {
            nombre=await res.get('file:content').name;
        })
        .catch(function(error) {
            gestionService.toastrService.mostrarAlerta('Documento no encontrado: ' + error, 'warning');
            throw new Error(error);
        });
        return nombre;
    }

    crearFolder(){
        GestionService.nuxeo.connect()
            .then(function (client) {
                GestionService.nuxeo.operation('Document.Create')
                .params({
                    type: 'Folder',
                    name: 'GestionDocumental',
                    properties: 'dc:title=GestionDocumental \ndc:description=Folder de modulo gestion documental'
                })
                .input('/'+'desarrollo'+'/'+'workspaces'+'/'+'pruebas'+'/').execute()
                .then(function(doc) {
                    console.log('Created ' + doc.title + ' folder');
                })
        .catch(function(error) {
          throw error;
        });
        });     
    }
}