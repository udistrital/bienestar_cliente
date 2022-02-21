import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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
    periapicalInicio: [null],
    periapicalFinal: [null],
    panoramicaInicio: [null],
    panoramicaFinal: [null],
    otraInicio: [null],
    otraFinal: [null],
    examenesLaboratorioOdontoInicio: [null],
    examenesLaboratorioOdontoFinal: [null],
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
  });
  pruebaEspecialista = {
    nombre: 'NOMBRE1 APELLIDO1',
    especialidad: 'ESPECIALIDAD 1',
  }
  logoDataUrl: string;
  constructor(private fb: FormBuilder, private toastr: ToastrService, private personaService: EstudiantesService, private saludService: SaludService, private aRoute: ActivatedRoute) { }
  ngOnInit() {
    Utils.getImageDataUrlFromLocalPath1('../../../../assets/images/Escudo_UD.png').then(
      result => this.logoDataUrl = result
    )
    this.saludService.getTipoOdontograma(1).subscribe((data: any) => {
      this.tipoOdontogramaVestabular = data;
    });
    this.saludService.getTipoOdontograma(2).subscribe((data: any) => {
      this.tipoOdontogramaVestibular = data;
    });
    this.saludService.getTipoOdontograma(3).subscribe((data: any) => {
      this.tipoOdontogramaLingualesInfantil = data;
    });
    this.saludService.getTipoOdontograma(4).subscribe((data: any) => {
      this.tipoOdontogramaVestibularInfantil = data;
    });
    this.terceroId = this.aRoute.snapshot.paramMap.get('terceroId');
    this.personaService.getEstudiante(this.saludService.IdPersona).subscribe((data: any) => {
      var paciente = data.datosEstudianteCollection.datosBasicosEstudiante[0];
      this.paciente = paciente.nombre;
    });
    this.getInfoOdontologia();
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
      this.especialidad = data;
    });
    this.saludService.getHistoriaClinica(this.terceroId).subscribe((data: any) => {  ///Remplazar para pruebas
      this.Historia = data[0];
      this.saludService.getHojaHistoria(this.terceroId, 3).subscribe(data => {
        if (JSON.stringify(data[0]) === '{}') {
          this.estado = "nueva";
          this.hideHistory = true;
        } else {
          this.listaHojas = data;
          this.firstOne = data[0].Id;
          this.estado = "vieja";
          this.hideHistory = false;
          this.HojaHistoria = data[0];
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
            this.examenDental = data[0];
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
            this.examenEstomatologico = data[0];
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
            this.diagnostico = data[0];
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
            this.examenesComplementarios = data[0];
            //console.log(this.examenesComplementarios);
            this.odontologiaForm.controls.tp.setValue(this.examenesComplementarios.Tp);
            this.odontologiaForm.controls.tpt.setValue(this.examenesComplementarios.Tpt);
            this.odontologiaForm.controls.coagulacion.setValue(this.examenesComplementarios.Coagulacion);
            this.odontologiaForm.controls.sangria.setValue(this.examenesComplementarios.Sangria);
            this.odontologiaForm.controls.otra.setValue(this.examenesComplementarios.Otra);
          });
        }
      });
    });

  }


  buscarEspecialista() {
    // TODO
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
        Profesional: null,
        Motivo: this.odontologiaForm.controls.motivoConsultaOdonto.value,
        Observacion: this.odontologiaForm.controls.observacionesOdontologia.value,
      }
      this.saludService.postHojaHistoria(hojaHistoria).subscribe(data => {
        //console.log(data);
        this.HojaHistoria = data;
        console.log('Hoja historia: ' + data);
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
            HistoriaClinicaId: this.Historia.Id
          }
          this.saludService.postAnamnesis(anamnesis).subscribe(data => {
            console.log('Anamnesis: ' + data[0]);
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
            HistoriaClinicaId: this.Historia.Id
          }
          this.saludService.putAnamnesis(this.anamnesis.Id, anamnesis).subscribe(data => {
            console.log('Anamnesis: ' + data[0]);
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
          HojaHistoriaId: this.HojaHistoria.Id
        }
        this.saludService.postExamenDental(examenDental).subscribe(data => {
          console.log('ExamenDental: ' + data[0]);
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
          HojaHistoriaId: this.HojaHistoria.Id
        }
        this.saludService.postExamenEstomatologico(examenEstomatologico).subscribe(data => {
          console.log('ExamenEstomatologico: ' + data[0]);
          this.saludService.falloPsico = false;
        }, error => {
          this.saludService.falloPsico = true;
        });
        const examenesComplementarios: ExamenesComplementarios = {
          Id: 0,
          PeriapicalInicio: null,
          PeriapicalFinal: null,
          PanoramicaInicio: null,
          PanoramicaFinal: null,
          OtraInicio: null,
          OtraFinal: null,
          LaboratorioInicio: null,
          LaboratorioFinal: null,
          Tp: this.odontologiaForm.controls.tp.value,     
          Tpt: this.odontologiaForm.controls.tpt.value,             
          Coagulacion: this.odontologiaForm.controls.coagulacion.value,     
          Sangria: this.odontologiaForm.controls.sangria.value,          
          Otra: this.odontologiaForm.controls.otra.value,             
          HistoriaClinicaId: this.Historia.Id,
          HojaHistoriaId: this.HojaHistoria.Id
        }
        this.saludService.postExamenesComplementarios(examenesComplementarios).subscribe(data => {
          console.log('ExamenesComplementarios: ' + data[0]);
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
          HojaHistoriaId: this.HojaHistoria.Id
        }
        this.saludService.postDiagnosticoOdontologia(diagnostico).subscribe(data => {
          console.log('Diagnostico: ' + data[0]);
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
          Diagrama: this.odontogramaVestabular
        };
        this.saludService.postOdontograma(odontogramaVestabular).subscribe(data => {
          console.log('Vestabular: ' + data[0]);
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
          Diagrama: this.odontogramaVestibular
        };
        this.saludService.postOdontograma(odontogramaVestibular).subscribe(data => {
          console.log('Vestibular: ' + data[0]);
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
          Diagrama: this.odontogramaVestibularInfantil
        };
        this.saludService.postOdontograma(odontogramaVestibularInfantil).subscribe(data => {
          console.log('VestibularInfantil: ' + data[0]);
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
          Diagrama: this.odontogramaLingualesInfantil
        };
        this.saludService.postOdontograma(odontogramaLingualesInfantil).subscribe(data => {
          console.log('LingualesInfantil: ' + data[0]);
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
        Profesional: null,
        Motivo: this.odontologiaForm.controls.motivoConsultaOdonto.value,
        Observacion: this.odontologiaForm.controls.observacionesOdontologia.value,
      }
      // console.log(hojaHistoria);
      this.saludService.putHojaHistoria(this.HojaHistoria.Id, hojaHistoria).subscribe(data => {
        console.log('Hoja historia: ' + data);
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
        HistoriaClinicaId: this.Historia.Id
      }
      this.saludService.putAnamnesis(this.anamnesis.Id, anamnesis).subscribe(data => {
        console.log('Anamnesis: ' + data[0]);
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
        HojaHistoriaId: this.HojaHistoria.Id
      }
      this.saludService.putExamenDental(this.examenDental.Id, examenDental).subscribe(data => {
        console.log('ExamenDental: ' + data[0]);
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
        HojaHistoriaId: this.HojaHistoria.Id
      }
      this.saludService.putExamenEstomatologico(this.examenEstomatologico.Id, examenEstomatologico).subscribe(data => {
        console.log('ExamenEstomatologico: ' + data[0]);
        this.saludService.falloPsico = false;
      }, error => {
        this.saludService.falloPsico = true;
      });
      const examenesComplementarios: ExamenesComplementarios = {
        Id: this.examenesComplementarios.Id,
        PeriapicalInicio: null,
        PeriapicalFinal: null,
        PanoramicaInicio: null,
        PanoramicaFinal: null,
        OtraInicio: null,
        OtraFinal: null,
        LaboratorioInicio: null,
        LaboratorioFinal: null,
        Tp: this.odontologiaForm.controls.tp.value,     
        Tpt: this.odontologiaForm.controls.tpt.value,             
        Coagulacion: this.odontologiaForm.controls.coagulacion.value,     
        Sangria: this.odontologiaForm.controls.sangria.value,          
        Otra: this.odontologiaForm.controls.otra.value,             
        HistoriaClinicaId: this.Historia.Id,
        HojaHistoriaId: this.HojaHistoria.Id
      }
      this.saludService.putExamenesComplementarios(this.examenesComplementarios.Id, examenesComplementarios).subscribe(data => {
        console.log('ExamenesComplementarios: ' + data[0]);
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
        HojaHistoriaId: this.HojaHistoria.Id
      }
      this.saludService.putDiagnosticoOdontologia(this.diagnostico.Id, diagnostico).subscribe(data => {
        console.log('Diagnostico: ' + data[0]);
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
        Diagrama: this.odontogramaVestabular
      };
      this.saludService.putOdontograma(odontogramaVestabular.Id, odontogramaVestabular).subscribe(data => {
        console.log('Vestibular: ' + data[0]);
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
        Diagrama: this.odontogramaVestibular
      };
      this.saludService.putOdontograma(odontogramaVestibular.Id, odontogramaVestibular).subscribe(data => {
        console.log('Vestibular: ' + data[0]);
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
        Diagrama: this.odontogramaVestibularInfantil
      };
      this.saludService.putOdontograma(odontogramaVestibularInfantil.Id, odontogramaVestibularInfantil).subscribe(data => {
        console.log('Vestibular: ' + data[0]);
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
        Diagrama: this.odontogramaLingualesInfantil
      };
      this.saludService.putOdontograma(odontogramaLingualesInfantil.Id, odontogramaLingualesInfantil).subscribe(data => {
        console.log('Vestibular: ' + data[0]);
        this.saludService.falloPsico = false;
      }, error => {
        this.saludService.falloPsico = true;
      });

    }
    if (this.saludService.falloPsico === false) {
      this.toastr.success(`Ha registrado con éxito la historia clínica de odontología para: ${this.paciente}`, '¡Guardado!');
      setTimeout(() => {
        window.location.reload();
      },
        1000);
      // window.location.reload();
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
    this.saludService.getHojaHistoriaEspecifica(Id).subscribe(data => {//Reemplazar por terceroId
      //console.log(data);
      this.HojaHistoria = data;
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
        this.examenDental = data[0];
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
        this.examenEstomatologico = data[0];
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
        this.diagnostico = data[0];
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
        this.examenesComplementarios = data[0];
        //console.log(this.examenesComplementarios);
        this.odontologiaForm.controls.tp.setValue(this.examenesComplementarios.Tp);
        this.odontologiaForm.controls.tpt.setValue(this.examenesComplementarios.Tpt);
        this.odontologiaForm.controls.coagulacion.setValue(this.examenesComplementarios.Coagulacion);
        this.odontologiaForm.controls.sangria.setValue(this.examenesComplementarios.Sangria);
        this.odontologiaForm.controls.otra.setValue(this.examenesComplementarios.Otra);
      });
      this.saludService.getOdontograma(this.HojaHistoria.Id, 1).subscribe(data => {
        this.getOdontogramaVestabular = data[0];
        this.odontologiaForm.controls.observacionesVestabular.setValue(this.getOdontogramaVestabular.Observaciones);
      });
      this.saludService.getOdontograma(this.HojaHistoria.Id, 2).subscribe(data => {
        this.getOdontogramaVestibular = data[0];
        this.odontologiaForm.controls.observacionesVestibular.setValue(this.getOdontogramaVestibular.Observaciones);
      });
      this.saludService.getOdontograma(this.HojaHistoria.Id, 3).subscribe(data => {
        this.getOdontogramaLingualesInfantil = data[0];
        this.odontologiaForm.controls.observacionesLingualesInfantil.setValue(this.getOdontogramaLingualesInfantil.Observaciones);
      });
      this.saludService.getOdontograma(this.HojaHistoria.Id, 4).subscribe(data => {
        this.getOdontogramaVestibularInfantil = data[0];
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
  }
  getAnanmesis() {
    this.saludService.getAnanmesis(this.Historia.Id).subscribe(data => {
      this.anamnesis = data[0];
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
  getOdontogramas(){
    this.saludService.getOdontogramas(this.Historia.Id, 1).subscribe(data => {
      this.getOdontogramaVestabular = data[0];
      this.odontologiaForm.controls.observacionesVestabular.setValue(this.getOdontogramaVestabular.Observaciones);
    });
    this.saludService.getOdontogramas(this.Historia.Id, 2).subscribe(data => {
      this.getOdontogramaVestibular = data[0];
      this.odontologiaForm.controls.observacionesVestibular.setValue(this.getOdontogramaVestibular.Observaciones);
    });
    this.saludService.getOdontogramas(this.Historia.Id, 3).subscribe(data => {
      this.getOdontogramaLingualesInfantil = data[0];
      this.odontologiaForm.controls.observacionesLingualesInfantil.setValue(this.getOdontogramaLingualesInfantil.Observaciones);
    });
    this.saludService.getOdontogramas(this.Historia.Id, 4).subscribe(data => {
      this.getOdontogramaVestibularInfantil = data[0];
      this.odontologiaForm.controls.observacionesVestibularInfantil.setValue(this.getOdontogramaVestibularInfantil.Observaciones);
    });
  }
  async openPdf() {
    let fechaActual = new (Date);
    let pipe = new DatePipe('en_US');
   let  myFormattedDate = pipe.transform(fechaActual, 'short');
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
        {text: '\n'+this.odontologiaForm.controls.medicamento.value}
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
