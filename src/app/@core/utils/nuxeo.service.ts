import * as Nuxeo from 'nuxeo';
import { Injectable } from '@angular/core';
import { environment } from './../../../environments/environment';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Documento } from '../data/models/documento/documento';
import { TipoDocumento } from '../data/models/documento/tipo_documento';

@Injectable()
export class NuxeoService {
    static nuxeo: Nuxeo

    private documentos$ = new Subject<Documento[]>();
    private documentos: object;

    private blobDocument$ = new Subject<[object]>();
    private blobDocument: object;

    private updateDoc$ = new Subject<[object]>();
    private updateDoc: object

    constructor() {
        this.documentos = {};
        this.blobDocument = {};
        this.updateDoc = {};

        NuxeoService.nuxeo = new Nuxeo({
            baseURL: environment.NUXEO.PATH,
            auth: {
                method: 'basic',
                username: environment.NUXEO.CREDENTIALS.USERNAME,
                password: environment.NUXEO.CREDENTIALS.PASS,
            },
        });
    }

    public getDocumentos$(file, documentoService): Observable<Documento[]> {
        this.saveFiles(file, documentoService, this);
        return this.documentos$.asObservable();
    }

    public getDocumentoById$(Id, documentoService): Observable<object[]> {
        this.getFile(Id, documentoService, this);
        return this.blobDocument$.asObservable();
    }

    public updateDocument$(files, documentoService): Observable<object[]> {
        this.updateFile(files, documentoService, this);
        return this.updateDoc$.asObservable();
    }

    saveFiles(files, documentoService, nuxeoservice) {
        this.documentos = {};
        nuxeoservice.documentos = {};
        NuxeoService.nuxeo.connect()
            .then(function (client) {
                files.forEach(file => {
                    documentoService.get('tipo_documento/' + file.IdDocumento)
                        .subscribe(res => {
                            if (res !== null) {
                                console.log("init subs")
                                const tipoDocumento = <TipoDocumento>res;
                                NuxeoService.nuxeo.operation('Document.Create')
                                    .params({
                                        type: tipoDocumento.TipoDocumentoNuxeo,
                                        name: file.nombre,
                                        properties: 'dc:title=' + file.nombre,
                                    })
                                    .input(tipoDocumento.Workspace)
                                    .execute()
                                    .then(function (doc) {
                                        console.log("nuxeo block")
                                        const nuxeoBlob = new Nuxeo.Blob({ content: file.file });
                                        NuxeoService.nuxeo.batchUpload()
                                            .upload(nuxeoBlob)
                                            .then(function (response) {
                                                file.uid = doc.uid
                                                NuxeoService.nuxeo.operation('Blob.AttachOnDocument')
                                                    .param('document', doc.uid)
                                                    .input(response.blob)
                                                    .execute()
                                                    .then(function (respuesta) {
                                                        console.log("rep ,docs")
                                                        const documentoPost = new Documento;
                                                        documentoPost.Enlace = file.uid;
                                                        documentoPost.Nombre = file.nombre;
                                                        documentoPost.TipoDocumento = tipoDocumento;
                                                        documentoPost.Activo = true;
                                                        documentoPost.Metadatos = file.Metadatos;
                                                        documentoService.post('documento', documentoPost)
                                                            .subscribe(resuestaPost => {
                                                                nuxeoservice.documentos[file.key] = resuestaPost;
                                                                nuxeoservice.documentos$.next(nuxeoservice.documentos);
                                                            })
                                                    });
                                            })
                                            .catch(function (error) {
                                                console.info(error);
                                                return error;
                                            });
                                    })
                                    .catch(function (error) {                                  
                                        console.info(error);
                                        return error;
                                    })
                            }
                        },(error)=> console.log("Fail",error)
                        );
                });
            });
    }

    updateFile(files, documentoService, nuxeoservice) {
        this.updateDoc = {};
        nuxeoservice.updateDoc = {};
        files.forEach(file => {
            if (file.file !== undefined) {
                const nuxeoBlob = new Nuxeo.Blob({ content: file.file });
                documentoService.get('documento?query=Id:' + file.documento)
                    .subscribe(res => {
                        if (res !== null) {
                            const documento_temp = <any>res[0];
                            NuxeoService.nuxeo.connect()
                            NuxeoService.nuxeo.batchUpload()
                                .upload(nuxeoBlob)
                                .then(function (response) {
                                    NuxeoService.nuxeo.operation('Blob.AttachOnDocument')
                                        .params({
                                            type: documento_temp.TipoDocumento.TipoDocumentoNuxeo,
                                            name: file.nombre,
                                            properties: 'dc:title=' + file.nombre,
                                        })
                                        .param('document', documento_temp.Enlace)
                                        .input(response.blob)
                                        .execute()
                                        .then(function (respuesta) {
                                            respuesta.blob()
                                                .then(function (responseblob) {
                                                    const url = URL.createObjectURL(responseblob);
                                                    const response_update = {
                                                        documento: documento_temp,
                                                        url: url,
                                                    };
                                                    nuxeoservice.updateDoc[file.key] = response_update;
                                                    nuxeoservice.updateDoc$.next(nuxeoservice.updateDoc);
                                                });
                                        });
                                });
                        }
                    });
            }
        });
    };

    getFile(files, documentoService, nuxeoservice) {
        this.blobDocument = {};
        nuxeoservice.blobDocument = {};
        files.forEach(file => {  
            documentoService.get('documento/' + file.DocumentoId)
                .subscribe(res => {
                    if (res !== null) {
                        if (res.Enlace != null) {
                            NuxeoService.nuxeo.header('X-NXDocumentProperties', '*');
                            NuxeoService.nuxeo.request('/id/' + res.Enlace)
                                .get()
                                .then(function (response) {
                                    response.fetchBlob()
                                        .then(function (blob) {
                                            blob.blob()
                                                .then(function (responseblob) {
                                                    const url = URL.createObjectURL(responseblob);
                                                    const response_get = {
                                                        documento: file.Descripcion,
                                                        url: url,
                                                    }; 
                                                    nuxeoservice.blobDocument[file.key] = response_get;
                                                    nuxeoservice.blobDocument$.next(nuxeoservice.blobDocument);
                                                });
                                        })
                                        .catch(function (response2) {
                                        });
                                })
                                .catch(function (response) {
                                });
                        }
                    }
                });
        });
    }
}