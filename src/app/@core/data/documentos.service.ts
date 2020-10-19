import { Injectable } from '@angular/core';
import * as Nuxeo from 'nuxeo';
import { Observable, Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Documento } from './models/Documento';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { TipoDocumento } from './models/TipoDocumento';

const path = environment.DOCUMENTO_SERVICE;
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'authorization': 'Bearer ' + window.localStorage.getItem('access_token'),
  }),
}

@Injectable({
  providedIn: 'root'
})
export class DocumentosService {

  static nuxeo: Nuxeo

  private documentos$ = new Subject<Documento[]>();
  private documentos: object;

  constructor(private http: HttpClient) {
    DocumentosService.nuxeo = new Nuxeo({
      baseURL: environment.NUXEO.PATH,
      auth: {
        method: 'basic',
        username: 'campus_virtual',
        password: 'c4mpus',
      },
    });
  }

  public getDocumentos(file): Observable<Documento[]> {
    this.saveFiles(file, this);
    return this.documentos$.asObservable();
  }



  saveFiles(files, nuxeoservice) {
    this.documentos = {};
    nuxeoservice.documentos = {};
    DocumentosService.nuxeo.connect()
      .then(function (client) {
        files.forEach(file => {
          this.get('tipo_documento/' + file.IdDocumento)
            .subscribe(res => {
              if (res !== null) {
                const tipoDocumento = <TipoDocumento>res;
                console.info(tipoDocumento);
                DocumentosService.nuxeo.operation('Document.Create')
                  .params({
                    type: tipoDocumento.TipoDocumentoNuxeo,
                    name: file.nombre,
                    properties: 'dc:title=' + file.nombre,
                  })
                  .input(tipoDocumento.Workspace)
                  .execute()
                  .then(function (doc) {
                    const nuxeoBlob = new Nuxeo.Blob({ content: file.file });
                    DocumentosService.nuxeo.batchUpload()
                      .upload(nuxeoBlob)
                      .then(function (response) {
                        file.uid = doc.uid
                        DocumentosService.nuxeo.operation('Blob.AttachOnDocument')
                          .param('document', doc.uid)
                          .input(response.blob)
                          .execute()
                          .then(function (respuesta) {
                            const documentoPost = new Documento;
                            documentoPost.Enlace = file.uid;
                            documentoPost.Nombre = file.nombre;
                            documentoPost.TipoDocumento = tipoDocumento;
                            this.post('documento', documentoPost)
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
            });
        });
      });
  }

  get(endpoint) {
    return this.http.get(path + endpoint, httpOptions).pipe(
      catchError(this.handleError),
    );
  }

  post(endpoint, element) {
    return this.http.post(path + endpoint, element, httpOptions).pipe(
      catchError(this.handleError),
    );
  }


  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
      }
      // return an observable with a user-facing error message
      return throwError({
        status: error.status,
        message: 'Something bad happened; please try again later.',
      });
  };
}
