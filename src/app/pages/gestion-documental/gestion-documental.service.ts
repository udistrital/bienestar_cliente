import * as Nuxeo from 'nuxeo';
import { Injectable } from '@angular/core';
import { environment } from './../../../environments/environment';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Documento } from '../../shared/models/Salud/documento.model';
import { NuxeoService } from '../../@core/utils/nuxeo.service';
import { DocumentoG } from '../../@core/data/models/documento/documento_Gestion';
@Injectable({
    providedIn: 'root'
  })
export class GestionService {
    static nuxeo: Nuxeo;

    private documentos$ = new Subject<Documento[]>();
    private documentos: object;


    private blob: object;

    private updateDoc$ = new Subject<[object]>();
    private updateDoc: object

    

    constructor() {
        this.documentos = {};
        this.updateDoc = {};
        
        GestionService.nuxeo = new Nuxeo({
            baseURL: environment.NUXEO.PATH,
            auth: {
                method: 'basic',
                username: environment.NUXEO.CREDENTIALS.USERNAME,
                password: environment.NUXEO.CREDENTIALS.PASS,
            },
        });
    }

    // Carga el documento a nux
    crearDocumento(documento: DocumentoG){
        const file = documento.Archivo;
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