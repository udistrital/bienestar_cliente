import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { EstudiantesService } from '../../../../shared/services/estudiantes.service';
import { SaludService } from '../../../../shared/services/salud.service';
@Component({
  selector: 'ngx-odontologia',
  templateUrl: './odontologia.component.html',
  styleUrls: ['../historia-clinica.component.css']
})
export class OdontologiaComponent implements OnInit {
  paciente: string;
  nuevaEvolucionOdonto: FormControl = this.fb.control('');
  odontologiaForm: FormGroup = this.fb.group({
    motivoConsultaOdonto: [null],
    tratamientoMedico: [null],
    ingestionMedicamentos: [null],
    reaccionesAlergicas: [null],
    hemorragias: [null],
    irradiaciones: [null],
    sinusitis: [null],
    enfermedadesRespiratorias: [''],
    cardiopatias: [null],
    diabetes: [null],
    fiebreReumatica: [null],
    hepatitis: [null],
    hipertensionArterial: [null],
    otrasEnfermedades: [null],
    antecedentesFamiliares: [null],
    cepillado: [null],
    cepilladoCuantas: [null],
    sedaDental: [null],
    sedaDentalCuantas: [null],
    enjuague: [null],
    enjuagueCuantas: [null],
    dulces: [null],
    fuma: [null],
    chicles: [null],
    temperatura: [null],
    pulso: [null],
    tensionArterial: [null],
    respiracion: [null],
    articulacionTemporoMandibula: [''],
    labios: [null],
    lengua: [null],
    paladar: [null],
    pisoBoca: [null],
    carrillos: [null],
    glandulasSalivales: [null],
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
    placaCalcificada: [''],
    oclusion: [null],
    otrosOdonto: [null],
    observaciones: [null],
    ultimaVisitaOdontologo: [null],
    evaluacionEstadoFinal: [null],
    indiceActualVestabular: [null],
    indiceAnteriorVestabular: [null],
    fechaPlacaVestabular: [null],
    indiceActualVestibular: [null],
    indiceAnteriorVestibular: [null],
    fechaPlacaVestibular: [null],
    observacionesVestibular: [null],
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
  constructor(private fb: FormBuilder, private toastr: ToastrService, private personaService: EstudiantesService, private saludService: SaludService) { }
  ngOnInit() {
    this.personaService.getEstudiante(this.saludService.IdPersona).subscribe((data: any) => {
      var paciente = data.datosEstudianteCollection.datosBasicosEstudiante[0];
      this.paciente = paciente.nombre;
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
  buscarEspecialista() {
    // TODO
  }
  guardarHistoriaOdontologia() {
    const historiaOdontologia: any = {
      motivoConsultaOdonto: this.odontologiaForm.get('motivoConsultaOdonto').value,
      tratamientoMedico: this.odontologiaForm.get('tratamientoMedico').value,
      ingestionMedicamentos: this.odontologiaForm.get('ingestionMedicamentos').value,
      reaccionesAlergicas: this.odontologiaForm.get('reaccionesAlergicas').value,
      hemorragias: this.odontologiaForm.get('hemorragias').value,
      irradiaciones: this.odontologiaForm.get('irradiaciones').value,
      sinusitis: this.odontologiaForm.get('sinusitis').value,
      enfermedadesRespiratorias: this.odontologiaForm.get('enfermedadesRespiratorias').value,
      cardiopatias: this.odontologiaForm.get('cardiopatias').value,
      diabetes: this.odontologiaForm.get('diabetes').value,
      fiebreReumatica: this.odontologiaForm.get('fiebreReumatica').value,
      hepatitis: this.odontologiaForm.get('hepatitis').value,
      hipertensionArterial: this.odontologiaForm.get('hipertensionArterial').value,
      otrasEnfermedades: this.odontologiaForm.get('otrasEnfermedades').value,
      antecedentesFamiliares: this.odontologiaForm.get('antecedentesFamiliares').value,
      cepillado: this.odontologiaForm.get('cepillado').value,
      cepilladoCuantas: this.odontologiaForm.get('cepilladoCuantas').value,
      sedaDental: this.odontologiaForm.get('sedaDental').value,
      sedaDentalCuantas: this.odontologiaForm.get('sedaDentalCuantas').value,
      enjuague: this.odontologiaForm.get('enjuague').value,
      enjuagueCuantas: this.odontologiaForm.get('enjuagueCuantas').value,
      dulces: this.odontologiaForm.get('dulces').value,
      fuma: this.odontologiaForm.get('fuma').value,
      chicles: this.odontologiaForm.get('chicles').value,
      temperatura: this.odontologiaForm.get('temperatura').value,
      pulso: this.odontologiaForm.get('pulso').value,
      tensionArterial: this.odontologiaForm.get('tensionArterial').value,
      respiracion: this.odontologiaForm.get('respiracion').value,
      articulacionTemporoMandibula: this.odontologiaForm.get('articulacionTemporoMandibula').value,
      labios: this.odontologiaForm.get('labios').value,
      lengua: this.odontologiaForm.get('lengua').value,
      paladar: this.odontologiaForm.get('paladar').value,
      pisoBoca: this.odontologiaForm.get('pisoBoca').value,
      carrillos: this.odontologiaForm.get('carrillos').value,
      glandulasSalivales: this.odontologiaForm.get('glandulasSalivales').value,
      maxilares: this.odontologiaForm.get('maxilares').value,
      senosMaxilares: this.odontologiaForm.get('senosMaxilares').value,
      musculosMasticadores: this.odontologiaForm.get('musculosMasticadores').value,
      nerviosoOdontologia: this.odontologiaForm.get('nerviosoOdontologia').value,
      vascularOdontologia: this.odontologiaForm.get('vascularOdontologia').value,
      linfaticoRegionalOdontologia: this.odontologiaForm.get('linfaticoRegionalOdontologia').value,
      Supernumerarios: this.odontologiaForm.get('Supernumerarios').value,
      abrasion: this.odontologiaForm.get('abrasion').value,
      manchas: this.odontologiaForm.get('manchas').value,
      patologiaPulpar: this.odontologiaForm.get('patologiaPulpar').value,
      placaBlanda: this.odontologiaForm.get('placaBlanda').value,
      placaCalcificada: this.odontologiaForm.get('placaCalcificada').value,
      oclusion: this.odontologiaForm.get('oclusion').value,
      otrosOdonto: this.odontologiaForm.get('otrosOdonto').value,
      observaciones: this.odontologiaForm.get('observaciones').value,
      ultimaVisitaOdontologo: this.odontologiaForm.get('ultimaVisitaOdontologo').value,
      evaluacionEstadoFinal: this.odontologiaForm.get('evaluacionEstadoFinal').value,
      indiceActualVestabular: this.odontologiaForm.get('indiceActualVestabular').value,
      indiceAnteriorVestabular: this.odontologiaForm.get('indiceAnteriorVestabular').value,
      fechaPlacaVestabular: this.odontologiaForm.get('fechaPlacaVestabular').value,
      indiceActualVestibular: this.odontologiaForm.get('indiceActualVestibular').value,
      indiceAnteriorVestibular: this.odontologiaForm.get('indiceAnteriorVestibular').value,
      fechaPlacaVestibular: this.odontologiaForm.get('fechaPlacaVestibular').value,
      observacionesVestibular: this.odontologiaForm.get('observacionesVestibular').value,
      diagnosticoOdonto: this.odontologiaForm.get('diagnosticoOdonto').value,
      pronosticoOdonto: this.odontologiaForm.get('pronosticoOdonto').value,
      periapicalInicio: this.odontologiaForm.get('periapical1').value,
      periapicalFinal: this.odontologiaForm.get('periapical2').value,
      panoramicaInicio: this.odontologiaForm.get('panoramica1').value,
      panoramicaFinal: this.odontologiaForm.get('panoramica2').value,
      otraInicio: this.odontologiaForm.get('otra1').value,
      otraFinal: this.odontologiaForm.get('otra2').value,
      examenesLaboratorioOdontoInicio: this.odontologiaForm.get('examenesLaboratorioOdonto1').value,
      examenesLaboratorioOdontoFinal: this.odontologiaForm.get('examenesLaboratorioOdonto2').value,
      tp: this.odontologiaForm.get('tp').value,
      tpt: this.odontologiaForm.get('tpt').value,
      coagulacion: this.odontologiaForm.get('coagulacion').value,
      sangria: this.odontologiaForm.get('sangria').value,
      otra: this.odontologiaForm.get('otra').value,
      evolucion: this.odontologiaForm.get('evolucion').value,
      observacionesFinales: this.odontologiaForm.get('observacionesOdontologia').value,
    }

    this.toastr.success(`Ha registrado con éxito la historia clínica de odontología para: ${this.paciente}`, '¡Guardado!');
  }
}
