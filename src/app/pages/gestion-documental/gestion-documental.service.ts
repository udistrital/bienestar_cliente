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
import * as JSZip from 'jszip';
import { DocumentoService } from '../../@core/data/documento.service';


@Injectable({
  providedIn: "root",
})
export class GestionService {
  static nuxeo: Nuxeo;
  static path = "/desarrollo/workspaces/pruebas/GestionDocumental";

  static documentoSubido: DocumentoGestion;
  documentos = [];

  constructor(
    private http: HttpClient,
    public toastrService: AlertToastService
  ) {
    GestionService.nuxeo = new Nuxeo({
      baseURL: environment.NUXEO.PATH,
      auth: {
        method: "basic",
        username: environment.NUXEO.CREDENTIALS.USERNAME,
        password: environment.NUXEO.CREDENTIALS.PASS,
      },
    });
  }

  /* SOLO API REST DOCUMENTOS */
  // Agrega documento al API
  addDocumento(
    documento: DocumentoGestion,
    documentoService: DocumentoService
  ){
    return documentoService.post("documento", documento);
  }

  /**
   * Obtiene los documentos de SIBUD del API Documetos
   *
   * @param documentoService Objeto de DocumetoService.
   * @param gestionService Objeto de GestionService.
   * @param filtro Query extra para realzar filtros
   * @return documentos
   */
  async getDocumentos(documentoService: DocumentoService,gestionService: GestionService, filtro?) {
    // Si no viene el parametro filtro
    if(filtro === undefined){
      filtro=''
    }

    let query="documento?query=TipoDocumento.Descripcion%3AGestion%20documental%20de%20bienestar%20institucional"+filtro+"&limit=20";
    let consulta = await documentoService.get(query).toPromise().catch(error=>{
      gestionService.toastrService.mostrarAlerta('Error buscando documentos '+error);
      console.log('el error es', error);
    });
    return consulta;
  }

  /**
   * Consulta los tipos de dccumentos creados para el SIBUD en la tabla tipo_documento
   * del API Documetos
   *
   * @param documentoService Objeto de DocumetoService.
   * @param query query para obtener un tipo especifico de documento
   * @return Map con los Tipos de documento y su id en la base de datos
   */
  async consultarTiposDocumento(documentoService: DocumentoService, query?) {
    let tipos: { [key: string]: Number }={'':0};
    delete tipos['']; // Se inicializo y elimino el item para que dejara asignar los valores
    let parametros = query? query: 'DominioTipoDocumento.Id:7'
    let consulta = await documentoService.get("tipo_documento?query="+parametros).toPromise();
    for(let item of consulta) {
        if (item.Workspace.includes("gestion_documental/documentos")){
            tipos[item.Nombre] = item.Id;
        }
      }
    if(query){
      return consulta;
    }else{
      return tipos;
    }
  }

  /**
   * Modifica documento en el API de documentos
   *
   * @param documento Documento a editar
   * @param documentoService Objeto de DocumetoService.
   */
  editDocumento(documento: DocumentoGestion, documentoService: DocumentoService){
      documentoService.put('documento', documento,documento.Id).toPromise();
    }
    
    /**
     * Elimina documentos en el API de documentos
     *
     * @param documento Documento a borrar
     * @param documentoService Objeto de DocumetoService.
     *      *
     */
    deletDocumento(documento: DocumentoGestion, documentoService: DocumentoService){
      documentoService.delete('documento',documento).toPromise();
    }

  /** API REST DOCUMENTOS Y NUXEO */

