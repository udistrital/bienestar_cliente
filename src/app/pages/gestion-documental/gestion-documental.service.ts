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
    static path ='/desarrollo/workspaces/pruebas/GestionDocumental';

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
        return apiRestService.post(this.convertirADiccionario(documento));
    }
    
    // Modifica documento del API
    editDocumento(documento: DocumentoGestion, apiRestService: ApiRestService){
        apiRestService.update(this.convertirADiccionario(documento), documento.IdApi);
    }
    deletDocumento(documento: DocumentoGestion, apiRestService: ApiRestService){
        apiRestService.delete(documento.IdApi);
    }
    
    //Generea un json para enviarlo al API
    convertirADiccionario(documento: DocumentoGestion){
         
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

    /**
     * Crea un directorio en nuxeo de la ruta indicada para el gestor documental de funcionarios
     *
     * @param file Archivos a cargar.
     * @param path Directorio del.
     * @param gestionService Objeto de GestionService.
     *
     */
    async crearDocumentoGestor(file: File, path, gestionService: GestionService){
        await GestionService.nuxeo.connect().
            then( async function(client){
                await GestionService.nuxeo.operation('Document.Create')
                    .params({
                        type: 'File',
                        name: file.name,
                        properties: 'dc:title='+file.name
                        //properties: 'dc:title='+documento.Nombre+' \ndc:description=Documento para probar creacion'
                    })
                    .input(GestionService.path+'/GestorRepositorios/'+path)
                    .execute()
                    .then(async function(res) {
                        const blob = new Nuxeo.Blob({ content: file });
                        await GestionService.nuxeo.batchUpload()
                            .upload(blob)
                            .then( async function (response) { 
                                await GestionService.nuxeo.operation('Blob.AttachOnDocument')
                                    .param('document',res.uid)
                                    .input(response.blob)
                                    .execute();
                                gestionService.toastrService.mostrarAlerta('Se ha creado el documento '+file.name,'success');
                            }).catch(function (error) {
                                gestionService.toastrService.mostrarAlerta('Error creando el documento '+file.name+', error:'+error,'danger');
                                console.log(error);
                            });
                    })
            }
        );
    }
    

    /**
     * Crea un directorio en nuxeo de la ruta indicada para el la carga de documetos de 
     * SUBUD (Resoluciones, actas,...)
     *
     * @param file Archivos a cargar.
     * @param path Directorio del.
     * @param gestionService Objeto de GestionService.
     *
     */
    async crearDocumento(documento: DocumentoGestion, gestionService: GestionService, apiRestService: ApiRestService){
        const file = documento.Archivo;
        const documentoCons = documento;
        await GestionService.nuxeo.connect().
            then( async function(client){
                await GestionService.nuxeo.operation('Document.Create')
                    .params({
                        type: 'File',
                        name: documento.Nombre,
                        description: documento.Descripcion,
                        properties: 'dc:title='+documento.Nombre
                        //properties: 'dc:title='+documento.Nombre+' \ndc:description=Documento para probar creacion'
                    })
                    .input(GestionService.path)
                    .execute()
                    .then(async function(res) {
                        const blob = new Nuxeo.Blob({ content: file });
                        await GestionService.nuxeo.batchUpload()
                            .upload(blob)
                            .then( async function (response) { 
                                GestionService.nuxeo.operation('Blob.AttachOnDocument')
                                    .param('document',res.uid)
                                    .input(response.blob)
                                    .execute();
                                documentoCons.Enlace = res.path;
                                documentoCons.Id = res.uid;
                                // Se requiere esperar por que se necesita el _id que asigna el API en la respuesta del POST
                                
                                documentoCons.IdApi=await gestionService.addDocumento(documentoCons, apiRestService)['_id'];
                                gestionService.toastrService.mostrarAlerta('Se ha creado el documento '+documento.Nombre,'success');
                            }).catch(function (error) {
                                gestionService.toastrService.mostrarAlerta('Error creando el documento '+documento.Nombre+', error:'+error,'danger');
                            });
                    })
        });
        return documentoCons;
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
                                });
                            gestionService.toastrService.mostrarAlerta('El documento '+documento.Nombre+' ha sido actualizado','success');
                        })
                        .catch(function(error){
                            gestionService.toastrService.mostrarAlerta('Error actualizando el documento '+documento.Nombre+', error: '+error,'danger');
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
                    gestionService.toastrService.mostrarAlerta('El documento '+documento.Nombre+' ha sido eliminado','success');
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
                    gestionService.toastrService.mostrarAlerta('Se ha obtenido el documento satisfactoriamente','success');
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

    /**
     * Crea un directorio en nuxeo de la ruta indicada
     *
     * @param userPath Path a crear.
     * @param gestionService instancia de GestionService.
     * @param newPath? Path opcional, donde se creara el folder cuando no sea la raiz.
     *
     */
    async crearFolder(nombre, gestionService, newPath?){
        let path=GestionService.path+'/GestorRepositorios';
        if(newPath){
            path=path+'/'+newPath;
        }
        await GestionService.nuxeo.connect()
            .then(async function (client) {
                await GestionService.nuxeo.operation('Document.Create')
                .params({
                    type: 'Folder',
                    name: nombre,
                    properties: 'dc:title='+nombre+'\ndc:description=Folder de funcionario'
                })
                .input(path).execute()
                .then(async function(doc) {
                    await gestionService.toastrService.mostrarAlerta('Repositorio creado','success');
                })
                .catch(function(error) {
                    gestionService.toastrService.mostrarAlerta('Error creando carpeta', 'danger');
                throw error;
                });
            })
            .catch(function(error) {
                gestionService.toastrService.mostrarAlerta('Error en conexión con Nuxeo', 'danger');
            throw error;
            });
    }

    /**
     * Obtiene el directorio en nuxeo de la ruta indicada
     *
     * @param userPath Path del funcionario.
     * @param gestionService Instacion de GestionService.
     * @param validar? Parametro opcional, si solo se esta verificando qu un directorio exista.
     *
     * @return Map, 'existe' en True si encuentra el directorio o False si no existe y
     * 'valores' con el contenido del directorio si existe
     */
    async obtenerDirectorio(userPath,gestionService,validar?){
        let retorno =new Map;
        retorno.set('existe',false);
        retorno.set('valores', undefined);
        const headers = {
            'X-NXDocumentProperties': '*',
          };
        await GestionService.nuxeo.operation('Document.GetChildren')
        .input(GestionService.path+'/GestorRepositorios/'+userPath)
        .execute({ headers })
        .then(async function(docs) {
            await retorno.set('valores', docs.entries);
            await retorno.set('existe', true);
        })
        .catch( function(error) {
            if(!validar)
                gestionService.toastrService.mostrarAlerta('Repositorio no encontrado buscando la ruta:' + userPath, 'danger');
        });
        return retorno;
    }
}