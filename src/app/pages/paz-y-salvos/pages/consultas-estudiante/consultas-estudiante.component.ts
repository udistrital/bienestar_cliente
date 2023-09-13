import { Component, OnInit } from "@angular/core";
import { AtencionesService } from "../../services/atenciones.service";
import Swal from "sweetalert2";
import { UtilService } from "../../../../shared/services/utilService";
import { ListService } from "../../../../@core/store/list.service";
import { Tercero } from "../../../../@core/data/models/terceros/tercero";
import { Solicitud } from "../../../../@core/data/models/solicitud/solicitud";
import { Periodo } from "../../../../@core/data/models/parametro/periodo";
import { ApiConstanst } from "../../../../shared/constants/api.constans";
import { environment } from "../../../../../environments/environment";
import { ImplicitAutenticationService } from "../../../../@core/utils/implicit_autentication.service";
import { Observacion } from "../../../../@core/data/models/solicitud/observacion";
import { EstudiantesService } from "../../../../shared/services/estudiantes.service";
import { SoportePaquete } from "../../../../@core/data/models/solicitud/soporte-paquete";
import { NuxeoService } from "../../../../@core/utils/nuxeo.service";
import { DocumentoService } from "../../../../@core/data/documento.service";

@Component({
  selector: "ngx-consultas-estudiante",
  templateUrl: "./consultas-estudiante.component.html",
  styleUrls: ["./consultas-estudiante.component.scss"],
})
export class ConsultasEstudianteComponent implements OnInit {
  //para solicitud
  solicitudesExt: any[] = [];
  //paginacion
  pagActual: number = 1;
  contPag: number = 0;
  itemsPag: number[] = [1, 5, 10, 25, 50, 100, 250, 500, 1000, 2500];
  paginacion: number = 10;
  itemTipoSol = null;
  //desplegables

  estudiante = null;
  tercero: Tercero = null;
  solicitud: Solicitud = null;
  periodo: Periodo = null;
  loading: boolean = true;
  puedeCrear: boolean = false;

//  Para gestionar la descarga del paz y salv0
  documentosHTML = new Array();
  documentosSolicitud: SoportePaquete;
  selectDoc = [];


  constructor(
    private utilService: UtilService,
    private est: EstudiantesService,
    private listService: ListService,
    private nuxeoService: NuxeoService,
    private documentoService: DocumentoService,
  ) {
    this.obtenerInfoUsuario();
  }

  ngOnInit() {}
  showError(titulo: string, msj: any) {
    this.loading = false;
    Swal.close();
    this.utilService.showSwAlertError(titulo, msj);
  }
 

  obtenerInfoUsuario() {
    Swal.fire({
      title: "Por favor espere!",
      html: `cargando información del estudiante`,
      allowOutsideClick: false,
      showConfirmButton: false,
    });
    Swal.showLoading();
    this.listService.getInfoEstudiante().then((resp) => {
      this.est.getEstudiantePorDocumento(resp.documento).subscribe((res) => {
        
        this.estudiante = res[0].TerceroId;
        this.estudiante.documento = res[0].Numero;
        this.estudiante.documento_compuesto =
          res[0].TipoDocumentoId.CodigoAbreviacion +
          " " +
          this.estudiante.documento;
          if (this.tercero !== undefined) {

            this.listService
              .loadSolicitanteByIdTerceroPYZ(this.estudiante.Id, null, null, null)
              .then((resp) => {

                if(resp.length === 0){ 
                  Swal.fire({
                    title: "Sin solicitudes :(",
                    text: "...upsss no encontramos ninguna solicitud de paz y salvos asociada a este usuario ",
                    confirmButtonText: "Aceptar",
                });;
                }     
                  else{
                  for (const solicitante of resp) {
                    this.listService.loadSolicitud(solicitante.SolicitudId.Id).then((solicitud)=>{
                        this.loadDocumentos(solicitud.Id).then((pazysalvo)=>{
                          this.solicitudesExt.push({...solicitud,'documento':pazysalvo});
                        })                     
  
                  })
                  }
                  Swal.close();
                }
 

              })
              .catch((error) => console.error(error));
          } else {
            this.showError(
              "Estudiante no encontrado",
              "No se encuentra el tercero"
            );
          }
          Swal.close()
      });

    });
  }

  loadDocumentos(solicitudId) {
    return new Promise((resolve, rejected) => {
      let contDocs = 0;
      let terminoDescargar = false;
      let pazysalvo = null; // Variable para almacenar el resultado
  
      this.listService.findPaqueteSolicitudBySolicitud(solicitudId).then((paqSol) => {
        if ( Object.keys(paqSol).length !== 0) {
         
          this.listService.findSoportePaqueteByIdPaquete(paqSol.PaqueteId.Id).then((soportes) => {
            this.documentosSolicitud = soportes;
            const documentosHTML = [];
  
            for (let i = 0; i < Object.keys(soportes).length; i++) {
              const element = Object.values(soportes)[i];
              this.documentosHTML[i] = new Array();
              this.documentosHTML[i][0] = element.Descripcion;
            }
  
            this.nuxeoService.getDocumentoById$(soportes, this.documentoService).subscribe((res: Object) => {
              for (let i = 0; i < this.documentosHTML.length; i++) {
                if (res['undefined'].documento == this.documentosHTML[i][0]) {
                  this.documentosHTML[i][1] = res['undefined'].url;
                }
              }
              contDocs++;
              if (contDocs === Object.keys(soportes).length && !terminoDescargar) {
                pazysalvo = this.documentosHTML[0];
                this.selectDoc = this.selectDoc.concat(pazysalvo[1]);
                this.loading = false;
                Swal.close();
                terminoDescargar = true;
                resolve(pazysalvo[1]); // Resolvemos la Promesa con pazysalvo
              }
            });
          });
        }else{
          resolve("")
        }
      }).catch((err) => {
        this.showError('No se encontraron documentos', err);
        rejected(err); // Rechazamos la Promesa si ocurre un error
      });
    });
  }
 
}
