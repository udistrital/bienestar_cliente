import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import { EstudiantesService } from '../../../../shared/services/estudiantes.service';
import { SaludService } from '../../../../shared/services/salud.service';
import { Anamnesis } from '../../../../shared/models/Salud/ananmesis.model';
import { ActivatedRoute } from '@angular/router';
import { HistoriaClinica } from '../../../../shared/models/Salud/historiaClinica.model';
import { ExamenDental } from '../../../../shared/models/Salud/examenDental.model';
import { HojaHistoria } from '../../../../shared/models/Salud/hojaHistoria.model';
import { ExamenEstomatologico } from '../../../../shared/models/Salud/examenEstomatologico';
import { DiagnosticoOdontologia } from '../../../../shared/models/Salud/diagnosticoOdontologia';
import { Evolucion } from '../../../../shared/models/Salud/evolucion.model';
import { Especialidad } from '../../../../shared/models/Salud/especialidad.model';
import { TipoOdontograma } from '../../../../shared/models/Salud/tipoOdontograma';
import { Odontograma } from '../../../../shared/models/Salud/odontograma';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { Utils } from '../../../../shared/utils/utils';
import { DatePipe } from '@angular/common';
import { ExamenesComplementarios } from '../../../../shared/models/Salud/examenesComplementarios';
import { ListService } from '../../../../@core/store/list.service';
import { Observable, ReplaySubject } from 'rxjs';
import { Documento } from '../../../../shared/models/Salud/documento.model';
import * as FileSaver from 'file-saver';
import { sample } from 'rxjs-compat/operator/sample';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
@Component({
  selector: 'ngx-odontologia',
  templateUrl: './odontologia.component.html',
  styleUrls: ['../historia-clinica.component.css']
})
export class OdontologiaComponent implements OnInit {
  tipoOdontogramaVestibular: TipoOdontograma;
  tipoOdontogramaVestabular: TipoOdontograma;
  tipoOdontogramaVestibularInfantil: TipoOdontograma;
  tipoOdontogramaLingualesInfantil: TipoOdontograma;
  getOdontogramaVestibular: Odontograma;
  getOdontogramaVestabular: Odontograma;
  getOdontogramaVestibularInfantil: Odontograma;
  getOdontogramaLingualesInfantil: Odontograma;
  odontogramaVestibular: any;
  odontogramaVestabular: any;
  odontogramaVestibularInfantil: any;
  odontogramaLingualesInfantil: any;
  firstOne: any;
  hideHistory: boolean = false;
  especialidad: Especialidad;
  listaHojas: any = [];
  estado: string;
  terceroId: any;
  paciente: string;
  anamnesis: Anamnesis;
  examenDental: ExamenDental;
  examenesComplementarios: ExamenesComplementarios;
  examenEstomatologico: ExamenEstomatologico;
  Historia: HistoriaClinica;
  HojaHistoria: HojaHistoria;
  diagnostico: DiagnosticoOdontologia;
  evolucion: Evolucion[] = [];
  fechaUltimaVisita: Date;
  nuevaEvolucionOdonto: FormControl = this.fb.control('');
  odontologiaForm: FormGroup = this.fb.group({
    motivoConsultaOdonto: [null],
    tratamientoMedico: [null],
    ingestionMedicamentos: [null],
    reaccionesAlergicas: [null],
    hemorragias: [null],
    irradiaciones: [null],
    sinusitis: [null],
    enfermedadesRespiratorias: [null],
    cardiopatias: [null],
    diabetes: [null],
    fiebreReumatica: [null],
    hepatitis: [null],
    hipertensionArterial: [null],
    otrasEnfermedades: [null],
    antecedentesFamiliares: [null],
    cepillado: [false],
    cepilladoCuantas: [null],
    sedaDental: [false],
    sedaDentalCuantas: [null],
    enjuague: [false],
    enjuagueCuantas: [null],
    dulces: [null],
    fuma: [null],
    chicles: [null],
    temperatura: [null],
    pulso: [null],
    tensionArterial: [null],
    respiracion: [null],
    articulacionTemporoMandibula: [null],
    labios: [null],
    lengua: [null],
    paladar: [null],
    pisoBoca: [null],
    carrillos: [null],
    glandulasSalivares: [null],
    maxilares: [null],
    senosMaxilares: [null],
    musculosMasticadores: [null],
    nerviosoOdontologia: [null],
    vascularOdontologia: [null],
    linfaticoRegionalOdontologia: [null],
    Supernumerarios: [null],
    abrasion: [null],
    manchas: [null],
    patologiaPulpar: [null],
    placaBlanda: [null],
    placaCalcificada: [null],
    oclusion: [null],
    otrosOdonto: [null],
    observaciones: [null],
    ultimaVisitaOdontologo: [null],
    evaluacionEstadoFinal: [null],
    diagnosticoOdonto: [null],
    pronosticoOdonto: [null],
    tp: [null],
    tpt: [null],
    coagulacion: [null],
    sangria: [null],
    otra: [null],
    observacionesOdontologia: [null],
    observacionesVestibular: [null],
    observacionesVestabular: [null],
    observacionesVestibularInfantil: [null],
    observacionesLingualesInfantil: [null],
    medicamento: [null],
    evolucionOdonto: this.fb.array([]),
  }, { validators: [validateDate] });
  nombreEspecialista: any;
  terceroEspecialista: any;
  logoDataUrl: string;
  base64PeriapicalInicio: any = null;
  enlacePeriapicalInicio: any = null;
  blobPeriapicalInicio: Blob;
  estadoPeriapicalInicio: boolean = false;
  subidoPeriapicalInicio: boolean = false;
  base64PeriapicalFinal: any = null;
  enlacePeriapicalFinal: any = null;
  estadoPeriapicalFinal: boolean = false;
  subidoPeriapicalFinal: boolean = false;
  blobPeriapicalFinal: Blob;
  base64PanoramicaInicio: any = null;
  enlacePanoramicaInicio: any = null;
  estadoPanoramicaInicio: boolean = false;
  subidoPanoramicaInicio: boolean = false;
  blobPanoramicaInicio: Blob;
  base64PanoramicaFinal: any = null;
  enlacePanoramicaFinal: any = null;
  estadoPanoramicaFinal: boolean = false;
  subidoPanoramicaFinal: boolean = false;
  blobPanoramicaFinal: Blob;
  base64OtraInicio: any = null;
  enlaceOtraInicio: any = null;
  estadoOtraInicio: boolean = false;
  subidoOtraInicio: boolean = false;
  blobOtraInicio: Blob;
  base64OtraFinal: any = null;
  enlaceOtraFinal: any = null;
  estadoOtraFinal: boolean = false;
  subidoOtraFinal: boolean = false;
  blobOtraFinal: Blob;
  base64LaboratorioInicio: any = null;
  enlaceLaboratorioInicio: any = null;
  estadoLaboratorioInicio: boolean = false;
  subidoLaboratorioInicio: boolean = false;
  blobLaboratorioInicio: Blob;
  base64LaboratorioFinal: any = null;
  enlaceLaboratorioFinal: any = null;
  estadoLaboratorioFinal: boolean = false;
  subidoLaboratorioFinal: boolean = false;
  blobLaboratorioFinal: Blob;
  @ViewChild('inputPeriapicalInicio', { static: true }) inputPeriapicalInicio: ElementRef;
  @ViewChild('inputPeriapicalFinal', { static: true }) inputPeriapicalFinal: ElementRef;
  @ViewChild('inputPanoramicaInicio', { static: true }) inputPanoramicaInicio: ElementRef;
  @ViewChild('inputPanoramicaFinal', { static: true }) inputPanoramicaFinal: ElementRef;
  @ViewChild('inputOtraInicio', { static: true }) inputOtraInicio: ElementRef;
  @ViewChild('inputOtraFinal', { static: true }) inputOtraFinal: ElementRef;
  @ViewChild('inputLaboratorioInicio', { static: true }) inputLaboratorioInicio: ElementRef;
  @ViewChild('inputLaboratorioFinal', { static: true }) inputLaboratorioFinal: ElementRef;
  constructor(private fb: FormBuilder, private toastr: ToastrService, private personaService: EstudiantesService, private saludService: SaludService, private aRoute: ActivatedRoute,
    private listService: ListService) { }
  ngOnInit() {
    //console.log(new Date());
    Utils.getImageDataUrlFromLocalPath1('../../../../assets/images/Escudo_UD.png').then(
      result => this.logoDataUrl = result
    )
    this.saludService.getTipoOdontograma(1).subscribe((data: any) => {
      this.tipoOdontogramaVestabular = data['Data'];
    });
    this.saludService.getTipoOdontograma(2).subscribe((data: any) => {
      this.tipoOdontogramaVestibular = data['Data'];
    });
    this.saludService.getTipoOdontograma(3).subscribe((data: any) => {
      this.tipoOdontogramaLingualesInfantil = data['Data'];
    });
    this.saludService.getTipoOdontograma(4).subscribe((data: any) => {
      this.tipoOdontogramaVestibularInfantil = data['Data'];
    });
    this.terceroId = this.aRoute.snapshot.paramMap.get('terceroId');
    this.personaService.getEstudiante(this.saludService.IdPersona).subscribe((data: any) => {
      var paciente = data.datosEstudianteCollection.datosBasicosEstudiante[0];
      this.paciente = paciente.nombre;
    });
    this.listService.getInfoEstudiante().then((resp) => {
      //console.log(resp);
      this.personaService.getEstudiantePorDocumento(resp.documento).subscribe((res) => {
        //console.log(res);
        this.terceroEspecialista = res[0].TerceroId.Id;
        this.getInfoOdontologia();
      });
    });
  }
  get evolucionOdontoArr() {
    return this.odontologiaForm.get('evolucionOdonto') as FormArray;
  }
  agregarEvolucionOdonto() {
    if (this.nuevaEvolucionOdonto.invalid) {
      return
    }
    this.evolucionOdontoArr.push(new FormControl(this.nuevaEvolucionOdonto.value));
    this.nuevaEvolucionOdonto.reset();
  }
  borrarEvolucionOdonto(i: number) {
    this.evolucionOdontoArr.removeAt(i);
  }
  getInfoOdontologia() {
    this.saludService.getEspecialidad(3).subscribe((data: any) => {
      this.especialidad = data['Data'];
    });
    this.saludService.getHistoriaClinica(this.terceroId).subscribe((data: any) => {  ///Remplazar para pruebas
      this.Historia = data['Data'][0];
      this.saludService.getHojaHistoria(this.terceroId, 3).subscribe(data => {
        if (JSON.stringify(data['Data'][0]) === '{}') {
          this.estado = "nueva";
          this.hideHistory = true;
          this.nombreEspecialista = "";
        } else {
          this.listaHojas = data['Data'];
          this.firstOne = data['Data'][0].Id;
          this.estado = "vieja";
          this.hideHistory = false;
          this.HojaHistoria = data['Data'][0];
          this.evolucion = [];
          let evolucion = JSON.parse(this.HojaHistoria.Evolucion) || [];
          this.evolucion.push({ ...evolucion });
          let evolucion2: any = this.evolucion[0].evolucion;
          for (let i = 0; i < evolucion2.length; i++) {
            this.evolucionOdontoArr.push(new FormControl(evolucion2[i]));
          }
          this.odontologiaForm.controls.motivoConsultaOdonto.setValue(this.HojaHistoria.Motivo);
          this.odontologiaForm.controls.observacionesOdontologia.setValue(this.HojaHistoria.Observacion);
          this.getAnanmesis();
          this.getOdontogramas();
          this.saludService.getExamenDental(this.HojaHistoria.Id).subscribe(data => {
            this.examenDental = data['Data'][0];
            //console.log(this.examenDental);
            this.odontologiaForm.controls.abrasion.setValue(this.examenDental.Abrasion);
            this.odontologiaForm.controls.manchas.setValue(this.examenDental.Manchas);
            this.odontologiaForm.controls.observaciones.setValue(this.examenDental.Observaciones);
            this.odontologiaForm.controls.oclusion.setValue(this.examenDental.Oclusion);
            this.odontologiaForm.controls.otrosOdonto.setValue(this.examenDental.Otros);
            this.odontologiaForm.controls.patologiaPulpar.setValue(this.examenDental.PatologiaPulpar);
            this.odontologiaForm.controls.placaBlanda.setValue(this.examenDental.PlacaBlanda);
            this.odontologiaForm.controls.placaCalcificada.setValue(this.examenDental.PlacaCalcificada);
            this.odontologiaForm.controls.Supernumerarios.setValue(this.examenDental.Supernumerarios);
          });
          this.saludService.getExamenEstomatologico(this.HojaHistoria.Id).subscribe(data => {
            this.examenEstomatologico = data['Data'][0];
            //console.log(this.examenEstomatologico);
            this.odontologiaForm.controls.articulacionTemporoMandibula.setValue(this.examenEstomatologico.ArticulacionTemporo);
            this.odontologiaForm.controls.carrillos.setValue(this.examenEstomatologico.Carrillos);
            this.odontologiaForm.controls.glandulasSalivares.setValue(this.examenEstomatologico.GlandulasSalivares);
            this.odontologiaForm.controls.labios.setValue(this.examenEstomatologico.Labios);
            this.odontologiaForm.controls.lengua.setValue(this.examenEstomatologico.Lengua);
            this.odontologiaForm.controls.maxilares.setValue(this.examenEstomatologico.Maxilares);
            this.odontologiaForm.controls.musculosMasticadores.setValue(this.examenEstomatologico.MusculosMasticadores);
            this.odontologiaForm.controls.paladar.setValue(this.examenEstomatologico.Paladar);
            this.odontologiaForm.controls.pisoBoca.setValue(this.examenEstomatologico.PisoBoca);
            this.odontologiaForm.controls.senosMaxilares.setValue(this.examenEstomatologico.SenosMaxilares);
            this.odontologiaForm.controls.linfaticoRegionalOdontologia.setValue(this.examenEstomatologico.SistemaLinfaticoRegional);
            this.odontologiaForm.controls.nerviosoOdontologia.setValue(this.examenEstomatologico.SistemaNervioso);
            this.odontologiaForm.controls.vascularOdontologia.setValue(this.examenEstomatologico.SistemaVascular);
          });
          this.saludService.getDiagnosticoOdontologia(this.HojaHistoria.Id).subscribe(data => {
            this.diagnostico = data['Data'][0];
            //console.log(this.diagnostico);
            this.odontologiaForm.controls.evaluacionEstadoFinal.setValue(this.diagnostico.Evaluacion);
            this.odontologiaForm.controls.diagnosticoOdonto.setValue(this.diagnostico.Diagnostico);
            this.odontologiaForm.controls.pronosticoOdonto.setValue(this.diagnostico.Pronostico);
            this.odontologiaForm.controls.pulso.setValue(this.diagnostico.Pulso);
            this.odontologiaForm.controls.respiracion.setValue(this.diagnostico.Respiracion);
            this.odontologiaForm.controls.temperatura.setValue(this.diagnostico.Temperatura);
            this.odontologiaForm.controls.tensionArterial.setValue(this.diagnostico.TensionArterial);
            this.odontologiaForm.controls.medicamento.setValue(this.diagnostico.Medicamento);
          });
          this.saludService.getExamenesComplementarios(this.HojaHistoria.Id).subscribe(data => {
            //console.log(this.examenesComplementarios);
            this.examenesComplementarios = data['Data'][0];
            if (this.examenesComplementarios.PanoramicaInicio != null && this.examenesComplementarios.PanoramicaInicio != "") {
              this.saludService.getDocumento(this.examenesComplementarios.PanoramicaInicio).subscribe(data => {
                const byteArray = new Uint8Array(atob(data['file']).split('').map(char => char.charCodeAt(0)));
                this.blobPanoramicaInicio = new Blob([byteArray], { type: 'application/pdf' });
                this.estadoPanoramicaInicio = true;
              });

            }
            if (this.examenesComplementarios.PanoramicaFinal != null && this.examenesComplementarios.PanoramicaFinal != "") {
              this.saludService.getDocumento(this.examenesComplementarios.PanoramicaFinal).subscribe(data => {
                const byteArray = new Uint8Array(atob(data['file']).split('').map(char => char.charCodeAt(0)));
                this.blobPanoramicaFinal = new Blob([byteArray], { type: 'application/pdf' });
                this.estadoPanoramicaFinal = true;
              });

            }
            if (this.examenesComplementarios.PeriapicalInicio != null && this.examenesComplementarios.PeriapicalInicio != "") {
              this.saludService.getDocumento(this.examenesComplementarios.PeriapicalInicio).subscribe(data => {
                const byteArray = new Uint8Array(atob(data['file']).split('').map(char => char.charCodeAt(0)));
                this.blobPeriapicalInicio = new Blob([byteArray], { type: 'application/pdf' });
                this.estadoPeriapicalInicio = true;
              });

            }
            if (this.examenesComplementarios.PeriapicalFinal != null && this.examenesComplementarios.PeriapicalFinal != "") {
              this.saludService.getDocumento(this.examenesComplementarios.PeriapicalFinal).subscribe(data => {
                const byteArray = new Uint8Array(atob(data['file']).split('').map(char => char.charCodeAt(0)));
                this.blobPeriapicalFinal = new Blob([byteArray], { type: 'application/pdf' });
                this.estadoPeriapicalFinal = true;
              });
            }
            if (this.examenesComplementarios.OtraInicio != null && this.examenesComplementarios.OtraInicio != "") {
              this.saludService.getDocumento(this.examenesComplementarios.OtraInicio).subscribe(data => {
                const byteArray = new Uint8Array(atob(data['file']).split('').map(char => char.charCodeAt(0)));
                this.blobOtraInicio = new Blob([byteArray], { type: 'application/pdf' });
                this.estadoOtraInicio = true;
              });
            }
            if (this.examenesComplementarios.OtraFinal != null && this.examenesComplementarios.OtraFinal != "") {
              this.saludService.getDocumento(this.examenesComplementarios.OtraFinal).subscribe(data => {
                const byteArray = new Uint8Array(atob(data['file']).split('').map(char => char.charCodeAt(0)));
                this.blobOtraFinal = new Blob([byteArray], { type: 'application/pdf' });
                this.estadoOtraFinal = true;
              });
            }
            if (this.examenesComplementarios.LaboratorioInicio != null && this.examenesComplementarios.LaboratorioInicio != "") {
              this.saludService.getDocumento(this.examenesComplementarios.LaboratorioInicio).subscribe(data => {
                const byteArray = new Uint8Array(atob(data['file']).split('').map(char => char.charCodeAt(0)));
                this.blobLaboratorioInicio = new Blob([byteArray], { type: 'application/pdf' });
                this.estadoLaboratorioInicio = true;
              });
            }
            if (this.examenesComplementarios.LaboratorioFinal != null && this.examenesComplementarios.LaboratorioFinal != "") {
              this.saludService.getDocumento(this.examenesComplementarios.LaboratorioFinal).subscribe(data => {
                const byteArray = new Uint8Array(atob(data['file']).split('').map(char => char.charCodeAt(0)));
                this.blobLaboratorioFinal = new Blob([byteArray], { type: 'application/pdf' });
                this.estadoLaboratorioFinal = true;
              });
            }

            this.odontologiaForm.controls.tp.setValue(this.examenesComplementarios.Tp);
            this.odontologiaForm.controls.tpt.setValue(this.examenesComplementarios.Tpt);
            this.odontologiaForm.controls.coagulacion.setValue(this.examenesComplementarios.Coagulacion);
            this.odontologiaForm.controls.sangria.setValue(this.examenesComplementarios.Sangria);
            this.odontologiaForm.controls.otra.setValue(this.examenesComplementarios.Otra);
          });
          this.personaService.getDatosPersonalesPorTercero(this.HojaHistoria.Profesional).subscribe(data => {
            this.nombreEspecialista = data[0].TerceroId.NombreCompleto;
          });
        }
      });
    });

  }

