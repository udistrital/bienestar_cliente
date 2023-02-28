import * as Nuxeo from 'nuxeo';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from './../../../environments/environment';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Documento } from '../../shared/models/Salud/documento.model';
import { NuxeoService } from '../../@core/utils/nuxeo.service';
import { DocumentoG } from '../../@core/data/models/documento/documento_Gestion';
import { ApiRestService } from './api-rest.service';

@Injectable({
    providedIn: 'root'
  })


export class GestionService {
    static nuxeo: Nuxeo;

    static documentoSubido: DocumentoG;
    documentos = [];

    private documentos$ = new Subject<Documento[]>();
    private blob: object;
   
    
    constructor( private http: HttpClient ) {
        GestionService.nuxeo = new Nuxeo({
            baseURL: environment.NUXEO.PATH,
            auth: {
                method: 'basic',
                username: environment.NUXEO.CREDENTIALS.USERNAME,
                password: environment.NUXEO.CREDENTIALS.PASS,
            },
        });
    }
    
    addDocumento(documento: DocumentoG, apiRestService: ApiRestService){
        const body = {
            Id: documento.Id,
            Nombre: documento.Nombre,
            Tipo: documento.TipoDocumento.Nombre,
            Serie: documento.Serie,
            SubSerie: documento.SubSerie,
            Descripcion: documento.Descripcion,
            Enlace: documento.Enlace,
            Fecha: documento.Fecha,
        }
        apiRestService.post(body);
    }

    // Carga el documento a nux
    crearDocumento(documento: DocumentoG, gestionService: GestionService, apiRestService: ApiRestService){
        const file = documento.Archivo;
        const documentoCons = documento;
        GestionService.nuxeo.connect().
            then(function(client){
                GestionService.nuxeo.operation('Document.Create')
                    .params({
                        type: 'File',
                        name: 'Documento de prueba',
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
                                console.log(blob);
                                GestionService.nuxeo.operation('Blob.AttachOnDocument')
                                    .param('document',res.uid)
                                    .input(response.blob)
                                    .execute();
                                documentoCons.Enlace=res.path;
                                documentoCons.Id=res.uid;
                                gestionService.addDocumento(documentoCons, apiRestService);
                            }).catch(function (error) {
                                console.log(error);
                                return error;
                            });
                    })
            });
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