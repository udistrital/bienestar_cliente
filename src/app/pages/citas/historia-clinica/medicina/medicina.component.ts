import { ThrowStmt } from '@angular/compiler';
import { toBase64String } from '@angular/compiler/src/output/source_map';
import { Component, OnInit, Input  } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Analisis } from '../../../../shared/models/Salud/analisis.model';
import { Antecedente } from '../../../../shared/models/Salud/antecedente.model';
import { Diagnostico } from '../../../../shared/models/Salud/diagnostico.model';
import { Especialidad } from '../../../../shared/models/Salud/especialidad.model';
import { Evolucion } from '../../../../shared/models/Salud/evolucion.model';
import { Examen } from '../../../../shared/models/Salud/examen.model';
import { HistoriaClinica } from '../../../../shared/models/Salud/historiaClinica.model';
import { HojaHistoria } from '../../../../shared/models/Salud/hojaHistoria.model';
import { Sistemas } from '../../../../shared/models/Salud/sistemas.model';
import { EstudiantesService } from '../../../../shared/services/estudiantes.service';
import { SaludService } from '../../../../shared/services/salud.service';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { Utils } from '../../../../shared/utils/utils';
import { DatePipe } from '@angular/common';
import { ListService } from '../../../../@core/store/list.service';
import { Enfermeria } from '../../../../shared/models/Salud/enfermeria.model';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
@Component({
  selector: 'ngx-medicina',
  templateUrl: './medicina.component.html',
  styleUrls: ['../historia-clinica.component.css']
})
export class MedicinaComponent implements OnInit {

  paciente: string;
  enfermeria: Enfermeria | null;
  crear: boolean = false;
  superAdmin: boolean = false;
  fechaActual = new Date();
  firstOne: any;
  hideHistory: boolean = false;
  especialidad: Especialidad;
  listaHojas: any = [];
  estado: string;
  terceroId: any;
  idHistoria: number | null;
  historiaClinica: HistoriaClinica;
  hojaHistoria: HojaHistoria | null;
  antecedentes: Antecedente | null;
  sistemas: Sistemas | null;
  diagnostico: Diagnostico | null;
  examenes: Examen | null;
  evolucion: Evolucion[] = [];
  analisis: Analisis[] = [];
  //paciente: string;
  nuevoAnalisis: FormControl = this.fb.control('');
  nuevaEvolucion: FormControl = this.fb.control('');
  medicinaForm: FormGroup = this.fb.group({
    motivoConsulta: [''],
    patologicos: [''],
    hospitalarios: [''],
    traumaticos: [''],
    quirurgicos: [''],
    genitoUrinarios: [''],
    alergicos: [''],
    farmacologicos: [''],
    familiares: [''],
    ocupacionales: [''],
    menarquia: [''],
    fur: [''],
    ciclos: [''],
    ias: [''],
    compañeros: [''],
    fo: [''],
    fup: [''],
    pp: [''],
    fuccv: [''],
    resultadoccv: [''],
    examenSeno: [''],
    resultadoSeno: [''],
    piel: [''],
    colageno: [''],
    linfatico: [''],
    oseo: [''],
    muscular: [''],
    articular: [''],
    digestivo: [''],
    urinario: [''],
    sentidos: [''],
    cardioVascular: [''],
    neurologico: [''],
    respiratorio: [''],
    examenes: [''],
    ta: [''],
    fc: [''],
    fr: [''],
    sao2: [''],
    peso: [''],
    imc: [''],
    talla: [''],
    tc: [''],
    estadoGeneral: [''],
    cabezaYCuello: [''],
    orl: [''],
    ojos: [''],
    torax: [''],
    ruidosRespiratorios: [''],
    ruidosCardiacos: [''],
    abdomen: [''],
    neurologicoE: [''],
    genital: [''],
    extremidades: [''],
    diagnostico: [''],
    analisis: this.fb.array([]),
    evolucion: this.fb.array([]),
    planDeManejo: [''],
    observacionesMedicina: [''],
    medicamento: ['']
  });
  nombreEspecialista: any;
  terceroEspecialista: any;
  logoDataUrl: string;
  estadoHoja: boolean = false;
  estadoSistema: boolean = false;
  estadoExamen: boolean = false;
  estadoDiagnostico: boolean = false;
  estadoAntecedente: boolean = false;
  constructor(private fb: FormBuilder, private toastr: ToastrService, private saludService: SaludService, private personaService: EstudiantesService, private aRoute: ActivatedRoute, private listService: ListService) { }

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
    this.medicinaForm.disable();
    this.fechaActual.setDate(this.fechaActual.getDate() - 1);
    Utils.getImageDataUrlFromLocalPath1('../../../../assets/images/Escudo_UD.png').then(
      result => this.logoDataUrl = result
    )
    this.terceroId = this.aRoute.snapshot.paramMap.get('terceroId');
   /* this.personaService.getEstudiante(this.saludService.IdPersona).subscribe((data: any) => {
      var paciente = data.datosEstudianteCollection.datosBasicosEstudiante[0];
      this.paciente = paciente.nombre;
    });*/
    //busca la informacion del login
    //this.listService.getInfoEstudiante().then((resp) => {
      //console.log(resp);
      
      //if (resp.role.includes('SUPER_ADMIN_BIENESTAR')) {
      const temp = atob(localStorage.getItem(btoa("roles")));
   