  guardarDocumentos() {
    this.toastr.warning('Guardando documentos...');
    this.odontologiaForm.disable();
    if (this.base64PanoramicaInicio == null) {
      this.subidoPanoramicaInicio = true;
      this.comprobarCargaDocumentos();
    }
    else if (this.base64PanoramicaInicio != null) {
      const documento: Documento = {
        IdTipoDocumento: 61,
        nombre: "Panoramica Inicio " + this.paciente,
        metadatos: {},
        descripcion: "Examen médico paciente",
        file: this.base64PanoramicaInicio
      }
      let array = [documento]
      this.saludService.postDocumento(array).subscribe(resp => {
        console.log(resp);
        this.enlacePanoramicaInicio = resp['res'].Enlace;
        this.subidoPanoramicaInicio = true;
        this.comprobarCargaDocumentos();
      },
      (err) => {
        this.toastr.error(err)
        this.subidoPanoramicaInicio = true;
        this.comprobarCargaDocumentos();
      });
    }
    if (this.base64PanoramicaFinal == null) {
      this.subidoPanoramicaFinal = true;
      this.comprobarCargaDocumentos();
    }
    else if (this.base64PanoramicaFinal != null) {
      const documento: Documento = {
        IdTipoDocumento: 61,
        nombre: "Panoramica Final " + this.paciente,
        metadatos: {},
        descripcion: "Examen médico paciente",
        file: this.base64PanoramicaFinal
      }
      let array = [documento]
      this.saludService.postDocumento(array).subscribe(resp => {
        console.log(resp);
        this.enlacePanoramicaFinal = resp['res'].Enlace;
        this.subidoPanoramicaFinal = true;
        this.comprobarCargaDocumentos();
      },
      (err) => {
        this.toastr.error(err)
        this.subidoPanoramicaFinal = true;
        this.comprobarCargaDocumentos();
      });
    }
    if (this.base64PeriapicalInicio == null) {
      this.subidoPeriapicalInicio = true;
      this.comprobarCargaDocumentos();
    }
    else if (this.base64PeriapicalInicio != null) {
      const documento: Documento = {
        IdTipoDocumento: 61,
        nombre: "Periapical Inicio " + this.paciente,
        metadatos: {},
        descripcion: "Examen médico paciente",
        file: this.base64PeriapicalInicio
      }
      let array = [documento]
      this.saludService.postDocumento(array).subscribe(resp => {
        console.log(resp);
        this.enlacePeriapicalInicio = resp['res'].Enlace;
        this.subidoPeriapicalInicio = true;
        this.comprobarCargaDocumentos();
      },
      (err) => {
        this.toastr.error(err)
        this.subidoPeriapicalInicio = true;
        this.comprobarCargaDocumentos();
      });
    }
    if (this.base64PeriapicalFinal == null) {
      this.subidoPeriapicalFinal = true;
      this.comprobarCargaDocumentos();
    }
    else if (this.base64PeriapicalFinal != null) {
      const documento: Documento = {
        IdTipoDocumento: 61,
        nombre: "Periapical Final " + this.paciente,
        metadatos: {},
        descripcion: "Examen médico paciente",
        file: this.base64PeriapicalFinal
      }
      let array = [documento]
      this.saludService.postDocumento(array).subscribe(resp => {
        console.log(resp);
        this.enlacePeriapicalFinal = resp['res'].Enlace;
        this.subidoPeriapicalFinal = true;
        this.comprobarCargaDocumentos();
      },
      (err) => {
        this.toastr.error(err)
        this.subidoPeriapicalFinal = true;
        this.comprobarCargaDocumentos();
      });
    }
    if (this.base64OtraInicio == null) {
      this.subidoOtraInicio = true;
      this.comprobarCargaDocumentos();
    }
    else if (this.base64OtraInicio != null) {
      const documento: Documento = {
        IdTipoDocumento: 61,
        nombre: "Otra Inicio " + this.paciente,
        metadatos: {},
        descripcion: "Examen médico paciente",
        file: this.base64OtraInicio
      }
      let array = [documento]
      this.saludService.postDocumento(array).subscribe(resp => {
        console.log(resp);
        this.enlaceOtraInicio = resp['res'].Enlace;
        this.subidoOtraInicio = true;
        this.comprobarCargaDocumentos();
      },
      (err) => {
        this.toastr.error(err)
        this.subidoOtraInicio = true;
        this.comprobarCargaDocumentos();
      });
    }
    if (this.base64OtraFinal == null) {
      this.subidoOtraFinal = true;
      this.comprobarCargaDocumentos();
    }
    else if (this.base64OtraFinal != null) {
      const documento: Documento = {
        IdTipoDocumento: 61,
        nombre: "Otra Final " + this.paciente,
        metadatos: {},
        descripcion: "Examen médico paciente",
        file: this.base64OtraFinal
      }
      let array = [documento]
      this.saludService.postDocumento(array).subscribe(resp => {
        console.log(resp);
        this.enlaceOtraFinal = resp['res'].Enlace;
        this.subidoOtraFinal = true;
        this.comprobarCargaDocumentos();
      },
      (err) => {
        this.toastr.error(err)
        this.subidoOtraFinal = true;
        this.comprobarCargaDocumentos();
      });
    }
    if (this.base64LaboratorioInicio == null) {
      this.subidoLaboratorioInicio = true;
      this.comprobarCargaDocumentos();
    }
    else if (this.base64LaboratorioInicio != null) {
      const documento: Documento = {
        IdTipoDocumento: 61,
        nombre: "Laboratorio Inicio " + this.paciente,
        metadatos: {},
        descripcion: "Examen médico paciente",
        file: this.base64LaboratorioInicio
      }
      let array = [documento]
      this.saludService.postDocumento(array).subscribe(resp => {
        console.log(resp);
        this.enlaceLaboratorioInicio = resp['res'].Enlace;
        this.subidoLaboratorioInicio = true;
        this.comprobarCargaDocumentos();
      },
      (err) => {
        this.toastr.error(err)
        this.subidoLaboratorioInicio = true;
        this.comprobarCargaDocumentos();
      });
    }
    if (this.base64LaboratorioFinal == null) {
      this.subidoLaboratorioFinal = true;
      this.comprobarCargaDocumentos();
    }
    else if (this.base64LaboratorioFinal != null) {
      const documento: Documento = {
        IdTipoDocumento: 61,
        nombre: "Laboratorio Final " + this.paciente,
        metadatos: {},
        descripcion: "Examen médico paciente",
        file: this.base64LaboratorioFinal
      }
      let array = [documento]
      this.saludService.postDocumento(array).subscribe(resp => {
        console.log(resp);
        this.enlaceLaboratorioFinal = resp['res'].Enlace;
        this.subidoLaboratorioFinal = true;
        this.comprobarCargaDocumentos();
      },
      (err) => {
        this.toastr.error(err)
        this.subidoLaboratorioFinal = true;
        this.comprobarCargaDocumentos();
      });
    }
  }

