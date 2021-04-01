import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { NgForm } from "@angular/forms";
import Swal from "sweetalert2";
import { SedeModel } from "../../modelos/sede.model";
import { RegistroInscritoModel } from "../../modelos/registroInscrito.model";
import { FechaModel } from "../../modelos/fecha.model";
import { FechasService } from "../../servicios/fechas.service";
import { RegistrosInscritosService } from "../../servicios/registros-inscritos.service";
import { SedesService } from "../../servicios/sedes.service";
import { NbGlobalPhysicalPosition, NbToastrService } from "@nebular/theme";
import { ListService } from "../../../../@core/store/list.service";
import { Periodo } from "../../../../@core/data/models/parametro/periodo";
import { IAppState } from "../../../../@core/store/app.state";
import { Store } from "@ngrx/store";
import { ParametroPeriodo } from "../../../../@core/data/models/parametro/parametro_periodo";
import { DatePipe } from "@angular/common";
import { formatDate } from "@angular/common";
import { environment } from "../../../../../environments/environment";
import { OikosService } from "../../../../@core/data/oikos.service";
import { HttpErrorResponse } from "@angular/common/http";
import { TranslateService } from "@ngx-translate/core";
import { TercerosService } from "../../../../@core/data/terceros.service";
import { Tercero } from "../../../../@core/data/models/terceros/tercero";

@Component({
  selector: "ngx-inscritos",
  templateUrl: "./inscritos.component.html",
  styleUrls: ["./inscritos.component.scss"],
})
export class InscritosComponent implements OnInit {
  inscritos: boolean;
  sedes: SedeModel[] = [];
  /* sedesAccesso: SedeModel[] = [] */
  sedesAccesso = [];
  facultadAccesso = [];
  registosAprovados: string[] = [];
  registroBase = new RegistroInscritoModel();
  periodo: Periodo = null;
  fechaActual = new FechaModel();
  myDate = formatDate(new Date(), "yyyy-MM-dd", "en");

  constructor(
    private fechasService: FechasService,
    private registroInscritoService: RegistrosInscritosService,
    private sedesService: SedesService,
    private router: Router,
    private route: ActivatedRoute,
    private toastrService: NbToastrService,
    private oikosService: OikosService,
    private tercerosService: TercerosService,
    private translate: TranslateService,
    private datePipe: DatePipe,
    private store: Store<IAppState>,
    private listService: ListService
  ) {
    this.myDate = this.datePipe.transform(this.myDate, "yyyy-MM-dd");
    this.listService.findParametroPeriodo(environment.IDS.IDSERVICIOAPOYO);
    this.loadPeriodo();
    this.cargarSedes()
      .then(() => {
        if (this.sedesAccesso != []) {
          this.cargarFacultades();
        }
      })
      .catch(() => {
        console.error("Error en cargar sedes");
      });
  }
  public loadPeriodo() {
    this.store
      .select((state) => state)
      .subscribe((list) => {
        const listaParam = list.listParametros;
        if (listaParam.length > 0 && this.periodo === null) {
          console.info("Periodo");
          console.info(listaParam);
          let parametros = <Array<ParametroPeriodo>>listaParam[0]["Data"];
          this.periodo = parametros[0].PeriodoId;
        }
      });
  }

  async ngOnInit() {
    this.inscritos = true;
    let tipo = this.route.snapshot.paramMap.get("tipo");
    console.info(tipo);
    this.fechaActual.fechaDia = new Date();
    if (tipo === "no-inscritos") {
      this.inscritos = false;
    } else {
      if (tipo === "inscritos") {
        this.inscritos = true;
      }
    }

    /* this.fechasService.getFechas()
      .subscribe(async resp => {
        this.fechaActual = this.buscarFechaActiva(resp);

        if (this.fechaActual == null) {
          
          this.router.navigateByUrl('');
        } else {
          
          this.registroBase.codigo = "";
          this.registroBase.sede = "";
          this.registroBase.fecha = this.fechaActual.fechaDia;

        }
      }); */

    /*  this.sedesService.getSedes()
      .subscribe(resp => {
        this.sedesAccesso = resp;
      }); */
  }

  OnChanges() {
    console.log("cambios");
  }

  async guardar(form: NgForm) {
    if (form.invalid || this.sedesAccesso.length === 0) {
      Object.values(form.controls).forEach((control) => {
        control.markAsTouched();
      });
      return;
    }
    this.registroBase.sede = form.value["sede"];
    console.log(this.registroBase.sede);
    console.log(this.facultadAccesso[this.registroBase.sede]);
    console.log(this.registroBase);
    const terceroReg: Tercero= await this.cargarTerceroByDocumento(this.registroBase.codigo);
    if(terceroReg !== undefined){
      console.log(terceroReg);
      if(this.inscritos){
        console.log("se busca inscripcion");
      }else{
        console.log("se busca si esta activo");
      }
      this.showToast();
    }else{
      Swal.fire('No se encuentra');
    }
    /* this.loadTerceroByDocumento(this.registroBase.codigo).then((resp) => {
      const terceroReg: Tercero=resp;
      if(terceroReg !== undefined){
        console.log(terceroReg);
        if(this.inscritos){
          console.log("se busca inscripcion");
        }else{
          console.log("se busca si esta activo");
        }
        this.showToast();
      }else{
        Swal.fire('No se encuentra');
      }
    })
    .catch(() => {
      Swal.fire('Error al cargar documentos');
    }); */

    

    Object.values(form.controls).forEach((control) => {
      control.markAsUntouched();
    });
    form.value["codigo"] = "";
  }

