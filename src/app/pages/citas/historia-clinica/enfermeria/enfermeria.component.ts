import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ListService } from '../../../../@core/store/list.service';
import { Enfermeria } from '../../../../shared/models/Salud/enfermeria.model';
import { Especialidad } from '../../../../shared/models/Salud/especialidad.model';
import { HistoriaClinica } from '../../../../shared/models/Salud/historiaClinica.model';
import { HojaHistoria } from '../../../../shared/models/Salud/hojaHistoria.model';
import { EstudiantesService } from '../../../../shared/services/estudiantes.service';
import { SaludService } from '../../../../shared/services/salud.service';

@Component({
  selector: 'ngx-enfermeria',
  templateUrl: './enfermeria.component.html',
  styleUrls: ['../historia-clinica.component.css']
})
export class EnfermeriaComponent implements OnInit {
  crear: boolean = false;
  superAdmin: boolean = false;
  firstOne: any;
  hideHistory: boolean = false;
  especialidad: Especialidad;
  listaHojas: any = [];
  estado: string;
  relaciones: any;
  terceroId: any;
  Historia: HistoriaClinica;
  HojaHistoria: HojaHistoria;
  paciente: string;
  enfermeria: Enfermeria;
  enfermeriaForm: FormGroup = this.fb.group({
    descripcion: [''],
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
  })
  nombreEspecialista: any;
  terceroEspecialista: any;
  estadoHoja: boolean = false;
  estadoEnfermeria: boolean = false;

  constructor(private fb: FormBuilder, private toastr: ToastrService, private saludService: SaludService, private personaService: EstudiantesService, private aRoute: ActivatedRoute, private listService: ListService) { }

