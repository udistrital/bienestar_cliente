import { Component, Input, OnInit } from "@angular/core";
import Swal from "sweetalert2";
import { Periodo } from "../../../../@core/data/models/parametro/periodo";
import { ListService } from "../../../../@core/store/list.service";
import { Solicitud } from "../../../../@core/data/models/solicitud/solicitud";
import { Tercero } from "../../../../@core/data/models/terceros/tercero";
import { ReferenciaSolicitud } from "../../../../@core/data/models/solicitud/referencia-solicitud";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ViewChild } from "@angular/core";
import { TemplateRef } from "@angular/core";
import { InfoCompletaEstudiante } from "../../../../@core/data/models/info-completa-estudiante/info-completa-estudiante";
import { DatePipe } from "@angular/common";
import { InfoComplementariaTercero } from "../../../../@core/data/models/terceros/info_complementaria_tercero";
import { UtilService } from "../../../../shared/services/utilService";
import { ApiConstanst } from "../../../../shared/constants/api.constans";
import { delay } from "rxjs/operators";

@Component({
  selector: 'ngx-crear-solicitud',
  templateUrl: './crear-solicitud.component.html',
  styleUrls: ['./crear-solicitud.component.scss']
})
export class CrearSolicitudComponent implements OnInit {

  @Input() tercero: Tercero = null;
  @Input() periodo: Periodo = null;
  @Input() extraSolicitud: boolean =false;

  estudiante: InfoCompletaEstudiante = new InfoCompletaEstudiante();
  solicitud: Solicitud = null;
  listInfoComplementaria: InfoComplementariaTercero[] = [];

  infoComeplementariaPut = [];
  loadData: boolean = true;

  allServicesP: boolean = false;
  oneServicesP: boolean = false;
  validarDocs: boolean = false;

  registro: FormGroup;
  residencia: FormGroup;
  academica: FormGroup;
  sisben: FormGroup;
  socioeconomica: FormGroup;
  personasacargo: FormGroup;
  necesidades: FormGroup;
  serviciosPublicos: FormGroup;
  especial: FormGroup;

  APP_CONSTANTS = ApiConstanst;

  @ViewChild("dialogo", { read: null, static: null }) dialogo: TemplateRef<any>;

  constructor(
    private utilService: UtilService,
    private listService: ListService,
  ) {
    /** Mensaje de carga de información en los fornmularios */
    Swal.fire({
      title: "Ya casi! Por favor espere",
      html: `cargando formulario de apoyo alimentario`,
      allowOutsideClick: false,
      showConfirmButton: false,
    });
    Swal.showLoading();
  
   }

  ngOnInit() {
    console.log(this.tercero);
    this.loadSolicitud();

    this.listService.findDocumentosTercero(this.tercero.Id, null).then((respDocs) => {
      for (const documento of respDocs) {
          if (this.estudiante.Carnet == null && documento.TipoDocumentoId.CodigoAbreviacion == "CODE") {
              this.estudiante.Carnet = documento;
          } else if (this.estudiante.Documento == null && documento.TipoDocumentoId.CodigoAbreviacion != "CODE") {
              this.estudiante.Documento = documento;
          }
      }
      this.listService.loadFacultadProyectoTercero(this.tercero.Id).then((nomFacultad) => {
        this.estudiante.Facultad = nomFacultad[0];
        this.estudiante.ProyectoCurricular = nomFacultad[1];
        this.loadInfoComp();
      }).catch((errorFacu) => {
        this.utilService.showSwAlertError("Facultad o Proyecto curricular no existe", errorFacu);
        this.loadInfoComp();
      });
    }).catch((errorDocs) => this.showError("Documentos no encontrados", errorDocs));    
  }

  loadInfoComp(){
    this.listService.findInfoComplementariaTercero(this.tercero.Id).then((respIC) => {
      console.log("Entro info");
      this.listInfoComplementaria = respIC;
      this.inicializarFormularios();
    }).catch((errIC) => {
      this.showError("error", errIC);
      this.inicializarFormularios();
    });
  }

  loadSolicitud(){
    this.listService.loadSolicitanteByIdTercero(this.tercero.Id, null, this.periodo.Nombre, null).then(
      (resp) => {
        if(resp.length>0){
          this.solicitud=resp[0].SolicitudId;
        }
      }
  ).catch((error) => console.error(error));
  }

