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
import { TipoAntecedentePsicologia } from '../../../../shared/models/Salud/tipoAntecedentePsicologia.model';
@Component({
  selector: 'ngx-psicologia',
  templateUrl: './psicologia.component.html',
  styleUrls: ['../historia-clinica.component.css']
})
export class PsicologiaComponent implements OnInit {
  idHistoria: number | null;
  idHojaHistoria: number | null;
  evolucion: Evolucion[] = [];
  paciente: string;
  idAntecedenteFamiliar: number;
  idAntecedentePersonal: number;
  tipoAntecedenteFamiliar: TipoAntecedentePsicologia;
  tipoAntecedentePersonal: TipoAntecedentePsicologia;
  idComportamiento: number;
  idComposicion: number;
  idDiagnostico: number;
  idLimites: number;

  idValoracion: number;
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
    relacionesSexuales: [null],
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
  constructor(private fb: FormBuilder, private toastr: ToastrService, private saludService: SaludService, private personaService: EstudiantesService) { }
  ngOnInit() {
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
    this.saludService.getHistoriaClinica(this.saludService.terceroId).subscribe((data: any) => {
      this.idHistoria = data[0].Id;
      this.saludService.getHojaHistoria(this.saludService.IdPersona).subscribe(data => {
        this.idHistoria = data[0].Id;
        this.saludService.getComposicionFamiliar(this.idHistoria).subscribe(data => {
          this.psicologiaForm.controls.viveCon.setValue(data[0].Observaciones);
          this.idComposicion = data[0].Id;
        });
        this.saludService.getLimites(this.idHistoria).subscribe(data => {
          // console.log(data);
          this.idLimites = data[0].Id;
          this.psicologiaForm.controls.difusos.setValue(data[0].Difusos);
          this.psicologiaForm.controls.claros.setValue(data[0].Claros);
          this.psicologiaForm.controls.rigidos.setValue(data[0].Rigidos);
        });
        this.saludService.getAntecedentesPsicologicos(this.idHistoria).subscribe(data => {
          // console.log(data);
          this.psicologiaForm.controls.actualesFamiliares.setValue(data[0].ActualSomatico);
          this.psicologiaForm.controls.pasadosFamiliares.setValue(data[0].PasadoSomatico);
          this.idAntecedenteFamiliar = data[0].Id;
          this.tipoAntecedenteFamiliar = data[0].TipoAntecedente;
          this.psicologiaForm.controls.actualesPersonales.setValue(data[1].ActualSomatico);
          this.psicologiaForm.controls.pasadosPersonales.setValue(data[1].PasadoSomatico);
          this.idAntecedentePersonal = data[1].Id;
          this.tipoAntecedentePersonal = data[1].TipoAntecedente;

        });
        this.saludService.getValoracionInterpersonal(this.idHistoria).subscribe(data => {
          // console.log(data);
          this.idValoracion = data[0].Id;
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
          this.idHojaHistoria = data[0].HojaHistoriaId;
          this.idComportamiento = data[0].Id;
          this.psicologiaForm.controls.problematicaActual.setValue(data[0].Problematica);
          this.psicologiaForm.controls.estiloAfrontamiento.setValue(data[0].Afrontamiento);
          this.psicologiaForm.controls.comportamientoDuranteConsulta.setValue(data[0].Comportamiento);
        });
        this.saludService.getDiagnosticoPsicologia(this.idHistoria).subscribe(data => {
          // console.log(data);
          this.idDiagnostico = data[0].Id;
          this.psicologiaForm.controls.hipotesis.setValue(data[0].Hipotesis);
          this.psicologiaForm.controls.acuerdos.setValue(data[0].Acuerdo);
          this.psicologiaForm.controls.observacionesPsicologia.setValue(data[0].Observaciones);
          let evolucion = JSON.parse(data[0].Evolucion);
          this.evolucion.push({ ...evolucion });
          let evolucion2 = this.evolucion[0].evolucion;
          this.evolucionPsicoArr.push(new FormControl(evolucion2));
        });
      });
    });
  }
  guardarHistoriaPsicologia() {
    let evolucionCorregida = JSON.stringify(this.evolucionPsicoArr.value);
    let evolucion = evolucionCorregida.slice(1, evolucionCorregida.length - 1);
    let evolucion2 = evolucion.replace(/]/g, "").replace(/\[/g, "");
    //POSTS
    if (!this.idHistoria) {
      console.log("no existe historia");

      const antecedentePsicologiaFamiliar: AntecedentePsicologia = {
        ActualSomatico: this.psicologiaForm.get('actualesFamiliares').value,
        HistoriaClinicaId: null,
        PasadoSomatico: this.psicologiaForm.get('pasadosFamiliares').value,
        Id: this.idAntecedenteFamiliar,
        TipoAntecedente: this.tipoAntecedenteFamiliar,
      }
      // console.log(antecedentePsicologiaFamiliar);
      this.saludService.postAntecedentePsicologia(antecedentePsicologiaFamiliar).subscribe(data => {
        console.log('AntecedentePsicologiaFamiliares: ' + data);
        const antecedentePsicologiaPersonal: AntecedentePsicologia = {
          ActualSomatico: this.psicologiaForm.get('actualesPersonales').value,
          HistoriaClinicaId: this.idHistoria,
          PasadoSomatico: this.psicologiaForm.get('pasadosPersonales').value,
          Id: this.idAntecedentePersonal,
          TipoAntecedente: this.tipoAntecedentePersonal,
        }
        // console.log(antecedentePsicologiaPersonal);
        this.saludService.postAntecedentePsicologia(antecedentePsicologiaPersonal).subscribe(data => {
          console.log('AntecedentePsicologiaPersonales: ' + data);
          this.saludService.falloPsico = true;
        }, error => {
          this.saludService.falloPsico = false;
        });
        const comportamientoConsulta: ComportamientoConsulta = {
          Afrontamiento: this.psicologiaForm.get('estiloAfrontamiento').value,
          Comportamiento: this.psicologiaForm.get('comportamientoDuranteConsulta').value,
          HistoriaClinicaId: this.idHistoria,
          HojaHistoriaId: this.idHojaHistoria,
          Id: this.idComportamiento,
          Problematica: this.psicologiaForm.get('problematicaActual').value,
        }
        // console.log(comportamientoConsulta);
        this.saludService.postComportamientoConsulta(comportamientoConsulta).subscribe(data => {
          console.log('ComportamientoConsulta: ' + data);
          this.saludService.falloPsico = true;
        }, error => {
          this.saludService.falloPsico = false;
        });
        const composicionFamiliar: ComposicionFamiliar = {
          HistoriaClinicaId: this.idHistoria,
          HojaHistoriaId: this.idHojaHistoria,
          Id: this.idComposicion,
          Observaciones: this.psicologiaForm.get('observacionesPsicologia').value,
        }
        // console.log(composicionFamiliar);
        this.saludService.postComposicionFamiliar(composicionFamiliar).subscribe(data => {
          console.log('ComposicionFamiliar: ' + data);
          this.saludService.falloPsico = true;
        }, error => {
          this.saludService.falloPsico = false;
        });
        const diagnostico: DiagnosticoPsicologia = {
          Acuerdo: this.psicologiaForm.get('acuerdos').value,
          Evolucion: '{"evolucion":[' + evolucion2 + ']}',
          Hipotesis: this.psicologiaForm.get('hipotesis').value,
          HistoriaClinicaId: this.idHistoria,
          HojaHistoriaId: this.idHojaHistoria,
          Id: this.idDiagnostico,
          Observaciones: this.psicologiaForm.get('observacionesPsicologia').value,
        }
        // console.log(diagnostico);
        this.saludService.postDiagnosticoPsicologia(diagnostico).subscribe(data => {
          console.log('DiagnosticoPsicologia: ' + data);
          this.saludService.falloPsico = true;
        }, error => {
          this.saludService.falloPsico = false;
        });
        const limites: Limites = {
          Claros: this.psicologiaForm.get('claros').value,
          Difusos: this.psicologiaForm.get('difusos').value,
          HistoriaClinicaId: this.idHistoria,
          HojaHistoriaId: this.idHojaHistoria,
          Id: this.idLimites,
          Rigidos: this.psicologiaForm.get('rigidos').value,
        }
        // console.log(limites);
        this.saludService.postLimites(limites).subscribe(data => {
          console.log('Limites: ' + data);
          this.saludService.falloPsico = true;
        }, error => {
          this.saludService.falloPsico = false;
        });
        const valoracionInterpersonal: ValoracionInterpersonal = {
          Autoridad: this.psicologiaForm.get('figurasDeAutoridad').value,
          Drogas: this.psicologiaForm.get('drogas').value,
          Economicos: this.psicologiaForm.get('economicos').value,
          HistoriaClinicaId: this.idHistoria,
          HojaHistoriaId: this.idHojaHistoria,
          Id: this.idValoracion,
          Judiciales: this.psicologiaForm.get('judiciales').value,
          Motivo: this.psicologiaForm.get('motivoConsultaPsico').value,
          Orientacion: this.psicologiaForm.get('orientacionSexual').value,
          Pareja: this.psicologiaForm.get('pareja').value,
          Pares: this.psicologiaForm.get('pares').value,
          Proteccion: this.psicologiaForm.get('metodoProteccion').value,
          Relaciones: this.psicologiaForm.get('relacionesSexuales').value,
          Satisfaccion: this.psicologiaForm.get('satisfaccion').value,
        }
        // console.log(valoracionInterpersonal);
        this.saludService.putValoracionInterpersonal(this.idValoracion, valoracionInterpersonal,).subscribe(data => {
          console.log('ValoracionInterpersonal: ' + data);
        });
        this.saludService.falloPsico = true;
      }, error => {
        this.saludService.falloPsico = false;
      });
      console.log(this.saludService.falloPsico);
      if (this.saludService.falloPsico === false) {
        this.toastr.success(`Ha registrado con éxito la historia clínica de psicología para: ${this.paciente}`, '¡Guardado!');
      } else {
        this.toastr.error('Ha ocurrido un error al guardar la historia clínica', 'Error');
      }
    }


    // PUTS
    if (this.idHistoria) {
      const antecedentePsicologiaFamiliar: AntecedentePsicologia = {
        ActualSomatico: this.psicologiaForm.get('actualesFamiliares').value,
        HistoriaClinicaId: this.idHistoria,
        PasadoSomatico: this.psicologiaForm.get('pasadosFamiliares').value,
        Id: this.idAntecedenteFamiliar,
        TipoAntecedente: this.tipoAntecedenteFamiliar,
      }
      // console.log(antecedentePsicologiaFamiliar);
      this.saludService.putAntecedentePsicologia(this.idAntecedenteFamiliar, antecedentePsicologiaFamiliar).subscribe(data => {
        console.log('AntecedentePsicologiaFamiliares: ' + data);
        const antecedentePsicologiaPersonal: AntecedentePsicologia = {
          ActualSomatico: this.psicologiaForm.get('actualesPersonales').value,
          HistoriaClinicaId: this.idHistoria,
          PasadoSomatico: this.psicologiaForm.get('pasadosPersonales').value,
          Id: this.idAntecedentePersonal,
          TipoAntecedente: this.tipoAntecedentePersonal,
        }
        // console.log(antecedentePsicologiaPersonal);
        this.saludService.putAntecedentePsicologia(this.idAntecedentePersonal, antecedentePsicologiaPersonal).subscribe(data => {
          console.log('AntecedentePsicologiaPersonales: ' + data);
          this.saludService.falloPsico = false;
        }, error => {
          this.saludService.falloPsico = true;
        });
        const comportamientoConsulta: ComportamientoConsulta = {
          Afrontamiento: this.psicologiaForm.get('estiloAfrontamiento').value,
          Comportamiento: this.psicologiaForm.get('comportamientoDuranteConsulta').value,
          HistoriaClinicaId: this.idHistoria,
          HojaHistoriaId: this.idHojaHistoria,
          Id: this.idComportamiento,
          Problematica: this.psicologiaForm.get('problematicaActual').value,
        }
        // console.log(comportamientoConsulta);
        this.saludService.putComportamientoConsulta(this.idComportamiento, comportamientoConsulta).subscribe(data => {
          console.log('ComportamientoConsulta: ' + data);
          this.saludService.falloPsico = false;
        }, error => {
          this.saludService.falloPsico = true;
        });
        const composicionFamiliar: ComposicionFamiliar = {
          HistoriaClinicaId: this.idHistoria,
          HojaHistoriaId: this.idHojaHistoria,
          Id: this.idComposicion,
          Observaciones: this.psicologiaForm.get('observacionesPsicologia').value,
        }
        // console.log(composicionFamiliar);
        this.saludService.putComposicionFamiliar(this.idComposicion, composicionFamiliar).subscribe(data => {
          console.log('ComposicionFamiliar: ' + data);
          this.saludService.falloPsico = false;
        }, error => {
          this.saludService.falloPsico = true;
        });
        const diagnostico: DiagnosticoPsicologia = {
          Acuerdo: this.psicologiaForm.get('acuerdos').value,
          Evolucion: '{"evolucion":[' + evolucion2 + ']}',
          Hipotesis: this.psicologiaForm.get('hipotesis').value,
          HistoriaClinicaId: this.idHistoria,
          HojaHistoriaId: this.idHojaHistoria,
          Id: this.idDiagnostico,
          Observaciones: this.psicologiaForm.get('observacionesPsicologia').value,
        }
        // console.log(diagnostico);
        this.saludService.putDiagnosticoPsicologia(this.idDiagnostico, diagnostico).subscribe(data => {
          console.log('DiagnosticoPsicologia: ' + data);
          this.saludService.falloPsico = false;
        }, error => {
          this.saludService.falloPsico = true;
        });
        const limites: Limites = {
          Claros: this.psicologiaForm.get('claros').value,
          Difusos: this.psicologiaForm.get('difusos').value,
          HistoriaClinicaId: this.idHistoria,
          HojaHistoriaId: this.idHojaHistoria,
          Id: this.idLimites,
          Rigidos: this.psicologiaForm.get('rigidos').value,
        }
        // console.log(limites);
        this.saludService.putLimites(this.idLimites, limites).subscribe(data => {
          console.log('Limites: ' + data);
          this.saludService.falloPsico = false;
        }, error => {
          this.saludService.falloPsico = true;
        });
        const valoracionInterpersonal: ValoracionInterpersonal = {
          Autoridad: this.psicologiaForm.get('figurasDeAutoridad').value,
          Drogas: this.psicologiaForm.get('drogas').value,
          Economicos: this.psicologiaForm.get('economicos').value,
          HistoriaClinicaId: this.idHistoria,
          HojaHistoriaId: this.idHojaHistoria,
          Id: this.idValoracion,
          Judiciales: this.psicologiaForm.get('judiciales').value,
          Motivo: this.psicologiaForm.get('motivoConsultaPsico').value,
          Orientacion: this.psicologiaForm.get('orientacionSexual').value,
          Pareja: this.psicologiaForm.get('pareja').value,
          Pares: this.psicologiaForm.get('pares').value,
          Proteccion: this.psicologiaForm.get('metodoProteccion').value,
          Relaciones: this.psicologiaForm.get('relacionesSexuales').value,
          Satisfaccion: this.psicologiaForm.get('satisfaccion').value,
        }
        // console.log(valoracionInterpersonal);
        this.saludService.putValoracionInterpersonal(this.idValoracion, valoracionInterpersonal).subscribe(data => {
          console.log('ValoracionInterpersonal: ' + data);
        });
        this.saludService.falloPsico = false;
      }, error => {
        this.saludService.falloPsico = true;
      });
      // console.log(this.saludService.falloPsico);
      if (this.saludService.falloPsico === false) {
        this.toastr.success(`Ha registrado con éxito la historia clínica de psicología para: ${this.paciente}`, '¡Guardado!');
      } else {
        this.toastr.error('Ha ocurrido un error al guardar la historia clínica', 'Error');
      }
    }
  }
}
