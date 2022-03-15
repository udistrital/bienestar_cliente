import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConsultaFisioterapia } from '../../../../shared/models/Salud/consultaFisioterapia.model';
import { Especialidad } from '../../../../shared/models/Salud/especialidad.model';
import { Evolucion } from '../../../../shared/models/Salud/evolucion.model';
import { HistoriaClinica } from '../../../../shared/models/Salud/historiaClinica.model';
import { HojaHistoria } from '../../../../shared/models/Salud/hojaHistoria.model';
import { EstudiantesService } from '../../../../shared/services/estudiantes.service';
import { SaludService } from '../../../../shared/services/salud.service';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { Utils } from '../../../../shared/utils/utils';
import { DatePipe } from '@angular/common';
import { ListService } from '../../../../@core/store/list.service';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'ngx-fisioterapia',
  templateUrl: './fisioterapia.component.html',
  styleUrls: ['../historia-clinica.component.css']
})
export class FisioterapiaComponent implements OnInit {
  firstOne: any;
  superAdmin: boolean = false;
  hideHistory: boolean = false;
  listaHojas: any = [];
  estado: string;
  especialidad: Especialidad;
  historiaNueva: HistoriaClinica;
  hojahistoria: HojaHistoria;
  idHistoria: number | null;
  terceroId: any;
  fisioterapia: ConsultaFisioterapia | null;
  evolucion: Evolucion[] = [];
  paciente: string;
  nuevaEvolucionFisio: FormControl = this.fb.control('');
  fisioterapiaForm: FormGroup = this.fb.group({
    motivoConsultaFisio: [null],
    valoracion: [null],
    diagnostico: [null],
    planDeManejoFisio: [null],
    observacionesFisioterapia: [null],
    medicamento: [null],
    evolucionFisio: this.fb.array([]),
  })
  nombreEspecialista: any;
  terceroEspecialista: any;
  logoDataUrl: string;
  estadoHoja: boolean = false;
  estadoFisio: boolean = false;
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
      if (resp.role.includes('SUPER_ADMIN_BIENESTAR')){
        this.fisioterapiaForm.disable();
        this.superAdmin = true;
      }
      this.personaService.getEstudiantePorDocumento(resp.documento).subscribe((res) => {
        //console.log(res);
        this.terceroEspecialista = res[0].TerceroId.Id;
        this.cargarInformacion();
      });
    });
  }
  get evolucionFisioArr() {
    return this.fisioterapiaForm.get('evolucionFisio') as FormArray;
  }
  agregarEvolucionFisio() {
    if (this.nuevaEvolucionFisio.invalid) {
      return
    }
    this.evolucionFisioArr.push(new FormControl(this.nuevaEvolucionFisio.value));
    this.nuevaEvolucionFisio.reset();
  }
  borrarEvolucionFisio(i: number) {
    this.evolucionFisioArr.removeAt(i);
  }

  cargarInformacion() {

    this.saludService.getEspecialidad(2).subscribe((data: any) => {
      this.especialidad = data['Data'];
    });
    this.saludService.getHistoriaClinica(this.terceroId).subscribe((data: any) => {
      this.idHistoria = data['Data'][0].Id;
      this.saludService.getHojaHistoria(parseInt(this.terceroId), 2).subscribe(data => {
        if (JSON.stringify(data['Data'][0]) === '{}') {
          this.estado = "nueva";
          this.hideHistory = true;
          this.nombreEspecialista = "";
        } else {
          this.listaHojas = data['Data'];
          this.firstOne = data['Data'][0].Id;
          this.estado = "vieja";
          this.hideHistory = false;
          this.hojahistoria = data['Data'][0];
          this.fisioterapiaForm.controls.motivoConsultaFisio.setValue(this.hojahistoria.Motivo);
          this.fisioterapiaForm.controls.observacionesFisioterapia.setValue(this.hojahistoria.Observacion);
          this.evolucion = [];
          let evolucion = JSON.parse(this.hojahistoria.Evolucion) || [];
          this.evolucion.push({ ...evolucion });
          let evolucion2: any = this.evolucion[0].evolucion;
          for (let i = 0; i < evolucion2.length; i++) {
            this.evolucionFisioArr.push(new FormControl(evolucion2[i]));
          }
          this.saludService.getConsultaFisioterapia(this.hojahistoria.Id).subscribe(data => {
            // console.log(data);
            this.fisioterapia = data['Data'][0] || '';
            this.fisioterapiaForm.controls.valoracion.setValue(this.fisioterapia.Valoracion);
            this.fisioterapiaForm.controls.planDeManejoFisio.setValue(this.fisioterapia.PlanManejo);
            this.fisioterapiaForm.controls.diagnostico.setValue(this.fisioterapia.Diagnostico);
            this.fisioterapiaForm.controls.medicamento.setValue(this.fisioterapia.Medicamento);
          }
          );
          this.personaService.getDatosPersonalesPorTercero(this.hojahistoria.Profesional).subscribe(data => {
            this.nombreEspecialista = data[0].TerceroId.NombreCompleto;
          });
        }
      });
    });
  }

  guardarHistoriaFisioterapia() {
    this.fisioterapiaForm.disable();
    let evolucionCorregida = JSON.stringify(this.evolucionFisioArr.value);
    let evolucion = evolucionCorregida.slice(1, evolucionCorregida.length - 1);
    let evolucion2 = evolucion.replace(/]/g, "").replace(/\[/g, "");
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
        Motivo: this.fisioterapiaForm.get('motivoConsultaFisio').value,
        Observacion: this.fisioterapiaForm.get('observacionesFisioterapia').value,
        FechaCreacion: new Date(),
        FechaModificacion: new Date(),
        Activo: true
      }
      this.saludService.postHojaHistoria(hojaHistoria).subscribe(data => {
        //console.log(data);
        this.estadoHoja = true;
        this.hojahistoria = data['Data'];
        console.log('Hoja historia: ' + data['Data']);
        this.saludService.falloMedicina = false;
        const consultaFisio: ConsultaFisioterapia = {
          Id: 0,
          HojaHistoria: this.hojahistoria,
          HistoriaClinica: { Id: this.saludService.historia, Tercero: parseInt(this.terceroId) },
          Valoracion: this.fisioterapiaForm.get('valoracion').value,
          PlanManejo: this.fisioterapiaForm.get('planDeManejoFisio').value,
          Diagnostico: this.fisioterapiaForm.get('diagnostico').value,
          Medicamento: this.fisioterapiaForm.get('medicamento').value,
          FechaCreacion: new Date(),
          FechaModificacion: new Date(),
          Activo: true
        };
        // console.log(historiaFisio);
        this.saludService.postFisioterapia(consultaFisio).subscribe(data => {
          console.log('Fisioterapia: ' + data['Data']);
          this.estadoFisio = true;
          this.comprobarHoja();
        }, error => {
          this.estadoFisio = false;
          this.toastr.error(error);
        }
        );
      });
    }
    else if (this.estado == "vieja") {
      const hojaHistoria: HojaHistoria = {
        Id: this.hojahistoria.Id,
        HistoriaClinica: this.hojahistoria.HistoriaClinica,
        Evolucion: '{"evolucion":[' + evolucion2 + ']}',
        FechaConsulta: new Date(this.hojahistoria.FechaConsulta),
        Especialidad: this.hojahistoria.Especialidad,
        Persona: this.saludService.IdPersona,
        Profesional: this.hojahistoria.Profesional,
        Motivo: this.fisioterapiaForm.get('motivoConsultaFisio').value,
        Observacion: this.fisioterapiaForm.get('observacionesFisioterapia').value,
        FechaCreacion: this.hojahistoria.FechaCreacion,
        FechaModificacion: new Date(),
        Activo: true
      }
      // console.log(hojaHistoria);
      this.saludService.putHojaHistoria(this.hojahistoria.Id, hojaHistoria).subscribe(data => {
        console.log('Hoja historia: ' + data['Data']);
        this.estadoHoja = true;
        this.comprobarHoja();
      }, error => {
        this.estadoHoja = false;
        this.toastr.error(error);
      });
      const consultaFisio: ConsultaFisioterapia = {
        Id: this.fisioterapia.Id,
        HojaHistoria: this.hojahistoria,
        HistoriaClinica: { Id: this.saludService.historia, Tercero: parseInt(this.terceroId) },
        Valoracion: this.fisioterapiaForm.get('valoracion').value,
        PlanManejo: this.fisioterapiaForm.get('planDeManejoFisio').value,
        Diagnostico: this.fisioterapiaForm.get('diagnostico').value,
        Medicamento: this.fisioterapiaForm.get('medicamento').value,
        FechaCreacion: this.fisioterapia.FechaCreacion,
        FechaModificacion: new Date(),
        Activo: true
      };
      // console.log(historiaFisio);
      this.saludService.putFisioterapia(this.fisioterapia.Id, consultaFisio).subscribe(data => {
        console.log('Fisioterapia: ' + data['Data']);
        this.estadoFisio = true;
        this.comprobarHoja();
      }, error => {
        this.estadoFisio = false;
        this.toastr.error(error);
      }
      );
    }

  }
  comprobarHoja(){
    if (this.estadoHoja && this.estadoFisio){
      this.toastr.success(`Ha registrado con éxito la historia clínica de fisioterapia para: ${this.paciente}`, '¡Guardado!');
        setTimeout(() => {
          window.location.reload();
        },
          1000);
    }
  }
  cambiarHoja(data: any) {
    this.evolucionFisioArr.clear();
    this.getHojaEspecifica(data);
  }
  getHojaEspecifica(Id: any) {
    this.saludService.getHojaHistoriaEspecifica(Id).subscribe(data => {//Reemplazar por terceroId
      //console.log(data);
      this.hojahistoria = data['Data'];
      this.fisioterapiaForm.controls.motivoConsultaFisio.setValue(this.hojahistoria.Motivo);
      this.fisioterapiaForm.controls.observacionesFisioterapia.setValue(this.hojahistoria.Observacion);
      this.evolucion = [];
      let evolucion = JSON.parse(this.hojahistoria.Evolucion) || [];
      this.evolucion.push({ ...evolucion });
      let evolucion2: any = this.evolucion[0].evolucion;
      for (let i = 0; i < evolucion2.length; i++) {
        this.evolucionFisioArr.push(new FormControl(evolucion2[i]));
      }
      this.saludService.getConsultaFisioterapia(this.hojahistoria.Id).subscribe(data => {
        // console.log(data);
        this.fisioterapia = data['Data'][0] || '';
        this.fisioterapiaForm.controls.valoracion.setValue(this.fisioterapia.Valoracion);
        this.fisioterapiaForm.controls.planDeManejoFisio.setValue(this.fisioterapia.PlanManejo);
        this.fisioterapiaForm.controls.diagnostico.setValue(this.fisioterapia.Diagnostico);
        this.fisioterapiaForm.controls.medicamento.setValue(this.fisioterapia.Medicamento);
      }
      );
      this.personaService.getDatosPersonalesPorTercero(this.hojahistoria.Profesional).subscribe(data => {
        this.nombreEspecialista = data[0].TerceroId.NombreCompleto;
      });
    }
    );
  }
  crearNuevaHoja() {
    this.fisioterapiaForm.reset();
    this.estado = "nueva";
    this.evolucionFisioArr.clear();
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
        
        { text: '\n\nMedicamentos recetados - Módulo fisioterapia\n', style: 'secondTitle' },
        {text: '\n'+this.fisioterapiaForm.controls.medicamento.value}
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