  guardarHistoriaOdontologia() {
    let evolucionCorregida = JSON.stringify(this.evolucionOdontoArr.value);
    let evolucion = evolucionCorregida.slice(1, evolucionCorregida.length - 1);
    let evolucion2 = evolucion.replace(/]/g, "").replace(/\[/g, "");
    if (this.estado == "nueva") {
      let fechaActual = new (Date);
      fechaActual.setHours(fechaActual.getHours() - 5);
      const hojaHistoria: HojaHistoria = {
        Id: 0,
        HistoriaClinica: { Id: this.saludService.historia, Tercero: parseInt(this.terceroId) },
        Evolucion: '{"evolucion":[' + evolucion2 + ']}',
        FechaConsulta: fechaActual,
        Especialidad: this.especialidad,
        Persona: this.saludService.IdPersona,
        Profesional: this.terceroEspecialista,
        Motivo: this.odontologiaForm.controls.motivoConsultaOdonto.value,
        Observacion: this.odontologiaForm.controls.observacionesOdontologia.value,
        FechaCreacion: new Date(),
        FechaModificacion: new Date(),
        Activo: true
      }
      this.saludService.postHojaHistoria(hojaHistoria).subscribe(data => {
        //console.log(data);
        this.HojaHistoria = data['Data'];
        console.log('Hoja historia: ' + data['Data']);
        this.saludService.falloMedicina = false;
        if (!this.anamnesis) {
          const anamnesis: Anamnesis = {
            Id: 0,
            Alergias: this.odontologiaForm.controls.reaccionesAlergicas.value,
            AntecedenteFamiliar: this.odontologiaForm.controls.antecedentesFamiliares.value,
            Cardiopatias: this.odontologiaForm.controls.cardiopatias.value,
            Cepillado: this.odontologiaForm.controls.cepilladoCuantas.value,
            Chicle: this.odontologiaForm.controls.chicles.value,
            Diabetes: this.odontologiaForm.controls.diabetes.value,
            Dulces: this.odontologiaForm.controls.dulces.value,
            EnfermedadRespiratoria: this.odontologiaForm.controls.enfermedadesRespiratorias.value,
            Enjuague: this.odontologiaForm.controls.enjuagueCuantas.value,
            FiebreReumatica: this.odontologiaForm.controls.fiebreReumatica.value,
            Fuma: this.odontologiaForm.controls.fuma.value,
            Hemorragias: this.odontologiaForm.controls.hemorragias.value,
            Hepatitis: this.odontologiaForm.controls.hepatitis.value,
            Hipertension: this.odontologiaForm.controls.hipertensionArterial.value,
            Irradiaciones: this.odontologiaForm.controls.irradiaciones.value,
            Medicamentos: this.odontologiaForm.controls.ingestionMedicamentos.value,
            Otros: this.odontologiaForm.controls.otrasEnfermedades.value,
            Seda: this.odontologiaForm.controls.sedaDentalCuantas.value,
            Sinusitis: this.odontologiaForm.controls.sinusitis.value,
            Tratamiento: this.odontologiaForm.controls.tratamientoMedico.value,
            UltimaVisita: new Date(this.odontologiaForm.controls.ultimaVisitaOdontologo.value),
            HistoriaClinicaId: this.Historia.Id,
            FechaCreacion: new Date(),
            FechaModificacion: new Date(),
            Activo: true
          }
          this.saludService.postAnamnesis(anamnesis).subscribe(data => {
            console.log('Anamnesis: ' + data['Data']);
            this.saludService.falloPsico = false;
          }, error => {
            this.saludService.falloPsico = true;
          });
        } else if (this.anamnesis) {
          const anamnesis: Anamnesis = {
            Id: this.anamnesis.Id,
            Alergias: this.odontologiaForm.controls.reaccionesAlergicas.value,
            AntecedenteFamiliar: this.odontologiaForm.controls.antecedentesFamiliares.value,
            Cardiopatias: this.odontologiaForm.controls.cardiopatias.value,
            Cepillado: this.odontologiaForm.controls.cepilladoCuantas.value,
            Chicle: this.odontologiaForm.controls.chicles.value,
            Diabetes: this.odontologiaForm.controls.diabetes.value,
            Dulces: this.odontologiaForm.controls.dulces.value,
            EnfermedadRespiratoria: this.odontologiaForm.controls.enfermedadesRespiratorias.value,
            Enjuague: this.odontologiaForm.controls.enjuagueCuantas.value,
            FiebreReumatica: this.odontologiaForm.controls.fiebreReumatica.value,
            Fuma: this.odontologiaForm.controls.fuma.value,
            Hemorragias: this.odontologiaForm.controls.hemorragias.value,
            Hepatitis: this.odontologiaForm.controls.hepatitis.value,
            Hipertension: this.odontologiaForm.controls.hipertensionArterial.value,
            Irradiaciones: this.odontologiaForm.controls.irradiaciones.value,
            Medicamentos: this.odontologiaForm.controls.ingestionMedicamentos.value,
            Otros: this.odontologiaForm.controls.otrasEnfermedades.value,
            Seda: this.odontologiaForm.controls.sedaDentalCuantas.value,
            Sinusitis: this.odontologiaForm.controls.sinusitis.value,
            Tratamiento: this.odontologiaForm.controls.tratamientoMedico.value,
            UltimaVisita: new Date(this.odontologiaForm.controls.ultimaVisitaOdontologo.value),
            HistoriaClinicaId: this.Historia.Id,
            FechaCreacion: this.anamnesis.FechaCreacion,
            FechaModificacion: new Date(),
            Activo: true
          }
          this.saludService.putAnamnesis(this.anamnesis.Id, anamnesis).subscribe(data => {
            console.log('Anamnesis: ' + data['Data']);
            this.saludService.falloPsico = false;
          }, error => {
            this.saludService.falloPsico = true;
          });
        }
        const examenDental: ExamenDental = {
          Id: 0,
          Abrasion: this.odontologiaForm.controls.abrasion.value,
          Manchas: this.odontologiaForm.controls.manchas.value,
          Observaciones: this.odontologiaForm.controls.observaciones.value,
          Oclusion: this.odontologiaForm.controls.oclusion.value,
          Otros: this.odontologiaForm.controls.otrosOdonto.value,
          PatologiaPulpar: this.odontologiaForm.controls.patologiaPulpar.value,
          PlacaBlanda: this.odontologiaForm.controls.placaBlanda.value,
          PlacaCalcificada: this.odontologiaForm.controls.placaCalcificada.value,
          Supernumerarios: this.odontologiaForm.controls.Supernumerarios.value,
          HistoriaClinicaId: this.Historia.Id,
          HojaHistoriaId: this.HojaHistoria.Id,
          FechaCreacion: new Date(),
          FechaModificacion: new Date(),
          Activo: true
        }
        this.saludService.postExamenDental(examenDental).subscribe(data => {
          console.log('ExamenDental: ' + data['Data']);
          this.saludService.falloPsico = false;
        }, error => {
          this.saludService.falloPsico = true;
        });
        const examenEstomatologico: ExamenEstomatologico = {
          Id: 0,
          ArticulacionTemporo: this.odontologiaForm.controls.articulacionTemporoMandibula.value,
          Carrillos: this.odontologiaForm.controls.carrillos.value,
          GlandulasSalivares: this.odontologiaForm.controls.glandulasSalivares.value,
          Labios: this.odontologiaForm.controls.labios.value,
          Lengua: this.odontologiaForm.controls.lengua.value,
          Maxilares: this.odontologiaForm.controls.maxilares.value,
          MusculosMasticadores: this.odontologiaForm.controls.musculosMasticadores.value,
          Paladar: this.odontologiaForm.controls.paladar.value,
          PisoBoca: this.odontologiaForm.controls.pisoBoca.value,
          SenosMaxilares: this.odontologiaForm.controls.senosMaxilares.value,
          SistemaLinfaticoRegional: this.odontologiaForm.controls.linfaticoRegionalOdontologia.value,
          SistemaNervioso: this.odontologiaForm.controls.nerviosoOdontologia.value,
          SistemaVascular: this.odontologiaForm.controls.vascularOdontologia.value,
          HistoriaClinicaId: this.Historia.Id,
          HojaHistoriaId: this.HojaHistoria.Id,
          FechaCreacion: new Date(),
          FechaModificacion: new Date(),
          Activo: true
        }
        this.saludService.postExamenEstomatologico(examenEstomatologico).subscribe(data => {
          console.log('ExamenEstomatologico: ' + data['Data']);
          this.saludService.falloPsico = false;
        }, error => {
          this.saludService.falloPsico = true;
        });
        const examenesComplementarios: ExamenesComplementarios = {
          Id: 0,
          PeriapicalInicio: this.enlacePeriapicalInicio,
          PeriapicalFinal: this.enlacePeriapicalFinal,
          PanoramicaInicio: this.enlacePanoramicaInicio,
          PanoramicaFinal: this.enlacePanoramicaFinal,
          OtraInicio: this.enlaceOtraInicio,
          OtraFinal: this.enlaceOtraFinal,
          LaboratorioInicio: this.enlaceLaboratorioInicio,
          LaboratorioFinal: this.enlaceLaboratorioFinal,
          Tp: this.odontologiaForm.controls.tp.value,
          Tpt: this.odontologiaForm.controls.tpt.value,
          Coagulacion: this.odontologiaForm.controls.coagulacion.value,
          Sangria: this.odontologiaForm.controls.sangria.value,
          Otra: this.odontologiaForm.controls.otra.value,
          HistoriaClinicaId: this.Historia.Id,
          HojaHistoriaId: this.HojaHistoria.Id,
          FechaCreacion: new Date(),
          FechaModificacion: new Date(),
          Activo: true
        }
        this.saludService.postExamenesComplementarios(examenesComplementarios).subscribe(data => {
          console.log('ExamenesComplementarios: ' + data['Data']);
          this.saludService.falloPsico = false;
        }, error => {
          this.saludService.falloPsico = true;
        });
        const diagnostico: DiagnosticoOdontologia = {
          Id: 0,
          Evaluacion: this.odontologiaForm.controls.evaluacionEstadoFinal.value,
          Diagnostico: this.odontologiaForm.controls.diagnosticoOdonto.value,
          Pronostico: this.odontologiaForm.controls.pronosticoOdonto.value,
          Pulso: this.odontologiaForm.controls.pulso.value,
          Respiracion: this.odontologiaForm.controls.respiracion.value,
          Temperatura: this.odontologiaForm.controls.temperatura.value,
          TensionArterial: this.odontologiaForm.controls.tensionArterial.value,
          Medicamento: this.odontologiaForm.controls.medicamento.value,
          HistoriaClinica: this.Historia.Id,
          HojaHistoriaId: this.HojaHistoria.Id,
          FechaCreacion: new Date(),
          FechaModificacion: new Date(),
          Activo: true
        }
        this.saludService.postDiagnosticoOdontologia(diagnostico).subscribe(data => {
          console.log('Diagnostico: ' + data['Data']);
          this.saludService.falloPsico = false;
        }, error => {
          this.saludService.falloPsico = true;
        });
        const odontogramaVestabular: Odontograma = {
          HistoriaClinicaId: this.Historia.Id,
          IdHojaHistoria: this.HojaHistoria.Id,
          Id: 0,
          Observaciones: this.odontologiaForm.controls.observacionesVestabular.value,
          IdTipoOdontograma: this.tipoOdontogramaVestabular,
          Diagrama: this.odontogramaVestabular,
          FechaCreacion: new Date(),
          FechaModificacion: new Date(),
          Activo: true
        };
        console.log(odontogramaVestabular);
        this.saludService.postOdontograma(odontogramaVestabular).subscribe(data => {
          console.log('Vestabular: ' + data['Data']);
          this.saludService.falloPsico = false;
        }, error => {
          this.saludService.falloPsico = true;
        });
        const odontogramaVestibular: Odontograma = {
          HistoriaClinicaId: this.Historia.Id,
          IdHojaHistoria: this.HojaHistoria.Id,
          Id: 0,
          Observaciones: this.odontologiaForm.controls.observacionesVestibular.value,
          IdTipoOdontograma: this.tipoOdontogramaVestibular,
          Diagrama: this.odontogramaVestibular,
          FechaCreacion: new Date(),
          FechaModificacion: new Date(),
          Activo: true
        };
        console.log(odontogramaVestibular);
        this.saludService.postOdontograma(odontogramaVestibular).subscribe(data => {
          console.log('Vestibular: ' + data['Data']);
          this.saludService.falloPsico = false;
        }, error => {
          this.saludService.falloPsico = true;
        });
        const odontogramaVestibularInfantil: Odontograma = {
          HistoriaClinicaId: this.Historia.Id,
          IdHojaHistoria: this.HojaHistoria.Id,
          Id: 0,
          Observaciones: this.odontologiaForm.controls.observacionesVestibularInfantil.value,
          IdTipoOdontograma: this.tipoOdontogramaVestibularInfantil,
          Diagrama: this.odontogramaVestibularInfantil,
          FechaCreacion: new Date(),
          FechaModificacion: new Date(),
          Activo: true
        };
        console.log(odontogramaVestibularInfantil);
        this.saludService.postOdontograma(odontogramaVestibularInfantil).subscribe(data => {
          console.log('VestibularInfantil: ' + data['Data']);
          this.saludService.falloPsico = false;
        }, error => {
          this.saludService.falloPsico = true;
        });
        const odontogramaLingualesInfantil: Odontograma = {
          HistoriaClinicaId: this.Historia.Id,
          IdHojaHistoria: this.HojaHistoria.Id,
          Id: 0,
          Observaciones: this.odontologiaForm.controls.observacionesLingualesInfantil.value,
          IdTipoOdontograma: this.tipoOdontogramaLingualesInfantil,
          Diagrama: this.odontogramaLingualesInfantil,
          FechaCreacion: new Date(),
          FechaModificacion: new Date(),
          Activo: true
        };
        console.log(odontogramaLingualesInfantil);
        this.saludService.postOdontograma(odontogramaLingualesInfantil).subscribe(data => {
          console.log('LingualesInfantil: ' + data['Data']);
          this.saludService.falloPsico = false;
        }, error => {
          this.saludService.falloPsico = true;
        });
      });
    }
    else if (this.estado == "vieja") {
      ///ACTUALIZACIÓN 
      // PUTS
      //Hoja historia clínica
      const hojaHistoria: HojaHistoria = {
        Id: this.HojaHistoria.Id,
        HistoriaClinica: this.HojaHistoria.HistoriaClinica,
        Evolucion: '{"evolucion":[' + evolucion2 + ']}',
        FechaConsulta: new Date(this.HojaHistoria.FechaConsulta),
        Especialidad: this.HojaHistoria.Especialidad,
        Persona: this.saludService.IdPersona,
        Profesional: this.HojaHistoria.Profesional,
        Motivo: this.odontologiaForm.controls.motivoConsultaOdonto.value,
        Observacion: this.odontologiaForm.controls.observacionesOdontologia.value,
        FechaCreacion: this.HojaHistoria.FechaCreacion,
        FechaModificacion: new Date(),
        Activo: true
      }
      // console.log(hojaHistoria);
      this.saludService.putHojaHistoria(this.HojaHistoria.Id, hojaHistoria).subscribe(data => {
        console.log('Hoja historia: ' + data['Data']);
        this.saludService.falloMedicina = false;
      }, error => {
        this.saludService.falloMedicina = true;
      });
      const anamnesis: Anamnesis = {
        Id: this.anamnesis.Id,
        Alergias: this.odontologiaForm.controls.reaccionesAlergicas.value,
        AntecedenteFamiliar: this.odontologiaForm.controls.antecedentesFamiliares.value,
        Cardiopatias: this.odontologiaForm.controls.cardiopatias.value,
        Cepillado: this.odontologiaForm.controls.cepilladoCuantas.value,
        Chicle: this.odontologiaForm.controls.chicles.value,
        Diabetes: this.odontologiaForm.controls.diabetes.value,
        Dulces: this.odontologiaForm.controls.dulces.value,
        EnfermedadRespiratoria: this.odontologiaForm.controls.enfermedadesRespiratorias.value,
        Enjuague: this.odontologiaForm.controls.enjuagueCuantas.value,
        FiebreReumatica: this.odontologiaForm.controls.fiebreReumatica.value,
        Fuma: this.odontologiaForm.controls.fuma.value,
        Hemorragias: this.odontologiaForm.controls.hemorragias.value,
        Hepatitis: this.odontologiaForm.controls.hepatitis.value,
        Hipertension: this.odontologiaForm.controls.hipertensionArterial.value,
        Irradiaciones: this.odontologiaForm.controls.irradiaciones.value,
        Medicamentos: this.odontologiaForm.controls.ingestionMedicamentos.value,
        Otros: this.odontologiaForm.controls.otrasEnfermedades.value,
        Seda: this.odontologiaForm.controls.sedaDentalCuantas.value,
        Sinusitis: this.odontologiaForm.controls.sinusitis.value,
        Tratamiento: this.odontologiaForm.controls.tratamientoMedico.value,
        UltimaVisita: new Date(this.odontologiaForm.controls.ultimaVisitaOdontologo.value),
        HistoriaClinicaId: this.Historia.Id,
        FechaCreacion: this.anamnesis.FechaCreacion,
        FechaModificacion: new Date(),
        Activo: true
      }
      this.saludService.putAnamnesis(this.anamnesis.Id, anamnesis).subscribe(data => {
        console.log('Anamnesis: ' + data['Data']);
        this.saludService.falloPsico = false;
      }, error => {
        this.saludService.falloPsico = true;
      });

      const examenDental: ExamenDental = {
        Id: this.examenDental.Id,
        Abrasion: this.odontologiaForm.controls.abrasion.value,
        Manchas: this.odontologiaForm.controls.manchas.value,
        Observaciones: this.odontologiaForm.controls.observaciones.value,
        Oclusion: this.odontologiaForm.controls.oclusion.value,
        Otros: this.odontologiaForm.controls.otrosOdonto.value,
        PatologiaPulpar: this.odontologiaForm.controls.patologiaPulpar.value,
        PlacaBlanda: this.odontologiaForm.controls.placaBlanda.value,
        PlacaCalcificada: this.odontologiaForm.controls.placaCalcificada.value,
        Supernumerarios: this.odontologiaForm.controls.Supernumerarios.value,
        HistoriaClinicaId: this.Historia.Id,
        HojaHistoriaId: this.HojaHistoria.Id,
        FechaCreacion: this.examenDental.FechaCreacion,
        FechaModificacion: new Date(),
        Activo: true
      }
      this.saludService.putExamenDental(this.examenDental.Id, examenDental).subscribe(data => {
        console.log('ExamenDental: ' + data['Data']);
        this.saludService.falloPsico = false;
      }, error => {
        this.saludService.falloPsico = true;
      });
      const examenEstomatologico: ExamenEstomatologico = {
        Id: this.examenEstomatologico.Id,
        ArticulacionTemporo: this.odontologiaForm.controls.articulacionTemporoMandibula.value,
        Carrillos: this.odontologiaForm.controls.carrillos.value,
        GlandulasSalivares: this.odontologiaForm.controls.glandulasSalivares.value,
        Labios: this.odontologiaForm.controls.labios.value,
        Lengua: this.odontologiaForm.controls.lengua.value,
        Maxilares: this.odontologiaForm.controls.maxilares.value,
        MusculosMasticadores: this.odontologiaForm.controls.musculosMasticadores.value,
        Paladar: this.odontologiaForm.controls.paladar.value,
        PisoBoca: this.odontologiaForm.controls.pisoBoca.value,
        SenosMaxilares: this.odontologiaForm.controls.senosMaxilares.value,
        SistemaLinfaticoRegional: this.odontologiaForm.controls.linfaticoRegionalOdontologia.value,
        SistemaNervioso: this.odontologiaForm.controls.nerviosoOdontologia.value,
        SistemaVascular: this.odontologiaForm.controls.vascularOdontologia.value,
        HistoriaClinicaId: this.Historia.Id,
        HojaHistoriaId: this.HojaHistoria.Id,
        FechaCreacion: this.examenEstomatologico.FechaCreacion,
        FechaModificacion: new Date(),
        Activo: true
      }
      this.saludService.putExamenEstomatologico(this.examenEstomatologico.Id, examenEstomatologico).subscribe(data => {
        console.log('ExamenEstomatologico: ' + data['Data']);
        this.saludService.falloPsico = false;
      }, error => {
        this.saludService.falloPsico = true;
      });
      if (this.examenesComplementarios.PeriapicalInicio != null && this.examenesComplementarios.PeriapicalInicio != "") {
        this.enlacePeriapicalInicio = this.examenesComplementarios.PeriapicalInicio;
      }
      if (this.examenesComplementarios.PeriapicalFinal != null && this.examenesComplementarios.PeriapicalFinal != "") {
        this.enlacePeriapicalFinal = this.examenesComplementarios.PeriapicalFinal;
      }
      if (this.examenesComplementarios.PanoramicaInicio != null && this.examenesComplementarios.PanoramicaInicio != "") {
        this.enlacePanoramicaInicio = this.examenesComplementarios.PanoramicaInicio;
      }
      if (this.examenesComplementarios.PanoramicaFinal != null && this.examenesComplementarios.PanoramicaFinal != "") {
        this.enlacePanoramicaFinal = this.examenesComplementarios.PanoramicaFinal;
      }
      if (this.examenesComplementarios.OtraInicio != null && this.examenesComplementarios.OtraInicio != "") {
        this.enlaceOtraInicio = this.examenesComplementarios.OtraInicio;
      }
      if (this.examenesComplementarios.OtraFinal != null && this.examenesComplementarios.OtraFinal != "") {
        this.enlaceOtraFinal = this.examenesComplementarios.OtraFinal;
      }
      if (this.examenesComplementarios.LaboratorioInicio != null && this.examenesComplementarios.LaboratorioInicio != "") {
        this.enlaceLaboratorioInicio = this.examenesComplementarios.LaboratorioInicio;
      }
      if (this.examenesComplementarios.LaboratorioFinal != null && this.examenesComplementarios.LaboratorioFinal != "") {
        this.enlaceLaboratorioFinal = this.examenesComplementarios.LaboratorioFinal;
      }
      const examenesComplementarios: ExamenesComplementarios = {
        Id: this.examenesComplementarios.Id,
        PeriapicalInicio: this.enlacePeriapicalInicio,
        PeriapicalFinal: this.enlacePeriapicalFinal,
        PanoramicaInicio: this.enlacePanoramicaInicio,
        PanoramicaFinal: this.enlacePanoramicaFinal,
        OtraInicio: this.enlaceOtraInicio,
        OtraFinal: this.enlaceOtraFinal,
        LaboratorioInicio: this.enlaceLaboratorioInicio,
        LaboratorioFinal: this.enlaceLaboratorioFinal,
        Tp: this.odontologiaForm.controls.tp.value,
        Tpt: this.odontologiaForm.controls.tpt.value,
        Coagulacion: this.odontologiaForm.controls.coagulacion.value,
        Sangria: this.odontologiaForm.controls.sangria.value,
        Otra: this.odontologiaForm.controls.otra.value,
        HistoriaClinicaId: this.Historia.Id,
        HojaHistoriaId: this.HojaHistoria.Id,
        FechaCreacion: this.examenesComplementarios.FechaCreacion,
        FechaModificacion: new Date(),
        Activo: true
      }
      this.saludService.putExamenesComplementarios(this.examenesComplementarios.Id, examenesComplementarios).subscribe(data => {
        console.log('ExamenesComplementarios: ' + data['Data']);
        this.saludService.falloPsico = false;
      }, error => {
        this.saludService.falloPsico = true;
      });

      const diagnostico: DiagnosticoOdontologia = {
        Id: this.diagnostico.Id,
        Evaluacion: this.odontologiaForm.controls.evaluacionEstadoFinal.value,
        Diagnostico: this.odontologiaForm.controls.diagnosticoOdonto.value,
        Pronostico: this.odontologiaForm.controls.pronosticoOdonto.value,
        Pulso: this.odontologiaForm.controls.pulso.value,
        Respiracion: this.odontologiaForm.controls.respiracion.value,
        Temperatura: this.odontologiaForm.controls.temperatura.value,
        TensionArterial: this.odontologiaForm.controls.tensionArterial.value,
        Medicamento: this.odontologiaForm.controls.medicamento.value,
        HistoriaClinica: this.Historia.Id,
        HojaHistoriaId: this.HojaHistoria.Id,
        FechaCreacion: this.diagnostico.FechaCreacion,
        FechaModificacion: new Date(),
        Activo: true
      }
      this.saludService.putDiagnosticoOdontologia(this.diagnostico.Id, diagnostico).subscribe(data => {
        console.log('Diagnostico: ' + data['Data']);
        this.saludService.falloPsico = false;
      }, error => {
        this.saludService.falloPsico = true;
      });
      const odontogramaVestabular: Odontograma = {
        HistoriaClinicaId: this.Historia.Id,
        IdHojaHistoria: this.HojaHistoria.Id,
        Id: this.getOdontogramaVestabular.Id,
        Observaciones: this.odontologiaForm.controls.observacionesVestabular.value,
        IdTipoOdontograma: this.tipoOdontogramaVestabular,
        Diagrama: this.odontogramaVestabular,
        FechaCreacion: this.getOdontogramaVestabular.FechaCreacion,
        FechaModificacion: new Date(),
        Activo: true
      };
      this.saludService.putOdontograma(odontogramaVestabular.Id, odontogramaVestabular).subscribe(data => {
        console.log('Vestibular: ' + data['Data']);
        this.saludService.falloPsico = false;
      }, error => {
        this.saludService.falloPsico = true;
      });
      const odontogramaVestibular: Odontograma = {
        HistoriaClinicaId: this.Historia.Id,
        IdHojaHistoria: this.HojaHistoria.Id,
        Id: this.getOdontogramaVestibular.Id,
        Observaciones: this.odontologiaForm.controls.observacionesVestibular.value,
        IdTipoOdontograma: this.tipoOdontogramaVestibular,
        Diagrama: this.odontogramaVestibular,
        FechaCreacion: this.getOdontogramaVestibular.FechaCreacion,
        FechaModificacion: new Date(),
        Activo: true
      };
      this.saludService.putOdontograma(odontogramaVestibular.Id, odontogramaVestibular).subscribe(data => {
        console.log('Vestibular: ' + data['Data']);
        this.saludService.falloPsico = false;
      }, error => {
        this.saludService.falloPsico = true;
      });
      const odontogramaVestibularInfantil: Odontograma = {
        HistoriaClinicaId: this.Historia.Id,
        IdHojaHistoria: this.HojaHistoria.Id,
        Id: this.getOdontogramaVestibularInfantil.Id,
        Observaciones: this.odontologiaForm.controls.observacionesVestibularInfantil.value,
        IdTipoOdontograma: this.tipoOdontogramaVestibularInfantil,
        Diagrama: this.odontogramaVestibularInfantil,
        FechaCreacion: this.getOdontogramaVestibularInfantil.FechaCreacion,
        FechaModificacion: new Date(),
        Activo: true
      };
      this.saludService.putOdontograma(odontogramaVestibularInfantil.Id, odontogramaVestibularInfantil).subscribe(data => {
        console.log('Vestibular: ' + data['Data']);
        this.saludService.falloPsico = false;
      }, error => {
        this.saludService.falloPsico = true;
      });
      const odontogramaLingualesInfantil: Odontograma = {
        HistoriaClinicaId: this.Historia.Id,
        IdHojaHistoria: this.HojaHistoria.Id,
        Id: this.getOdontogramaLingualesInfantil.Id,
        Observaciones: this.odontologiaForm.controls.observacionesLingualesInfantil.value,
        IdTipoOdontograma: this.tipoOdontogramaLingualesInfantil,
        Diagrama: this.odontogramaLingualesInfantil,
        FechaCreacion: this.getOdontogramaLingualesInfantil.FechaCreacion,
        FechaModificacion: new Date(),
        Activo: true
      };
      this.saludService.putOdontograma(odontogramaLingualesInfantil.Id, odontogramaLingualesInfantil).subscribe(data => {
        console.log('Vestibular: ' + data['Data']);
        this.saludService.falloPsico = false;
      }, error => {
        this.saludService.falloPsico = true;
      });

    }
    if (this.saludService.falloPsico === false) {
      this.toastr.success(`Ha registrado con éxito la historia clínica de odontología para: ${this.paciente}`, '¡Guardado!');
      // setTimeout(() => {
      //   window.location.reload();
      // },
      //   1000);
    } else {
      this.toastr.error('Ha ocurrido un error al guardar la historia clínica', 'Error');
    }
  }