  ngOnInit() {
    this.enfermeriaForm.disable();
    this.terceroId = this.aRoute.snapshot.paramMap.get('terceroId');
    //console.log(this.saludService.IdPersona);
    this.personaService.getEstudiante(this.saludService.IdPersona).subscribe((data: any) => {
      var paciente = data.datosEstudianteCollection.datosBasicosEstudiante[0];
      this.paciente = paciente.nombre;
    });
    this.listService.getInfoEstudiante().then((resp) => {
      //console.log(resp);
      if (resp.role.includes('SUPER_ADMIN_BIENESTAR')) {
        this.enfermeriaForm.disable();
        this.superAdmin = true;
      }
      this.personaService.getEstudiantePorDocumento(resp.documento).subscribe((res) => {
        //console.log(res);
        this.terceroEspecialista = res[0].TerceroId.Id;
        this.getInfoEnfermeria();
      });
    });
  }
  crearNuevaHoja() {
    this.crear = true
    this.enfermeriaForm.reset();
    this.getInfoEnfermeriaNuevaHoja();
    this.enfermeriaForm.enable();
    this.estado = "nueva";
    this.hideHistory = true;
    this.nombreEspecialista = "";
  }
  cambiarHoja(data: any) {
    this.getHojaEspecifica(data);
  }
  guardarHistoriaEnfermeria() {
    this.enfermeriaForm.disable();
    if (this.estado == "nueva") {
      let fechaActual = new (Date);
      fechaActual.setHours(fechaActual.getHours() - 5);
      const hojaHistoria: HojaHistoria = {
        Id: 0,
        HistoriaClinica: { Id: this.Historia.Id, Tercero: parseInt(this.terceroId) },
        Evolucion: null,
        FechaConsulta: fechaActual,
        Especialidad: this.especialidad,
        Persona: this.saludService.IdPersona,
        Profesional: this.terceroEspecialista,
        Motivo: null,
        Observacion: null,
        FechaCreacion: new Date(),
        FechaModificacion: new Date(),
        Activo: true
      }
      //console.log(hojaHistoria);
      this.saludService.postHojaHistoria(hojaHistoria).subscribe(data => {
        this.estadoHoja = true;
        this.HojaHistoria = data['Data'];
        console.log('Hoja historia: ' + data['Data']);
        this.saludService.falloMedicina = false;
        const enfermeria: Enfermeria = {
          Descripcion: this.enfermeriaForm.get('descripcion').value,
          Abdomen: this.enfermeriaForm.get('abdomen').value,
          CabezaYCuello: this.enfermeriaForm.get('cabezaYCuello').value,
          EstadoGeneral: this.enfermeriaForm.get('estadoGeneral').value,
          Extremidades: this.enfermeriaForm.get('extremidades').value,
          Fc: this.enfermeriaForm.get('fc').value,
          Fr: this.enfermeriaForm.get('fr').value,
          Genital: this.enfermeriaForm.get('genital').value,
          Imc: this.enfermeriaForm.get('imc').value,
          Neurologico: this.enfermeriaForm.get('neurologicoE').value,
          Ojos: this.enfermeriaForm.get('ojos').value,
          Orl: this.enfermeriaForm.get('orl').value,
          Peso: this.enfermeriaForm.get('peso').value,
          RuidosCardiacos: this.enfermeriaForm.get('ruidosCardiacos').value,
          RuidosRespiratorios: this.enfermeriaForm.get('ruidosRespiratorios').value,
          Sao2: this.enfermeriaForm.get('sao2').value,
          Ta: this.enfermeriaForm.get('ta').value,
          Talla: this.enfermeriaForm.get('talla').value,
          Temperatura: this.enfermeriaForm.get('tc').value,
          Torax: this.enfermeriaForm.get('torax').value,
          HistoriaClinica: { Id: this.Historia.Id, Tercero: parseInt(this.terceroId) },
          Id: 0,
          HojaHistoria: { Id: this.HojaHistoria.Id },
          FechaCreacion: new Date(),
          FechaModificacion: new Date(),
          Activo: true
        }
        // console.log(enfermeria);
        this.saludService.postEnfermeria(enfermeria).subscribe(data => {
          console.log('NotasEnfermería: ' + data['Data']);
          this.estadoEnfermeria = true;
          this.comprobarHoja();
        }, error => {
          this.estadoEnfermeria = false;
          this.toastr.error(error);
        });
      });
    } else if (this.estado == "vieja") {
      ///ACTUALIZACIÓN 
      // PUTS
      //Hoja historia clínica
      const hojaHistoria: HojaHistoria = {
        Id: this.HojaHistoria.Id,
        HistoriaClinica: this.HojaHistoria.HistoriaClinica,
        Evolucion: null,
        FechaConsulta: new Date(this.HojaHistoria.FechaConsulta),
        Especialidad: this.HojaHistoria.Especialidad,
        Persona: this.saludService.IdPersona,
        Profesional: this.HojaHistoria.Profesional,
        Motivo: null,
        Observacion: null,
        FechaCreacion: this.HojaHistoria.FechaCreacion,
        FechaModificacion: new Date(),
        Activo: true
      }
      // console.log(hojaHistoria);
      this.saludService.putHojaHistoria(this.HojaHistoria.Id, hojaHistoria).subscribe(data => {
        console.log('Hoja historia: ' + data['Data']);
        this.estadoHoja = true;
        this.comprobarHoja();
      }, error => {
        this.estadoHoja = false;
        this.toastr.error(error);
      });
      const enfermeria: Enfermeria = {
        Descripcion: this.enfermeriaForm.get('descripcion').value,
        Abdomen: this.enfermeriaForm.get('abdomen').value,
        CabezaYCuello: this.enfermeriaForm.get('cabezaYCuello').value,
        EstadoGeneral: this.enfermeriaForm.get('estadoGeneral').value,
        Extremidades: this.enfermeriaForm.get('extremidades').value,
        Fc: this.enfermeriaForm.get('fc').value,
        Fr: this.enfermeriaForm.get('fr').value,
        Genital: this.enfermeriaForm.get('genital').value,
        Imc: this.enfermeriaForm.get('imc').value,
        Neurologico: this.enfermeriaForm.get('neurologicoE').value,
        Ojos: this.enfermeriaForm.get('ojos').value,
        Orl: this.enfermeriaForm.get('orl').value,
        Peso: this.enfermeriaForm.get('peso').value,
        RuidosCardiacos: this.enfermeriaForm.get('ruidosCardiacos').value,
        RuidosRespiratorios: this.enfermeriaForm.get('ruidosRespiratorios').value,
        Sao2: this.enfermeriaForm.get('sao2').value,
        Ta: this.enfermeriaForm.get('ta').value,
        Talla: this.enfermeriaForm.get('talla').value,
        Temperatura: this.enfermeriaForm.get('tc').value,
        Torax: this.enfermeriaForm.get('torax').value,
        HistoriaClinica: this.HojaHistoria.HistoriaClinica,
        HojaHistoria: { Id: this.HojaHistoria.Id },
        Id: this.enfermeria.Id,
        FechaCreacion: this.HojaHistoria.FechaCreacion,
        FechaModificacion: new Date(),
        Activo: true
      }
      //console.log(enfermeria);
      this.saludService.putEnfermeria(this.enfermeria.Id, enfermeria).subscribe(data => {
        // console.log(data);
        console.log('NotasEnfermería: ' + data['Data']);
        this.estadoEnfermeria = true;
        this.comprobarHoja();
      }, error => {
        this.estadoEnfermeria = false;
        this.toastr.error(error);
      });
    }
  }
  comprobarHoja() {
    if (this.estadoEnfermeria && this.estadoHoja) {
      this.toastr.success(`Ha registrado con éxito la historia clínica de enfermería para: ${this.paciente}`, '¡Guardado!');
      setTimeout(() => {
        window.location.reload();
      },
        1000);
    }
  }
  getHojaEspecifica(Id: any) {
    this.saludService.getHojaHistoriaEspecifica(Id).subscribe(data => {//Reemplazar por terceroId
      //console.log(data);
      this.HojaHistoria = data['Data'];
      this.saludService.getEnfermeria(this.HojaHistoria.Id).subscribe(data => {
        this.enfermeria = data['Data'][0];
        this.enfermeriaForm.controls.descripcion.setValue(this.enfermeria.Descripcion);
        this.enfermeriaForm.controls.abdomen.setValue(this.enfermeria.Abdomen);
        this.enfermeriaForm.controls.cabezaYCuello.setValue(this.enfermeria.CabezaYCuello);
        this.enfermeriaForm.controls.estadoGeneral.setValue(this.enfermeria.EstadoGeneral);
        this.enfermeriaForm.controls.extremidades.setValue(this.enfermeria.Extremidades);
        this.enfermeriaForm.controls.fc.setValue(this.enfermeria.Fc);
        this.enfermeriaForm.controls.fr.setValue(this.enfermeria.Fr);
        this.enfermeriaForm.controls.genital.setValue(this.enfermeria.Genital);
        this.enfermeriaForm.controls.imc.setValue(this.enfermeria.Imc);
        this.enfermeriaForm.controls.neurologicoE.setValue(this.enfermeria.Neurologico);
        this.enfermeriaForm.controls.ojos.setValue(this.enfermeria.Ojos);
        this.enfermeriaForm.controls.orl.setValue(this.enfermeria.Orl);
        this.enfermeriaForm.controls.peso.setValue(this.enfermeria.Peso);
        this.enfermeriaForm.controls.ruidosCardiacos.setValue(this.enfermeria.RuidosCardiacos);
        this.enfermeriaForm.controls.ruidosRespiratorios.setValue(this.enfermeria.RuidosRespiratorios);
        this.enfermeriaForm.controls.sao2.setValue(this.enfermeria.Sao2);
        this.enfermeriaForm.controls.ta.setValue(this.enfermeria.Ta);
        this.enfermeriaForm.controls.talla.setValue(this.enfermeria.Talla);
        this.enfermeriaForm.controls.tc.setValue(this.enfermeria.Temperatura);
        this.enfermeriaForm.controls.torax.setValue(this.enfermeria.Torax);
      });
      this.personaService.getDatosPersonalesPorTercero(this.HojaHistoria.Profesional).subscribe(data => {
        this.nombreEspecialista = data[0].TerceroId.NombreCompleto;
      });
    });
  }
  getInfoEnfermeria() {
    this.saludService.getEspecialidad(5).subscribe((data: any) => {
      this.especialidad = data['Data'];
    });
    this.saludService.getHistoriaClinica(this.terceroId).subscribe((data: any) => {  ///Remplazar para pruebas
      this.Historia = data['Data'][0];
      // console.log(data);
      this.saludService.getHojaHistoria(this.terceroId, 5).subscribe(data => {
        if (JSON.stringify(data['Data'][0]) === '{}') {
          this.crear = true;
          this.estado = "nueva";
          if (!this.superAdmin) {
            this.enfermeriaForm.enable();
          }
          this.hideHistory = true;
          this.nombreEspecialista = "";
        } else {
          this.crear = false;
          this.listaHojas = data['Data'];
          this.firstOne = data['Data'][0].Id;
          this.estado = "vieja";
          this.hideHistory = false;
          this.HojaHistoria = data['Data'][0];
          this.saludService.getEnfermeria(this.HojaHistoria.Id).subscribe(data => {
            this.enfermeria = data['Data'][0];
            // console.log(this.enfermeria);
            this.enfermeriaForm.controls.descripcion.setValue(this.enfermeria.Descripcion);
            this.enfermeriaForm.controls.abdomen.setValue(this.enfermeria.Abdomen);
            this.enfermeriaForm.controls.cabezaYCuello.setValue(this.enfermeria.CabezaYCuello);
            this.enfermeriaForm.controls.estadoGeneral.setValue(this.enfermeria.EstadoGeneral);
            this.enfermeriaForm.controls.extremidades.setValue(this.enfermeria.Extremidades);
            this.enfermeriaForm.controls.fc.setValue(this.enfermeria.Fc);
            this.enfermeriaForm.controls.fr.setValue(this.enfermeria.Fr);
            this.enfermeriaForm.controls.genital.setValue(this.enfermeria.Genital);
            this.enfermeriaForm.controls.imc.setValue(this.enfermeria.Imc);
            this.enfermeriaForm.controls.neurologicoE.setValue(this.enfermeria.Neurologico);
            this.enfermeriaForm.controls.ojos.setValue(this.enfermeria.Ojos);
            this.enfermeriaForm.controls.orl.setValue(this.enfermeria.Orl);
            this.enfermeriaForm.controls.peso.setValue(this.enfermeria.Peso);
            this.enfermeriaForm.controls.ruidosCardiacos.setValue(this.enfermeria.RuidosCardiacos);
            this.enfermeriaForm.controls.ruidosRespiratorios.setValue(this.enfermeria.RuidosRespiratorios);
            this.enfermeriaForm.controls.sao2.setValue(this.enfermeria.Sao2);
            this.enfermeriaForm.controls.ta.setValue(this.enfermeria.Ta);
            this.enfermeriaForm.controls.talla.setValue(this.enfermeria.Talla);
            this.enfermeriaForm.controls.tc.setValue(this.enfermeria.Temperatura);
            this.enfermeriaForm.controls.torax.setValue(this.enfermeria.Torax);
          });
          this.personaService.getDatosPersonalesPorTercero(this.HojaHistoria.Profesional).subscribe(data => {
            this.nombreEspecialista = data[0].TerceroId.NombreCompleto;
          });
        }
      });
    });
  }
  getInfoEnfermeriaNuevaHoja() {
    this.saludService.getHojaHistoria(this.terceroId, 5).subscribe(data => {
      this.HojaHistoria = data['Data'][0];
      this.saludService.getEnfermeria(this.HojaHistoria.Id).subscribe(data => {
        this.enfermeria = data['Data'][0];
        // console.log(this.enfermeria);
        this.enfermeriaForm.controls.descripcion.setValue(this.enfermeria.Descripcion);
        this.enfermeriaForm.controls.abdomen.setValue(this.enfermeria.Abdomen);
        this.enfermeriaForm.controls.cabezaYCuello.setValue(this.enfermeria.CabezaYCuello);
        this.enfermeriaForm.controls.estadoGeneral.setValue(this.enfermeria.EstadoGeneral);
        this.enfermeriaForm.controls.extremidades.setValue(this.enfermeria.Extremidades);
        this.enfermeriaForm.controls.fc.setValue(this.enfermeria.Fc);
        this.enfermeriaForm.controls.fr.setValue(this.enfermeria.Fr);
        this.enfermeriaForm.controls.genital.setValue(this.enfermeria.Genital);
        this.enfermeriaForm.controls.imc.setValue(this.enfermeria.Imc);
        this.enfermeriaForm.controls.neurologicoE.setValue(this.enfermeria.Neurologico);
        this.enfermeriaForm.controls.ojos.setValue(this.enfermeria.Ojos);
        this.enfermeriaForm.controls.orl.setValue(this.enfermeria.Orl);
        this.enfermeriaForm.controls.peso.setValue(this.enfermeria.Peso);
        this.enfermeriaForm.controls.ruidosCardiacos.setValue(this.enfermeria.RuidosCardiacos);
        this.enfermeriaForm.controls.ruidosRespiratorios.setValue(this.enfermeria.RuidosRespiratorios);
        this.enfermeriaForm.controls.sao2.setValue(this.enfermeria.Sao2);
        this.enfermeriaForm.controls.ta.setValue(this.enfermeria.Ta);
        this.enfermeriaForm.controls.talla.setValue(this.enfermeria.Talla);
        this.enfermeriaForm.controls.tc.setValue(this.enfermeria.Temperatura);
        this.enfermeriaForm.controls.torax.setValue(this.enfermeria.Torax);
      });
    });
  }

}
