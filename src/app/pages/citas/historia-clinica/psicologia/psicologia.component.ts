import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'ngx-psicologia',
  templateUrl: './psicologia.component.html',
  styleUrls: ['../historia-clinica.component.css']
})
export class PsicologiaComponent implements OnInit {
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
  constructor(private fb: FormBuilder, private toastr: ToastrService) { }
  ngOnInit() {
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

}
