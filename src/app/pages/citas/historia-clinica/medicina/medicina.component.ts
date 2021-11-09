import { toBase64String } from '@angular/compiler/src/output/source_map';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Analisis } from '../../../../shared/models/Salud/analisis.model';
import { Antecedente } from '../../../../shared/models/Salud/antecedente.model';
import { Diagnostico } from '../../../../shared/models/Salud/diagnostico.model';
import { Evolucion } from '../../../../shared/models/Salud/evolucion.model';
import { Examen } from '../../../../shared/models/Salud/examen.model';
import { HistoriaClinica } from '../../../../shared/models/Salud/historiaClinica.model';
import { HojaHistoria } from '../../../../shared/models/Salud/hojaHistoria.model';
import { Sistemas } from '../../../../shared/models/Salud/sistemas.model';
import { EstudiantesService } from '../../../../shared/services/estudiantes.service';
import { SaludService } from '../../../../shared/services/salud.service';
@Component({
  selector: 'ngx-medicina',
  templateUrl: './medicina.component.html',
  styleUrls: ['../historia-clinica.component.css']
})
export class MedicinaComponent implements OnInit {
  idHistoria: number | null;
  historiaClinica: HistoriaClinica;
  hojaHistoria: HojaHistoria | null;
  antecedentes: Antecedente | null;
  sistemas: Sistemas | null;
  diagnostico: Diagnostico | null;
  examenes: Examen | null;
  evolucion: Evolucion[] = [];
  analisis: Analisis[] = [];
  paciente: string;
  nuevoAnalisis: FormControl = this.fb.control('');
  nuevaEvolucion: FormControl = this.fb.control('');
  medicinaForm: FormGroup = this.fb.group({
    motivoConsulta: [null],
    patologicos: [null],
    hospitalarios: [null],
    traumaticos: [null],
    quirurgicos: [null],
    genitoUrinarios: [null],
    alergicos: [null],
    farmacologicos: [null],
    familiares: [null],
    ocupacionales: [null],
    menarquia: [null],
    fur: [null],
    ciclos: [null],
    ias: [null],
    compañeros: [null],
    fo: [null],
    fup: [null],
    pp: [null],
    fuccv: [null],
    resultadoccv: [null],
    examenSeno: [null],
    resultadoSeno: [null],
    piel: [null],
    colageno: [null],
    linfatico: [null],
    oseo: [null],
    muscular: [null],
    articular: [null],
    digestivo: [null],
    urinario: [null],
    sentidos: [null],
    cardioVascular: [null],
    neurologico: [null],
    respiratorio: [null],
    examenes: [null],
    ta: [null],
    fc: [null],
    fr: [null],
    sao2: [null],
    peso: [null],
    imc: [null],
    talla: [null],
    tc: [null],
    estadoGeneral: [null],
    cabezaYCuello: [null],
    orl: [null],
    ojos: [null],
    torax: [null],
    ruidosRespiratorios: [null],
    ruidosCardiacos: [null],
    abdomen: [null],
    neurologicoE: [null],
    genital: [null],
    extremidades: [null],
    diagnostico: [null],
    analisis: this.fb.array([]),
    evolucion: this.fb.array([]),
    planDeManejo: [null],
    observacionesMedicina: [null]
  });
  pruebaEspecialista = {
    nombre: 'NOMBRE1 APELLIDO1',
    especialidad: 'ESPECIALIDAD 1',
  }
  constructor(private fb: FormBuilder, private toastr: ToastrService, private saludService: SaludService, private personaService: EstudiantesService) { }

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
    this.analisisArr.push(new FormControl(this.nuevoAnalisis.value));
    this.nuevoAnalisis.reset();
  }
  agregarEvolucion() {
    if (this.nuevaEvolucion.invalid) {
      return
    }
    this.evolucionArr.push(new FormControl(this.nuevaEvolucion.value));
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
  //Formulario para guardar en la DB

  ngOnInit() {
    this.personaService.getEstudiante(this.saludService.IdPersona).subscribe((data: any) => {
      var paciente = data.datosEstudianteCollection.datosBasicosEstudiante[0];
      this.paciente = paciente.nombre;
    });
    this.getInfoHistoria();
  }

  getInfoHistoria() {
    this.saludService.getHistoriaClinica(this.saludService.terceroId).subscribe((data: any) => {
      this.historiaClinica = data[0];
      this.idHistoria = data[0].Id;
      //HojaHistoria
      this.saludService.getHojaHistoria(this.saludService.IdPersona).subscribe(data => {
        // console.log(this.saludService.IdPersona);
        this.hojaHistoria = data[0];
        this.medicinaForm.controls.motivoConsulta.setValue(this.hojaHistoria.Motivo);
        this.medicinaForm.controls.observacionesMedicina.setValue(this.hojaHistoria.Observacion);
        let evolucion = JSON.parse(this.hojaHistoria.Evolucion);
        this.evolucion.push({ ...evolucion });
        let evolucion2 = this.evolucion[0].evolucion;
        for (let i = 0; i < evolucion2.length; i++) {
          this.evolucionArr.push(new FormControl(evolucion2[i]));
        }
        // this.idHistoria = this.hojaHistoria.HistoriaClinica.Id;
        this.saludService.IdHistoria = this.idHistoria;
        //Antecedente
        this.saludService.getAntecedente(this.hojaHistoria.HistoriaClinica.Id).subscribe(data => {
          this.antecedentes = data;
          // console.log(this.antecedentes);
          this.medicinaForm.controls.patologicos.setValue(this.antecedentes[0].Observaciones);
          this.medicinaForm.controls.hospitalarios.setValue(this.antecedentes[1].Observaciones);
          this.medicinaForm.controls.quirurgicos.setValue(this.antecedentes[2].Observaciones);
          this.medicinaForm.controls.genitoUrinarios.setValue(this.antecedentes[3].Observaciones);
          this.medicinaForm.controls.traumaticos.setValue(this.antecedentes[4].Observaciones);
          this.medicinaForm.controls.alergicos.setValue(this.antecedentes[5].Observaciones);
          this.medicinaForm.controls.farmacologicos.setValue(this.antecedentes[6].Observaciones);
          this.medicinaForm.controls.familiares.setValue(this.antecedentes[7].Observaciones);
          this.medicinaForm.controls.ocupacionales.setValue(this.antecedentes[8].Observaciones);
        });
        //Sistemas
        this.saludService.getSistema(this.hojaHistoria.HistoriaClinica.Id).subscribe(data => {
          // console.log(data);
          this.sistemas = data;
          this.medicinaForm.controls.piel.setValue(this.sistemas[0].Observacion);
          this.medicinaForm.controls.colageno.setValue(this.sistemas[1].Observacion);
          this.medicinaForm.controls.linfatico.setValue(this.sistemas[2].Observacion);
          this.medicinaForm.controls.oseo.setValue(this.sistemas[3].Observacion);
          this.medicinaForm.controls.muscular.setValue(this.sistemas[4].Observacion);
          this.medicinaForm.controls.articular.setValue(this.sistemas[5].Observacion);
          this.medicinaForm.controls.digestivo.setValue(this.sistemas[6].Observacion);
          this.medicinaForm.controls.urinario.setValue(this.sistemas[7].Observacion);
          this.medicinaForm.controls.sentidos.setValue(this.sistemas[8].Observacion);
          this.medicinaForm.controls.cardioVascular.setValue(this.sistemas[9].Observacion);
          this.medicinaForm.controls.neurologico.setValue(this.sistemas[10].Observacion);
          this.medicinaForm.controls.respiratorio.setValue(this.sistemas[11].Observacion);
        });
        //Exámenes
        this.saludService.getExamen(this.hojaHistoria.HistoriaClinica.Id).subscribe(data => {
          // console.log(data);
          this.examenes = data;
          this.medicinaForm.controls.examenes.setValue(this.examenes[0].Observacion);
          this.medicinaForm.controls.ta.setValue(this.examenes[1].Observacion);
          this.medicinaForm.controls.fc.setValue(this.examenes[2].Observacion);
          this.medicinaForm.controls.sao2.setValue(this.examenes[3].Observacion);
          this.medicinaForm.controls.imc.setValue(this.examenes[4].Observacion);
          this.medicinaForm.controls.fr.setValue(this.examenes[5].Observacion);
          this.medicinaForm.controls.tc.setValue(this.examenes[6].Observacion);
          this.medicinaForm.controls.peso.setValue(this.examenes[7].Observacion);
          this.medicinaForm.controls.talla.setValue(this.examenes[8].Observacion);
          this.medicinaForm.controls.estadoGeneral.setValue(this.examenes[9].Observacion);
          this.medicinaForm.controls.cabezaYCuello.setValue(this.examenes[10].Observacion);
          this.medicinaForm.controls.orl.setValue(this.examenes[11].Observacion);
          this.medicinaForm.controls.ojos.setValue(this.examenes[12].Observacion);
          this.medicinaForm.controls.torax.setValue(this.examenes[13].Observacion);
          this.medicinaForm.controls.ruidosRespiratorios.setValue(this.examenes[14].Observacion);
          this.medicinaForm.controls.ruidosCardiacos.setValue(this.examenes[15].Observacion);
          this.medicinaForm.controls.abdomen.setValue(this.examenes[16].Observacion);
          this.medicinaForm.controls.neurologicoE.setValue(this.examenes[17].Observacion);
          this.medicinaForm.controls.genital.setValue(this.examenes[18].Observacion);
          this.medicinaForm.controls.extremidades.setValue(this.examenes[19].Observacion);
        });
        //Diagnostico
        this.saludService.getDiagnostico(this.hojaHistoria.HistoriaClinica.Id).subscribe(data => {
          // console.log(data[0]);
          this.diagnostico = data[0];
          this.medicinaForm.controls.diagnostico.setValue(this.diagnostico.Descripcion);
          this.medicinaForm.controls.planDeManejo.setValue(this.diagnostico.PlanDeManejo);
          let analisis = JSON.parse(this.diagnostico.Analisis);
          this.analisis.push({ ...analisis });
          let analisis2 = this.analisis[0].analisis;
          for (let i = 0; i < analisis2.length; i++) {
            this.analisisArr.push(new FormControl(analisis2[i]));
          }
        });
      });
    });
  }

  guardarHistoriaMedicina() {
    let evolucionCorregida = JSON.stringify(this.evolucionArr.value);
    let evolucion = evolucionCorregida.slice(1, evolucionCorregida.length - 1);
    let evolucion2 = evolucion.replace(/]/g, "").replace(/\[/g, "");

    let analisisCorregido = JSON.stringify(this.analisisArr.value);
    let analisis = analisisCorregido.slice(1, analisisCorregido.length - 1);
    let analisis2 = analisis.replace(/]/g, "").replace(/\[/g, "");
    //POSTS
    if (this.hojaHistoria.Id === null || this.hojaHistoria.Id === undefined) {
      // || !this.antecedentes || !this.sistemas || !this.diagnostico || !this.examenes
      const hojaHistoria: HojaHistoria = {
        Id: null,
        HistoriaClinica: this.historiaClinica,
        Diagnostico: this.medicinaForm.get('diagnostico').value,
        Evolucion: '{"evolucion":[' + evolucion2 + ']}',
        FechaConsulta: new Date(),
        Especialidad: 1,
        Persona: this.saludService.IdPersona,
        Profesional: null,
        Motivo: this.medicinaForm.get('motivoConsulta').value,
        Observacion: this.medicinaForm.get('observacionesMedicina').value,
      }
      // console.log(hojaHistoria);
      this.saludService.postHojaHistoria(hojaHistoria).subscribe(data => {
        console.log('Hoja historia: ' + data[0]);
        this.saludService.falloMedicina = false;
      }, error => {
        this.saludService.falloMedicina = true;
      });
      this.getInfoHistoria();
    }
    //Diagnostico
    if (!this.diagnostico) {

      setTimeout(() => {
        const diagnostico: Diagnostico = {
          Id: 0,
          HistoriaClinica: this.historiaClinica,
          HojaHistoria: { Id: this.hojaHistoria.Id },
          Activo: true,
          Analisis: '{"analisis":[' + analisis2 + ']}',
          Descripcion: this.medicinaForm.get('diagnostico').value,
          FechaCreacion: new Date(),
          FechaModificacion: new Date(),
          Nombre: null,
          Numero: null,
          PlanDeManejo: this.medicinaForm.get('planDeManejo').value,
        }
        this.saludService.postDiagnostico(diagnostico).subscribe(data => {
          console.log('Diagnóstico: ' + data[0]);
          this.saludService.falloMedicina = false;
        }, error => {
          this.saludService.falloMedicina = true;
        });
      }, 2000);
    }
    // this.toastr.success(`Ha registrado con éxito la historia clínica de medicina para: ${this.paciente}`, '¡Guardado!');

    //PUTS
    //Hoja historia clínica
    if (this.hojaHistoria.Id !== null && this.hojaHistoria.Id !== undefined) {
      const hojaHistoria: HojaHistoria = {
        Id: this.hojaHistoria.Id,
        HistoriaClinica: { Id: this.idHistoria },
        Diagnostico: this.medicinaForm.get('diagnostico').value,
        Evolucion: '{"evolucion":[' + evolucion2 + ']}',
        FechaConsulta: new Date(),
        Especialidad: this.hojaHistoria.Especialidad,
        Persona: this.hojaHistoria.Persona,
        Profesional: this.hojaHistoria.Profesional,
        Motivo: this.medicinaForm.get('motivoConsulta').value,
        Observacion: this.medicinaForm.get('observacionesMedicina').value,
      }
      // console.log(hojaHistoria);
      // this.saludService.putHojaHistoria(this.idHistoria, hojaHistoria).subscribe((data) => {
      //   console.log('Hoja historia: ' + data);
      //   this.saludService.falloPsico = false;
      // }, error => {
      //   this.saludService.falloPsico = true;
      // });
      //Sistemas
    }
    //Antecedentes
    if (this.antecedentes) {
      // const antecedente: Antecedente = {
      //   Id: this.antecedentes.Id,
      //   HistoriaClinica: {Id: this.idHistoria},
      //   TipoAntecedente?: TipoAntecedente,
      //   Observaciones?: string,
      // }
    }
    if (this.sistemas) {
      //    const sistema1: Sistemas = {
      //   HojaHistoria: hojaHistoria,
      //   HistoriaClinica: { Id: this.idHistoria },
      //   Id: this.sistemas.Id,
      //   TipoSistema: { Id: 1 },
      //   Observacion: this.medicinaForm.get('piel').value,
      // }
      // const sistema2: Sistemas = {
      //   HojaHistoria: hojaHistoria,
      //   HistoriaClinica: { Id: this.idHistoria },
      //   Id: this.sistemas.Id,
      //   TipoSistema: { Id: 2 },
      //   Observacion: this.medicinaForm.get('colageno').value,
      // this.saludService.putSistema(this.idHistoria, sistema1).subscribe((data) => {
      //   console.log('Sistema: ' + data);
      //   this.saludService.falloMedicina = false;
      // }, error => {
      //   this.saludService.falloPsico = true;
      // });
    }

    if (this.diagnostico) {
      //Diagnostico
      const diagnostico: Diagnostico = {
        Id: this.diagnostico.Id,
        HistoriaClinica: { Id: this.idHistoria },
        HojaHistoria: { Id: this.hojaHistoria.Id },
        Activo: this.diagnostico.Activo,
        Analisis: '{"analisis":[' + analisis2 + ']}',
        Descripcion: this.medicinaForm.get('diagnostico').value,
        FechaCreacion: this.diagnostico.FechaCreacion,
        FechaModificacion: new Date(),
        Nombre: this.diagnostico.Nombre,
        Numero: this.diagnostico.Numero,
        PlanDeManejo: this.medicinaForm.get('planDeManejo').value,
      }
      // console.log(diagnostico);
      // this.saludService.putDiagnostico(this.idHistoria, diagnostico).subscribe((data) => {
      //   console.log('Diagnostico: ' + data);
      //   this.saludService.falloMedicina = false;
      // }, error => {
      //   this.saludService.falloMedicina = true;
      // });
    }
    if (this.examenes) {


    }

    if (this.saludService.falloMedicina === false) {
      this.toastr.success(`Ha registrado con éxito la historia clínica de psicología para: ${this.paciente}`, '¡Guardado!');
    } else {
      this.toastr.error('Ha ocurrido un error al guardar la historia clínica', 'Error');
    }
  }
}