       if (temp != undefined) {
        if (temp.includes('SUPER_ADMIN_BIENESTAR')) {
        this.medicinaForm.disable();
        this.superAdmin = true;
        }
       }
   
     
      this.personaService.getEstudiantePorDocumento(atob(localStorage.getItem(btoa("documento")))).subscribe((res) => {
   
        this.terceroEspecialista = res[0].TerceroId.Id;
        this.getInfoHistoria();
      });
    //});

  }


  getInfoHistoria() {
    this.saludService.getEspecialidad(1).subscribe((data: any) => {
      this.especialidad = data['Data'];
    });
    this.saludService.getHistoriaClinica(this.terceroId).subscribe((data: any) => {
      this.historiaClinica = data['Data'][0];
      // console.log(data);
      this.saludService.historia = data['Data'][0].Id;
      //HojaHistoria
      this.saludService.getHojaHistoria(this.terceroId, 1).subscribe(data => {//Reemplazar por terceroId
        //console.log(data);
        if (JSON.stringify(data['Data'][0]) === '{}') {
          this.estado = "nueva";
          this.crear = true;
          this.hideHistory = true;
          this.nombreEspecialista = "";
          if (!this.superAdmin) {
            this.medicinaForm.enable();
          }
          this.saludService.getAllEnfermeria(this.historiaClinica.Id).subscribe(data => {
            // console.log(data);
            if (JSON.stringify(data['Data'][0]) !== '{}') {
              this.enfermeria = data['Data'][0];
              this.medicinaForm.controls.ta.setValue(this.enfermeria.Ta);
              this.medicinaForm.controls.fc.setValue(this.enfermeria.Fc);
              this.medicinaForm.controls.sao2.setValue(this.enfermeria.Sao2);
              this.medicinaForm.controls.imc.setValue(this.enfermeria.Imc);
              this.medicinaForm.controls.fr.setValue(this.enfermeria.Fr);
              this.medicinaForm.controls.tc.setValue(this.enfermeria.Temperatura);
              this.medicinaForm.controls.peso.setValue(this.enfermeria.Peso);
              this.medicinaForm.controls.talla.setValue(this.enfermeria.Talla);
              this.medicinaForm.controls.estadoGeneral.setValue(this.enfermeria.EstadoGeneral);
              this.medicinaForm.controls.cabezaYCuello.setValue(this.enfermeria.CabezaYCuello);
              this.medicinaForm.controls.orl.setValue(this.enfermeria.Orl);
              this.medicinaForm.controls.ojos.setValue(this.enfermeria.Ojos);
              this.medicinaForm.controls.torax.setValue(this.enfermeria.Torax);
              this.medicinaForm.controls.ruidosRespiratorios.setValue(this.enfermeria.RuidosRespiratorios);
              this.medicinaForm.controls.ruidosCardiacos.setValue(this.enfermeria.RuidosCardiacos);
              this.medicinaForm.controls.abdomen.setValue(this.enfermeria.Abdomen);
              this.medicinaForm.controls.neurologicoE.setValue(this.enfermeria.Neurologico);
              this.medicinaForm.controls.genital.setValue(this.enfermeria.Genital);
              this.medicinaForm.controls.extremidades.setValue(this.enfermeria.Extremidades);
            }
          });
        } else {
          this.medicinaForm.controls.observacionesMedicina.enable();
          this.crear = false;
          this.listaHojas = data['Data'];
          this.firstOne = data['Data'][0].Id;
          this.estado = "vieja";
          this.hideHistory = false;
          this.hojaHistoria = data['Data'][0];
          this.medicinaForm.controls.motivoConsulta.setValue(this.hojaHistoria.Motivo);
          this.medicinaForm.controls.observacionesMedicina.setValue(this.hojaHistoria.Observacion);
          this.evolucion = [];
          this.analisis = [];
          let evolucion = JSON.parse(this.hojaHistoria.Evolucion);
          this.evolucion.push({ ...evolucion });
          let evolucion2 = this.evolucion[0].evolucion;
          for (let i = 0; i < evolucion2.length; i++) {
            this.evolucionArr.push(new FormControl(evolucion2[i]));
          }
          this.idHistoria = this.hojaHistoria.HistoriaClinica.Id;
          this.saludService.historia = this.idHistoria;
          this.getAntecedentes();
          //Sistemas
          this.saludService.getSistema(this.hojaHistoria.Id).subscribe(data => {
            // console.log(data);
            this.sistemas = data['Data'][0];
            this.medicinaForm.controls.articular.setValue(this.sistemas.Articular);
            this.medicinaForm.controls.cardioVascular.setValue(this.sistemas.CardioVascular);
            this.medicinaForm.controls.colageno.setValue(this.sistemas.Colageno);
            this.medicinaForm.controls.digestivo.setValue(this.sistemas.Digestivo);
            this.medicinaForm.controls.linfatico.setValue(this.sistemas.Linfatico);
            this.medicinaForm.controls.muscular.setValue(this.sistemas.Muscular);
            this.medicinaForm.controls.neurologico.setValue(this.sistemas.Neurologico);
            this.medicinaForm.controls.oseo.setValue(this.sistemas.Oseo);
            this.medicinaForm.controls.piel.setValue(this.sistemas.Piel);
            this.medicinaForm.controls.respiratorio.setValue(this.sistemas.Respiratorio);
            this.medicinaForm.controls.sentidos.setValue(this.sistemas.Sentidos);
            this.medicinaForm.controls.urinario.setValue(this.sistemas.Urinario);
            //Exámenes
            this.saludService.getExamen(this.hojaHistoria.Id).subscribe(data => {
              // console.log(data);
              this.examenes = data['Data'][0];
              this.medicinaForm.controls.examenes.setValue(this.examenes.Laboratorio);
              this.medicinaForm.controls.ta.setValue(this.examenes.Ta);
              this.medicinaForm.controls.fc.setValue(this.examenes.Fc);
              this.medicinaForm.controls.sao2.setValue(this.examenes.Sao2);
              this.medicinaForm.controls.imc.setValue(this.examenes.Imc);
              this.medicinaForm.controls.fr.setValue(this.examenes.Fr);
              this.medicinaForm.controls.tc.setValue(this.examenes.Temperatura);
              this.medicinaForm.controls.peso.setValue(this.examenes.Peso);
              this.medicinaForm.controls.talla.setValue(this.examenes.Talla);
              this.medicinaForm.controls.estadoGeneral.setValue(this.examenes.EstadoGeneral);
              this.medicinaForm.controls.cabezaYCuello.setValue(this.examenes.CabezaYCuello);
              this.medicinaForm.controls.orl.setValue(this.examenes.Orl);
              this.medicinaForm.controls.ojos.setValue(this.examenes.Ojos);
              this.medicinaForm.controls.torax.setValue(this.examenes.Torax);
              this.medicinaForm.controls.ruidosRespiratorios.setValue(this.examenes.RuidosRespiratorios);
              this.medicinaForm.controls.ruidosCardiacos.setValue(this.examenes.RuidosCardiacos);
              this.medicinaForm.controls.abdomen.setValue(this.examenes.Abdomen);
              this.medicinaForm.controls.neurologicoE.setValue(this.examenes.Neurologico);
              this.medicinaForm.controls.genital.setValue(this.examenes.Genital);
              this.medicinaForm.controls.extremidades.setValue(this.examenes.Extremidades);
            });
            //Diagnostico
            this.saludService.getDiagnostico(this.hojaHistoria.Id).subscribe(data => {
              // console.log(data[0]);
              this.diagnostico = data['Data'][0];
              this.medicinaForm.controls.diagnostico.setValue(this.diagnostico.Descripcion);
              this.medicinaForm.controls.planDeManejo.setValue(this.diagnostico.PlanDeManejo);
              this.medicinaForm.controls.medicamento.setValue(this.diagnostico.Medicamento);
              let analisis = JSON.parse(this.diagnostico.Analisis);
              this.analisis.push({ ...analisis });
              let analisis2 = this.analisis[0].analisis;
              for (let i = 0; i < analisis2.length; i++) {
                this.analisisArr.push(new FormControl(analisis2[i]));
              }
            });
            this.personaService.getDatosPersonalesPorTercero(this.hojaHistoria.Profesional).subscribe(data => {
              this.nombreEspecialista = data[0].TerceroId.NombreCompleto;
            });
          });
        }
      });
    });
  }
  getInfoHistoriaNuevaHoja() {
    this.saludService.getHojaHistoria(this.terceroId, 1).subscribe(data => {
      this.hojaHistoria = data['Data'][0];
      this.medicinaForm.controls.motivoConsulta.setValue(this.hojaHistoria.Motivo);
      this.idHistoria = this.hojaHistoria.HistoriaClinica.Id;
      this.saludService.historia = this.idHistoria;
      this.getAntecedentes();
      //Sistemas
      this.saludService.getSistema(this.hojaHistoria.Id).subscribe(data => {
        // console.log(data);
        this.sistemas = data['Data'][0];
        this.medicinaForm.controls.articular.setValue(this.sistemas.Articular);
        this.medicinaForm.controls.cardioVascular.setValue(this.sistemas.CardioVascular);
        this.medicinaForm.controls.colageno.setValue(this.sistemas.Colageno);
        this.medicinaForm.controls.digestivo.setValue(this.sistemas.Digestivo);
        this.medicinaForm.controls.linfatico.setValue(this.sistemas.Linfatico);
        this.medicinaForm.controls.muscular.setValue(this.sistemas.Muscular);
        this.medicinaForm.controls.neurologico.setValue(this.sistemas.Neurologico);
        this.medicinaForm.controls.oseo.setValue(this.sistemas.Oseo);
        this.medicinaForm.controls.piel.setValue(this.sistemas.Piel);
        this.medicinaForm.controls.respiratorio.setValue(this.sistemas.Respiratorio);
        this.medicinaForm.controls.sentidos.setValue(this.sistemas.Sentidos);
        this.medicinaForm.controls.urinario.setValue(this.sistemas.Urinario);
        //Exámenes
        this.saludService.getExamen(this.hojaHistoria.Id).subscribe(data => {
          // console.log(data);
          this.examenes = data['Data'][0];
          this.medicinaForm.controls.examenes.setValue(this.examenes.Laboratorio);
        });
        this.saludService.getAllEnfermeria(this.historiaClinica.Id).subscribe(data => {
          // console.log(data);
          if (JSON.stringify(data['Data'][0]) !== '{}') {
            this.enfermeria = data['Data'][0];
            this.medicinaForm.controls.ta.setValue(this.enfermeria.Ta);
            this.medicinaForm.controls.fc.setValue(this.enfermeria.Fc);
            this.medicinaForm.controls.sao2.setValue(this.enfermeria.Sao2);
            this.medicinaForm.controls.imc.setValue(this.enfermeria.Imc);
            this.medicinaForm.controls.fr.setValue(this.enfermeria.Fr);
            this.medicinaForm.controls.tc.setValue(this.enfermeria.Temperatura);
            this.medicinaForm.controls.peso.setValue(this.enfermeria.Peso);
            this.medicinaForm.controls.talla.setValue(this.enfermeria.Talla);
            this.medicinaForm.controls.estadoGeneral.setValue(this.enfermeria.EstadoGeneral);
            this.medicinaForm.controls.cabezaYCuello.setValue(this.enfermeria.CabezaYCuello);
            this.medicinaForm.controls.orl.setValue(this.enfermeria.Orl);
            this.medicinaForm.controls.ojos.setValue(this.enfermeria.Ojos);
            this.medicinaForm.controls.torax.setValue(this.enfermeria.Torax);
            this.medicinaForm.controls.ruidosRespiratorios.setValue(this.enfermeria.RuidosRespiratorios);
            this.medicinaForm.controls.ruidosCardiacos.setValue(this.enfermeria.RuidosCardiacos);
            this.medicinaForm.controls.abdomen.setValue(this.enfermeria.Abdomen);
            this.medicinaForm.controls.neurologicoE.setValue(this.enfermeria.Neurologico);
            this.medicinaForm.controls.genital.setValue(this.enfermeria.Genital);
            this.medicinaForm.controls.extremidades.setValue(this.enfermeria.Extremidades);
          }
        });
        //Diagnostico
        this.saludService.getDiagnostico(this.hojaHistoria.Id).subscribe(data => {
          // console.log(data[0]);
          this.diagnostico = data['Data'][0];
          this.medicinaForm.controls.diagnostico.setValue(this.diagnostico.Descripcion);
          this.medicinaForm.controls.planDeManejo.setValue(this.diagnostico.PlanDeManejo);
          this.medicinaForm.controls.medicamento.setValue(this.diagnostico.Medicamento);
        });
      });
    });
  }
  getHojaEspecifica(Id: any) {
    this.saludService.getHojaHistoriaEspecifica(Id).subscribe(data => {//Reemplazar por terceroId
      //console.log(data);
      this.hojaHistoria = data['Data'];
      this.medicinaForm.controls.motivoConsulta.setValue(this.hojaHistoria.Motivo);
      this.medicinaForm.controls.observacionesMedicina.setValue(this.hojaHistoria.Observacion);
      this.evolucion = [];
      this.analisis = [];
      let evolucion = JSON.parse(this.hojaHistoria.Evolucion);
      this.evolucion.push({ ...evolucion });
      let evolucion2 = this.evolucion[0].evolucion;
      for (let i = 0; i < evolucion2.length; i++) {
        this.evolucionArr.push(new FormControl(evolucion2[i]));
      }
      this.idHistoria = this.hojaHistoria.HistoriaClinica.Id;
      this.saludService.historia = this.idHistoria;
      this.getAntecedentes();
      //Sistemas
      this.saludService.getSistema(this.hojaHistoria.Id).subscribe(data => {
        // console.log(data);
        this.sistemas = data['Data'][0];
        this.medicinaForm.controls.articular.setValue(this.sistemas.Articular);
        this.medicinaForm.controls.cardioVascular.setValue(this.sistemas.CardioVascular);
        this.medicinaForm.controls.colageno.setValue(this.sistemas.Colageno);
        this.medicinaForm.controls.digestivo.setValue(this.sistemas.Digestivo);
        this.medicinaForm.controls.linfatico.setValue(this.sistemas.Linfatico);
        this.medicinaForm.controls.muscular.setValue(this.sistemas.Muscular);
        this.medicinaForm.controls.neurologico.setValue(this.sistemas.Neurologico);
        this.medicinaForm.controls.oseo.setValue(this.sistemas.Oseo);
        this.medicinaForm.controls.piel.setValue(this.sistemas.Piel);
        this.medicinaForm.controls.respiratorio.setValue(this.sistemas.Respiratorio);
        this.medicinaForm.controls.sentidos.setValue(this.sistemas.Sentidos);
        this.medicinaForm.controls.urinario.setValue(this.sistemas.Urinario);
        //Exámenes
        this.saludService.getExamen(this.hojaHistoria.Id).subscribe(data => {
          // console.log(data);
          this.examenes = data['Data'][0];
          this.medicinaForm.controls.examenes.setValue(this.examenes.Laboratorio);
          this.medicinaForm.controls.ta.setValue(this.examenes.Ta);
          this.medicinaForm.controls.fc.setValue(this.examenes.Fc);
          this.medicinaForm.controls.sao2.setValue(this.examenes.Sao2);
          this.medicinaForm.controls.imc.setValue(this.examenes.Imc);
          this.medicinaForm.controls.fr.setValue(this.examenes.Fr);
          this.medicinaForm.controls.tc.setValue(this.examenes.Temperatura);
          this.medicinaForm.controls.peso.setValue(this.examenes.Peso);
          this.medicinaForm.controls.talla.setValue(this.examenes.Talla);
          this.medicinaForm.controls.estadoGeneral.setValue(this.examenes.EstadoGeneral);
          this.medicinaForm.controls.cabezaYCuello.setValue(this.examenes.CabezaYCuello);
          this.medicinaForm.controls.orl.setValue(this.examenes.Orl);
          this.medicinaForm.controls.ojos.setValue(this.examenes.Ojos);
          this.medicinaForm.controls.torax.setValue(this.examenes.Torax);
          this.medicinaForm.controls.ruidosRespiratorios.setValue(this.examenes.RuidosRespiratorios);
          this.medicinaForm.controls.ruidosCardiacos.setValue(this.examenes.RuidosCardiacos);
          this.medicinaForm.controls.abdomen.setValue(this.examenes.Abdomen);
          this.medicinaForm.controls.neurologicoE.setValue(this.examenes.Neurologico);
          this.medicinaForm.controls.genital.setValue(this.examenes.Genital);
          this.medicinaForm.controls.extremidades.setValue(this.examenes.Extremidades);
        });
        //Diagnostico
        this.saludService.getDiagnostico(this.hojaHistoria.Id).subscribe(data => {
          // console.log(data[0]);
          this.diagnostico = data['Data'][0];
          this.medicinaForm.controls.diagnostico.setValue(this.diagnostico.Descripcion);
          this.medicinaForm.controls.planDeManejo.setValue(this.diagnostico.PlanDeManejo);
          this.medicinaForm.controls.medicamento.setValue(this.diagnostico.Medicamento);
          let analisis = JSON.parse(this.diagnostico.Analisis);
          this.analisis.push({ ...analisis });
          let analisis2 = this.analisis[0].analisis;
          for (let i = 0; i < analisis2.length; i++) {
            this.analisisArr.push(new FormControl(analisis2[i]));
          }
        });
        this.personaService.getDatosPersonalesPorTercero(this.hojaHistoria.Profesional).subscribe(data => {
          this.nombreEspecialista = data[0].TerceroId.NombreCompleto;
        });
      });
    });

  }
  guardarHistoriaMedicina() {
    this.medicinaForm.disable();
    let evolucionCorregida = JSON.stringify(this.evolucionArr.value);
    let evolucion = evolucionCorregida.slice(1, evolucionCorregida.length - 1);
    let evolucion2 = evolucion.replace(/]/g, "").replace(/\[/g, "");

    let analisisCorregido = JSON.stringify(this.analisisArr.value);
    let analisis = analisisCorregido.slice(1, analisisCorregido.length - 1);
    let analisis2 = analisis.replace(/]/g, "").replace(/\[/g, "");

    //POSTS
    //Antecedentes
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
        Motivo: this.medicinaForm.get('motivoConsulta').value,
        Observacion: this.medicinaForm.get('observacionesMedicina').value,
        FechaCreacion: new Date(),
        FechaModificacion: new Date(),
        Activo: true
      }
      this.saludService.postHojaHistoria(hojaHistoria).subscribe(data => {
        //console.log(data);
        this.estadoHoja = true;
        this.hojaHistoria = data['Data'];
        console.log('Hoja historia: ' + data['Data']);
        this.saludService.falloMedicina = false;
        if (!this.antecedentes) {
          const antecedentes: Antecedente = {
            Id: 0,
            HistoriaClinica: { Id: this.saludService.historia, Tercero: parseInt(this.terceroId) },
            Alergicos: this.medicinaForm.get('alergicos').value,
            Ccv: new Date(this.medicinaForm.controls.fuccv.value),
            Ciclos: this.medicinaForm.get('ciclos').value,
            CompañerosSexuales: this.medicinaForm.get('compañeros').value,
            Familiares: this.medicinaForm.get('familiares').value,
            Farmacologicos: this.medicinaForm.get('farmacologicos').value,
            Fog: this.medicinaForm.get('fo').value,
            Fup: this.medicinaForm.get('fup').value,
            Fur: this.medicinaForm.get('fur').value,
            GenitoUrinarios: this.medicinaForm.get('genitoUrinarios').value,
            Hospitalarios: this.medicinaForm.get('hospitalarios').value,
            Ias: this.medicinaForm.get('ias').value,
            Menarquia: this.medicinaForm.get('menarquia').value,
            Ocupacionales: this.medicinaForm.get('ocupacionales').value,
            Patologicos: this.medicinaForm.get('patologicos').value,
            Pp: this.medicinaForm.get('pp').value,
            Quirurgicos: this.medicinaForm.get('quirurgicos').value,
            ResultadoCcv: this.medicinaForm.controls.resultadoccv.value,
            ResultadoSeno: this.medicinaForm.controls.resultadoSeno.value,
            Seno: new Date(this.medicinaForm.controls.examenSeno.value),
            Traumaticos: this.medicinaForm.get('traumaticos').value,
            FechaCreacion: new Date(),
            FechaModificacion: new Date(),
            Activo: true
          }
          // console.log(this.antecedentes);

          this.saludService.postAntecedente(antecedentes).subscribe(data => {
            console.log('Antecedentes: ' + data['Data']);
            this.estadoAntecedente = true;
            this.comprobarHoja();
          }, error => {
            this.estadoAntecedente = false;
            this.toastr.error(error);
          });
        } else if (this.antecedentes) {
          const antecedentes: Antecedente = {
            Id: this.antecedentes.Id,
            HistoriaClinica: this.antecedentes.HistoriaClinica,
            Alergicos: this.medicinaForm.get('alergicos').value,
            Familiares: this.medicinaForm.get('familiares').value,
            Farmacologicos: this.medicinaForm.get('farmacologicos').value,
            GenitoUrinarios: this.medicinaForm.get('genitoUrinarios').value,
            Hospitalarios: this.medicinaForm.get('hospitalarios').value,
            Ocupacionales: this.medicinaForm.get('ocupacionales').value,
            Patologicos: this.medicinaForm.get('patologicos').value,
            Quirurgicos: this.medicinaForm.get('quirurgicos').value,
            Traumaticos: this.medicinaForm.get('traumaticos').value,
            Ias: this.medicinaForm.get('ias').value,
            Ccv: new Date(this.medicinaForm.controls.fuccv.value),
            Seno: new Date(this.medicinaForm.controls.examenSeno.value),
            Menarquia: this.medicinaForm.get('menarquia').value,
            CompañerosSexuales: this.medicinaForm.get('compañeros').value,
            ResultadoCcv: this.medicinaForm.controls.resultadoccv.value,
            ResultadoSeno: this.medicinaForm.controls.resultadoSeno.value,
            Ciclos: this.medicinaForm.get('ciclos').value,
            Pp: this.medicinaForm.get('pp').value,
            Fog: this.medicinaForm.get('fo').value,
            Fup: this.medicinaForm.get('fup').value,
            Fur: this.medicinaForm.get('fur').value,
            FechaCreacion: this.antecedentes.FechaCreacion,
            FechaModificacion: new Date(),
            Activo: true
          }
          this.saludService.putAntecedente(this.antecedentes.Id, antecedentes).subscribe(data => {
            console.log('Antecedentes: ' + data['Data']);
            this.estadoAntecedente = true;
            this.comprobarHoja();
          }, error => {
            this.estadoAntecedente = false;
            this.toastr.error(error);
          });

        }
        //Sistemas
        const sistemas: Sistemas = {
          HistoriaClinica: { Id: this.saludService.historia, Tercero: parseInt(this.terceroId) },
          HojaHistoria: this.hojaHistoria,
          Id: 0,
          Articular: this.medicinaForm.get('articular').value,
          CardioVascular: this.medicinaForm.get('cardioVascular').value,
          Colageno: this.medicinaForm.get('colageno').value,
          Digestivo: this.medicinaForm.get('digestivo').value,
          Linfatico: this.medicinaForm.get('linfatico').value,
          Muscular: this.medicinaForm.get('muscular').value,
          Neurologico: this.medicinaForm.get('neurologico').value,
          Oseo: this.medicinaForm.get('oseo').value,
          Piel: this.medicinaForm.get('piel').value,
          Respiratorio: this.medicinaForm.get('respiratorio').value,
          Sentidos: this.medicinaForm.get('sentidos').value,
          Urinario: this.medicinaForm.get('urinario').value,
          FechaCreacion: new Date(),
          FechaModificacion: new Date(),
          Activo: true
        }
        this.saludService.postSistema(sistemas).subscribe(data => {
          console.log('Sistemas: ' + data['Data']);
          this.estadoSistema = true;
          this.comprobarHoja();
        }, error => {
          this.estadoSistema = false;
          this.toastr.error(error);
        });
        const examenes: Examen = {
          HistoriaClinica: { Id: this.saludService.historia, Tercero: parseInt(this.terceroId) },
          HojaHistoria: this.hojaHistoria,
          Id: 0,
          Abdomen: this.medicinaForm.get('abdomen').value,
          CabezaYCuello: this.medicinaForm.get('cabezaYCuello').value,
          EstadoGeneral: this.medicinaForm.get('estadoGeneral').value,
          Extremidades: this.medicinaForm.get('extremidades').value,
          Fc: this.medicinaForm.get('fc').value,
          Fr: this.medicinaForm.get('fr').value,
          Genital: this.medicinaForm.get('genital').value,
          Imc: this.medicinaForm.get('imc').value,
          Laboratorio: this.medicinaForm.get('examenes').value,
          Neurologico: this.medicinaForm.get('neurologicoE').value,
          Ojos: this.medicinaForm.get('ojos').value,
          Orl: this.medicinaForm.get('orl').value,
          Peso: this.medicinaForm.get('peso').value,
          RuidosCardiacos: this.medicinaForm.get('ruidosCardiacos').value,
          RuidosRespiratorios: this.medicinaForm.get('ruidosRespiratorios').value,
          Sao2: this.medicinaForm.get('sao2').value,
          Ta: this.medicinaForm.get('ta').value,
          Talla: this.medicinaForm.get('talla').value,
          Temperatura: this.medicinaForm.get('tc').value,
          Torax: this.medicinaForm.get('torax').value,
          FechaCreacion: new Date(),
          FechaModificacion: new Date(),
          Activo: true
        }
        this.saludService.postExamen(examenes).subscribe(data => {
          console.log('Examenes: ' + data['Data']);
          this.estadoExamen = true;
          this.comprobarHoja();
        }, error => {
          this.estadoExamen = false;
          this.toastr.error(error);
        });
        //Diagnostico
        const diagnostico: Diagnostico = {
          Id: 0,
          HojaHistoria: this.hojaHistoria,
          HistoriaClinica: { Id: this.saludService.historia, Tercero: parseInt(this.terceroId) },
          Analisis: '{"analisis":[' + analisis2 + ']}',
          Descripcion: this.medicinaForm.get('diagnostico').value,
          PlanDeManejo: this.medicinaForm.get('planDeManejo').value,
          Medicamento: this.medicinaForm.get('medicamento').value,
          FechaCreacion: new Date(),
          FechaModificacion: new Date(),
          Activo: true
        }
        this.saludService.postDiagnostico(diagnostico).subscribe(data => {
          console.log('Diagnóstico: ' + data['Data']);
          this.estadoDiagnostico = true;
          this.comprobarHoja();
        }, error => {
          this.estadoDiagnostico = false;
          this.toastr.error(error);
        });
      }, error => {
        this.estadoHoja = false;
        this.toastr.error(error);
      });
      // console.log("crear");

    } else if (this.estado == "vieja") {
      //PUTS
      //Hoja historia clínica
      const hojaHistoria: HojaHistoria = {
        Id: this.hojaHistoria.Id,
        HistoriaClinica: this.hojaHistoria.HistoriaClinica,
        Evolucion: '{"evolucion":[' + evolucion2 + ']}',
        FechaConsulta: new Date(this.hojaHistoria.FechaConsulta),
        Especialidad: this.hojaHistoria.Especialidad,
        Persona: this.saludService.IdPersona,
        Profesional: this.hojaHistoria.Profesional,
        Motivo: this.medicinaForm.get('motivoConsulta').value,
        Observacion: this.medicinaForm.get('observacionesMedicina').value,
        FechaCreacion: this.hojaHistoria.FechaCreacion,
        FechaModificacion: new Date(),
        Activo: true
      }
      // console.log(hojaHistoria);
      this.saludService.putHojaHistoria(this.hojaHistoria.Id, hojaHistoria).subscribe(data => {
        console.log('Hoja historia: ' + data['Data']);
        this.estadoHoja = true;
        this.comprobarHoja();
      }, error => {
        this.estadoHoja = false;
        this.toastr.error(error);
      });
      //Antecedentes
      // console.log('Actualizar');
      const antecedentes: Antecedente = {
        Id: this.antecedentes.Id,
        HistoriaClinica: this.antecedentes.HistoriaClinica,
        Alergicos: this.medicinaForm.get('alergicos').value,
        Familiares: this.medicinaForm.get('familiares').value,
        Farmacologicos: this.medicinaForm.get('farmacologicos').value,
        GenitoUrinarios: this.medicinaForm.get('genitoUrinarios').value,
        Hospitalarios: this.medicinaForm.get('hospitalarios').value,
        Ocupacionales: this.medicinaForm.get('ocupacionales').value,
        Patologicos: this.medicinaForm.get('patologicos').value,
        Quirurgicos: this.medicinaForm.get('quirurgicos').value,
        Traumaticos: this.medicinaForm.get('traumaticos').value,
        Ias: this.medicinaForm.get('ias').value,
        Ccv: new Date(this.medicinaForm.controls.fuccv.value),
        Seno: new Date(this.medicinaForm.controls.examenSeno.value),
        Menarquia: this.medicinaForm.get('menarquia').value,
        CompañerosSexuales: this.medicinaForm.get('compañeros').value,
        ResultadoCcv: this.medicinaForm.controls.resultadoccv.value,
        ResultadoSeno: this.medicinaForm.controls.resultadoSeno.value,
        Ciclos: this.medicinaForm.get('ciclos').value,
        Pp: this.medicinaForm.get('pp').value,
        Fog: this.medicinaForm.get('fo').value,
        Fup: this.medicinaForm.get('fup').value,
        Fur: this.medicinaForm.get('fur').value,
        FechaCreacion: this.antecedentes.FechaCreacion,
        FechaModificacion: new Date(),
        Activo: true
      }
      this.saludService.putAntecedente(this.antecedentes.Id, antecedentes).subscribe(data => {
        console.log('Antecedentes: ' + data['Data']);
        this.estadoAntecedente = true;
        this.comprobarHoja();
      }, error => {
        this.estadoAntecedente = false;
        this.toastr.error(error);
      });
      //Sistemas
      const sistemas: Sistemas = {
        HistoriaClinica: this.sistemas.HistoriaClinica,
        HojaHistoria: this.sistemas.HojaHistoria,
        Id: this.sistemas.Id,
        Articular: this.medicinaForm.get('articular').value,
        CardioVascular: this.medicinaForm.get('cardioVascular').value,
        Colageno: this.medicinaForm.get('colageno').value,
        Digestivo: this.medicinaForm.get('digestivo').value,
        Linfatico: this.medicinaForm.get('linfatico').value,
        Muscular: this.medicinaForm.get('muscular').value,
        Neurologico: this.medicinaForm.get('neurologico').value,
        Oseo: this.medicinaForm.get('oseo').value,
        Piel: this.medicinaForm.get('piel').value,
        Respiratorio: this.medicinaForm.get('respiratorio').value,
        Sentidos: this.medicinaForm.get('sentidos').value,
        Urinario: this.medicinaForm.get('urinario').value,
        FechaCreacion: this.sistemas.FechaCreacion,
        FechaModificacion: new Date(),
        Activo: true
      }
      // console.log(sistemas);
      this.saludService.putSistema(this.sistemas.Id, sistemas).subscribe(data => {
        console.log('Sistemas: ' + data['Data']);
        this.estadoSistema = true;
        this.comprobarHoja();
      }, error => {
        this.estadoSistema = false;
        this.toastr.error(error);
      });
      //Examenes
      const examenes: Examen = {
        HistoriaClinica: this.examenes.HistoriaClinica,
        HojaHistoria: { Id: this.hojaHistoria.Id },
        Id: this.examenes.Id,
        Abdomen: this.medicinaForm.get('abdomen').value,
        CabezaYCuello: this.medicinaForm.get('cabezaYCuello').value,
        EstadoGeneral: this.medicinaForm.get('estadoGeneral').value,
        Extremidades: this.medicinaForm.get('extremidades').value,
        Fc: this.medicinaForm.get('fc').value,
        Fr: this.medicinaForm.get('fr').value,
        Genital: this.medicinaForm.get('genital').value,
        Imc: this.medicinaForm.get('imc').value,
        Laboratorio: this.medicinaForm.get('examenes').value,
        Neurologico: this.medicinaForm.get('neurologicoE').value,
        Ojos: this.medicinaForm.get('ojos').value,
        Orl: this.medicinaForm.get('orl').value,
        Peso: this.medicinaForm.get('peso').value,
        RuidosCardiacos: this.medicinaForm.get('ruidosCardiacos').value,
        RuidosRespiratorios: this.medicinaForm.get('ruidosRespiratorios').value,
        Sao2: this.medicinaForm.get('sao2').value,
        Ta: this.medicinaForm.get('ta').value,
        Talla: this.medicinaForm.get('talla').value,
        Temperatura: this.medicinaForm.get('tc').value,
        Torax: this.medicinaForm.get('torax').value,
        FechaCreacion: this.examenes.FechaCreacion,
        FechaModificacion: new Date(),
        Activo: true
      }
      this.saludService.putExamen(this.examenes.Id, examenes).subscribe(data => {
        console.log('Examenes: ' + data['Data']);
        this.estadoExamen = true;
        this.comprobarHoja();
      }, error => {
        this.estadoExamen = false;
        this.toastr.error(error);
      });
      //Diagnostico
      const diagnostico: Diagnostico = {
        Id: this.diagnostico.Id,
        HistoriaClinica: this.diagnostico.HistoriaClinica,
        HojaHistoria: { Id: this.hojaHistoria.Id },
        Analisis: '{"analisis":[' + analisis2 + ']}',
        Descripcion: this.medicinaForm.get('diagnostico').value,
        PlanDeManejo: this.medicinaForm.get('planDeManejo').value,
        Medicamento: this.medicinaForm.get('medicamento').value,
        FechaCreacion: this.diagnostico.FechaCreacion,
        FechaModificacion: new Date(),
        Activo: true
      }
      this.saludService.putDiagnostico(this.diagnostico.Id, diagnostico).subscribe(data => {
        console.log('Diagnóstico: ' + data['Data']);
        this.estadoDiagnostico = true;
        this.comprobarHoja();
      }, error => {
        this.estadoDiagnostico = false;
        this.toastr.error(error);
      });
    }
  }
  comprobarHoja() {
    if (this.estadoHoja && this.estadoAntecedente && this.estadoDiagnostico && this.estadoExamen && this.estadoSistema) {
      this.toastr.success(`Ha registrado con éxito la historia clínica de medicina`, '¡Guardado!');
      setTimeout(() => {
        window.location.reload();
      },
        1000);
    }
  }

  cambiarHoja(data: any) {
    this.analisisArr.clear();
    this.evolucionArr.clear();
    this.getHojaEspecifica(data);
  }

  getAntecedentes() {
    //Antecedente
    this.saludService.getAntecedente(this.saludService.historia).subscribe(data => {
      // console.log(data);
      this.antecedentes = data['Data'][0];
      // console.log(this.antecedentes);
      this.medicinaForm.controls.patologicos.setValue(this.antecedentes.Patologicos);
      this.medicinaForm.controls.hospitalarios.setValue(this.antecedentes.Hospitalarios);
      this.medicinaForm.controls.quirurgicos.setValue(this.antecedentes.Quirurgicos);
      this.medicinaForm.controls.traumaticos.setValue(this.antecedentes.Traumaticos);
      this.medicinaForm.controls.genitoUrinarios.setValue(this.antecedentes.GenitoUrinarios);
      this.medicinaForm.controls.alergicos.setValue(this.antecedentes.Alergicos);
      this.medicinaForm.controls.farmacologicos.setValue(this.antecedentes.Farmacologicos);
      this.medicinaForm.controls.familiares.setValue(this.antecedentes.Familiares);
      this.medicinaForm.controls.ocupacionales.setValue(this.antecedentes.Ocupacionales);
      let fechaCcv = new Date(this.antecedentes.Ccv);
      fechaCcv.setHours(fechaCcv.getHours() + 5);
      this.medicinaForm.controls.fuccv.setValue(fechaCcv);
      this.medicinaForm.controls.ciclos.setValue(this.antecedentes.Ciclos);
      this.medicinaForm.controls.compañeros.setValue(this.antecedentes.CompañerosSexuales);
      this.medicinaForm.controls.fo.setValue(this.antecedentes.Fog);
      this.medicinaForm.controls.fup.setValue(this.antecedentes.Fup);
      this.medicinaForm.controls.fur.setValue(this.antecedentes.Fur);
      this.medicinaForm.controls.ias.setValue(this.antecedentes.Ias);
      this.medicinaForm.controls.menarquia.setValue(this.antecedentes.Menarquia);
      this.medicinaForm.controls.pp.setValue(this.antecedentes.Pp);
      let fechaSeno = new Date(this.antecedentes.Seno);
      fechaSeno.setHours(fechaSeno.getHours() + 5);
      this.medicinaForm.controls.examenSeno.setValue(fechaSeno);
      this.medicinaForm.controls.resultadoccv.setValue(this.antecedentes.ResultadoCcv);
      this.medicinaForm.controls.resultadoSeno.setValue(this.antecedentes.ResultadoSeno);
    });
  }
  crearNuevaHoja() {
    this.medicinaForm.reset();
    this.analisisArr.clear();
    this.evolucionArr.clear();
    this.crear = true;
    this.getInfoHistoriaNuevaHoja();
    this.estado = "nueva";
    this.medicinaForm.enable();
    this.hideHistory = true;
    this.nombreEspecialista = "";
  }

  async openPdf() {
    let fechaActual = new (Date);
    let pipe = new DatePipe('en_US');
    let myFormattedDate = pipe.transform(fechaActual, 'short');
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

        { text: '\n\nMedicamentos recetados - Módulo medicina\n', style: 'secondTitle' },
        { text: '\n' + this.medicinaForm.controls.medicamento.value }
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