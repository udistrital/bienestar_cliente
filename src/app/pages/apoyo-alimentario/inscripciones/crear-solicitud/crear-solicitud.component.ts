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

@Component({
  selector: 'ngx-crear-solicitud',
  templateUrl: './crear-solicitud.component.html',
  styleUrls: ['./crear-solicitud.component.scss']
})
export class CrearSolicitudComponent implements OnInit {

  @Input() tercero: Tercero = null;
  @Input() solicitud: Solicitud = null;
  @Input() periodo: Periodo = null;
  @Input() estudiante: InfoCompletaEstudiante = new InfoCompletaEstudiante();
  @Input() extraSolicitud: boolean =false;

  listInfoComplementaria: InfoComplementariaTercero[] = [];

  infoComeplementariaPut = [];
  loadData: boolean = true;

  allServicesP: boolean = false;
  oneServicesP: boolean = false;
  validarDocs: boolean;

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
    Swal.fire({
      title: "Ya casi! Por favor espere",
      html: `cargando formulario de apoyo alimentario`,
      allowOutsideClick: false,
      showConfirmButton: false,
    });
    Swal.showLoading();
    console.log("Iniciamos formularios");
   }

  ngOnInit() {
    console.log("Inicio :V ");

    this.listService.findInfoComplementariaTercero(this.tercero.Id).then((respIC) => {
      this.listInfoComplementaria = respIC;
      this.inicializarFormularios();
    }).catch((errIC) => {
      this.showError("error", errIC);
      this.inicializarFormularios();
    });
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
      console.log(this.listInfoComplementaria);

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

      case "POBLACION_CONDICION_ESPECIAL":
        this.estudiante.InfoEspecial.CondicionEspecial = JSON.parse(
          infComp.Dato
        ).value;
        break;

      case "PATOLOGIA_NUTRICION_ALIMENTACION":
        this.estudiante.InfoEspecial.Patologia = JSON.parse(
          infComp.Dato
        ).value;
        break;

      case "SEGURIDAD_SOCIAL":
        this.estudiante.InfoEspecial.SeguridadSocial = JSON.parse(
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
        console.log('num es :>> ', this.estudiante.InfoNecesidades.ServiciosPublicos.length);
        console.log('numsssss :>> ', contServices);
        if (contServices == this.estudiante.InfoNecesidades.ServiciosPublicos.length) {
          this.oneServicesP = true;
        }
        /* this.estudiante.InfoNecesidades.AguasNegras = JSON.parse(
          infComp.Dato
        ).value; */
        console.log('ServiciosPublicos :>> ', this.estudiante.InfoNecesidades.ServiciosPublicos);
        break;

      default:
        break;
    }
  }

  /* Clasifica informacion de contacto */
  agregarInformacionContacto(infComp: InfoComplementariaTercero) {
    const nombreInfComp = infComp.InfoComplementariaId.Nombre;
    console.log(infComp);
    switch (nombreInfComp) {
      case "CORREO INSTITUCIONAL":
        console.log(infComp);
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
        console.log("Se carga el estudiante");
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
            disabled: true,
          }),
          telefono: new FormControl({
            value: this.estudiante.InfoResidencia.Telefono,
            disabled: true,
          }),
        });

        this.academica = new FormGroup({
          valorMatricula: new FormControl({ value: this.estudiante.InfoAcademica.ValorMatricula, disabled: true }),
          numeroCreditos: new FormControl({ value: this.estudiante.InfoAcademica.NumeroCreditos, disabled: false }, Validators.required),
          promedio: new FormControl({ value: this.estudiante.InfoAcademica.Promedio, disabled: true }),
          matriculas: new FormControl({ value: this.estudiante.InfoAcademica.Matriculas, disabled: true }),
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
            value: this.estudiante.InfoSocioeconomica.IngresosMensuales,
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

        console.log("VULNERABILIDAD--->", this.estudiante.InfoSocioeconomica.ZonaVulnerabilidad);

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

        console.log("Personas a cargo--->", this.estudiante.InfoPersonasACargo.TienePersonasACargo);

        this.sisben = new FormGroup({
          tieneSisben: new FormControl({
            value: this.estudiante.InfoResidencia.Sisben,
            disabled: true,
          }),
          puntaje_Sisben: new FormControl({
            value: this.estudiante.InfoResidencia.Puntaje_Sisben,
            disabled: true,
          }),
          grupo: new FormControl({value: this.estudiante.InfoResidencia.Grupo_Sisben, disabled: false}),
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

        console.log("AGUAS--->", this.estudiante.InfoNecesidades.AguasNegras);
        console.log("PATOLOGIA--->", this.estudiante.InfoEspecial.Patologia);

        this.especial = new FormGroup({
          condicionEspecial: new FormControl({ value: this.estudiante.InfoEspecial.CondicionEspecial, disabled: false,}),
          discapacidad: new FormControl({ value: this.estudiante.InfoEspecial.Discapacidad, disabled: false,}),
          patologia: new FormControl({ value: this.estudiante.InfoEspecial.Patologia, disabled: false,}),
          seguridadSocial: new FormControl({ value: this.estudiante.InfoEspecial.SeguridadSocial, disabled: false,}),
          serPiloPaga: new FormControl({ value: this.estudiante.InfoEspecial.SerPiloPaga, disabled: false }),
        });

        console.log("DISCAPACIDAD--->", this.estudiante.InfoEspecial.Discapacidad);


        /*this.loading = false;
        Swal.close(); */
        this.loadData = false;
        Swal.close();
      })
      .catch((error) => {
        console.error(error);
        if (!error.status) {
          error.status = 409;
        }
        this.utilService.showSwAlertError(error.status + " Load info estudiante", error.status);
        /* Swal.fire({
          icon: "error",
          title: error.status + " Load info estudiante",
          text: this.translate.instant("ERROR." + error.status),
          confirmButtonText: this.translate.instant("GLOBAL.aceptar"),
        }); */
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
            text: "Procesando su solicitud",
            icon: "question",
            allowOutsideClick: false,
          });
          this.actualizarInfoEstudiante();
          console.log("SALi estudiante jajaja salu2 xd");

          Swal.showLoading();
          if (this.solicitud == null) {
            let refSol: ReferenciaSolicitud = new ReferenciaSolicitud();
            refSol.Periodo = this.periodo.Nombre;
            console.log(refSol.Puntaje);
            refSol.Puntaje = await this.calcularPuntaje()
            console.log("Puntaje -->",refSol.Puntaje);
            this.listService.crearSolicitudApoyoAlimentario(
              this.tercero.Id,
              refSol
            );
          } else {
            console.log("ya existe no se crea");
          }

          this.utilService.showSwAlertSuccess("Solicitud creada", "Se cargaron los datos de forma correcta");
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

    const SMMLV = 908.526; // Salario Minimo Mensual Legal Vigente

    if(ingresosMes>=0 && ingresosMes<=SMMLV){
      console.log("30 Puntos");
      ingresosFamiliares=30;
    }else if(ingresosMes>(SMMLV*1.1) && ingresosMes<=(SMMLV*2)){
      console.log("20 Puntos");
      ingresosFamiliares=20;
    }else if(ingresosMes>(SMMLV*2.1) && ingresosMes<=(SMMLV*3)){
      console.log("10 Puntos");
      ingresosFamiliares=10;
    }else if(ingresosMes>(SMMLV*3.1) && ingresosMes<=(SMMLV*4)){
      console.log("5 Puntos");
      ingresosFamiliares=5;
    }else if(ingresosMes>(SMMLV*4.1)){
      console.log("0 Puntos");
      ingresosFamiliares=0;
    }else{
      console.log("menos de 0 ingresos? ");
    }

    //Condiciones Familiares.
    let sostieneHogar=this.socioeconomica.get('cabezaFamilar').value;
    if(sostieneHogar=="El mismo"){
      console.log("CON --> 5 puntos");
      condicionesFamiliares+=5;
    }

    let sostieneASiMismo=this.socioeconomica.get('dependenciaEconomica').value;
    if(sostieneASiMismo=="El mismo"){
      console.log("CON --> 5 puntos");
      condicionesFamiliares+=5;
    }

    let conQuienReside=this.socioeconomica.get('conQuienVive').value;
    if (conQuienReside!="Familia") {
      console.log("CON --> 4 puntos");
      condicionesFamiliares+=4;
    }

    let tienePersonasACargo=this.personasacargo.get('tieneperacargo').value;
    if (tienePersonasACargo=="Si") {
      console.log("CON --> 6 puntos");
      condicionesFamiliares+=6;
    }

    //Procedencia y lugar de residencia
    let estrato=this.socioeconomica.get('estrato').value;
    if(estrato==1 || estrato==2 || estrato==3){
      console.log("RES --> 10 puntos");
      procedenciaYLugarDeResidencia+=10;
    }

    let municipio=this.residencia.get('municipio').value;
    let zonaVulnerabilidad=this.socioeconomica.get('zonaVulnerabilidad').value;
    if ((municipio!="Bogota" || municipio!="Bogotá") || zonaVulnerabilidad) {
      console.log("RES --> 5 puntos");
      procedenciaYLugarDeResidencia+=5;
    }

    let poblacionEspecial=this.especial.get('condicionEspecial').value;

    if (poblacionEspecial!="ninguna" && poblacionEspecial!=null) {
      console.log("RES --> 5 puntos");
      procedenciaYLugarDeResidencia+=5;
    }

    //Condiciones de Salud
    let presentaDiscapcidad=this.especial.get('discapacidad').value;
    if (presentaDiscapcidad=="si") {
      console.log("SALUD --> 5 puntos");
      condicionesDeSalud+=5;
    }

    let presentaPatologia=this.especial.get('patologia').value;
    if (presentaPatologia=="Si") {
      console.log("SALUD --> 5 puntos");
      condicionesDeSalud+=5;
    }

    let valMatricula=this.academica.get('valorMatricula').value;
    if(valMatricula>=0 && valMatricula<=100000){
      console.log("SEM --> 20 Puntos");
      rangoDeMatricula=20;
    }else if(valMatricula>100001 && valMatricula<=300000){
      console.log("SEM --> 16 Puntos");
      rangoDeMatricula=16;
    }else if(valMatricula>300001 && valMatricula<=500000){
      console.log("SEM --> 12 Puntos");
      rangoDeMatricula=12;
    }else if(valMatricula>500001 && valMatricula<=700000){
      console.log("SEM --> 8 Puntos");
      rangoDeMatricula=8;
    }else if(valMatricula>700001 && valMatricula<=900000){
      console.log("SEM --> 4 Puntos");
      rangoDeMatricula=4;
    }else if(valMatricula>900001){
      console.log("SEM --> 0 Puntos");
      rangoDeMatricula=0;
    }else{
      console.log("Es menor a 0");
    }


    console.log("ingresosFamiliares --> ",ingresosFamiliares);
    console.log("condicionesFamiliares --> ",condicionesFamiliares);
    console.log("procedenciaYLugarDeResidencia --> ",procedenciaYLugarDeResidencia);
    console.log("condicionesDeSalud --> ",condicionesDeSalud);
    console.log("rangoDeMatricula --> ",rangoDeMatricula);

    puntajeSol=ingresosFamiliares+condicionesFamiliares+procedenciaYLugarDeResidencia+condicionesDeSalud+rangoDeMatricula;

    console.log("Puntaje Total: ",puntajeSol);

    this.utilService.showToastAlert("Puntaje solicitud",`El puntaje obtenido por su solicitud fue: ${puntajeSol}`);

    for (let i = 0; i < 100; i++) {
      i=i+1
      i=i-1
    }
    return 100;
  }

  cargarDocumentos() {


    if(this.validarDocs){
      this.utilService.showSwAlertSuccess(" Solicitud procesada "," Se estan cargando los documentos.");
      this.listService.disparadorDeDocumentos.emit({
        data:"carga"
      });
    }else{
      this.utilService.showSwAlertError(" Documentos invalidos "," Ocurrio un error al cargar los documentos, asegurese de subirlos nuevamente.");
    }

    /* let archivosAdjuntos = [];
    let nombreArchivos= ['documentoIdentidad'];
    for (const iterator of nombreArchivos) {
      let archivo=this.documentosMap.get(iterator)
      archivosAdjuntos.push(archivo);
    }
    console.log(archivosAdjuntos);

    this.nuxeoService.getDocumentos$(archivosAdjuntos, this.documentoService).subscribe((res) => {
      console.log("Respuesta de nuexeo");
      console.log(res);

      if (archivosAdjuntos.length === Object.keys(res).length) {
          this.formularioReliquidacion.documentosCargados = res;
          const terceroInfoComplementaria: any = {};
          terceroInfoComplementaria.TerceroId = this.estudiante;
          terceroInfoComplementaria.Id = null;
          terceroInfoComplementaria.Activo = true;
          terceroInfoComplementaria.InfoComplementariaId = this.bodyReliquidacion;
          terceroInfoComplementaria.Dato = JSON.stringify(this.formularioReliquidacion);
          this.reliquidacionHelper.grabarSolicitudReliquidacion(terceroInfoComplementaria).subscribe((res2) => {
              this.reliquidacionHelper.obtenerTipoSolicitudEnviada().subscribe((tipoSolicitud) => {
                  this.guardarSolicitud(tipoSolicitud.Data, res2, this.formularioReliquidacion.documentosCargados);
              });
          });
      }
    }); */
  }

  actualizarInfoEstudiante() {

    if (this.validacionesForm()) {
      this.buscarInfoComplemetaria("ANTIGUEDAD_PROGRAMA", this.registro.get('programa').value);

      this.buscarInfoComplemetaria("CREDITOS_SEMESTRE_ACTUAL", this.academica.get('numeroCreditos').value);

      this.buscarInfoComplemetaria("ZONA_VULNERABILIDAD", this.socioeconomica.get('zonaVulnerabilidad').value);

      this.buscarInfoComplemetaria("PERSONAS_A_CARGO", this.personasacargo.get('tieneperacargo').value);
      this.buscarInfoComplemetaria("TIENE_HIJOS", this.personasacargo.get('hijos').value);
      this.buscarInfoComplemetaria("NUMERO_HIJOS", this.personasacargo.get('numeroHijos').value);
      this.buscarInfoComplemetaria("MENORES_EDAD_CONVIVE", this.personasacargo.get('menoresEdad').value);
      this.buscarInfoComplemetaria("MENORES_EDAD_ESTUDIANTES", this.personasacargo.get('menoresEstudiantes').value);
      this.buscarInfoComplemetaria("MENORES_EDAD_MATRICULADOS", this.personasacargo.get('menoresMatriculados').value);
      // GRUPO SISBEN?
      this.buscarInfoComplemetaria("CALIDAD_VIVIENDA", this.necesidades.get('calidadVivienda').value);
      this.buscarInfoComplemetaria("NUMERO_CUARTOS_DORMIR", this.necesidades.get('cuartosDormir').value);
      this.buscarInfoComplemetaria("NUMERO_PERSONAS_HOGAR", this.necesidades.get('personasHogar').value);
      this.buscarInfoComplemetaria("SERVICIOS_PUBLICOS_HOGAR", this.serviciosPublicos.value);
      this.buscarInfoComplemetaria("AGUA_PARA_CONSUMO", this.necesidades.get('origenAgua').value);
      this.buscarInfoComplemetaria("ELIMINACION_AGUAS_NEGRAS", this.necesidades.get('aguasNegras').value);
      // DISCAPACIDAD?
      this.buscarInfoComplemetaria("PATOLOGIA_NUTRICION_ALIMENTACION", this.especial.get('patologia').value);
      /* this.buscarInfoComplemetaria("POBLACION_CONDICION_ESPECIAL",this.especial.get('condicionEspecial').value); */
      /* this.buscarInfoComplemetaria("SEGURIDAD_SOCIAL",this.especial.get('seguridadSocial').value); */
      // SER PILO PAGA?
    }
    else {
      console.log("F PAPUU");
    }

  }

  buscarInfoComplemetaria(nombreInfoComp: string, valor: any) {

    for (const infoComp of this.listInfoComplementaria) {
      if (infoComp.InfoComplementariaId.Nombre == nombreInfoComp) {
        let objDato = JSON.parse(
          infoComp.Dato
        );
        /*console.log("objDato",typeof(objDato), objDato);
        console.log("valor",typeof(valor), valor); */

        if (objDato.value != valor) {
          if (typeof (valor) == 'object') {
            let cont = 0;
            for (let i = 0; i < Object.keys(valor).length; i++) {
              /* console.log('o :>> ', Object.keys(objDato.value)[i]);
              console.log('valor :>> ', Object.keys(valor)[i]); */
              if (Object.values(objDato.value)[i] !== Object.values(valor)[i]) {
                cont++;
              }
            }
            if (cont == 0) {
              console.log(`Se actualizo objetos ${nombreInfoComp}`);
              return true;
            }
          }
          console.log(`Actualizar ${objDato.value} 4 ${valor}`);
          objDato.value = valor;
          infoComp.Dato = JSON.stringify(objDato);
          this.listService.actualizarInfoComplementaria(infoComp);
        }
        console.log(`Se actualizo ${nombreInfoComp}`);
        return true;
      }
    }
    this.listService.findInfoComplementaria(nombreInfoComp).then((respInfo) => {
      console.log(respInfo);
      if (respInfo != undefined) {
        let infoComp = new InfoComplementariaTercero();
        infoComp.TerceroId = this.tercero;
        var objDato = {
          value: ""
        };
        objDato.value = valor;
        console.log("Dato", respInfo);
        infoComp.Dato = JSON.stringify(objDato);
        infoComp.InfoComplementariaId = respInfo;
        //infoComp.InfoComplementariaId.GrupoInfoComplementariaId = respInfo.GrupoInfoComplementariaId;
        this.listService.crearInfoComplementariaTercero(infoComp);
      } else {
        this.utilService.showSwAlertError('Nueva informacion', "El nombre no coincide con un tipo de informacion complementaria");
      }
    }).catch((err) => this.utilService.showSwAlertError('Actualizar informacion',err));
  }

  async save() {

    let p=await this.calcularPuntaje();

    const isValidTerm = await this.utilService.termsAndConditional();

    if (isValidTerm) {
      //***************************************************** */
      if (this.validacionesForm()) {
        console.log("validacion",this.validarDocs);
        this.listService.disparadorDeDocumentos.emit({
          data:"validar"
        })
        console.log("validacion",this.validarDocs);
        this.validarDocs=true
        if(this.validarDocs){
          this.registrar();
          console.log("Se guardoooo");
        }
      }
    }
  }

  validacionesForm(): boolean {
    let msj = " información ";
    let style = "color: #ff0000; font-weight: bold; font-size: 1.2em;"
    let valido: boolean = false;
    if (!this.registro.controls.programa.valid) {
      msj += " básica (Antiguedad del programa),";
    }
    if (!this.academica.controls.numeroCreditos.valid) {
      msj += " académica (Número de creditos),";
    }
    if (this.socioeconomica.controls.ingresosMensuales.value<=0) {
      msj += " socioeconomica (ingresos mensuales), 'Si el problema persiste consulte CONDOR'. ";
    }
    if (!this.socioeconomica.controls.zonaVulnerabilidad.valid) {
      msj += " socioeconomica (Zona de vulnerabilidad),";
    }
    
    if (!this.personasacargo.valid) {
      let menPersonasACargo="";
      if(!this.personasacargo.controls.tieneperacargo.valid){
        menPersonasACargo+=" Tiene personas a cargo,"
      }
      if(!this.personasacargo.controls.hijos.valid){
        menPersonasACargo+=" Tiene hijos,"
      }
      if(this.personasacargo.controls.numeroHijos.value<0 || this.personasacargo.controls.numeroHijos.value==null){
        menPersonasACargo+=" numero de hijos ,"
      }
      if(this.personasacargo.controls.menoresEdad.value<0 || this.personasacargo.controls.menoresEdad.value==null){
        menPersonasACargo+=" menores con los que vive,"
      }
      if(this.personasacargo.controls.menoresEstudiantes.value<0 || this.personasacargo.controls.menoresEstudiantes.value==null){
        menPersonasACargo+=" menores con educación,"
      }
      if(this.personasacargo.controls.menoresMatriculados.value<0 || this.personasacargo.controls.menoresMatriculados.value==null){
        menPersonasACargo+=" menores matriculados,"
      }
      menPersonasACargo = menPersonasACargo.slice(0, -1);
      msj += ` personas a cargo (${menPersonasACargo}), `;
    } 
    //Evaluar Caso
    if (!this.sisben.valid) {
      msj += " sisben,";
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
      msj += ` necesidades básicas (${menNecesidades}), `;
    }
    //Evaluar Caso x2
    if (!this.especial.valid) {
      msj += " población especial,";
    }

    msj = msj.slice(0, -1);

    /*
    Algo no me cuadra aca en la logica

    */
    if (!valido && msj != " información") {
      this.utilService.showSwAlertError("Campos Vacios", `Los campos con ( <span style="${style}">*</span> ) es obligatorio diligenciarlos. <br> Hacen falta datos en: <strong> ${msj} </strong>`);
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