  loadTerceroByDocumento(documento: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.tercerosService
        .get(`datos_identificacion?query=Numero:${documento}`)
        .subscribe(
          (result) => {
            /* let ter: Tercero;
            ter=result[0].TerceroId; */
            resolve(result[0].TerceroId);
          },
          (error: HttpErrorResponse) => {
            Swal.fire({
              icon: "error",
              title: error.status + "",
              text: this.translate.instant("ERROR." + error.status),
              footer:
                this.translate.instant("GLOBAL.cargar") +
                "-" +
                this.translate.instant("GLOBAL.info_complementaria"),
              confirmButtonText: this.translate.instant("GLOBAL.aceptar"),
            });
            reject(error);
          }
        );
    });
  }

  cargarTerceroByDocumento(documento: string) : any {
      this.tercerosService
        .get(`datos_identificacion?query=Numero:${documento}`)
        .subscribe(
          (result) => {
            /* let ter: Tercero;
            ter=result[0].TerceroId; */
            console.log(result[0].TerceroId);
            return result[0].TerceroId;
            //resolve(result[0].TerceroId);
          },
          (error: HttpErrorResponse) => {
            Swal.fire({
              icon: "error",
              title: error.status + "",
              text: this.translate.instant("ERROR." + error.status),
              footer:
                this.translate.instant("GLOBAL.cargar") +
                "-" +
                this.translate.instant("GLOBAL.info_complementaria"),
              confirmButtonText: this.translate.instant("GLOBAL.aceptar"),
            });
            return undefined;
          }
        );
  }

  buscarFechaActiva(fechas: FechaModel[]) {
    if (fechas === null) {
      return null;
    }

    let fechasAct: FechaModel;

    Object.keys(fechas).forEach((key) => {
      const fecha: FechaModel = fechas[key];
      if (this.fechaActiva(fecha.fechaDia)) {
        fechasAct = fecha;
      }
    });
    return fechasAct;
  }

  fechaActiva(fecha: Date) {
    let f1 = new Date(fecha); // Fecha ingresada por el usuario
    let f2 = new Date(Date.now()); //Fecha actual
    f1.setHours(0, 0, 0, 0);
    f1.setDate(f1.getDate() + 1);
    f2.setHours(0, 0, 0, 0);
    if (f1.getTime() == f2.getTime()) {
      return true;
    }
    return false;
  }
  cargarSedes(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.oikosService
        .get(
          `tipo_uso_espacio_fisico?query=TipoUsoId.Nombre:Apoyo,Activo:true&limit=-1`
        )
        .subscribe(
          (result) => {
            for (let i = 0; i < result.length; i++) {
              this.sedesAccesso.push(result[i].EspacioFisicoId.Nombre);
            }
            resolve(true);
          },
          (error: HttpErrorResponse) => {
            Swal.fire({
              icon: "error",
              title: error.status + "",
              text: this.translate.instant("ERROR." + error.status),
              footer:
                this.translate.instant("GLOBAL.cargar") +
                "-" +
                this.translate.instant("GLOBAL.info_complementaria"),
              confirmButtonText: this.translate.instant("GLOBAL.aceptar"),
            });
            reject(error);
          }
        );
    });

    //temporal
    /* let ingenieria = new SedeModel();
    ingenieria.id = "1";
    ingenieria.nombre = "Ingenieria";

    let macarena = new SedeModel();
    macarena.id = "2";
    macarena.nombre = "Macarena";

    let vivero = new SedeModel();
    vivero.id = "3";
    vivero.nombre = "Vivero"; */
    /* 
    this.sedesAccesso.push(ingenieria);
    this.sedesAccesso.push(macarena);
    this.sedesAccesso.push(vivero); */
  }

  async cargarFacultades() {
    console.log("Se toman:", this.sedesAccesso);
    for (let i = 0; i < this.sedesAccesso.length; i++) {
      this.facultadAccesso.push("");
    }
    for (let i = 0; i < this.sedesAccesso.length; i++) {
      console.log("Buscando facultad de:", this.sedesAccesso[i]);
      this.oikosService
        .get(
          `asignacion_espacio_fisico_dependencia?query=EspacioFisicoId.Nombre:${this.sedesAccesso[i]}&limit=-1`
        )
        .subscribe((result) => {
          for (let j = 0; j < result.length; j++) {
            let nomDependencia = result[j].DependenciaId.Nombre;
            var splitted = nomDependencia.split(" ", 1);
            if (splitted[0] == "FACULTAD") {
              this.facultadAccesso[i] = nomDependencia;
              break;
            }
          }
          /* console.log(
            "se encuenta facultad de:",
            result[0].DependenciaId.Nombre
          ); */
        });
    }
    console.log(this.facultadAccesso);
  }

  showToast() {
    /* console.log(dato); */
    let estudiante = this.registosAprovados.reverse();
    this.toastrService.show(
      "Se registro correctamente",
      `Estudiante: ${this.registroBase.codigo}`,
      {
        position: NbGlobalPhysicalPosition.TOP_RIGHT,
        status: "success",
        duration: 2000,
        icon: "checkmark-square-outline",
      }
    );
    this.registroBase.codigo = "";
  }
}
