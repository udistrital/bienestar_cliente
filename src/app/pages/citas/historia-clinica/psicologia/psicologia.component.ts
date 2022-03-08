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
import { Especialidad } from '../../../../shared/models/Salud/especialidad.model';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { Utils } from '../../../../shared/utils/utils';
import { DatePipe } from '@angular/common';
import { ListService } from '../../../../@core/store/list.service';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
@Component({
  selector: 'ngx-psicologia',
  templateUrl: './psicologia.component.html',
  styleUrls: ['../historia-clinica.component.css']
})
export class PsicologiaComponent implements OnInit {
  firstOne: any;
  hideHistory: boolean = false;
  especialidad: Especialidad;
  listaHojas: any = [];
  estado: string;
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
    diagnostico: [null],
    observacionesPsicologia: [null],
    evolucionPsico: this.fb.array([]),
    medicamento: [null]
  })
  nombreEspecialista: any;
  terceroEspecialista: any;
  logoDataUrl: string;
  constructor(private fb: FormBuilder, private toastr: ToastrService, private saludService: SaludService, private personaService: EstudiantesService, private aRoute: ActivatedRoute, private listService: ListService) { }
  ngOnInit() {
    Utils.getImageDataUrlFromLocalPath1('../../../../assets/images/Escudo_UD.png').then(
      result => this.logoDataUrl = result
    )
    this.terceroId = this.aRoute.snapshot.paramMap.get('terceroId');
    this.personaService.getEstudiante(this.saludService.IdPersona).subscribe((data: any) => {
      var paciente = data.datosEstudianteCollection.datosBasicosEstudiante[0];
      this.paciente = paciente.nombre;
    });
    this.listService.getInfoEstudiante().then((resp) => {
      //console.log(resp);
      this.personaService.getEstudiantePorDocumento(resp.documento).subscribe((res) => {
        //console.log(res);
        this.terceroEspecialista = res[0].TerceroId.Id;
        this.getInfoPsicologia();
      });
    });
    
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
  getInfoPsicologia() {
    this.saludService.getEspecialidad(4).subscribe((data: any) => {
      this.especialidad = data;
    });
    this.saludService.getHistoriaClinica(this.terceroId).subscribe((data: any) => {  ///Remplazar para pruebas
      this.Historia = data[0];
      // console.log(data);
      this.saludService.getHojaHistoria(this.terceroId, 4).subscribe(data => {
        if (JSON.stringify(data[0]) === '{}') {
          this.estado = "nueva";
          this.hideHistory = true;
          this.nombreEspecialista = "";
        } else {
          this.listaHojas = data;
          this.firstOne = data[0].Id;
          this.estado = "vieja";
          this.hideHistory = false;
          this.HojaHistoria = data[0];
          this.psicologiaForm.controls.motivoConsultaPsico.setValue(this.HojaHistoria.Motivo);
          this.psicologiaForm.controls.observacionesPsicologia.setValue(this.HojaHistoria.Observacion);
          this.evolucion = [];
          let evolucion = JSON.parse(this.HojaHistoria.Evolucion) || [];
          this.evolucion.push({ ...evolucion });
          let evolucion2: any = this.evolucion[0].evolucion;
          for (let i = 0; i < evolucion2.length; i++) {
            this.evolucionPsicoArr.push(new FormControl(evolucion2[i]));
          }
          this.saludService.getComposicionFamiliar(this.HojaHistoria.Id).subscribe(data => {
            this.composicion = data[0];
            this.psicologiaForm.controls.viveCon.setValue(this.composicion.Observaciones);
          });
          this.saludService.getLimites(this.HojaHistoria.Id).subscribe(data => {
            // console.log(data);       
            this.limites = data[0];
            this.psicologiaForm.controls.difusos.setValue(this.limites.Difusos);
            this.psicologiaForm.controls.claros.setValue(this.limites.Claros);
            this.psicologiaForm.controls.rigidos.setValue(this.limites.Rigidos);
          });
          this.getAntecedentes();
          this.saludService.getValoracionInterpersonal(this.HojaHistoria.Id).subscribe(data => {
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
          });
          this.saludService.getComportamientoConslta(this.HojaHistoria.Id).subscribe(data => {
            // console.log(data);
            this.comportamiento = data[0];
            this.psicologiaForm.controls.problematicaActual.setValue(this.comportamiento.Problematica);
            this.psicologiaForm.controls.estiloAfrontamiento.setValue(this.comportamiento.Afrontamiento);
            this.psicologiaForm.controls.comportamientoDuranteConsulta.setValue(this.comportamiento.Comportamiento);
          });
          this.saludService.getDiagnosticoPsicologia(this.HojaHistoria.Id).subscribe(data => {
            // console.log(data);
            this.diagnostico = data[0];
            this.psicologiaForm.controls.hipotesis.setValue(this.diagnostico.Hipotesis);
            this.psicologiaForm.controls.acuerdos.setValue(this.diagnostico.Acuerdo);
            this.psicologiaForm.controls.diagnostico.setValue(this.diagnostico.Diagnostico);
            this.psicologiaForm.controls.medicamento.setValue(this.diagnostico.Medicamento);
          });
          this.personaService.getDatosPersonalesPorTercero(this.HojaHistoria.Profesional).subscribe(data => {
            this.nombreEspecialista = data[0].TerceroId.NombreCompleto;
          });
        }
      });
    });
  }
  guardarHistoriaPsicologia() {
    this.psicologiaForm.disable();
    let evolucionCorregida = JSON.stringify(this.evolucionPsicoArr.value);
    let evolucion = evolucionCorregida.slice(1, evolucionCorregida.length - 1);
    let evolucion2 = evolucion.replace(/]/g, "").replace(/\[/g, "");
    //POSTS
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
        Profesional: this.terceroEspecialista,
        Motivo: this.psicologiaForm.get('motivoConsultaPsico').value,
        Observacion: this.psicologiaForm.get('observacionesPsicologia').value,
        FechaCreacion: new Date(),
        FechaModificacion: new Date(),
        Activo: true
      }
      this.saludService.postHojaHistoria(hojaHistoria).subscribe(data => {
        //console.log(data);
        this.HojaHistoria = data;
        console.log('Hoja historia: ' + data);
        this.saludService.falloMedicina = false;
        if (!this.antecedentes) {
          const antecedentePsicologia: AntecedentePsicologia = {
            Id: 0,
            PasadoFamiliar: this.psicologiaForm.controls.pasadosFamiliares.value,
            ActualFamiliar: this.psicologiaForm.controls.actualesFamiliares.value,
            PasadoPersonal: this.psicologiaForm.controls.pasadosPersonales.value,
            ActualPersonal: this.psicologiaForm.controls.actualesPersonales.value,
            HistoriaClinicaId: this.saludService.historia,
            FechaCreacion: new Date(),
            FechaModificacion: new Date(),
            Activo: true
          }
          // console.log(antecedentePsicologia);
          this.saludService.postAntecedentePsicologia(antecedentePsicologia).subscribe(data => {
            console.log('AntecedentePsicologia: ' + data[0]);
            this.saludService.falloPsico = false;
          }, error => {
            this.saludService.falloPsico = true;
          });
        } else if (this.antecedentes) {
          const antecedentePsicologia: AntecedentePsicologia = {
            Id: this.antecedentes.Id,
            PasadoFamiliar: this.psicologiaForm.controls.pasadosFamiliares.value,
            ActualFamiliar: this.psicologiaForm.controls.actualesFamiliares.value,
            PasadoPersonal: this.psicologiaForm.controls.pasadosPersonales.value,
            ActualPersonal: this.psicologiaForm.controls.actualesPersonales.value,
            HistoriaClinicaId: this.saludService.historia,
            FechaCreacion: this.antecedentes.FechaCreacion,
            FechaModificacion: new Date(),
            Activo: true
          }
          // console.log(antecedentePsicologia);
          this.saludService.putAntecedentePsicologia(this.antecedentes.Id, antecedentePsicologia).subscribe(data => {
            console.log('AntecedentePsicologia: ' + data);
            this.saludService.falloPsico = false;
          }, error => {
            this.saludService.falloPsico = true;
          });
        }
        const comportamientoConsulta: ComportamientoConsulta = {
          Afrontamiento: this.psicologiaForm.get('estiloAfrontamiento').value,
          Comportamiento: this.psicologiaForm.get('comportamientoDuranteConsulta').value,
          HistoriaClinicaId: this.saludService.historia,
          Id: 0,
          Problematica: this.psicologiaForm.get('problematicaActual').value,
          HojaHistoriaId: this.HojaHistoria.Id,
          FechaCreacion: new Date(),
          FechaModificacion: new Date(),
          Activo: true
        }
        // console.log(comportamientoConsulta);
        this.saludService.postComportamientoConsulta(comportamientoConsulta).subscribe(data => {
          console.log('ComportamientoConsulta: ' + data);
          this.saludService.falloPsico = false;
        }, error => {
          this.saludService.falloPsico = true;
        });
        const composicionFamiliar: ComposicionFamiliar = {
          HistoriaClinicaId: this.saludService.historia,
          HojaHistoriaId: this.HojaHistoria.Id,
          Id: 0,
          Observaciones: this.psicologiaForm.get('viveCon').value,
          FechaCreacion: new Date(),
          FechaModificacion: new Date(),
          Activo: true
        }
        // console.log('Ya había composicion');
        // console.log(composicionFamiliar);
        this.saludService.postComposicionFamiliar(composicionFamiliar).subscribe(data => {
          console.log('ComposicionFamiliar: ' + data);
          this.saludService.falloPsico = false;
        }, error => {
          this.saludService.falloPsico = true;
        });
        const diagnostico: DiagnosticoPsicologia = {
          Diagnostico: this.psicologiaForm.get('diagnostico').value,
          Acuerdo: this.psicologiaForm.get('acuerdos').value,
          Hipotesis: this.psicologiaForm.get('hipotesis').value,
          Medicamento: this.psicologiaForm.get('medicamento').value,
          HistoriaClinicaId: this.saludService.historia,
          HojaHistoriaId: this.HojaHistoria.Id,
          Id: 0,
          FechaCreacion: new Date(),
          FechaModificacion: new Date(),
          Activo: true
        }
        // console.log('Ya había diagnostico');
        // console.log(diagnostico);
        this.saludService.postDiagnosticoPsicologia(diagnostico).subscribe(data => {
          console.log('DiagnosticoPsicologia: ' + data[0]);
          this.saludService.falloPsico = false;
        }, error => {
          this.saludService.falloPsico = true;
        });
        const limites: Limites = {
          Claros: this.psicologiaForm.get('claros').value,
          Difusos: this.psicologiaForm.get('difusos').value,
          HistoriaClinicaId: this.saludService.historia,
          HojaHistoriaId: this.HojaHistoria.Id,
          Id: 0,
          Rigidos: this.psicologiaForm.get('rigidos').value,
          FechaCreacion: new Date(),
          FechaModificacion: new Date(),
          Activo: true
        }
        // console.log('Ya había limites');
        // console.log(limites);
        this.saludService.postLimites(limites).subscribe(data => {
          console.log('Limites: ' + data[0]);
          this.saludService.falloPsico = false;
        }, error => {
          this.saludService.falloPsico = true;
        });
        const valoracionInterpersonal: ValoracionInterpersonal = {
          Autoridad: this.psicologiaForm.get('figurasDeAutoridad').value,
          Drogas: this.psicologiaForm.get('drogas').value,
          Economicos: this.psicologiaForm.get('economicos').value,
          HistoriaClinicaId: this.saludService.historia,
          HojaHistoriaId: this.HojaHistoria.Id,
          Id: 0,
          Judiciales: this.psicologiaForm.get('judiciales').value,
          Orientacion: this.psicologiaForm.get('orientacionSexual').value,
          Pareja: this.psicologiaForm.get('pareja').value,
          Pares: this.psicologiaForm.get('pares').value,
          Proteccion: this.psicologiaForm.get('metodoProteccion').value,
          Relaciones: JSON.parse(this.psicologiaForm.get('relacionesSexuales').value),
          Satisfaccion: this.psicologiaForm.get('satisfaccion').value,
          FechaCreacion: new Date(),
          FechaModificacion: new Date(),
          Activo: true
        }
        // console.log('Ya había valoracion');
        // console.log(valoracionInterpersonal);
        this.saludService.postValoracionInterpersonal(valoracionInterpersonal).subscribe(data => {
          console.log('ValoracionInterpersonal: ' + data[0]);
          this.saludService.falloPsico = false;
        }, error => {
          this.saludService.falloPsico = true;
        });
      });
    } else if (this.estado == "vieja") {
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
        Profesional: this.HojaHistoria.Profesional,
        Motivo: this.psicologiaForm.get('motivoConsultaPsico').value,
        Observacion: this.psicologiaForm.get('observacionesPsicologia').value,
        FechaCreacion: this.HojaHistoria.FechaCreacion,
        FechaModificacion: new Date(),
        Activo: true
      }
      // console.log(hojaHistoria);
      this.saludService.putHojaHistoria(this.HojaHistoria.Id, hojaHistoria).subscribe(data => {
        console.log('Hoja historia: ' + data);
        this.saludService.falloMedicina = false;
      }, error => {
        this.saludService.falloMedicina = true;
      });
      const antecedentePsicologia: AntecedentePsicologia = {
        Id: this.antecedentes.Id,
        PasadoFamiliar: this.psicologiaForm.controls.pasadosFamiliares.value,
        ActualFamiliar: this.psicologiaForm.controls.actualesFamiliares.value,
        PasadoPersonal: this.psicologiaForm.controls.pasadosPersonales.value,
        ActualPersonal: this.psicologiaForm.controls.actualesPersonales.value,
        HistoriaClinicaId: this.saludService.historia,
        FechaCreacion: this.antecedentes.FechaCreacion,
        FechaModificacion: new Date(),
        Activo: true
      }
      // console.log(antecedentePsicologia);
      this.saludService.putAntecedentePsicologia(this.antecedentes.Id, antecedentePsicologia).subscribe(data => {
        console.log('AntecedentePsicologia: ' + data);
        this.saludService.falloPsico = false;
      }, error => {
        this.saludService.falloPsico = true;
      });
      const comportamientoConsulta: ComportamientoConsulta = {
        Afrontamiento: this.psicologiaForm.get('estiloAfrontamiento').value,
        Comportamiento: this.psicologiaForm.get('comportamientoDuranteConsulta').value,
        HistoriaClinicaId: this.saludService.historia,
        Id: this.comportamiento.Id,
        Problematica: this.psicologiaForm.get('problematicaActual').value,
        HojaHistoriaId: this.comportamiento.HojaHistoriaId,
        FechaCreacion: this.comportamiento.FechaCreacion,
        FechaModificacion: new Date(),
        Activo: true
      }
      // console.log(comportamientoConsulta);
      this.saludService.putComportamientoConsulta(this.comportamiento.Id, comportamientoConsulta).subscribe(data => {
        console.log('ComportamientoConsulta: ' + data);
        this.saludService.falloPsico = false;
      }, error => {
        this.saludService.falloPsico = true;
      });
      const composicionFamiliar: ComposicionFamiliar = {
        HistoriaClinicaId: this.composicion.HistoriaClinicaId,
        HojaHistoriaId: this.composicion.HojaHistoriaId,
        Id: this.composicion.Id,
        Observaciones: this.psicologiaForm.get('viveCon').value,
        FechaCreacion: this.composicion.FechaCreacion,
        FechaModificacion: new Date(),
        Activo: true
      }
      // console.log('Ya había composicion');
      // console.log(composicionFamiliar);
      this.saludService.putComposicionFamiliar(this.composicion.Id, composicionFamiliar).subscribe(data => {
        console.log('ComposicionFamiliar: ' + data);
        this.saludService.falloPsico = false;
      }, error => {
        this.saludService.falloPsico = true;
      });
      const diagnostico: DiagnosticoPsicologia = {
        Acuerdo: this.psicologiaForm.get('acuerdos').value,
        Hipotesis: this.psicologiaForm.get('hipotesis').value,
        HistoriaClinicaId: this.diagnostico.HistoriaClinicaId,
        Medicamento: this.psicologiaForm.get('medicamento').value,
        Diagnostico: this.psicologiaForm.get('diagnostico').value,
        HojaHistoriaId: this.diagnostico.HojaHistoriaId,
        Id: this.diagnostico.Id,
        FechaCreacion: this.diagnostico.FechaCreacion,
        FechaModificacion: new Date(),
        Activo: true
      }
      // console.log('Ya había diagnostico');
      // console.log(diagnostico);
      this.saludService.putDiagnosticoPsicologia(this.diagnostico.Id, diagnostico).subscribe(data => {
        console.log('DiagnosticoPsicologia: ' + data);
        this.saludService.falloPsico = false;
      }, error => {
        this.saludService.falloPsico = true;
      });
      const limites: Limites = {
        Claros: this.psicologiaForm.get('claros').value,
        Difusos: this.psicologiaForm.get('difusos').value,
        HistoriaClinicaId: this.limites.HistoriaClinicaId,
        HojaHistoriaId: this.limites.HojaHistoriaId,
        Id: this.limites.Id,
        Rigidos: this.psicologiaForm.get('rigidos').value,
        FechaCreacion: this.limites.FechaCreacion,
        FechaModificacion: new Date(),
        Activo: true
      }
      // console.log('Ya había limites');
      // console.log(limites);
      this.saludService.putLimites(this.limites.Id, limites).subscribe(data => {
        console.log('Limites: ' + data);
        this.saludService.falloPsico = false;
      }, error => {
        this.saludService.falloPsico = true;
      });
      const valoracionInterpersonal: ValoracionInterpersonal = {
        Autoridad: this.psicologiaForm.get('figurasDeAutoridad').value,
        Drogas: this.psicologiaForm.get('drogas').value,
        Economicos: this.psicologiaForm.get('economicos').value,
        HistoriaClinicaId: this.valoracion.HistoriaClinicaId,
        HojaHistoriaId: this.valoracion.HojaHistoriaId,
        Id: this.valoracion.Id,
        Judiciales: this.psicologiaForm.get('judiciales').value,
        Orientacion: this.psicologiaForm.get('orientacionSexual').value,
        Pareja: this.psicologiaForm.get('pareja').value,
        Pares: this.psicologiaForm.get('pares').value,
        Proteccion: this.psicologiaForm.get('metodoProteccion').value,
        Relaciones: JSON.parse(this.psicologiaForm.get('relacionesSexuales').value),
        Satisfaccion: this.psicologiaForm.get('satisfaccion').value,
        FechaCreacion: this.valoracion.FechaCreacion,
        FechaModificacion: new Date(),
        Activo: true
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
      setTimeout(() => {
        window.location.reload();
      },
        1500);
      // window.location.reload();
    } else {
      this.toastr.error('Ha ocurrido un error al guardar la historia clínica', 'Error');
    }
  }
  cambiarHoja(data: any) {
    this.evolucionPsicoArr.clear();
    this.getHojaEspecifica(data);
  }
  getHojaEspecifica(Id: any) {
    this.saludService.getHojaHistoriaEspecifica(Id).subscribe(data => {//Reemplazar por terceroId
      //console.log(data);
      this.HojaHistoria = data;
      this.psicologiaForm.controls.motivoConsultaPsico.setValue(this.HojaHistoria.Motivo);
      this.psicologiaForm.controls.observacionesPsicologia.setValue(this.HojaHistoria.Observacion);
      this.evolucion = [];
      let evolucion = JSON.parse(this.HojaHistoria.Evolucion) || [];
      this.evolucion.push({ ...evolucion });
      let evolucion2: any = this.evolucion[0].evolucion;
      for (let i = 0; i < evolucion2.length; i++) {
        this.evolucionPsicoArr.push(new FormControl(evolucion2[i]));
      }
      this.saludService.getComposicionFamiliar(this.HojaHistoria.Id).subscribe(data => {
        this.composicion = data[0];
        this.psicologiaForm.controls.viveCon.setValue(this.composicion.Observaciones);
      });
      this.saludService.getLimites(this.HojaHistoria.Id).subscribe(data => {
        // console.log(data);       
        this.limites = data[0];
        this.psicologiaForm.controls.difusos.setValue(this.limites.Difusos);
        this.psicologiaForm.controls.claros.setValue(this.limites.Claros);
        this.psicologiaForm.controls.rigidos.setValue(this.limites.Rigidos);
      });
      this.getAntecedentes();
      this.saludService.getValoracionInterpersonal(this.HojaHistoria.Id).subscribe(data => {
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
      });
      this.saludService.getComportamientoConslta(this.HojaHistoria.Id).subscribe(data => {
        // console.log(data);
        this.comportamiento = data[0];
        this.psicologiaForm.controls.problematicaActual.setValue(this.comportamiento.Problematica);
        this.psicologiaForm.controls.estiloAfrontamiento.setValue(this.comportamiento.Afrontamiento);
        this.psicologiaForm.controls.comportamientoDuranteConsulta.setValue(this.comportamiento.Comportamiento);
      });
      this.saludService.getDiagnosticoPsicologia(this.HojaHistoria.Id).subscribe(data => {
        // console.log(data);
        this.diagnostico = data[0];
        this.psicologiaForm.controls.hipotesis.setValue(this.diagnostico.Hipotesis);
        this.psicologiaForm.controls.acuerdos.setValue(this.diagnostico.Acuerdo);
        this.psicologiaForm.controls.diagnostico.setValue(this.diagnostico.Diagnostico);
        this.psicologiaForm.controls.medicamento.setValue(this.diagnostico.Medicamento);
      });
      this.personaService.getDatosPersonalesPorTercero(this.HojaHistoria.Profesional).subscribe(data => {
        this.nombreEspecialista = data[0].TerceroId.NombreCompleto;
      });
    });
  }
  getAntecedentes() {
    this.saludService.getAntecedentesPsicologicos(this.Historia.Id).subscribe(data => {
      // console.log(data);
      this.antecedentes = data[0];
      this.psicologiaForm.controls.actualesFamiliares.setValue(data[0].ActualFamiliar);
      this.psicologiaForm.controls.pasadosFamiliares.setValue(data[0].PasadoFamiliar);
      this.psicologiaForm.controls.actualesPersonales.setValue(data[0].ActualPersonal);
      this.psicologiaForm.controls.pasadosPersonales.setValue(data[0].PasadoPersonal);
    });
  }
  crearNuevaHoja() {
    this.psicologiaForm.reset();
    this.getAntecedentes();
    this.estado = "nueva";
    this.evolucionPsicoArr.clear();
    this.hideHistory = true;
    this.nombreEspecialista = "";
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
        
        { text: '\n\nMedicamentos recetados - Módulo psicología\n', style: 'secondTitle' },
        {text: '\n'+this.psicologiaForm.controls.medicamento.value}
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