  /**
   * Crea un directorio en nuxeo de la ruta indicada para el la carga de documetos de
   * SUBUD (Resoluciones, actas,...)
   *
   * @param file Archivos a cargar.
   * @param path Directorio del.
   * @param gestionService Objeto de GestionService.
   *
   */
  async crearDocumento(
    file,
    documento: DocumentoGestion,
    gestionService: GestionService,
    documentoService: DocumentoService
  ) {
    const documentoCons = documento;
    let tipo=await this.consultarTiposDocumento(documentoService, 'Id:'+documento.TipoDocumento.Id);
    await GestionService.nuxeo.connect().then(async function (client) {
      await GestionService.nuxeo
        .operation("Document.Create")
        .params({
          type: "File",
          name: documento.Nombre,
          description: documento.Descripcion,
          properties: "dc:title=" + documento.Nombre,
        })
        .input(tipo[0].Workspace)
        .execute()
        .then(async function (res) {
          const blob = new Nuxeo.Blob({ content: file });
          await GestionService.nuxeo
            .batchUpload()
            .upload(blob)
            .then(async function (response) {
              GestionService.nuxeo
                .operation("Blob.AttachOnDocument")
                .param("document", res.uid)
                .input(response.blob)
                .execute();
              documentoCons.Enlace = res.uid;
              // Se requiere esperar por que se necesita el _id que asigna el API en la respuesta del POST
              await gestionService
                .addDocumento(documentoCons, documentoService)
                .subscribe((doc) => {
                });
              gestionService.toastrService.mostrarAlerta(
                "Se ha creado el documento " + documento.Nombre,
                "success"
              );
            })
            .catch(function (error) {
              gestionService.toastrService.mostrarAlerta(
                "Error creando el documento " +
                  documento.Nombre +
                  ", error:" +
                  error,
                "danger"
              );
            });
        });
    });
    documentoCons.Metadatos=JSON.parse(documentoCons.Metadatos);
    return documentoCons;
  }