  changeEnjuague(data: MatCheckboxChange) {
    if (!data.checked) {
      this.odontologiaForm.controls['enjuagueCuantas'].setValue(0);
    }
  }
  changeSeda(data: MatCheckboxChange) {
    if (!data.checked) {
      this.odontologiaForm.controls['sedaDentalCuantas'].setValue(0);
    }
  }
  changeCepillado(data: MatCheckboxChange) {
    if (!data.checked) {
      this.odontologiaForm.controls['cepilladoCuantas'].setValue(0);
    }
  }
  cambiarHoja(data: any) {
    this.evolucionOdontoArr.clear();
    this.getHojaEspecifica(data);
  }
  getHojaEspecifica(Id: any) {
    this.reset();
    this.saludService.getHojaHistoriaEspecifica(Id).subscribe(data => {//Reemplazar por terceroId
      //console.log(data);
      this.HojaHistoria = data['Data'];
      this.evolucion = [];
      let evolucion = JSON.parse(this.HojaHistoria.Evolucion) || [];
      this.evolucion.push({ ...evolucion });
      let evolucion2: any = this.evolucion[0].evolucion;
      for (let i = 0; i < evolucion2.length; i++) {
        this.evolucionOdontoArr.push(new FormControl(evolucion2[i]));
      }
      this.odontologiaForm.controls.motivoConsultaOdonto.setValue(this.HojaHistoria.Motivo);
      this.odontologiaForm.controls.observacionesOdontologia.setValue(this.HojaHistoria.Observacion);
      this.getAnanmesis();
      this.saludService.getExamenDental(this.HojaHistoria.Id).subscribe(data => {
        this.examenDental = data['Data'][0];
        //console.log(this.examenDental);
        this.odontologiaForm.controls.abrasion.setValue(this.examenDental.Abrasion);
        this.odontologiaForm.controls.manchas.setValue(this.examenDental.Manchas);
        this.odontologiaForm.controls.observaciones.setValue(this.examenDental.Observaciones);
        this.odontologiaForm.controls.oclusion.setValue(this.examenDental.Oclusion);
        this.odontologiaForm.controls.otrosOdonto.setValue(this.examenDental.Otros);
        this.odontologiaForm.controls.patologiaPulpar.setValue(this.examenDental.PatologiaPulpar);
        this.odontologiaForm.controls.placaBlanda.setValue(this.examenDental.PlacaBlanda);
        this.odontologiaForm.controls.placaCalcificada.setValue(this.examenDental.PlacaCalcificada);
        this.odontologiaForm.controls.Supernumerarios.setValue(this.examenDental.Supernumerarios);
      });
      this.saludService.getExamenEstomatologico(this.HojaHistoria.Id).subscribe(data => {
        this.examenEstomatologico = data['Data'][0];
        //console.log(this.examenEstomatologico);
        this.odontologiaForm.controls.articulacionTemporoMandibula.setValue(this.examenEstomatologico.ArticulacionTemporo);
        this.odontologiaForm.controls.carrillos.setValue(this.examenEstomatologico.Carrillos);
        this.odontologiaForm.controls.glandulasSalivares.setValue(this.examenEstomatologico.GlandulasSalivares);
        this.odontologiaForm.controls.labios.setValue(this.examenEstomatologico.Labios);
        this.odontologiaForm.controls.lengua.setValue(this.examenEstomatologico.Lengua);
        this.odontologiaForm.controls.maxilares.setValue(this.examenEstomatologico.Maxilares);
        this.odontologiaForm.controls.musculosMasticadores.setValue(this.examenEstomatologico.MusculosMasticadores);
        this.odontologiaForm.controls.paladar.setValue(this.examenEstomatologico.Paladar);
        this.odontologiaForm.controls.pisoBoca.setValue(this.examenEstomatologico.PisoBoca);
        this.odontologiaForm.controls.senosMaxilares.setValue(this.examenEstomatologico.SenosMaxilares);
        this.odontologiaForm.controls.linfaticoRegionalOdontologia.setValue(this.examenEstomatologico.SistemaLinfaticoRegional);
        this.odontologiaForm.controls.nerviosoOdontologia.setValue(this.examenEstomatologico.SistemaNervioso);
        this.odontologiaForm.controls.vascularOdontologia.setValue(this.examenEstomatologico.SistemaVascular);
      });
      this.saludService.getDiagnosticoOdontologia(this.HojaHistoria.Id).subscribe(data => {
        this.diagnostico = data['Data'][0];
        //console.log(this.diagnostico);
        this.odontologiaForm.controls.evaluacionEstadoFinal.setValue(this.diagnostico.Evaluacion);
        this.odontologiaForm.controls.diagnosticoOdonto.setValue(this.diagnostico.Diagnostico);
        this.odontologiaForm.controls.pronosticoOdonto.setValue(this.diagnostico.Pronostico);
        this.odontologiaForm.controls.pulso.setValue(this.diagnostico.Pulso);
        this.odontologiaForm.controls.respiracion.setValue(this.diagnostico.Respiracion);
        this.odontologiaForm.controls.temperatura.setValue(this.diagnostico.Temperatura);
        this.odontologiaForm.controls.tensionArterial.setValue(this.diagnostico.TensionArterial);
        this.odontologiaForm.controls.medicamento.setValue(this.diagnostico.Medicamento);
      });
      this.saludService.getExamenesComplementarios(this.HojaHistoria.Id).subscribe(data => {
        this.examenesComplementarios = data['Data'][0];
        //console.log(this.examenesComplementarios);
        if (this.examenesComplementarios.PanoramicaInicio != null && this.examenesComplementarios.PanoramicaInicio != "") {
          this.saludService.getDocumento(this.examenesComplementarios.PanoramicaInicio).subscribe(data => {
            const byteArray = new Uint8Array(atob(data['file']).split('').map(char => char.charCodeAt(0)));
            this.blobPanoramicaInicio = new Blob([byteArray], { type: 'application/pdf' });
            this.estadoPanoramicaInicio = true;
          });

        }
        if (this.examenesComplementarios.PanoramicaFinal != null && this.examenesComplementarios.PanoramicaFinal != "") {
          this.saludService.getDocumento(this.examenesComplementarios.PanoramicaFinal).subscribe(data => {
            const byteArray = new Uint8Array(atob(data['file']).split('').map(char => char.charCodeAt(0)));
            this.blobPanoramicaFinal = new Blob([byteArray], { type: 'application/pdf' });
            this.estadoPanoramicaFinal = true;
          });

        }
        if (this.examenesComplementarios.PeriapicalInicio != null && this.examenesComplementarios.PeriapicalInicio != "") {
          this.saludService.getDocumento(this.examenesComplementarios.PeriapicalInicio).subscribe(data => {
            const byteArray = new Uint8Array(atob(data['file']).split('').map(char => char.charCodeAt(0)));
            this.blobPeriapicalInicio = new Blob([byteArray], { type: 'application/pdf' });
            this.estadoPeriapicalInicio = true;
          });

        }
        if (this.examenesComplementarios.PeriapicalFinal != null && this.examenesComplementarios.PeriapicalFinal != "") {
          this.saludService.getDocumento(this.examenesComplementarios.PeriapicalFinal).subscribe(data => {
            const byteArray = new Uint8Array(atob(data['file']).split('').map(char => char.charCodeAt(0)));
            this.blobPeriapicalFinal = new Blob([byteArray], { type: 'application/pdf' });
            this.estadoPeriapicalFinal = true;
          });
        }
        if (this.examenesComplementarios.OtraInicio != null && this.examenesComplementarios.OtraInicio != "") {
          this.saludService.getDocumento(this.examenesComplementarios.OtraInicio).subscribe(data => {
            const byteArray = new Uint8Array(atob(data['file']).split('').map(char => char.charCodeAt(0)));
            this.blobOtraInicio = new Blob([byteArray], { type: 'application/pdf' });
            this.estadoOtraInicio = true;
          });
        }
        if (this.examenesComplementarios.OtraFinal != null && this.examenesComplementarios.OtraFinal != "") {
          this.saludService.getDocumento(this.examenesComplementarios.OtraFinal).subscribe(data => {
            const byteArray = new Uint8Array(atob(data['file']).split('').map(char => char.charCodeAt(0)));
            this.blobOtraFinal = new Blob([byteArray], { type: 'application/pdf' });
            this.estadoOtraFinal = true;
          });
        }
        if (this.examenesComplementarios.LaboratorioInicio != null && this.examenesComplementarios.LaboratorioInicio != "") {
          this.saludService.getDocumento(this.examenesComplementarios.LaboratorioInicio).subscribe(data => {
            const byteArray = new Uint8Array(atob(data['file']).split('').map(char => char.charCodeAt(0)));
            this.blobLaboratorioInicio = new Blob([byteArray], { type: 'application/pdf' });
            this.estadoLaboratorioInicio = true;
          });
        }
        if (this.examenesComplementarios.LaboratorioFinal != null && this.examenesComplementarios.LaboratorioFinal != "") {
          this.saludService.getDocumento(this.examenesComplementarios.LaboratorioFinal).subscribe(data => {
            const byteArray = new Uint8Array(atob(data['file']).split('').map(char => char.charCodeAt(0)));
            this.blobLaboratorioFinal = new Blob([byteArray], { type: 'application/pdf' });
            this.estadoLaboratorioFinal = true;
          });
        }
        this.odontologiaForm.controls.tp.setValue(this.examenesComplementarios.Tp);
        this.odontologiaForm.controls.tpt.setValue(this.examenesComplementarios.Tpt);
        this.odontologiaForm.controls.coagulacion.setValue(this.examenesComplementarios.Coagulacion);
        this.odontologiaForm.controls.sangria.setValue(this.examenesComplementarios.Sangria);
        this.odontologiaForm.controls.otra.setValue(this.examenesComplementarios.Otra);
      });
      this.personaService.getDatosPersonalesPorTercero(this.HojaHistoria.Profesional).subscribe(data => {
        this.nombreEspecialista = data[0].TerceroId.NombreCompleto;
      });
      this.saludService.getOdontograma(this.HojaHistoria.Id, 1).subscribe(data => {
        this.getOdontogramaVestabular = data['Data'][0];
        this.odontologiaForm.controls.observacionesVestabular.setValue(this.getOdontogramaVestabular.Observaciones);
      });
      this.saludService.getOdontograma(this.HojaHistoria.Id, 2).subscribe(data => {
        this.getOdontogramaVestibular = data['Data'][0];
        this.odontologiaForm.controls.observacionesVestibular.setValue(this.getOdontogramaVestibular.Observaciones);
      });
      this.saludService.getOdontograma(this.HojaHistoria.Id, 3).subscribe(data => {
        this.getOdontogramaLingualesInfantil = data['Data'][0];
        this.odontologiaForm.controls.observacionesLingualesInfantil.setValue(this.getOdontogramaLingualesInfantil.Observaciones);
      });
      this.saludService.getOdontograma(this.HojaHistoria.Id, 4).subscribe(data => {
        this.getOdontogramaVestibularInfantil = data['Data'][0];
        this.odontologiaForm.controls.observacionesVestibularInfantil.setValue(this.getOdontogramaVestibularInfantil.Observaciones);
      });
    });
  }
  crearNuevaHoja() {
    this.odontologiaForm.reset();
    this.getAnanmesis();
    this.estado = "nueva";
    this.evolucionOdontoArr.clear();
    this.hideHistory = true;
    this.nombreEspecialista = "";
    this.reset();
  }
  getAnanmesis() {
    this.saludService.getAnanmesis(this.Historia.Id).subscribe(data => {
      this.anamnesis = data['Data'][0];
      //console.log(this.anamnesis);
      this.odontologiaForm.controls.reaccionesAlergicas.setValue(this.anamnesis.Alergias);
      this.odontologiaForm.controls.antecedentesFamiliares.setValue(this.anamnesis.AntecedenteFamiliar);
      this.odontologiaForm.controls.cardiopatias.setValue(this.anamnesis.Cardiopatias);
      this.odontologiaForm.controls.cepilladoCuantas.setValue(this.anamnesis.Cepillado);
      if (this.anamnesis.Cepillado > 0) {
        this.odontologiaForm.controls.cepillado.setValue(true);
      }
      this.odontologiaForm.controls.chicles.setValue(this.anamnesis.Chicle);
      this.odontologiaForm.controls.diabetes.setValue(this.anamnesis.Diabetes);
      this.odontologiaForm.controls.dulces.setValue(this.anamnesis.Dulces);
      this.odontologiaForm.controls.enfermedadesRespiratorias.setValue(this.anamnesis.EnfermedadRespiratoria);
      this.odontologiaForm.controls.enjuagueCuantas.setValue(this.anamnesis.Enjuague);
      if (this.anamnesis.Enjuague > 0) {
        this.odontologiaForm.controls.enjuague.setValue(true);
      }
      this.odontologiaForm.controls.fiebreReumatica.setValue(this.anamnesis.FiebreReumatica);
      this.odontologiaForm.controls.fuma.setValue(this.anamnesis.Fuma);
      this.odontologiaForm.controls.hemorragias.setValue(this.anamnesis.Hemorragias);
      this.odontologiaForm.controls.hepatitis.setValue(this.anamnesis.Hepatitis);
      this.odontologiaForm.controls.hipertensionArterial.setValue(this.anamnesis.Hipertension);
      this.odontologiaForm.controls.irradiaciones.setValue(this.anamnesis.Irradiaciones);
      this.odontologiaForm.controls.ingestionMedicamentos.setValue(this.anamnesis.Medicamentos);
      this.odontologiaForm.controls.otrasEnfermedades.setValue(this.anamnesis.Otros);
      this.odontologiaForm.controls.sedaDentalCuantas.setValue(this.anamnesis.Seda);
      if (this.anamnesis.Cepillado > 0) {
        this.odontologiaForm.controls.sedaDental.setValue(true);
      }
      this.odontologiaForm.controls.sinusitis.setValue(this.anamnesis.Sinusitis);
      this.odontologiaForm.controls.tratamientoMedico.setValue(this.anamnesis.Tratamiento);
      this.fechaUltimaVisita = new Date(this.anamnesis.UltimaVisita);
      this.fechaUltimaVisita.setHours(this.fechaUltimaVisita.getHours() + 5);
      this.odontologiaForm.controls.ultimaVisitaOdontologo.setValue(this.fechaUltimaVisita);
    });
  }
  resultOdontogramaVestabular(result: any) {
    if (result) {
      this.odontogramaVestabular = result;
    }
  }
  resultOdontogramaVestibular(result: any) {
    if (result) {
      this.odontogramaVestibular = result;
    }
  }
  resultOdontogramaVestibularInfantil(result: any) {
    if (result) {
      this.odontogramaVestibularInfantil = result;
    }
  }
  resultOdontogramaLingualesInfantil(result: any) {
    if (result) {
      this.odontogramaLingualesInfantil = result;
    }
  }
  getOdontogramas() {
    this.saludService.getOdontogramas(this.Historia.Id, 1).subscribe(data => {
      this.getOdontogramaVestabular = data['Data'][0];
      this.odontologiaForm.controls.observacionesVestabular.setValue(this.getOdontogramaVestabular.Observaciones);
    });
    this.saludService.getOdontogramas(this.Historia.Id, 2).subscribe(data => {
      this.getOdontogramaVestibular = data['Data'][0];
      this.odontologiaForm.controls.observacionesVestibular.setValue(this.getOdontogramaVestibular.Observaciones);
    });
    this.saludService.getOdontogramas(this.Historia.Id, 3).subscribe(data => {
      this.getOdontogramaLingualesInfantil = data['Data'][0];
      this.odontologiaForm.controls.observacionesLingualesInfantil.setValue(this.getOdontogramaLingualesInfantil.Observaciones);
    });
    this.saludService.getOdontogramas(this.Historia.Id, 4).subscribe(data => {
      this.getOdontogramaVestibularInfantil = data['Data'][0];
      this.odontologiaForm.controls.observacionesVestibularInfantil.setValue(this.getOdontogramaVestibularInfantil.Observaciones);
    });
  }
  onFilePeriapicalInicio(event: any) {
    // console.log(event.target.files);
    if (event.target.files.length > 0) {
      if (event.target.files[0].type == "application/pdf") {
        this.convertFile(event.target.files[0]).subscribe(base64 => {
          this.base64PeriapicalInicio = base64;
          //console.log(this.base64PeriapicalInicio);
        });
      } else {
        this.toastr.error("Solo permitidos documentos PDF");
        this.inputPeriapicalInicio.nativeElement.value = "";
        this.base64PeriapicalInicio = null;
      }
    }
    else {
      this.base64PeriapicalInicio = null;
    }
  }

