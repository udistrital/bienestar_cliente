import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Evolucion } from '../../../../shared/models/Salud/evolucion.model';
import { HojaHistoria } from '../../../../shared/models/Salud/hojaHistoria.model';
import { SaludService } from '../../../../shared/services/salud.service';
@Component({
  selector: 'ngx-psicologia',
  templateUrl: './psicologia.component.html',
  styleUrls: ['../historia-clinica.component.css']
})
export class PsicologiaComponent implements OnInit {
  idHistoria: number | null;
  evolucion: Evolucion[] = [];
  nuevaEvolucionPsico: FormControl = this.fb.control('', Validators.required);
  psicologiaForm: FormGroup = this.fb.group({
    viveCon: [null, Validators.required],
    difusos: [null, Validators.required],
    claros: [null, Validators.required],
    rigidos: [null, Validators.required],
    actualesFamiliares: [null, Validators.required],
    pasadosFamiliares: [null, Validators.required],
    actualesPersonales: [null, Validators.required],
    pasadosPersonales: [null, Validators.required],
    figurasDeAutoridad: [null, Validators.required],
    pares: [null, Validators.required],
    pareja: [null, Validators.required],
    relacionesSexuales: [null, Validators.required],
    satisfaccion: [null, Validators.required],
    metodoProteccion: [null, Validators.required],
    orientacionSexual: [null, Validators.required],
    economicos: [null, Validators.required],
    judiciales: [null, Validators.required],
    drogas: [null, Validators.required],
    motivoConsultaPsico: [null, Validators.required],
    problematicaActual: [null, Validators.required],
    estiloAfrontamiento: [null, Validators.required],
    comportamientoDuranteConsulta: ['', Validators.required],
    hipotesis: [null, Validators.required],
    acuerdos: [null, Validators.required],
    observacionesPsicologia: [null, Validators.required],
    evolucionPsico: this.fb.array([]),
  })
  pruebaEspecialista = {
    nombre: 'NOMBRE1 APELLIDO1',
    especialidad: 'ESPECIALIDAD 1',
  }
  constructor(private fb: FormBuilder, private toastr: ToastrService, private saludService: SaludService) { }
  ngOnInit() {
    this.getInfoPsicologia();
  }
  get evolucionPsicoArr() {
    return this.psicologiaForm.get('evolucionPsico') as FormArray;
  }
  agregarEvolucionPsico() {
    if (this.nuevaEvolucionPsico.invalid) {
      return
    }
    this.evolucionPsicoArr.push(new FormControl(this.nuevaEvolucionPsico.value, Validators.required));
    this.nuevaEvolucionPsico.reset();
  }
  borrarEvolucionPsico(i: number) {
    this.evolucionPsicoArr.removeAt(i);
  }
  buscarEspecialista() {
    // TODO
  }
  guardarHistoriaPsicologia() {
    const historiaPsicologia: any = {
      viveCon: this.psicologiaForm.get('viveCon').value,
      difusos: this.psicologiaForm.get('difusos').value,
      claros: this.psicologiaForm.get('claros').value,
      rigidos: this.psicologiaForm.get('rigidos').value,
      actualesFamiliares: this.psicologiaForm.get('actualesFamiliares').value,
      pasadosFamiliares: this.psicologiaForm.get('pasadosFamiliares').value,
      actualesPersonales: this.psicologiaForm.get('actualesPersonales').value,
      pasadosPersonales: this.psicologiaForm.get('pasadosPersonales').value,
      figurasDeAutoridad: this.psicologiaForm.get('figurasDeAutoridad').value,
      pares: this.psicologiaForm.get('pares').value,
      pareja: this.psicologiaForm.get('pareja').value,
      relacionesSexuales: this.psicologiaForm.get('relacionesSexuales').value,
      satisfaccion: this.psicologiaForm.get('satisfaccion').value,
      metodoProteccion: this.psicologiaForm.get('metodoProteccion').value,
      orientacionSexual: this.psicologiaForm.get('orientacionSexual').value,
      economicos: this.psicologiaForm.get('economicos').value,
      judiciales: this.psicologiaForm.get('judiciales').value,
      drogas: this.psicologiaForm.get('drogas').value,
      motivoConsultaPsico: this.psicologiaForm.get('motivoConsultaPsico').value,
      problematicaActual: this.psicologiaForm.get('problematicaActual').value,
      estiloAfrontamiento: this.psicologiaForm.get('estiloAfrontamiento').value,
      comportamientoDuranteConsulta: this.psicologiaForm.get('comportamientoDuranteConsulta').value,
      hipotesis: this.psicologiaForm.get('hipotesis').value,
      acuerdos: this.psicologiaForm.get('acuerdos').value,
      observaciones: this.psicologiaForm.get('observacionesPsicologia').value,
      evolucionPsico: this.psicologiaForm.get('evolucionPsico').value,
    }
    this.toastr.success('Ahora conecta todos los servicios xD', '¡Funciona!');
  }
  getInfoPsicologia() {
    this.saludService.getHojaHistoria(this.saludService.IdPersona).subscribe(data => {
      this.idHistoria = data[0].Id;
      this.saludService.getComposicionFamiliar(this.idHistoria).subscribe(data => {
        this.psicologiaForm.controls.viveCon.setValue(data[0].Observaciones);
      });
      this.saludService.getLimites(this.idHistoria).subscribe(data => {
        // console.log(data);
        this.psicologiaForm.controls.difusos.setValue(data[0].Difusos);
        this.psicologiaForm.controls.claros.setValue(data[0].Claros);
        this.psicologiaForm.controls.rigidos.setValue(data[0].Rigidos);
      });
      this.saludService.getAntecedentesPsicologicos(this.idHistoria).subscribe(data => {
        // console.log(data);
        this.psicologiaForm.controls.actualesFamiliares.setValue(data[0].ActualSomatico);
        this.psicologiaForm.controls.pasadosFamiliares.setValue(data[0].PasadoSomatico);
        this.psicologiaForm.controls.actualesPersonales.setValue(data[1].ActualSomatico);
        this.psicologiaForm.controls.pasadosPersonales.setValue(data[1].PasadoSomatico);

      });
      this.saludService.getValoracionInterpersonal(this.idHistoria).subscribe(data => {
        // console.log(data);
        this.psicologiaForm.controls.figurasDeAutoridad.setValue(data[0].Autoridad);
        this.psicologiaForm.controls.pares.setValue(data[0].Pares);
        this.psicologiaForm.controls.pareja.setValue(data[0].Pareja);
        this.psicologiaForm.controls.relacionesSexuales.setValue(data[0].RelacionesSexuales);
        this.psicologiaForm.controls.satisfaccion.setValue(data[0].Satisfaccion);
        this.psicologiaForm.controls.metodoProteccion.setValue(data[0].Proteccion);
        this.psicologiaForm.controls.orientacionSexual.setValue(data[0].Orientacion);
        this.psicologiaForm.controls.economicos.setValue(data[0].Economicos);
        this.psicologiaForm.controls.judiciales.setValue(data[0].Judiciales);
        this.psicologiaForm.controls.drogas.setValue(data[0].Drogas);
        this.psicologiaForm.controls.motivoConsultaPsico.setValue(data[0].Motivo);
      });
      this.saludService.getComportamientoConslta(this.idHistoria).subscribe(data => {
        // console.log(data);
        this.psicologiaForm.controls.problematicaActual.setValue(data[0].Problematica);
        this.psicologiaForm.controls.estiloAfrontamiento.setValue(data[0].Afrontamiento);
        this.psicologiaForm.controls.comportamientoDuranteConsulta.setValue(data[0].Comportamiento);
      });
      this.saludService.getDiagnosticoPsicologia(this.idHistoria).subscribe(data => {
        console.log(data);
        this.psicologiaForm.controls.hipotesis.setValue(data[0].Hipotesis);
        this.psicologiaForm.controls.acuerdos.setValue(data[0].Acuerdo);
        this.psicologiaForm.controls.observacionesPsicologia.setValue(data[0].Observaciones);
        let evolucion = JSON.parse(data[0].Evolucion);
        this.evolucion.push({ ...evolucion });
        let evolucion2 = this.evolucion[0].evolucion;
        this.evolucionPsicoArr.push(new FormControl(evolucion2));
      });
    });
  }

}