  /**
   * Actualizacion del documento en el API Documentos y en nuxeo
   *
   * @param documento documento a actualizar
   * @param file Archivos a cargar.
   * @param gestionService Objeto de GestionService.
   * @param documentoService Servicio del API Documentos
   * @param actualizarArchivo: Si se esta actualizando el archivo (Puede solo actualizarce la informacion)
   */
  actualizarDocumento(
    documento: DocumentoGestion,
    file: File,
    gestionService: GestionService,
    documentoService: DocumentoService,
    actualizarArchivo: Boolean
  ) {
        const documentoCons = documento;
        if(actualizarArchivo){
             this.editDocumento(documento,documentoService); 
            const nuxeoBlob = new Nuxeo.Blob({content: file});
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
                            gestionService.toastrService.mostrarAlerta('El documento '+documento.Nombre+' ha sido actualizado','success');
                        })
                        .catch(function(error){
                            gestionService.toastrService.mostrarAlerta('Error actualizando el documento '+documento.Nombre+', error: '+error,'danger');
                        });
                        
                });
        }else{
            this.editDocumento(documento,documentoService);
        }
  }

  /**
   * Borrar documento en el API OAS y en nuxeo
   *
   * @param documento documento a Borrar
   * @param gestionService Objeto de GestionService.
   * @param documentoService: Objeto de DocumentoService
   */
  eliminarDocumento(
    documento: DocumentoGestion,
    gestionService: GestionService,
    documentoService: DocumentoService
  ) {
    GestionService.nuxeo.header('X-NXDocumentProperties', '*');
        GestionService.nuxeo.request('/id/'+documento.Enlace)
            .get()
            .then(function(res){
                GestionService.nuxeo.operation('Document.Delete')
                .input(res)
                .execute()
                .then(function (del){
                    gestionService.deletDocumento(documento, documentoService);
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

  // Consulta un documento en Nuxeo y si lo encuentra genera
  // una URL para mostrarlo
  async obtenerDocumento(id, gestionService) {
    let url;
    GestionService.nuxeo.header("X-NXDocumentProperties", "*");
    await GestionService.nuxeo
      .request("/id/" + id)
      .get()
      .then(async function (res) {
        await res.fetchBlob().then(async function (blob) {
            await blob.blob().then(function (responseblob) {
              url = URL.createObjectURL(responseblob);
              gestionService.toastrService.mostrarAlerta(
                "Se ha obtenido el documento satisfactoriamente",
                "success"
              );
            });
          })
          .catch(function (error) {
            gestionService.toastrService.mostrarAlerta(
              "Error generando el documento: " + error,
              "danger"
            );
            throw new Error(error);
          });          
      })
      .catch(function (error) {
        gestionService.toastrService.mostrarAlerta(
          "Documento no encontrado: " + error,
          "warning"
        );
        throw new Error(error);
      });
    return url;
  }

  //funcion para encontar el nombre de un documento por medio del uid
  async obtenerNombreDocumento(uid, gestionService) {
    let nombre;
    GestionService.nuxeo.header("X-NXDocumentProperties", "*");
    await GestionService.nuxeo
      .request("/id/" + uid)
      .get()
      .then(async function (res) {
        nombre = await res.get("file:content").name;
      })
      .catch(function (error) {
        gestionService.toastrService.mostrarAlerta(
          "Documento no encontrado: " + error,
          "warning"
        );
        throw new Error(error);
      });
    return nombre;
  }

  /* GESTO DE DOCUMENTOS  */
  /**
   * Crea un directorio en nuxeo de la ruta indicada para el gestor documental de funcionarios
   *
   * @param file Archivos a cargar.
   * @param path Directorio del.
   * @param gestionService Objeto de GestionService.
   *
   */
  async crearDocumentoGestor(file: File, id, gestionService: GestionService) {
    await GestionService.nuxeo.connect().then(async function (client) {
      await GestionService.nuxeo
        .operation("Document.Create")
        .params({
          type: "File",
          name: file.name,
          properties: "dc:title=" + file.name,
          //properties: 'dc:title='+documento.Nombre+' \ndc:description=Documento para probar creacion'
        })
        .input(id)
        .execute()
        .then(async function (res) {
          const blob = new Nuxeo.Blob({ content: file });
          await GestionService.nuxeo
            .batchUpload()
            .upload(blob)
            .then(async function (response) {
              await GestionService.nuxeo
                .operation("Blob.AttachOnDocument")
                .param("document", res.uid)
                .input(response.blob)
                .execute();
              gestionService.toastrService.mostrarAlerta(
                "Se ha creado el documento " + file.name,
                "success"
              );
            })
            .catch(function (error) {
              gestionService.toastrService.mostrarAlerta(
                "Error creando el documento " + file.name + ", error:" + error,
                "danger"
              );
            });
        });
    });
  }
  /**
   * Crea un directorio en nuxeo de la ruta indicada
   * Si se quiere crear en un documento padre se debe enviar tambien el id
   *
   * @param userPath Path a crear.
   * @param gestionService instancia de GestionService.
   * @param idPadre? Ppcional, id del documento padre, donde se creara el folder cuando no sea la raiz.
   *
   */
  async crearFolder(nombre, gestionService, idPadre?) {
    let path = GestionService.path + "/GestorRepositorios";
    let newId;
    // Cuando se crea un directorio raiz para un usuario, no se necesita el id donde se creara la carpeta
    // Se creara en el documento padre
    if (idPadre) {
      path = idPadre;
    }
    await GestionService.nuxeo
      .connect()
      .then(async function (client) {
        await GestionService.nuxeo
          .operation("Document.Create")
          .params({
            type: "Folder",
            name: nombre,
            properties:
              "dc:title=" + nombre + "\ndc:description=Folder de funcionario",
          })
          .input(path)
          .execute()
          .then(async function (doc) {
            newId = await doc.uid;
            await gestionService.toastrService.mostrarAlerta(
              "Repositorio creado",
              "success"
            );
          })
          .catch(function (error) {
            gestionService.toastrService.mostrarAlerta(
              "Error creando carpeta",
              "danger"
            );
            throw error;
          });
      })
      .catch(function (error) {
        gestionService.toastrService.mostrarAlerta(
          "Error en conexión con Nuxeo",
          "danger"
        );
        throw error;
      });
    return newId;
  }

  async obtenerDirectorioByPath(nombre, gestionService, validar?) {
    let retorno = new Map();
    retorno.set("valores", undefined);
    retorno.set("id", undefined);
    let id;
    await GestionService.nuxeo
      .repository()
      .fetch(GestionService.path + "/GestorRepositorios/" + nombre)
      .then(async function (res) {
        id = await res.uid;
        await retorno.set("id", id);
        let resultado = await gestionService.obtenerDirectorioByID(
          id,
          gestionService
        );
        retorno.set("valores", resultado);
      })
      .catch((error) => {
        if (!validar)
          gestionService.toastrService.mostrarAlerta(
            "Repositorio no encontrado :",
            "danger"
          );
      });
    return retorno;
  }
  /**
   * Obtiene el directorio en nuxeo con el id indicado
   *
   * @param id id del directorio
   * @param gestionService Instacion de GestionService.
   * @param validar? Parametro opcional, si solo se esta verificando qu un directorio exista.
   *
   * @return los documentos hijos que contenga, si esta vacio retorna un arreglo vacio.
   */
  async obtenerDirectorioByID(id, gestionService, validar?) {
    let retorno: any = undefined;
    const headers = {
      "X-NXDocumentProperties": "*",
    };
    await GestionService.nuxeo
      .operation("Document.GetChildren")
      .input(id)
      .execute({ headers })
      .then(async function (docs) {
        retorno = await docs.entries;
      })
      .catch(function (error) {
        if (!validar)
          gestionService.toastrService.mostrarAlerta(
            "Repositorio no encontrado buscando la ruta: danger"
          );
      });
    return retorno;
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
  async obtenerDirectorio(userPath, gestionService, validar?) {
    let retorno = new Map();
    retorno.set("existe", false);
    retorno.set("valores", undefined);
    retorno.set("id", undefined);
    const headers = {
      "X-NXDocumentProperties": "*",
    };
    await GestionService.nuxeo
      .operation("Document.GetChildren")
      .input(GestionService.path + "/GestorRepositorios/" + userPath)
      .execute({ headers })
      .then(async function (docs) {
        await retorno.set("valores", docs.entries);
        await retorno.set("existe", true);
      })
      .catch(function (error) {
        if (!validar)
          gestionService.toastrService.mostrarAlerta(
            "Repositorio no encontrado buscando la ruta:" + userPath,
            "danger"
          );
      });
    return retorno;
  }

  /**
   * Elimina el documetno con el id recibido
   *
   * @param id identificador del archivo a eliminar.
   * @param gestionService Instacia de GestionService.
   */
  async eliminarElementoGestor(id, gestionService: GestionService) {
    await GestionService.nuxeo
      .operation("Document.Delete")
      .input(id)
      .execute()
      .then(function (del) {
        gestionService.toastrService.mostrarAlerta(
          "El elemento ha sido eliminado",
          "success"
        );
      })
      .catch(function (error) {
        gestionService.toastrService.mostrarAlerta(
          "Elemento no encontrado: " + error,
          "warning"
        );
      });
  }

  /**
   * Actualizacion el nombre de un documento o folder
   *
   * @param documento Objeto Document del documetno a eliminar.
   * @param nuevoNombre Nombre nuevo del documento
   * @param gestionService Instacia de GestionService.
   */
  async actualizarNombre(
    documento,
    nuevoNombre,
    gestionService: GestionService
  ) {
    let id = documento.uid;
    if (!documento.isFolder()) {
      //Cambiar nombre
      let operation = GestionService.nuxeo.operation("Document.SetBlobName");
      operation.input(id).params({
        name: nuevoNombre,
      });
      await operation.execute();
      documento.set({ "dc:title": nuevoNombre });
      await documento.save();
    } else {
      await documento.set({
        "dc:title": nuevoNombre,
      });
      await documento.save();
    }
  }
  /**
   * Actualizacion el blob asociado al documento
   *
   * @param blob Blob que remplazara al original.
   * @param nuevoNombre Nombre nuevo del documento
   * @param documento documento de Nuxeo que se actualizara
   * @param gestionService Instacia de GestionService.
   */
  async actualizarDocumentoGestor(
    blob,
    nuevoNombre,
    documento,
    gestionService: GestionService
  ) {
    var blob = new Nuxeo.Blob({
      content: blob,
      name: nuevoNombre,
    });
    await GestionService.nuxeo
      .batchUpload()
      .upload(blob)
      .then(async function (res) {
        await documento
          .set({
            "file:content": res.blob,
            "dc:title": nuevoNombre,
          })
          .save();
      });
    await GestionService.nuxeo
      .repository()
      .fetch(documento.uid)
      .then((doc) => {
        doc.set("file:content", {
          content: blob,
          name: documento.title,
          mimeType: blob.type,
        });
        return doc.save();
      });
  }

  /**
   * Mueve un documento a una ubicacion indicada
   *
   * @param idPadre id de la ubicacion donde se enviara el documento.
   * @param idHijo id del documento a mover
   * @param gestionService Instacia de GestionService.
   */
  async moverDocumento(idPadre, idHijo, gestionService: GestionService) {
    await GestionService.nuxeo
      .operation("Document.Move")
      .input(idHijo)
      .params({
        target: idPadre,
      })
      .execute()
      .then(async function (res) {
        await gestionService.toastrService.mostrarAlerta(
          "Se ha movido el elemento",
          "success"
        );
      })
      .catch(function (error) {
        gestionService.toastrService.mostrarAlerta(
          "Ha ocurrido un error moviendo el elemento, error: " + error,
          "danger"
        );
      });
  }

  /**
   * Recorre el documentno indicado y añade al folder los archivos
   * que se encuentran en el para generer un zip con jsZip.
   *
   * @param id identificador del documento a comprimir.
   * @param folder filder JSzip que contendra todos los ahrhicovs del documento a comprimir.
   */
  async createFolder(doc, folder: JSZip) {
    // Si el documento es un archivo lo añade al folder y termina la funcion
    if (!doc.isFolder()) {
      let blob;
      await doc.fetchBlob().then(async (res) => {
        blob = await res.blob();
      });
      folder.file(doc.title, blob);
      return;
    }
    // Si el documento es un folder obtiene los documentos que se encuentran en el y repite el poceso para los hijos
    let id = doc.uid;
    let documentos = await this.obtenerDirectorioByID(id, this);
    for (const documento of documentos) {
      if (!documento.isFolder()) {
        let blob;
        await documento.fetchBlob().then(async (res) => {
          blob = await res.blob();
        });
        folder.file(documento.title, blob);
      } else {
        let folderHijo = folder.folder(documento.title);
        await this.createFolder(documento, folderHijo);
      }
    }
  }

  /**
   * Crea un .zip para descargar de un documento indicado
   *
   * @param documentos arreglo de documento/s a descargar.
   */
  async crearZip(documentos) {
    let zip = new JSZip();
    let titulo;
    let folder;
    if (documentos.length > 1) {
      folder = zip.folder("GestorGenerate");
      for (const doc of documentos) {
        await this.createFolder(doc, folder);
      }
      titulo = "GestorGenerate";
    } else {
      folder = zip.folder(documentos[0].title);
      await this.createFolder(documentos[0], folder);
      titulo = documentos[0].title;
    }
    await zip.generateAsync({ type: "blob" }).then((content) => {
      const url = window.URL.createObjectURL(content);
      const a = document.createElement("a");
      a.href = url;
      a.download = titulo + ".zip";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
  }
}