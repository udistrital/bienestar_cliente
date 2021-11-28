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
@Component({
  selector: 'ngx-odontologia',
  templateUrl: './odontologia.component.html',
  styleUrls: ['../historia-clinica.component.css']
})
export class OdontologiaComponent implements OnInit {
  terceroId: any;
  paciente: string;
  anamnesis: Anamnesis;
  examenDental: ExamenDental;
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
    evolucionOdonto: this.fb.array([]),
  });
  pruebaEspecialista = {
    nombre: 'NOMBRE1 APELLIDO1',
    especialidad: 'ESPECIALIDAD 1',
  }
  constructor(private fb: FormBuilder, private toastr: ToastrService, private personaService: EstudiantesService, private saludService: SaludService, private aRoute: ActivatedRoute) { }
  ngOnInit() {
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
    this.saludService.getHistoriaClinica(this.terceroId).subscribe((data: any) => {  ///Remplazar para pruebas
      this.Historia = data[0];
      this.saludService.getHojaHistoria(this.terceroId).subscribe(data => {
        this.HojaHistoria = data[0];
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
        this.saludService.getExamenDental(this.Historia.Id).subscribe(data => {
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
        this.saludService.getExamenEstomatologico(this.Historia.Id).subscribe(data => {
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
        this.saludService.getDiagnosticoOdontologia(this.Historia.Id).subscribe(data => {
          this.diagnostico = data[0];
          //console.log(this.diagnostico);
          this.odontologiaForm.controls.evaluacionEstadoFinal.setValue(this.diagnostico.Evaluacion);
          this.odontologiaForm.controls.diagnosticoOdonto.setValue(this.diagnostico.Diagnostico);
          this.odontologiaForm.controls.pronosticoOdonto.setValue(this.diagnostico.Pronostico);
          this.odontologiaForm.controls.motivoConsultaOdonto.setValue(this.diagnostico.Motivo);
          this.odontologiaForm.controls.pulso.setValue(this.diagnostico.Pulso);
          this.odontologiaForm.controls.respiracion.setValue(this.diagnostico.Respiracion);
          this.odontologiaForm.controls.temperatura.setValue(this.diagnostico.Temperatura);
          this.odontologiaForm.controls.tensionArterial.setValue(this.diagnostico.TensionArterial);
          this.odontologiaForm.controls.observacionesOdontologia.setValue(this.diagnostico.Observaciones);
          let evolucion = JSON.parse(this.diagnostico.Evolucion) || [];
          this.evolucion.push({ ...evolucion });
          let evolucion2: any = this.evolucion[0].evolucion;
          for (let i = 0; i < evolucion2.length; i++) {
            this.evolucionOdontoArr.push(new FormControl(evolucion2[i]));
          }
        });
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
    }
    if (!this.examenDental) {
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
    }
    if (!this.examenEstomatologico) {
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
    }
    if (!this.diagnostico) {
      const diagnostico: DiagnosticoOdontologia = {
        Id: 0,
        Evaluacion: this.odontologiaForm.controls.evaluacionEstadoFinal.value,
        Evolucion: '{"evolucion":[' + evolucion2 + ']}',
        Diagnostico: this.odontologiaForm.controls.diagnosticoOdonto.value,
        Pronostico: this.odontologiaForm.controls.pronosticoOdonto.value,
        Motivo: this.odontologiaForm.controls.motivoConsultaOdonto.value,
        Pulso: this.odontologiaForm.controls.pulso.value,
        Respiracion: this.odontologiaForm.controls.respiracion.value,
        Temperatura: this.odontologiaForm.controls.temperatura.value,
        TensionArterial: this.odontologiaForm.controls.tensionArterial.value,
        Observaciones: this.odontologiaForm.controls.observacionesOdontologia.value,
        HistoriaClinica: this.Historia.Id,
        HojaHistoriaId: this.HojaHistoria.Id
      }
      this.saludService.postDiagnosticoOdontologia(diagnostico).subscribe(data => {
        console.log('Diagnostico: ' + data[0]);
        this.saludService.falloPsico = false;
      }, error => {
        this.saludService.falloPsico = true;
      });
    }
    if (this.anamnesis) {
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
    if (this.examenDental) {
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
    }
    if (this.examenEstomatologico) {
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
    }
    if (this.diagnostico) {
      const diagnostico: DiagnosticoOdontologia = {
        Id: this.diagnostico.Id,
        Evaluacion: this.odontologiaForm.controls.evaluacionEstadoFinal.value,
        Evolucion: '{"evolucion":[' + evolucion2 + ']}',
        Diagnostico: this.odontologiaForm.controls.diagnosticoOdonto.value,
        Pronostico: this.odontologiaForm.controls.pronosticoOdonto.value,
        Motivo: this.odontologiaForm.controls.motivoConsultaOdonto.value,
        Pulso: this.odontologiaForm.controls.pulso.value,
        Respiracion: this.odontologiaForm.controls.respiracion.value,
        Temperatura: this.odontologiaForm.controls.temperatura.value,
        TensionArterial: this.odontologiaForm.controls.tensionArterial.value,
        Observaciones: this.odontologiaForm.controls.observacionesOdontologia.value,
        HistoriaClinica: this.Historia.Id,
        HojaHistoriaId: this.HojaHistoria.Id
      }
      this.saludService.putDiagnosticoOdontologia(this.diagnostico.Id, diagnostico).subscribe(data => {
        console.log('Diagnostico: ' + data[0]);
        this.saludService.falloPsico = false;
      }, error => {
        this.saludService.falloPsico = true;
      });
    }


    if (this.saludService.falloPsico === false) {
      this.toastr.success(`Ha registrado con éxito la historia clínica de odontología para: ${this.paciente}`, '¡Guardado!');
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
}