  onFilePeriapicalFinal(event: any) {
    //console.log(event.target.files);
    if (event.target.files.length > 0) {
      if (event.target.files[0].type == "application/pdf") {
        this.convertFile(event.target.files[0]).subscribe(base64 => {
          this.base64PeriapicalFinal = base64;
          //console.log(this.base64PeriapicalFinal);
        });
      } else {
        this.toastr.error("Solo permitidos documentos PDF");
        this.inputPeriapicalFinal.nativeElement.value = "";
        this.base64PeriapicalFinal = null;

      }
    }
    else {
      this.base64PeriapicalFinal = null;
    }
  }
  onFilePanoramicaInicio(event: any) {
    //console.log(event.target.files);
    if (event.target.files.length > 0) {
      if (event.target.files[0].type == "application/pdf") {
        this.convertFile(event.target.files[0]).subscribe(base64 => {
          this.base64PanoramicaInicio = base64;
          //console.log(this.base64PanoramicaInicio);
        });
      } else {
        this.toastr.error("Solo permitidos documentos PDF");
        this.inputPanoramicaInicio.nativeElement.value = "";
        this.base64PanoramicaInicio = null;
      }
    }
    else {
      this.base64PanoramicaInicio = null;
    }
  }
  onFilePanoramicaFinal(event: any) {
    //console.log(event.target.files);
    if (event.target.files.length > 0) {
      if (event.target.files[0].type == "application/pdf") {
        this.convertFile(event.target.files[0]).subscribe(base64 => {
          this.base64PanoramicaFinal = base64;
          //console.log(this.base64PanoramicaFinal);
        });
      } else {
        this.toastr.error("Solo permitidos documentos PDF");
        this.inputPanoramicaFinal.nativeElement.value = "";
        this.base64PanoramicaFinal = null;
      }
    }
    else {
      this.base64PanoramicaFinal = null;
    }
  }
  onFileOtraInicio(event: any) {
    //console.log(event.target.files);
    if (event.target.files.length > 0) {
      if (event.target.files[0].type == "application/pdf") {
        this.convertFile(event.target.files[0]).subscribe(base64 => {
          this.base64OtraInicio = base64;
          //console.log(this.base64OtraInicio);
        });
      } else {
        this.toastr.error("Solo permitidos documentos PDF");
        this.inputOtraInicio.nativeElement.value = "";
        this.base64OtraInicio = null;
      }
    }
    else {
      this.base64OtraInicio = null;
    }
  }
  onFileOtraFinal(event: any) {
    //console.log(event.target.files);
    if (event.target.files.length > 0) {
      if (event.target.files[0].type == "application/pdf") {
        this.convertFile(event.target.files[0]).subscribe(base64 => {
          this.base64OtraFinal = base64;
          //console.log(this.base64OtraFinal);
        });
      } else {
        this.toastr.error("Solo permitidos documentos PDF");
        this.inputOtraFinal.nativeElement.value = "";
        this.base64OtraFinal = null;
      }
    }
    else {
      this.base64OtraFinal = null;
    }
  }
  onFileLaboratorioInicio(event: any) {
    //console.log(event.target.files);
    if (event.target.files.length > 0) {
      if (event.target.files[0].type == "application/pdf") {
        this.convertFile(event.target.files[0]).subscribe(base64 => {
          this.base64LaboratorioInicio = base64;
          //console.log(this.base64LaboratorioInicio);
        });
      } else {
        this.toastr.error("Solo permitidos documentos PDF");
        this.inputLaboratorioInicio.nativeElement.value = "";
        this.base64LaboratorioInicio = null;
      }
    }
    else {
      this.base64LaboratorioInicio = null;
    }
  }
  onFileLaboratorioFinal(event: any) {
    //console.log(event.target.files);
    if (event.target.files.length > 0) {
      if (event.target.files[0].type == "application/pdf") {
        this.convertFile(event.target.files[0]).subscribe(base64 => {
          this.base64LaboratorioFinal = base64;
          //console.log(this.base64LaboratorioFinal);
        });
      } else {
        this.toastr.error("Solo permitidos documentos PDF");
        this.inputLaboratorioFinal.nativeElement.value = "";
        this.base64LaboratorioFinal = null;
      }
    }
    else {
      this.base64LaboratorioFinal = null;
    }
  }
  convertFile(file: File): Observable<string> {
    const result = new ReplaySubject<string>(1);
    const reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = (event) => result.next(btoa(event.target["result"].toString()));
    return result;
  }
  downloadDocumentPeriapicalInicio() {
    FileSaver.saveAs(this.blobPeriapicalInicio, "Periapical Inicio " + this.paciente + ".pdf");
  }
  downloadDocumentPeriapicalFinal() {
    FileSaver.saveAs(this.blobPeriapicalFinal, "Periapical Final " + this.paciente + ".pdf");
  }
  downloadDocumentPanoramicaInicio() {
    FileSaver.saveAs(this.blobPanoramicaInicio, "Panorámica Inicio " + this.paciente + ".pdf");
  }
  downloadDocumentPanoramicaFinal() {
    FileSaver.saveAs(this.blobPanoramicaFinal, "Panorámica Final " + this.paciente + ".pdf");
  }
  downloadDocumentOtraInicio() {
    FileSaver.saveAs(this.blobOtraInicio, "Otra Inicio " + this.paciente + ".pdf");
  }
  downloadDocumentOtraFinal() {
    FileSaver.saveAs(this.blobOtraFinal, "Otra Final " + this.paciente + ".pdf");
  }
  downloadDocumentLaboratorioInicio() {
    FileSaver.saveAs(this.blobLaboratorioInicio, "Laboratorio Inicio " + this.paciente + ".pdf");
  }
  downloadDocumentLaboratorioFinal() {
    FileSaver.saveAs(this.blobLaboratorioFinal, "Laboratorio Final " + this.paciente + ".pdf");
  }
  reset() {
    this.inputPeriapicalInicio.nativeElement.value = "";
    this.base64PeriapicalInicio = null;
    this.inputPeriapicalFinal.nativeElement.value = "";
    this.base64PeriapicalFinal = null;
    this.inputPanoramicaInicio.nativeElement.value = "";
    this.base64PanoramicaInicio = null;
    this.inputPanoramicaFinal.nativeElement.value = "";
    this.base64PanoramicaFinal = null;
    this.inputOtraInicio.nativeElement.value = "";
    this.base64OtraInicio = null;
    this.inputOtraFinal.nativeElement.value = "";
    this.base64OtraFinal = null;
    this.inputLaboratorioInicio.nativeElement.value = "";
    this.base64LaboratorioInicio = null;
    this.inputLaboratorioFinal.nativeElement.value = "";
    this.base64LaboratorioFinal = null;
    this.estadoPeriapicalInicio = false;
    this.estadoPeriapicalFinal = false;
    this.estadoPanoramicaInicio = false;
    this.estadoPanoramicaFinal = false;
    this.estadoOtraInicio = false;
    this.estadoOtraFinal = false;
    this.estadoLaboratorioInicio = false;
    this.estadoLaboratorioFinal = false;
  }
  comprobarCargaDocumentos() {
    if (this.subidoLaboratorioFinal == true && this.subidoLaboratorioInicio == true && this.subidoOtraFinal == true && this.subidoOtraInicio == true && this.subidoPanoramicaFinal == true && this.subidoPanoramicaInicio == true && this.subidoPeriapicalFinal == true && this.subidoPeriapicalInicio == true) {
      this.guardarHistoriaOdontologia();
    }
  }
  async openPdf() {
    let fechaActual = new (Date);
    let pipe = new DatePipe('en_US');
    let myFormattedDate = pipe.transform(fechaActual, 'short');
    const documentDefinition = {
      content: [
        { text: "Fecha: " + myFormattedDate },
        { text: "Estudiante: " + this.paciente },
        {
          image: this.logoDataUrl,
          width: 150,
          height: 200,
          alignment: 'center'
        },

        { text: '\n\nMedicamentos recetados - Módulo odontología\n', style: 'secondTitle' },
        { text: '\n' + this.odontologiaForm.controls.medicamento.value }
      ],
      styles: {
        secondTitle: {
          bold: true,
          fontSize: 15,
          alignment: 'center'
        },
      },
      images: {
        mySuperImage: 'data:image/png;base64,...content...'
      }
    };
    pdfMake.createPdf(documentDefinition).open();
  }
}
function validateDate(c: AbstractControl) {
  let date = new Date();
  return 0;
}