   /* Clasifica la informacion de listInfoComplementaria */
  loadEstudiante(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.estudiante.Nombre = this.tercero.NombreCompleto;
      var datePipe = new DatePipe("en-US");
      this.estudiante.FechaNacimiento = datePipe.transform(
        this.tercero.FechaNacimiento,
        "dd/MM/yyyy"
      );
      let infComp: InfoComplementariaTercero;

      for (infComp of this.listInfoComplementaria) {
        const nombreGrupoInfo = infComp.InfoComplementariaId.GrupoInfoComplementariaId.Nombre;
        switch (nombreGrupoInfo) {
          case "Información Contacto":
            this.agregarInformacionContacto(infComp);
            break;
          case "Información Socioeconómica":
            this.agregarInformacionSocioEconomica(infComp);
            break;
          case "Apoyo Alimentario":
            this.agregarInformacionApoyoAlimentario(infComp);
            break;
          case "Información básica":
            this.agregarInformacionBasica(infComp);
            break;
          case "Dependencia económica":
            this.estudiante.InfoSocioeconomica.DependenciaEconomica =
              infComp.InfoComplementariaId.Nombre;
            break;
          case "¿Tiene Sisben?":
            this.estudiante.InfoResidencia.Sisben = infComp.InfoComplementariaId.Nombre
            /*
            SI: InfoComplementariaId.Id:170
            NO: InfoComplementariaId.Id:171
            */
            break;
          case "Tipo de Colegio":
            /*
            Privado: InfoComplementariaId.Id:172
            Publico: InfoComplementariaId.Id:173
            */
            this.estudiante.InfoSocioeconomica.TipoColegio =
              infComp.InfoComplementariaId.Nombre;
            break;
          case "Lugar de vivienda":
            /*
            Propio: InfoComplementariaId.Id:181
            Familiar: InfoComplementariaId.Id:182
            Arriendo: InfoComplementariaId.Id:183
            */
            this.estudiante.InfoSocioeconomica.TipoVivienda =
              infComp.InfoComplementariaId.Nombre;
            if (this.estudiante.InfoSocioeconomica.TipoVivienda == "Arriendo") {
              this.estudiante.InfoSocioeconomica.PagaArriendo == true;
            } else {
              this.estudiante.InfoSocioeconomica.PagaArriendo == false;
            }
            break;

          case "¿Con quién vive?":
            /*
            Familia: InfoComplementariaId.Id:184
            Solo: InfoComplementariaId.Id:185
            Amigos: InfoComplementariaId.Id:186
            */
            this.estudiante.InfoSocioeconomica.ConQuienVive =
              infComp.InfoComplementariaId.Nombre;

            break;

          case "Genero":
            this.estudiante.Genero = infComp.InfoComplementariaId.Nombre;
            break;

          case "Estado Civil":
            this.estudiante.InfoSocioeconomica.EstadoCivil =
              infComp.InfoComplementariaId.Nombre;
            break;

          default:
        }
      }
      resolve(true);
    });
  }

  /* Clasifica la informacion socieconomica del estudiante */
  agregarInformacionSocioEconomica(infComp: InfoComplementariaTercero) {
    const nombreInfComp = infComp.InfoComplementariaId.Nombre;
    switch (nombreInfComp) {
      case "ESTRATO":
        this.estudiante.InfoSocioeconomica.Estrato = JSON.parse(
          infComp.Dato
        ).ESTRATO;
        break;

      case "PUNTAJE_SISBEN":
        this.estudiante.InfoResidencia.Puntaje_Sisben = infComp.Dato;
        break;

      case "CABEZA_FAMILIA":
        /*
          Padre
          Madre
          Familiar
          El mismo
        */
        this.estudiante.InfoSocioeconomica.CabezaFamilar = JSON.parse(
          infComp.Dato
        ).value;
        break;

      case "PERSONAS_A_CARGO":
        this.estudiante.InfoPersonasACargo.TienePersonasACargo = JSON.parse(
          infComp.Dato
        ).value;
        break;

      case "NUMERO_HIJOS":
        this.estudiante.InfoPersonasACargo.NumeroHijos = JSON.parse(
          infComp.Dato
        ).value;
        break;

      case "NUMERO_HERMANOS":
        this.estudiante.InfoSocioeconomica.NumeroHermanos = infComp.Dato;
        break;

      case "INGRESOS_MENSUALES":
        this.estudiante.InfoSocioeconomica.IngresosMensuales = JSON.parse(
          infComp.Dato
        ).value;
        break;

      default:
        break;
    }
  }

  /* Clasifica la informacion correspondiente a apoyo alimentario del estudiante */
  agregarInformacionApoyoAlimentario(infComp: InfoComplementariaTercero) {
    this.infoComeplementariaPut.push(infComp.InfoComplementariaId.Id);
    const nombreInfComp = infComp.InfoComplementariaId.Nombre;
    switch (nombreInfComp) {

      case "ANTIGUEDAD_PROGRAMA":
        this.estudiante.AntiguedadPrograma = JSON.parse(
          infComp.Dato
        ).value;
        break;

      case "CREDITOS_SEMESTRE_ACTUAL":
        this.estudiante.InfoAcademica.NumeroCreditos = JSON.parse(
          infComp.Dato
        ).value;
        break;

      case "ZONA_VULNERABILIDAD":
        this.estudiante.InfoSocioeconomica.ZonaVulnerabilidad = JSON.parse(
          infComp.Dato
        ).value;
        break;

      case "MENORES_EDAD_CONVIVE":
        this.estudiante.InfoPersonasACargo.MenoresEdad = JSON.parse(
          infComp.Dato
        ).value;
        break;

      case "MENORES_EDAD_ESTUDIANTES":
        this.estudiante.InfoPersonasACargo.MenoresEstudiantes = JSON.parse(
          infComp.Dato
        ).value;
        break;

      case "MENORES_EDAD_MATRICULADOS":
        this.estudiante.InfoPersonasACargo.MenoresMatriculados = JSON.parse(
          infComp.Dato
        ).value;
        break;

      case "CALIDAD_VIVIENDA":
        this.estudiante.InfoNecesidades.CalidadVivienda = JSON.parse(
          infComp.Dato
        ).value;
        break;

      case "NUMERO_CUARTOS_DORMIR":
        this.estudiante.InfoNecesidades.CuartosDormir = JSON.parse(
          infComp.Dato
        ).value;
        break;

      case "NUMERO_PERSONAS_HOGAR":
        this.estudiante.InfoNecesidades.PersonasHogar = JSON.parse(
          infComp.Dato
        ).value;
        break;

      case "AGUA_PARA_CONSUMO":
        this.estudiante.InfoNecesidades.OrigenAgua = JSON.parse(
          infComp.Dato
        ).value;
        break;

      case "ELIMINACION_AGUAS_NEGRAS":
        this.estudiante.InfoNecesidades.AguasNegras = JSON.parse(
          infComp.Dato
        ).value;
        break;

      case "PATOLOGIA_NUTRICION_ALIMENTACION":
        this.estudiante.InfoEspecial.Patologia = JSON.parse(
          infComp.Dato
        ).value;
        break;

      case "TIENE_HIJOS":
        this.estudiante.InfoPersonasACargo.Hijos = JSON.parse(
          infComp.Dato
        ).value;
        break;

      case "SERVICIOS_PUBLICOS_HOGAR":
        let contServices = 0;
        let servicios = JSON.parse(infComp.Dato).value
        for (let i of this.estudiante.InfoNecesidades.ServiciosPublicos) {
          if (servicios[i[0]] == true) {
            i[1] = "true";
            contServices++;
          }
        }
        if (contServices == this.estudiante.InfoNecesidades.ServiciosPublicos.length) {
          this.oneServicesP = true;
        }
        //console.log('ServiciosPublicos :>> ', this.estudiante.InfoNecesidades.ServiciosPublicos);
        break;

      default:
        break;
    }
  }

  /* Clasifica informacion de basica */
  agregarInformacionBasica(infComp: InfoComplementariaTercero) {
    const nombreInfComp = infComp.InfoComplementariaId.Nombre;
    switch (nombreInfComp) {
      case "Barrio de residencia":
        this.estudiante.InfoResidencia.Barrio = JSON.parse(infComp.Dato).value;
        break;

      case "Valor de matricula":
        this.estudiante.InfoAcademica.ValorMatricula = JSON.parse(
          infComp.Dato
        ).value;
        break;

      case "Promedio de carrera":
        this.estudiante.InfoAcademica.Promedio = JSON.parse(
          infComp.Dato
        ).value;
        break;

      case "Número de matriculas":
        this.estudiante.InfoAcademica.Matriculas = JSON.parse(infComp.Dato).value;
        break;

      case "Grupo Sisben":
        this.estudiante.InfoResidencia.Grupo_Sisben = JSON.parse(
          infComp.Dato
        ).value;
        break;

      case "Población Especial":
        this.estudiante.InfoEspecial.CondicionEspecial = JSON.parse(
          infComp.Dato
        ).value;
        break;

      case "Tiene Discapacidad":
        this.estudiante.InfoEspecial.Discapacidad = JSON.parse(
          infComp.Dato
        ).value;
        break;

      case "Seguridad Social":
        this.estudiante.InfoEspecial.SeguridadSocial = JSON.parse(
          infComp.Dato
        ).value;
        break;

      case "Pertenece a Ser Pilo Paga":
        this.estudiante.InfoEspecial.SerPiloPaga = JSON.parse(
          infComp.Dato
        ).value;
        break;

      default:
        break;
    }
  }

  /* Clasifica informacion de contacto */
  agregarInformacionContacto(infComp: InfoComplementariaTercero) {
    const nombreInfComp = infComp.InfoComplementariaId.Nombre;
    switch (nombreInfComp) {
      case "CORREO INSTITUCIONAL":
        this.estudiante.Correo_Institucional = JSON.parse(infComp.Dato).value;
        break;

      case "TELEFONO":
        this.estudiante.InfoResidencia.Telefono = JSON.parse(
          infComp.Dato
        ).telefono;
        break;

      case "CELULAR":
        this.estudiante.Celular = infComp.Dato;
        break;

      case "CORREO":
        this.estudiante.Correo = JSON.parse(infComp.Dato).value;
        break;

      case "DIRECCIÓN":
        this.estudiante.InfoResidencia.Direccion = JSON.parse(
          infComp.Dato
        ).Data;
        /* "Dato": "{\"DIRECCIÓN\":\"CL 60 A SUR # 73 - 41\",\"ZONA\":\"URBANA\",\"GENERO\":\"MIXTO\",\"DANE11\":\"51100202578\",\"DANE12\":\"111001107816\",\"CLASE\":\"DISTRITAL\",\"NAT_JURIDICA\":\"OFICIAL\",\"ESTADO\":\"ANTIGUO ACTIVO\"}", */
        break;

      case "LUGAR_RESIDENCIA":
        this.listService.cargarLugar(JSON.parse(infComp.Dato)).then((resp) => {
          this.estudiante.InfoResidencia.Municipio = resp.Nombre;
          this.residencia.get('municipio').setValue(resp.Nombre);
        }).catch((err) => {
          this.showError("Ubicación no disponible", "Ocurrió un error al obtener el LUGAR_RESIDENCIA, intente más tarde");
        });
        break;
      case "LOCALIDAD":
        this.listService.cargarLugar(JSON.parse(infComp.Dato).LOCALIDAD).then((resp) => {
          this.estudiante.InfoResidencia.Localidad = resp.Nombre;
          this.residencia.get('localidad').setValue(resp.Nombre);
        }).catch((err) => {
          this.showError("Ubicación no disponible", "Ocurrió un error al obtener la LOCALIDAD, intente más tarde");
        });
        break;


      default:
        break;
    }
  }

  /* Carga los datos a estudiante y crea los formularios reactivos */
  private inicializarFormularios() {
    this.loadEstudiante()
      .then(() => {
        this.registro = new FormGroup({
          nombres: new FormControl({
            value: this.estudiante.Nombre,
            disabled: true,
          }),
          codigo: new FormControl({
            value: this.estudiante.Carnet.Numero,
            disabled: true,
          }),
          documento: new FormControl({
            value: this.estudiante.Documento.Numero,
            disabled: true,
          }),
          tipoDocumento: new FormControl({
            value: this.estudiante.Documento.TipoDocumentoId.Nombre,
            disabled: true,
          }),
          proyecto: new FormControl({
            value: this.estudiante.ProyectoCurricular,
            disabled: true,
          }),
          facultad: new FormControl({
            value: this.estudiante.Facultad,
            disabled: true,
          }),
          fechaNacimiento: new FormControl({
            value: this.estudiante.FechaNacimiento,
            disabled: true,
          }),
          email_institucional: new FormControl({
            value: this.estudiante.Correo_Institucional,
            disabled: true,
          }),
          email: new FormControl({
            value: this.estudiante.Correo,
            disabled: true,
          }),
          celular: new FormControl({
            value: this.estudiante.Celular,
            disabled: true,
          }),
          programa: new FormControl({
            value: this.estudiante.AntiguedadPrograma,
            disabled: false,
          }),
          genero: new FormControl({
            value: this.estudiante.Genero,
            disabled: true,
          }),
        });

        this.residencia = new FormGroup({
          localidad: new FormControl({
            value: this.estudiante.InfoResidencia.Localidad,
            disabled: true,
          }),
          municipio: new FormControl({
            value: this.estudiante.InfoResidencia.Municipio,
            disabled: true,
          }),
          direccion: new FormControl({
            value: this.estudiante.InfoResidencia.Direccion,
            disabled: true,
          }),
          barrio: new FormControl({
            value: this.estudiante.InfoResidencia.Barrio,
            disabled: false,
          }),
          telefono: new FormControl({
            value: this.estudiante.InfoResidencia.Telefono,
            disabled: true,
          }),
        });

        this.academica = new FormGroup({
          valorMatricula: new FormControl({ 
            value: this.estudiante.InfoAcademica.ValorMatricula, 
            disabled: false 
          }),
          numeroCreditos: new FormControl({ 
            value: this.estudiante.InfoAcademica.NumeroCreditos, 
            disabled: false 
          }, Validators.required),
          promedio: new FormControl({ 
            value: this.estudiante.InfoAcademica.Promedio,
            disabled: false 
          }),
          matriculas: new FormControl({ 
            value: this.estudiante.InfoAcademica.Matriculas,
            disabled: false 
          }),
        });

        this.socioeconomica = new FormGroup({
          estadocivil: new FormControl({
            value: this.estudiante.InfoSocioeconomica.EstadoCivil,
            disabled: true,
          }),
          estrato: new FormControl({
            value: this.estudiante.InfoSocioeconomica.Estrato,
            disabled: true,
          }),
          ingresosMensuales: new FormControl({
            value: this.estudiante.InfoSocioeconomica.IngresosMensuales || 500000,
            disabled: true,
          }),
          cabezaFamilar: new FormControl({
            value: this.estudiante.InfoSocioeconomica.CabezaFamilar,
            disabled: true,
          }),
          dependenciaEconomica: new FormControl({
            value: this.estudiante.InfoSocioeconomica.DependenciaEconomica,
            disabled: true,
          }),
          pagaArriendo: new FormControl(),
          zonaVulnerabilidad: new FormControl({
            value: this.estudiante.InfoSocioeconomica.ZonaVulnerabilidad,
            disabled: false,
          }),
          numeroHermanos: new FormControl(),
          conQuienVive: new FormControl({
            value: this.estudiante.InfoSocioeconomica.ConQuienVive,
            disabled: true,
          }),
          tipoColegio: new FormControl({
            value: this.estudiante.InfoSocioeconomica.TipoColegio,
            disabled: true,
          }),
          tipoVivienda: new FormControl({
            value: this.estudiante.InfoSocioeconomica.TipoVivienda,
            disabled: true,
          }),
        });

        this.personasacargo = new FormGroup({
          tieneperacargo: new FormControl({
            value: this.estudiante.InfoPersonasACargo.TienePersonasACargo,
            disabled: false,
          }),
          hijos: new FormControl({
            value: this.estudiante.InfoPersonasACargo.Hijos,
            disabled: false,
          }),
          numeroHijos: new FormControl({
            value: this.estudiante.InfoPersonasACargo.NumeroHijos,
            disabled: false,
          }),
          menoresEdad: new FormControl({
            value: this.estudiante.InfoPersonasACargo.MenoresEdad,
            disabled: false,
          }),
          menoresEstudiantes: new FormControl({
            value: this.estudiante.InfoPersonasACargo.MenoresEdad,
            disabled: false,
          }),
          menoresMatriculados: new FormControl({
            value: this.estudiante.InfoPersonasACargo.MenoresMatriculados,
            disabled: false,
          }),
        });

        this.sisben = new FormGroup({
          tieneSisben: new FormControl({
            value: this.estudiante.InfoResidencia.Sisben,
            disabled: true,
          }),
          puntaje_Sisben: new FormControl({
            value: this.estudiante.InfoResidencia.Puntaje_Sisben,
            disabled: true,
          }),
          grupo: new FormControl({
            value: this.estudiante.InfoResidencia.Grupo_Sisben,
            disabled: false,
          }),
        });

        this.necesidades = new FormGroup({
          calidadVivienda: new FormControl({
            value: this.estudiante.InfoNecesidades.CalidadVivienda,
            disabled: false,
          }),
          cuartosDormir: new FormControl({
            value: this.estudiante.InfoNecesidades.CuartosDormir,
            disabled: false,
          }),
          personasHogar: new FormControl({
            value: this.estudiante.InfoNecesidades.PersonasHogar,
            disabled: false,
          }),
          origenAgua: new FormControl({
            value: this.estudiante.InfoNecesidades.OrigenAgua,
            disabled: false,
          }),
          aguasNegras: new FormControl({
            value: this.estudiante.InfoNecesidades.AguasNegras,
            disabled: false,
          }),
        });

        this.serviciosPublicos = new FormGroup({
          luz: new FormControl({
            value: (this.estudiante.InfoNecesidades.ServiciosPublicos[0][1] == "true"),
            disabled: false,
          }),
          gas: new FormControl({
            value: (this.estudiante.InfoNecesidades.ServiciosPublicos[1][1] == "true"),
            disabled: false,
          }),
          telefono: new FormControl({
            value: (this.estudiante.InfoNecesidades.ServiciosPublicos[2][1] == "true"),
            disabled: false,
          }),
          tv: new FormControl({
            value: (this.estudiante.InfoNecesidades.ServiciosPublicos[3][1] == "true"),
            disabled: false,
          }),
        });

        this.especial = new FormGroup({
          condicionEspecial: new FormControl({ value: this.estudiante.InfoEspecial.CondicionEspecial, disabled: false,}),
          discapacidad: new FormControl({ value: this.estudiante.InfoEspecial.Discapacidad, disabled: false,}),
          patologia: new FormControl({ value: this.estudiante.InfoEspecial.Patologia, disabled: false,}),
          seguridadSocial: new FormControl({ value: this.estudiante.InfoEspecial.SeguridadSocial, disabled: false,}),
          serPiloPaga: new FormControl({ value: this.estudiante.InfoEspecial.SerPiloPaga, disabled: false }),
        });

        this.loadData = false;
        Swal.close();
      })
      .catch((error) => {
        console.error(error);
        if (!error.status) {
          error.status = 409;
        }
        this.utilService.showSwAlertError(error.status + " Load info estudiante", error.status);
      });
  }

  showError(titulo: string, msj: any) {
    this.loadData = false;
    Swal.close();
    this.utilService.showSwAlertError(titulo, msj);
  }


  registrar() {
    let msj;
    if(!this.extraSolicitud){
      msj=`Desea solicitar apoyo alimentario para ${this.tercero.NombreCompleto}`;
    }else{
      msj=`Desea crear solicitud de apoyo alimentario en ExtraTiempo para ${this.tercero.NombreCompleto}`;
    }
    this.utilService.showSwAlertQuery("Está seguro?",msj, "Solicitar", "question")
      .then(async (resp) => {
        if (resp) {
          Swal.fire({
            title: "Espere",
            html: `Se estan guardando los datos`,
            allowOutsideClick: false,
            showConfirmButton: false,
          });
          Swal.showLoading();
          this.actualizarInfoEstudiante();
          /** Se compuerba que no exista una solciitud para el periodo actual */
          if (this.solicitud == null) {
            let refSol: ReferenciaSolicitud = new ReferenciaSolicitud();
            refSol.Periodo = this.periodo.Nombre;
            /** Se calcula el puntaje con base en los datos diligenciados para crear la solicitud. */
            refSol.Puntaje = await this.calcularPuntaje()
            //console.log("Puntaje -->",refSol.Puntaje);
            Swal.close();
            await this.listService.crearSolicitudApoyoAlimentario(
              this.tercero.Id,
              refSol
            );
          } else {
            this.showError("Solicitud Duplicada","La solicitud ya existe y no se pueden diligenciar 2 por periodo.");
          }
          //this.utilService.showSwAlertSuccess("Solicitud creada", "Se cargaron los datos de forma correcta");
          
        }
      });
    return false;
  }
  //Revisar caso de mayor tiempo de ejecución.
  calcularPuntaje(): number {

    let puntajeSol=0;
    let ingresosFamiliares=0;
    let condicionesFamiliares=0;
    let procedenciaYLugarDeResidencia=0;
    let condicionesDeSalud=0;
    let rangoDeMatricula=0;

    //Ingresos Familiares.
    let ingresosMes=this.socioeconomica.get('ingresosMensuales').value;
    const SMMLV = 908526; // Salario Minimo Mensual Legal Vigente

    if(ingresosMes>=0 && ingresosMes<=SMMLV){
      ingresosFamiliares=30;
    }else if(ingresosMes>(SMMLV*1) && ingresosMes<=(SMMLV*2)){
      ingresosFamiliares=20;
    }else if(ingresosMes>(SMMLV*2) && ingresosMes<=(SMMLV*3)){
      ingresosFamiliares=10;
    }else if(ingresosMes>(SMMLV*3) && ingresosMes<=(SMMLV*4)){
      ingresosFamiliares=5;
    }else if(ingresosMes>(SMMLV*4)){
      ingresosFamiliares=0;
    }else{
      //menos de 0 ingresos
    }

    //Condiciones Familiares.
    let sostieneHogar=this.socioeconomica.get('cabezaFamilar').value;
    if(sostieneHogar=="El mismo"){
      condicionesFamiliares+=5;
    }

    let sostieneASiMismo=this.socioeconomica.get('dependenciaEconomica').value;
    if(sostieneASiMismo=="El mismo"){
      condicionesFamiliares+=5;
    }

    let conQuienReside=this.socioeconomica.get('conQuienVive').value;
    if (conQuienReside!="Familia") {
      condicionesFamiliares+=4;
    }

    let tienePersonasACargo=this.personasacargo.get('tieneperacargo').value;
    if (tienePersonasACargo=="Si") {
      condicionesFamiliares+=6;
    }

    //Procedencia y lugar de residencia
    let estrato=this.socioeconomica.get('estrato').value;
    if(estrato==1 || estrato==2 || estrato==3){
      procedenciaYLugarDeResidencia+=10;
    }

    let municipio=this.residencia.get('municipio').value;
    let zonaVulnerabilidad=this.socioeconomica.get('zonaVulnerabilidad').value;
    
    if ((municipio!="Bogota" || municipio!="Bogotá") || zonaVulnerabilidad) {
      procedenciaYLugarDeResidencia+=5;
    }

    let poblacionEspecial=this.especial.get('condicionEspecial').value;

    if (poblacionEspecial!="ninguna" && poblacionEspecial!=null) {
      procedenciaYLugarDeResidencia+=5;
    }

    //Condiciones de Salud
    let presentaDiscapcidad=this.especial.get('discapacidad').value;
    if (presentaDiscapcidad=="si") {
      condicionesDeSalud+=5;
    }

    let presentaPatologia=this.especial.get('patologia').value;
    if (presentaPatologia=="Si") {
      condicionesDeSalud+=5;
    }

    let valMatricula=this.academica.get('valorMatricula').value;
    if(valMatricula>=0 && valMatricula<=100000){      
      rangoDeMatricula=20;
    }else if(valMatricula>100001 && valMatricula<=300000){
      rangoDeMatricula=16;
    }else if(valMatricula>300001 && valMatricula<=500000){
      rangoDeMatricula=12;
    }else if(valMatricula>500001 && valMatricula<=700000){
      rangoDeMatricula=8;
    }else if(valMatricula>700001 && valMatricula<=900000){
      rangoDeMatricula=4;
    }else if(valMatricula>900001){
      rangoDeMatricula=0;
    }else{
      //Es menor a 0
    }

    /* 
    console.log("ingresosFamiliares --> ",ingresosFamiliares);
    console.log("condicionesFamiliares --> ",condicionesFamiliares);
    console.log("procedenciaYLugarDeResidencia --> ",procedenciaYLugarDeResidencia);
    console.log("condicionesDeSalud --> ",condicionesDeSalud);
    console.log("rangoDeMatricula --> ",rangoDeMatricula); */

    //Puntaje Total:
    puntajeSol=ingresosFamiliares+condicionesFamiliares+procedenciaYLugarDeResidencia+condicionesDeSalud+rangoDeMatricula;


    return puntajeSol;
  }

  cargarDocumentos(validCarga) {
    delay(10000);
    if(validCarga){
      this.utilService.showSwAlertSuccess(" Felicitaciones!! "," Solicitud procesada con éxito");
      delay(10000);
      window.location.reload();
    }else{
      this.utilService.showSwAlertError(" Documentos invalidos "," Ocurrio un error al cargar los documentos, asegurese de subirlos nuevamente.");
    }
  }

  actualizarInfoEstudiante() {

    /** Se actualizara la información requerida que cambia constantemente para la solciitud de apoyo */
    if (this.validacionesForm()) {
      this.buscarInfoComplemetaria("ANTIGUEDAD_PROGRAMA", this.registro.get('programa').value);

      this.buscarInfoComplemetaria("Barrio de residencia", this.residencia.get('barrio').value);

      this.buscarInfoComplemetaria("Valor de matricula", this.academica.get('valorMatricula').value);
      this.buscarInfoComplemetaria("CREDITOS_SEMESTRE_ACTUAL", this.academica.get('numeroCreditos').value);
      this.buscarInfoComplemetaria("Promedio de carrera", this.academica.get('promedio').value);
      this.buscarInfoComplemetaria("Número de matriculas", this.academica.get('matriculas').value);
      
      this.buscarInfoComplemetaria("ZONA_VULNERABILIDAD", this.socioeconomica.get('zonaVulnerabilidad').value);

      this.buscarInfoComplemetaria("PERSONAS_A_CARGO", this.personasacargo.get('tieneperacargo').value);
      this.buscarInfoComplemetaria("TIENE_HIJOS", this.personasacargo.get('hijos').value);
      this.buscarInfoComplemetaria("NUMERO_HIJOS", this.personasacargo.get('numeroHijos').value);
      this.buscarInfoComplemetaria("MENORES_EDAD_CONVIVE", this.personasacargo.get('menoresEdad').value);
      this.buscarInfoComplemetaria("MENORES_EDAD_ESTUDIANTES", this.personasacargo.get('menoresEstudiantes').value);
      this.buscarInfoComplemetaria("MENORES_EDAD_MATRICULADOS", this.personasacargo.get('menoresMatriculados').value);
      
      this.buscarInfoComplemetaria("Grupo Sisben", this.sisben.get('grupo').value);

      this.buscarInfoComplemetaria("CALIDAD_VIVIENDA", this.necesidades.get('calidadVivienda').value);
      this.buscarInfoComplemetaria("NUMERO_CUARTOS_DORMIR", this.necesidades.get('cuartosDormir').value);
      this.buscarInfoComplemetaria("NUMERO_PERSONAS_HOGAR", this.necesidades.get('personasHogar').value);
      this.buscarInfoComplemetaria("SERVICIOS_PUBLICOS_HOGAR", this.serviciosPublicos.value);
      this.buscarInfoComplemetaria("AGUA_PARA_CONSUMO", this.necesidades.get('origenAgua').value);
      this.buscarInfoComplemetaria("ELIMINACION_AGUAS_NEGRAS", this.necesidades.get('aguasNegras').value);
      // DISCAPACIDAD?
      this.buscarInfoComplemetaria("PATOLOGIA_NUTRICION_ALIMENTACION", this.especial.get('patologia').value);
      this.buscarInfoComplemetaria("Población Especial",this.especial.get('condicionEspecial').value);
      this.buscarInfoComplemetaria("Tiene Discapacidad",this.especial.get('discapacidad').value);
      this.buscarInfoComplemetaria("Seguridad Social",this.especial.get('seguridadSocial').value);
      this.buscarInfoComplemetaria("Pertenece a Ser Pilo Paga",this.especial.get('serPiloPaga').value);
    }
    else {
      this.showError("Fallo formualrio","Al parecer algun dato no quedo correctamente diligenciado.");
    }

  }

  buscarInfoComplemetaria(nombreInfoComp: string, valor: any) {

    /** Se busca si eciste información complementaria en la información obtenida al cargar el solicitante */
    for (const infoComp of this.listInfoComplementaria) {
      /** Si existe, se procede a examinar y actualziar el dato */
      if (infoComp.InfoComplementariaId.Nombre == nombreInfoComp) {
        let objDato = JSON.parse(
          infoComp.Dato
        );

        if (objDato.value != valor) {
          if (typeof (valor) == 'object') {
            let cont = 0;
            for (let i = 0; i < Object.keys(valor).length; i++) {
              if (Object.values(objDato.value)[i] !== Object.values(valor)[i]) {
                cont++;
              }
            }
            if (cont == 0) {
              //console.log(`Se actualizo objetos ${nombreInfoComp}`);
              return true;
            }
          }
          //console.log(`Actualizar ${objDato.value} 4 ${valor}`);
          objDato.value = valor;
          infoComp.Dato = JSON.stringify(objDato);
          this.listService.actualizarInfoComplementaria(infoComp);
        }
        //console.log(`Se actualizo ${nombreInfoComp}`);
        return true;
      }
    }
    /** Se busca el tipo de información complementaria a guardar */
    this.listService.findInfoComplementaria(nombreInfoComp).then((respInfo) => {
      /** Si existe se agregan valores y se agrega nueva información del tercero */
      if (respInfo != undefined) {
        let infoComp = new InfoComplementariaTercero();
        infoComp.TerceroId = this.tercero;
        var objDato = {
          value: ""
        };
        objDato.value = valor;
        infoComp.Dato = JSON.stringify(objDato);
        infoComp.InfoComplementariaId = respInfo;
        this.listService.crearInfoComplementariaTercero(infoComp);
      } else {
        this.utilService.showSwAlertError('Nueva informacion', "El nombre no coincide con un tipo de informacion complementaria");
      }
    }).catch((err) => this.utilService.showSwAlertError('Actualizar informacion',err));
  }

  async save() {
  
    const isValidTerm = await this.utilService.termsAndConditional();

    if (isValidTerm) {
      //***************************************************** */
      if (this.validacionesForm()) {
        this.listService.disparadorDeDocumentos.emit({
          data:"validar"
        });
        if(this.validarDocs){
          this.registrar();
        }
      }
    }
  }

  validacionesForm(): boolean {
    let msj = " <strong> información </strong>";
    let style = "color: #ff0000; font-weight: bold; font-size: 1.2em;"
    let valido: boolean = true;
    if (!this.registro.controls.programa.valid) {
      msj += " <strong> básica </strong> (Antiguedad del programa),";
      valido=false;
    }
    if (!this.residencia.controls.barrio.valid || this.residencia.controls.barrio.value==null || this.residencia.controls.barrio.value=="") {
      msj += " <strong> residencia </strong> (Barrio residencia),";
      valido=false;
    }
    if (!this.academica.valid) {
      let menAcademica="";
      
      if(this.academica.controls.valorMatricula.value<=0 || this.academica.controls.valorMatricula.value==null || !this.academica.controls.valorMatricula.valid ){
        menAcademica+=" Valor matricula,"
      }
      if(this.academica.controls.numeroCreditos.value<0 || this.academica.controls.numeroCreditos.value>21 || this.academica.controls.numeroCreditos.value==null || !this.academica.controls.numeroCreditos.valid){
        menAcademica+=" Numero de Creditos,"
      }
      if(this.academica.controls.promedio.value<0 || this.academica.controls.promedio.value>5 || this.academica.controls.promedio.value==null || !this.academica.controls.promedio.valid){
        menAcademica+=" Promedio ,"
      }
      if(this.academica.controls.matriculas.value<=0 || this.academica.controls.matriculas.value>15 || this.academica.controls.matriculas.value==null || !this.academica.controls.matriculas.valid ){
        menAcademica+=" Número de Matriculas,"
      }
      menAcademica = menAcademica.slice(0, -1);
      msj += ` <strong> academica </strong> (${menAcademica}), `;
      valido=false;
    }
    if (this.socioeconomica.controls.ingresosMensuales.value<=0) {
      msj += " <strong> socioeconomica </strong> (ingresos mensuales), <strong> 'Si el problema persiste consulte CONDOR'.</strong> ";
      valido=false;
    }
    if (!this.socioeconomica.controls.zonaVulnerabilidad.valid) {
      msj += " <strong> socioeconomica </strong> (Zona de vulnerabilidad),";
      valido=false;
    }
    
    if (!this.personasacargo.valid) {
      let menPersonasACargo="";
      if(!this.personasacargo.controls.tieneperacargo.valid){
        menPersonasACargo+=" Tiene personas a cargo,"
      }
      if(!this.personasacargo.controls.hijos.valid){
        menPersonasACargo+=" Tiene hijos,"
      }
      if(this.personasacargo.controls.numeroHijos.value<0 || this.personasacargo.controls.numeroHijos.value==null || !this.personasacargo.controls.numeroHijos.valid){
        menPersonasACargo+=" numero de hijos ,"
      }
      if(this.personasacargo.controls.menoresEdad.value<0 || this.personasacargo.controls.menoresEdad.value==null || !this.personasacargo.controls.menoresEdad.valid){
        menPersonasACargo+=" menores con los que vive,"
      }
      if(this.personasacargo.controls.menoresEstudiantes.value<0 || this.personasacargo.controls.menoresEstudiantes.value==null || !this.personasacargo.controls.menoresEstudiantes.valid){
        menPersonasACargo+=" menores con educación,"
      }
      if(this.personasacargo.controls.menoresMatriculados.value<0 || this.personasacargo.controls.menoresMatriculados.value==null || !this.personasacargo.controls.menoresMatriculados.valid){
        menPersonasACargo+=" menores matriculados,"
      }
      menPersonasACargo = menPersonasACargo.slice(0, -1);
      msj += ` <strong> personas a cargo </strong> (${menPersonasACargo}), `;
      valido=false;
    } 
    if (!this.sisben.controls.grupo.valid) {
      msj += " <strong> sisben </strong> (Grupo),";
      valido=false;
    }
    if (!this.necesidades.valid) {
      let menNecesidades="";
      if(!this.necesidades.controls.calidadVivienda.valid){
        menNecesidades+=" Calidad vivienda,"
      }
      if(!this.necesidades.controls.cuartosDormir.valid){
        menNecesidades+=" cuartos para dormir,"
      }
      if(!this.necesidades.controls.personasHogar.valid){
        menNecesidades+=" personas en el hogar,"
      }
      if(!this.validServicios()){
        menNecesidades+=" Servicios Públicos,"
      }
      if(!this.necesidades.controls.origenAgua.valid){
        menNecesidades+=" Origen agua,"
      }
      if(this.necesidades.controls.aguasNegras.value==""){
        menNecesidades+=" Aguas negras,"
      }
      menNecesidades = menNecesidades.slice(0, -1);
      msj += ` <strong> necesidades básicas </strong> (${menNecesidades}), `;
      valido=false;
    }
    if (!this.especial.valid) {
      let menEspecial="";
      if(!this.especial.controls.condicionEspecial.valid){
        menEspecial+=" Poblacion Especial,"
      }
      if(!this.especial.controls.discapacidad.valid){
        menEspecial+=" Discapacidad,"
      }
      if(!this.especial.controls.patologia.valid){
        menEspecial+=" Patologia,"
      }
      if(!this.especial.controls.seguridadSocial.valid){
        menEspecial+=" Seguridad Social,"
      }
      if(!this.especial.controls.serPiloPaga.valid){
        menEspecial+=" Ser Pilo Paga,"
      }
      menEspecial = menEspecial.slice(0, -1);
      msj += ` <strong> info adicional </strong> (${menEspecial}), `;
      valido=false;
    }

    msj = msj.slice(0, -1);

    /*
    Algo no me cuadra aca en la logica
    Ahora si? :v
    */
    if (!valido && msj.length>31) {
      this.utilService.showSwAlertError("Campos Vacios", `Los campos con ( <span style="${style}">*</span> ) es obligatorio diligenciarlos. <br> Hacen falta datos en:  ${msj}`);
    } else {
      valido = true;
    }

    return valido;
  }

  validServicios(): boolean{
    let cont=0;
    for (let i of this.estudiante.InfoNecesidades.ServiciosPublicos) {
      let element=this.serviciosPublicos.get(i[0]).value;
      if(element==false){
        cont+=1;
      }
    }
    if(cont==4){
      return false;
    }else{
      return true;
    }
  }

  allSelected(check: boolean) {
    this.allServicesP = check;
    this.oneServicesP = check;
    for (let i of this.estudiante.InfoNecesidades.ServiciosPublicos) {
      if (this.allServicesP) {
        i[1] = "true";
        this.serviciosPublicos.get(i[0]).setValue(true);
      } else {
        i[1] = "false";
        this.serviciosPublicos.get(i[0]).setValue(false);
      }
    }
  }

  oneSelected(check: boolean) {

    if (check) {
      if (this.serviciosPublicos.get('luz').value == true
        && this.serviciosPublicos.get('gas').value == true
        && this.serviciosPublicos.get('telefono').value == true
        && this.serviciosPublicos.get('tv').value == true) {
        this.oneServicesP = true;
      } else if (this.serviciosPublicos.get('luz').value == false
        || this.serviciosPublicos.get('gas').value == false
        || this.serviciosPublicos.get('telefono').value == false
        || this.serviciosPublicos.get('tv').value == false) {
        this.oneServicesP = false;
      }
    } else {
      this.oneServicesP = check;
    }

  }

}
