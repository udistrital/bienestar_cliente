import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'ngx-medicina',
  templateUrl: './medicina.component.html',
  styleUrls: ['../historia-clinica.component.css']
})
export class MedicinaComponent implements OnInit {
  nuevoAnalisis: FormControl = this.fb.control('', Validators.required);
  nuevaEvolucion: FormControl = this.fb.control('', Validators.required);
  medicinaForm: FormGroup = this.fb.group({
    motivoConsulta: [null, Validators.required],
    patologicos: [null, Validators.required],
    hospitalarios: [null, Validators.required],
    traumaticos: [null, Validators.required],
    quirurgicos: [null, Validators.required],
    genitoUrinarios: [null, Validators.required],
    alergicos: [null, Validators.required],
    farmacologicos: [null, Validators.required],
    familiares: [null, Validators.required],
    ocupacionales: [null, Validators.required],
    menarquia: [null, Validators.required],
    fur: [null, Validators.required],
    ciclos: [null, Validators.required],
    ias: [null, Validators.required],
    compañeros: [null, Validators.required],
    fo: [null, Validators.required],
    fup: [null, Validators.required],
    pp: [null, Validators.required],
    fuccv: [null, Validators.required],
    resultadoccv: [null, Validators.required],
    examenSeno: [null, Validators.required],
    resultadoSeno: [null, Validators.required],
    piel: [null, Validators.required],
    colageno: [null, Validators.required],
    linfatico: [null, Validators.required],
    oseo: [null, Validators.required],
    muscular: [null, Validators.required],
    articular: [null, Validators.required],
    digestivo: [null, Validators.required],
    urinario: [null, Validators.required],
    sentidos: [null, Validators.required],
    cardioVascular: [null, Validators.required],
    neurologico: [null, Validators.required],
    respiratorio: [null, Validators.required],
    examenes: [null, Validators.required],
    ta: [null, Validators.required],
    fc: [null, Validators.required],
    fr: [null, Validators.required],
    sao2: [null, Validators.required],
    peso: [null, Validators.required],
    imc: [null, Validators.required],
    talla: [null, Validators.required],
    tc: [null, Validators.required],
    estadoGeneral: [null, Validators.required],
    cabezaYCuello: [null, Validators.required],
    orl: [null, Validators.required],
    ojos: [null, Validators.required],
    torax: [null, Validators.required],
    ruidosRespiratorios: [null, Validators.required],
    ruidosCardiacos: [null, Validators.required],
    abdomen: [null, Validators.required],
    neurologicoE: [null, Validators.required],
    genital: [null, Validators.required],
    extremidades: [null, Validators.required],
    id1: [null, Validators.required],
    id2: [null, Validators.required],
    id3: [null, Validators.required],
    id4: [null, Validators.required],
    analisis: this.fb.array([]),
    evolucion: this.fb.array([]),
    planDeManejo: [null, Validators.required],
    observacionesMedicina: [null, Validators.required]
  });
  pruebaEspecialista = {
    nombre: 'NOMBRE1 APELLIDO1',
    especialidad: 'ESPECIALIDAD 1',
  }
  constructor(private fb: FormBuilder, private toastr: ToastrService) { }
  ngOnInit() {
  }
  get analisisArr() {
    return this.medicinaForm.get('analisis') as FormArray;
  }
  get evolucionArr() {
    return this.medicinaForm.get('evolucion') as FormArray;
  }
  agregarAnalisis() {
    if (this.nuevoAnalisis.invalid) {
      return
    }
    this.analisisArr.push(new FormControl(this.nuevoAnalisis.value, Validators.required));
    this.nuevoAnalisis.reset();
  }
  agregarEvolucion() {
    if (this.nuevaEvolucion.invalid) {
      return
    }
    this.evolucionArr.push(new FormControl(this.nuevaEvolucion.value, Validators.required));
    this.nuevaEvolucion.reset();
  }
  borrarAnalisis(i: number) {
    this.analisisArr.removeAt(i);
  }
  borrarEvolucion(i: number) {
    this.evolucionArr.removeAt(i);
  }
  buscarEspecialista() {
    // TODO
  }
  guardarHistoriaMedicina() {
    const historiaMedicina: any = {
      motivoConsulta: this.medicinaForm.get('motivoConsulta').value,
      patologicos: this.medicinaForm.get('patologicos').value,
      hospitalarios: this.medicinaForm.get('hospitalarios').value,
      traumaticos: this.medicinaForm.get('traumaticos').value,
      quirurgicos: this.medicinaForm.get('quirurgicos').value,
      genitoUrinarios: this.medicinaForm.get('genitoUrinarios').value,
      alergicos: this.medicinaForm.get('alergicos').value,
      farmacologicos: this.medicinaForm.get('farmacologicos').value,
      familiares: this.medicinaForm.get('familiares').value,
      ocupacionales: this.medicinaForm.get('ocupacionales').value,
      menarquia: this.medicinaForm.get('menarquia').value,
      fur: this.medicinaForm.get('fur').value,
      ciclos: this.medicinaForm.get('ciclos').value,
      ias: this.medicinaForm.get('ias').value,
      compañeros: this.medicinaForm.get('compañeros').value,
      fo: this.medicinaForm.get('fo').value,
      fup: this.medicinaForm.get('fup').value,
      pp: this.medicinaForm.get('pp').value,
      fuccv: this.medicinaForm.get('fuccv').value,
      resultadoccv: this.medicinaForm.get('resultadoccv').value,
      examenSeno: this.medicinaForm.get('examenSeno').value,
      resultadoSeno: this.medicinaForm.get('resultadoSeno').value,
      piel: this.medicinaForm.get('piel').value,
      colageno: this.medicinaForm.get('colageno').value,
      linfatico: this.medicinaForm.get('linfatico').value,
      oseo: this.medicinaForm.get('oseo').value,
      muscular: this.medicinaForm.get('muscular').value,
      articular: this.medicinaForm.get('articular').value,
      digestivo: this.medicinaForm.get('digestivo').value,
      urinario: this.medicinaForm.get('urinario').value,
      sentidos: this.medicinaForm.get('sentidos').value,
      cardioVascular: this.medicinaForm.get('cardioVascular').value,
      neurologico: this.medicinaForm.get('neurologico').value,
      respiratorio: this.medicinaForm.get('respiratorio').value,
      examenes: this.medicinaForm.get('examenes').value,
      ta: this.medicinaForm.get('ta').value,
      fc: this.medicinaForm.get('fc').value,
      fr: this.medicinaForm.get('fr').value,
      sao2: this.medicinaForm.get('sao2').value,
      peso: this.medicinaForm.get('peso').value,
      imc: this.medicinaForm.get('imc').value,
      talla: this.medicinaForm.get('talla').value,
      tc: this.medicinaForm.get('tc').value,
      estadoGeneral: this.medicinaForm.get('estadoGeneral').value,
      cabezaYCuello: this.medicinaForm.get('cabezaYCuello').value,
      orl: this.medicinaForm.get('orl').value,
      ojos: this.medicinaForm.get('ojos').value,
      torax: this.medicinaForm.get('torax').value,
      ruidosRespiratorios: this.medicinaForm.get('ruidosRespiratorios').value,
      ruidosCardiacos: this.medicinaForm.get('ruidosCardiacos').value,
      abdomen: this.medicinaForm.get('abdomen').value,
      neurologicoE: this.medicinaForm.get('neurologicoE').value,
      genital: this.medicinaForm.get('genital').value,
      extremidades: this.medicinaForm.get('extremidades').value,
      id1: this.medicinaForm.get('id1').value,
      id2: this.medicinaForm.get('id2').value,
      id3: this.medicinaForm.get('id3').value,
      id4: this.medicinaForm.get('id4').value,
      analisis: this.medicinaForm.get('analisis').value,
      observaciones: this.medicinaForm.get('observacionesMedicina').value,
      evolucion: this.medicinaForm.get('evolucion').value,
      planDeManejo: this.medicinaForm.get('planDeManejo').value,
    }
    this.toastr.success('Ahora conecta todos los servicios xD', '¡Funciona!');
  }
}
