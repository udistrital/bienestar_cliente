import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, NumberValueAccessor, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Evolucion } from '../../../../shared/models/Salud/evolucion.model';
import { AntecedentePsicologia } from '../../../../shared/models/Salud/antecedentePsicologia.model';
import { EstudiantesService } from '../../../../shared/services/estudiantes.service';
import { SaludService } from '../../../../shared/services/salud.service';
import { ComportamientoConsulta } from '../../../../shared/models/Salud/comportamientoConsulta.model';
import { ComposicionFamiliar } from '../../../../shared/models/Salud/composicionFamiliar.model';
import { DiagnosticoPsicologia } from '../../../../shared/models/Salud/DiagnosticoPsicologia.model';
import { Limites } from '../../../../shared/models/Salud/limites.model';
import { ValoracionInterpersonal } from '../../../../shared/models/Salud/valoracionInterpersonal.model';
import { HistoriaClinica } from '../../../../shared/models/Salud/historiaClinica.model';
import { HojaHistoria } from '../../../../shared/models/Salud/hojaHistoria.model';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'ngx-psicologia',
  templateUrl: './psicologia.component.html',
  styleUrls: ['../historia-clinica.component.css']
})
export class PsicologiaComponent implements OnInit {
  relaciones: any;
  terceroId: any;
  Historia: HistoriaClinica;
  HojaHistoria: HojaHistoria;
  evolucion: Evolucion[] = [];
  paciente: string;
  antecedentes: AntecedentePsicologia;
  comportamiento: ComportamientoConsulta;
  composicion: ComposicionFamiliar;
  diagnostico: DiagnosticoPsicologia;
  limites: Limites;
  valoracion: ValoracionInterpersonal;
  nuevaEvolucionPsico: FormControl = this.fb.control('');
  psicologiaForm: FormGroup = this.fb.group({
    viveCon: [null],
    difusos: [null],
    claros: [null],
    rigidos: [null],
    actualesFamiliares: [null],
    pasadosFamiliares: [null],
    actualesPersonales: [null],
    pasadosPersonales: [null],
    figurasDeAutoridad: [null],
    pares: [null],
    pareja: [null],
    relacionesSexuales: [true],
    satisfaccion: [null],
    metodoProteccion: [null],
    orientacionSexual: [null],
    economicos: [null],
    judiciales: [null],
    drogas: [null],
    motivoConsultaPsico: [null],
    problematicaActual: [null],
    estiloAfrontamiento: [null],
    comportamientoDuranteConsulta: [''],
    hipotesis: [null],
    acuerdos: [null],
    observacionesPsicologia: [null],
    evolucionPsico: this.fb.array([]),
  })
  pruebaEspecialista = {
    nombre: 'NOMBRE1 APELLIDO1',
    especialidad: 'ESPECIALIDAD 1',
  }
  constructor(private fb: FormBuilder, private toastr: ToastrService, private saludService: SaludService, private personaService: EstudiantesService, private aRoute: ActivatedRoute) { }
  ngOnInit() {
    this.terceroId = this.aRoute.snapshot.paramMap.get('terceroId');
    this.personaService.getEstudiante(this.saludService.IdPersona).subscribe((data: any) => {
      var paciente = data.datosEstudianteCollection.datosBasicosEstudiante[0];
      this.paciente = paciente.nombre;
    });
    this.getInfoPsicologia();
  }
  get evolucionPsicoArr() {
    return this.psicologiaForm.get('evolucionPsico') as FormArray;
  }
  agregarEvolucionPsico() {
    if (this.nuevaEvolucionPsico.invalid) {
      return
    }
    this.evolucionPsicoArr.push(new FormControl(this.nuevaEvolucionPsico.value));
    this.nuevaEvolucionPsico.reset();
  }
  borrarEvolucionPsico(i: number) {
    this.evolucionPsicoArr.removeAt(i);
  }
  buscarEspecialista() {
    // TODO
  }
  getInfoPsicologia() {
    this.saludService.getHistoriaClinica(this.terceroId).subscribe((data: any) => {  ///Remplazar para pruebas
      this.Historia = data[0];
      // console.log(data);
      this.saludService.getHojaHistoria(this.terceroId).subscribe(data => {
        this.HojaHistoria = data[0];
        this.saludService.getComposicionFamiliar(this.Historia.Id).subscribe(data => {
          this.composicion = data[0];
          this.psicologiaForm.controls.viveCon.setValue(this.composicion.Observaciones);
        });
        this.saludService.getLimites(this.Historia.Id).subscribe(data => {
          // console.log(data);       
          this.limites = data[0];
          this.psicologiaForm.controls.difusos.setValue(this.limites.Difusos);
          this.psicologiaForm.controls.claros.setValue(this.limites.Claros);
          this.psicologiaForm.controls.rigidos.setValue(this.limites.Rigidos);
        });
        this.saludService.getAntecedentesPsicologicos(this.Historia.Id).subscribe(data => {
          // console.log(data);
          this.antecedentes = data[0];
          this.psicologiaForm.controls.actualesFamiliares.setValue(data[0].ActualFamiliar);
          this.psicologiaForm.controls.pasadosFamiliares.setValue(data[0].PasadoFamiliar);
          this.psicologiaForm.controls.actualesPersonales.setValue(data[0].ActualPersonal);
          this.psicologiaForm.controls.pasadosPersonales.setValue(data[0].PasadoPersonal);
        });
        this.saludService.getValoracionInterpersonal(this.Historia.Id).subscribe(data => {
          //console.log(data);
          this.valoracion = data[0];
          this.psicologiaForm.controls.figurasDeAutoridad.setValue(this.valoracion.Autoridad);
          this.psicologiaForm.controls.pares.setValue(this.valoracion.Pares);
          this.psicologiaForm.controls.pareja.setValue(this.valoracion.Pareja);
          this.relaciones = this.valoracion.Relaciones;
          this.psicologiaForm.controls.satisfaccion.setValue(this.valoracion.Satisfaccion);
          this.psicologiaForm.controls.metodoProteccion.setValue(this.valoracion.Proteccion);
          this.psicologiaForm.controls.orientacionSexual.setValue(this.valoracion.Orientacion);
          this.psicologiaForm.controls.economicos.setValue(this.valoracion.Economicos);
          this.psicologiaForm.controls.judiciales.setValue(this.valoracion.Judiciales);
          this.psicologiaForm.controls.drogas.setValue(this.valoracion.Drogas);
          this.psicologiaForm.controls.motivoConsultaPsico.setValue(this.valoracion.Motivo);
        });
        this.saludService.getComportamientoConslta(this.Historia.Id).subscribe(data => {
          // console.log(data);
          this.comportamiento = data[0];
          this.psicologiaForm.controls.problematicaActual.setValue(this.comportamiento.Problematica);
          this.psicologiaForm.controls.estiloAfrontamiento.setValue(this.comportamiento.Afrontamiento);
          this.psicologiaForm.controls.comportamientoDuranteConsulta.setValue(this.comportamiento.Comportamiento);
        });
        this.saludService.getDiagnosticoPsicologia(this.Historia.Id).subscribe(data => {
          // console.log(data);
          this.diagnostico = data[0];
          this.psicologiaForm.controls.hipotesis.setValue(this.diagnostico.Hipotesis);
          this.psicologiaForm.controls.acuerdos.setValue(this.diagnostico.Acuerdo);
          this.psicologiaForm.controls.observacionesPsicologia.setValue(this.diagnostico.Observaciones);
          let evolucion = JSON.parse(this.diagnostico.Evolucion) || [];
          this.evolucion.push({ ...evolucion });
          let evolucion2: any = this.evolucion[0].evolucion;
          for (let i = 0; i < evolucion2.length; i++) {
            this.evolucionPsicoArr.push(new FormControl(evolucion2[i]));
          }
        });
      });
    });
  }
  guardarHistoriaPsicologia() {
    let evolucionCorregida = JSON.stringify(this.evolucionPsicoArr.value);
    let evolucion = evolucionCorregida.slice(1, evolucionCorregida.length - 1);
    let evolucion2 = evolucion.replace(/]/g, "").replace(/\[/g, "");
    //POSTS
    if (!this.antecedentes) {
      const antecedentePsicologia: AntecedentePsicologia = {
        Id: 0,
        PasadoFamiliar: this.psicologiaForm.controls.pasadosFamiliares.value,
        ActualFamiliar: this.psicologiaForm.controls.actualesFamiliares.value,
        PasadoPersonal: this.psicologiaForm.controls.pasadosPersonales.value,
        ActualPersonal: this.psicologiaForm.controls.actualesPersonales.value,
        HistoriaClinicaId: this.saludService.historia,
      }
      // console.log(antecedentePsicologia);
      this.saludService.postAntecedentePsicologia(antecedentePsicologia).subscribe(data => {
        console.log('AntecedentePsicologia: ' + data[0]);
        this.saludService.falloPsico = false;
      }, error => {
        this.saludService.falloPsico = true;
      });
    }
    if (!this.comportamiento) {
      const comportamientoConsulta: ComportamientoConsulta = {
        Afrontamiento: this.psicologiaForm.get('estiloAfrontamiento').value,
        Comportamiento: this.psicologiaForm.get('comportamientoDuranteConsulta').value,
        HistoriaClinicaId: this.saludService.historia,
        Id: 0,
        Problematica: this.psicologiaForm.get('problematicaActual').value,
        HojaHistoriaId: this.saludService.hojaHistoria,
      }
      // console.log(comportamientoConsulta);
      this.saludService.postComportamientoConsulta(comportamientoConsulta).subscribe(data => {
        console.log('ComportamientoConsulta: ' + data);
        this.saludService.falloPsico = false;
      }, error => {
        this.saludService.falloPsico = true;
      });
    }
    if (!this.composicion) {
      const composicionFamiliar: ComposicionFamiliar = {
        HistoriaClinicaId: this.saludService.historia,
        HojaHistoriaId: this.saludService.hojaHistoria,
        Id: 0,
        Observaciones: this.psicologiaForm.get('observacionesPsicologia').value,
      }
      // console.log('Ya había composicion');
      // console.log(composicionFamiliar);
      this.saludService.postComposicionFamiliar(composicionFamiliar).subscribe(data => {
        console.log('ComposicionFamiliar: ' + data);
        this.saludService.falloPsico = false;
      }, error => {
        this.saludService.falloPsico = true;
      });
    }
    if (!this.diagnostico) {
      const diagnostico: DiagnosticoPsicologia = {
        Acuerdo: this.psicologiaForm.get('acuerdos').value,
        Evolucion: '{"evolucion":[' + evolucion2 + ']}',
        Hipotesis: this.psicologiaForm.get('hipotesis').value,
        HistoriaClinicaId: this.saludService.historia,
        HojaHistoriaId: this.saludService.hojaHistoria,
        Id: 0,
        Observaciones: this.psicologiaForm.get('observacionesPsicologia').value,
      }
      // console.log('Ya había diagnostico');
      // console.log(diagnostico);
      this.saludService.postDiagnosticoPsicologia(diagnostico).subscribe(data => {
        console.log('DiagnosticoPsicologia: ' + data[0]);
        this.saludService.falloPsico = false;
      }, error => {
        this.saludService.falloPsico = true;
      });
    }
    if (!this.limites) {
      const limites: Limites = {
        Claros: this.psicologiaForm.get('claros').value,
        Difusos: this.psicologiaForm.get('difusos').value,
        HistoriaClinicaId: this.saludService.historia,
        HojaHistoriaId: this.saludService.hojaHistoria,
        Id: 0,
        Rigidos: this.psicologiaForm.get('rigidos').value,
      }
      // console.log('Ya había limites');
      // console.log(limites);
      this.saludService.postLimites(limites).subscribe(data => {
        console.log('Limites: ' + data[0]);
        this.saludService.falloPsico = false;
      }, error => {
        this.saludService.falloPsico = true;
      });
    }
    if (!this.valoracion) {
      const valoracionInterpersonal: ValoracionInterpersonal = {
        Autoridad: this.psicologiaForm.get('figurasDeAutoridad').value,
        Drogas: this.psicologiaForm.get('drogas').value,
        Economicos: this.psicologiaForm.get('economicos').value,
        HistoriaClinicaId: this.saludService.historia,
        HojaHistoriaId: this.saludService.hojaHistoria,
        Id: 0,
        Judiciales: this.psicologiaForm.get('judiciales').value,
        Motivo: this.psicologiaForm.get('motivoConsultaPsico').value,
        Orientacion: this.psicologiaForm.get('orientacionSexual').value,
        Pareja: this.psicologiaForm.get('pareja').value,
        Pares: this.psicologiaForm.get('pares').value,
        Proteccion: this.psicologiaForm.get('metodoProteccion').value,
        Relaciones: JSON.parse(this.psicologiaForm.get('relacionesSexuales').value),
        Satisfaccion: this.psicologiaForm.get('satisfaccion').value,
      }
      // console.log('Ya había valoracion');
      // console.log(valoracionInterpersonal);
      this.saludService.postValoracionInterpersonal(valoracionInterpersonal).subscribe(data => {
        console.log('ValoracionInterpersonal: ' + data[0]);
        this.saludService.falloPsico = false;
      }, error => {
        this.saludService.falloPsico = true;
      });
    }
    ///ACTUALIZACIÓN 
    // PUTS
    if (this.antecedentes) {
      const antecedentePsicologia: AntecedentePsicologia = {
        Id: this.antecedentes.Id,
        PasadoFamiliar: this.psicologiaForm.controls.pasadosFamiliares.value,
        ActualFamiliar: this.psicologiaForm.controls.actualesFamiliares.value,
        PasadoPersonal: this.psicologiaForm.controls.pasadosPersonales.value,
        ActualPersonal: this.psicologiaForm.controls.actualesPersonales.value,
        HistoriaClinicaId: this.saludService.historia,
      }
      // console.log(antecedentePsicologia);
      this.saludService.putAntecedentePsicologia(this.antecedentes.Id, antecedentePsicologia).subscribe(data => {
        console.log('AntecedentePsicologia: ' + data);
        this.saludService.falloPsico = false;
      }, error => {
        this.saludService.falloPsico = true;
      });
    }
    if (this.comportamiento) {
      const comportamientoConsulta: ComportamientoConsulta = {
        Afrontamiento: this.psicologiaForm.get('estiloAfrontamiento').value,
        Comportamiento: this.psicologiaForm.get('comportamientoDuranteConsulta').value,
        HistoriaClinicaId: this.saludService.historia,
        Id: this.comportamiento.Id,
        Problematica: this.psicologiaForm.get('problematicaActual').value,
        HojaHistoriaId: this.comportamiento.HojaHistoriaId,
      }
      // console.log(comportamientoConsulta);
      this.saludService.putComportamientoConsulta(this.comportamiento.Id, comportamientoConsulta).subscribe(data => {
        console.log('ComportamientoConsulta: ' + data);
        this.saludService.falloPsico = false;
      }, error => {
        this.saludService.falloPsico = true;
      });
    }
    if (this.composicion) {
      const composicionFamiliar: ComposicionFamiliar = {
        HistoriaClinicaId: this.composicion.HistoriaClinicaId,
        HojaHistoriaId: this.saludService.hojaHistoria,
        Id: this.composicion.Id,
        Observaciones: this.psicologiaForm.get('observacionesPsicologia').value,
      }
      // console.log('Ya había composicion');
      // console.log(composicionFamiliar);
      this.saludService.putComposicionFamiliar(this.composicion.Id, composicionFamiliar).subscribe(data => {
        console.log('ComposicionFamiliar: ' + data);
        this.saludService.falloPsico = false;
      }, error => {
        this.saludService.falloPsico = true;
      });
    }
    if (this.diagnostico) {
      const diagnostico: DiagnosticoPsicologia = {
        Acuerdo: this.psicologiaForm.get('acuerdos').value,
        Evolucion: '{"evolucion":[' + evolucion2 + ']}',
        Hipotesis: this.psicologiaForm.get('hipotesis').value,
        HistoriaClinicaId: this.saludService.historia,
        HojaHistoriaId: this.saludService.hojaHistoria,
        Id: this.diagnostico.Id,
        Observaciones: this.psicologiaForm.get('observacionesPsicologia').value,
      }
      // console.log('Ya había diagnostico');
      // console.log(diagnostico);
      this.saludService.putDiagnosticoPsicologia(this.diagnostico.Id, diagnostico).subscribe(data => {
        console.log('DiagnosticoPsicologia: ' + data);
        this.saludService.falloPsico = false;
      }, error => {
        this.saludService.falloPsico = true;
      });
    }
    if (this.limites) {
      const limites: Limites = {
        Claros: this.psicologiaForm.get('claros').value,
        Difusos: this.psicologiaForm.get('difusos').value,
        HistoriaClinicaId: this.saludService.historia,
        HojaHistoriaId: this.saludService.hojaHistoria,
        Id: this.limites.Id,
        Rigidos: this.psicologiaForm.get('rigidos').value,
      }
      // console.log('Ya había limites');
      // console.log(limites);
      this.saludService.putLimites(this.limites.Id, limites).subscribe(data => {
        console.log('Limites: ' + data);
        this.saludService.falloPsico = false;
      }, error => {
        this.saludService.falloPsico = true;
      });
    }
    if (this.valoracion) {
      const valoracionInterpersonal: ValoracionInterpersonal = {
        Autoridad: this.psicologiaForm.get('figurasDeAutoridad').value,
        Drogas: this.psicologiaForm.get('drogas').value,
        Economicos: this.psicologiaForm.get('economicos').value,
        HistoriaClinicaId: this.saludService.historia,
        HojaHistoriaId: this.saludService.hojaHistoria,
        Id: this.valoracion.Id,
        Judiciales: this.psicologiaForm.get('judiciales').value,
        Motivo: this.psicologiaForm.get('motivoConsultaPsico').value,
        Orientacion: this.psicologiaForm.get('orientacionSexual').value,
        Pareja: this.psicologiaForm.get('pareja').value,
        Pares: this.psicologiaForm.get('pares').value,
        Proteccion: this.psicologiaForm.get('metodoProteccion').value,
        Relaciones: JSON.parse(this.psicologiaForm.get('relacionesSexuales').value),
        Satisfaccion: this.psicologiaForm.get('satisfaccion').value,
      }
      // console.log('Ya había valoracion');
      // console.log(valoracionInterpersonal);
      this.saludService.putValoracionInterpersonal(this.valoracion.Id, valoracionInterpersonal).subscribe(data => {
        console.log('ValoracionInterpersonal: ' + data);
        this.saludService.falloPsico = false;
      }, error => {
        this.saludService.falloPsico = true;
      });
    }
    // console.log(this.saludService.falloPsico);
    if (this.saludService.falloPsico === false) {
      this.toastr.success(`Ha registrado con éxito la historia clínica de psicología para: ${this.paciente}`, '¡Guardado!');
      // window.location.reload();
    } else {
      this.toastr.error('Ha ocurrido un error al guardar la historia clínica', 'Error');
    }
  }
}



