import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'ngx-odontologia',
  templateUrl: './odontologia.component.html',
  styleUrls: ['../historia-clinica.component.css']
})
export class OdontologiaComponent implements OnInit {
  nuevaEvolucionOdonto: FormControl = this.fb.control('', Validators.required);
  odontologiaForm: FormGroup = this.fb.group({
    motivoConsultaOdonto: [null, Validators.required],
    tratamientoMedico: [null, Validators.required],
    ingestionMedicamentos: [null, Validators.required],
    reaccionesAlergicas: [null, Validators.required],
    hemorragias: [null, Validators.required],
    irradiaciones: [null, Validators.required],
    sinusitis: [null, Validators.required],
    enfermedadesRespiratorias: ['', Validators.required],
    cardiopatias: [null, Validators.required],
    diabetes: [null, Validators.required],
    fiebreReumatica: [null, Validators.required],
    hepatitis: [null, Validators.required],
    hipertensionArterial: [null, Validators.required],
    otrasEnfermedades: [null, Validators.required],
    antecedentesFamiliares: [null, Validators.required],
    cepillado: [null, Validators.required],
    cepilladoCuantas: [null, Validators.required],
    sedaDental: [null, Validators.required],
    sedaDentalCuantas: [null, Validators.required],
    enjuague: [null, Validators.required],
    enjuagueCuantas: [null, Validators.required],
    dulces: [null, Validators.required],
    fuma: [null, Validators.required],
    chicles: [null, Validators.required],
    temperatura: [null, Validators.required],
    pulso: [null, Validators.required],
    tensionArterial: [null, Validators.required],
    respiracion: [null, Validators.required],
    articulacionTemporoMandibula: ['', Validators.required],
    labios: [null, Validators.required],
    lengua: [null, Validators.required],
    paladar: [null, Validators.required],
    pisoBoca: [null, Validators.required],
    carrillos: [null, Validators.required],
    glandulasSalivales: [null, Validators.required],
    maxilares: [null, Validators.required],
    senosMaxilares: [null, Validators.required],
    musculosMasticadores: [null, Validators.required],
    nerviosoOdontologia: [null, Validators.required],
    vascularOdontologia: [null, Validators.required],
    linfaticoRegionalOdontologia: [null, Validators.required],
    Supernumerarios: [null, Validators.required],
    abrasion: [null, Validators.required],
    manchas: [null, Validators.required],
    patologiaPulpar: [null, Validators.required],
    placaBlanda: [null, Validators.required],
    placaCalcificada: ['', Validators.required],
    oclusion: [null, Validators.required],
    otrosOdonto: [null, Validators.required],
    observaciones: [null, Validators.required],
    ultimaVisitaOdontologo: [null, Validators.required],
    evaluacionEstadoFinal: [null, Validators.required],
    indiceActualVestabular: [null, Validators.required],
    indiceAnteriorVestabular: [null, Validators.required],
    fechaPlacaVestabular: [null, Validators.required],
    indiceActualVestibular: [null, Validators.required],
    indiceAnteriorVestibular: [null, Validators.required],
    fechaPlacaVestibular: [null, Validators.required],
    observacionesVestibular: [null, Validators.required],
    diagnosticoOdonto: [null, Validators.required],
    pronosticoOdonto: [null, Validators.required],
    periapicalInicio: [null, Validators.required],
    periapicalFinal: [null, Validators.required],
    panoramicaInicio: [null, Validators.required],
    panoramicaFinal: [null, Validators.required],
    otraInicio: [null, Validators.required],
    otraFinal: [null, Validators.required],
    examenesLaboratorioOdontoInicio: [null, Validators.required],
    examenesLaboratorioOdontoFinal: [null, Validators.required],
    tp: [null, Validators.required],
    tpt: [null, Validators.required],
    coagulacion: [null, Validators.required],
    sangria: [null, Validators.required],
    otra: [null, Validators.required],
    observacionesOdontologia: [null, Validators.required],
    evolucionOdonto: this.fb.array([]),
  });
  pruebaEspecialista = {
    nombre: 'NOMBRE1 APELLIDO1',
    especialidad: 'ESPECIALIDAD 1',
  }
  constructor(private fb: FormBuilder, private toastr: ToastrService) { }
  ngOnInit() {
  }
  get evolucionOdontoArr() {
    return this.odontologiaForm.get('evolucionOdonto') as FormArray;
  }
  agregarEvolucionOdonto() {
    if (this.nuevaEvolucionOdonto.invalid) {
      return
    }
    this.evolucionOdontoArr.push(new FormControl(this.nuevaEvolucionOdonto.value, Validators.required));
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

    this.toastr.success('Ahora conecta todos los servicios xD', '¡Funciona!');
  }
}
