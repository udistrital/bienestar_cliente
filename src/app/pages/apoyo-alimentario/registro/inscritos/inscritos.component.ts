import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
import { SedeModel } from '../../modelos/sede.model'
import { RegistroInscritoModel } from '../../modelos/registroInscrito.model'
import { FechaModel } from '../../modelos/fecha.model';
import { FechasService } from '../../servicios/fechas.service'
import { RegistrosInscritosService } from '../../servicios/registros-inscritos.service'
import { SedesService } from '../../servicios/sedes.service'
import { NbGlobalPhysicalPosition, NbToastrService ,NbToast} from '@nebular/theme';


@Component({
  selector: 'ngx-inscritos',
  templateUrl: './inscritos.component.html',
  styleUrls: ['./inscritos.component.scss']
})
export class InscritosComponent implements OnInit {

  inscritos: boolean;
  sedesTemp: SedeModel[] = [];
  sedesAccesso: SedeModel[] = []
  /* sedesAccesso = ["Ingenieria","Macarena","Vivero", "Bosa"];  */
  registosAprovados: string[] = []
  registroBase = new RegistroInscritoModel();

  fechaActual = new FechaModel();

  constructor(private fechasService: FechasService,
    private registroInscritoService: RegistrosInscritosService,
    private sedesService: SedesService,
    private router: Router, private route: ActivatedRoute,
    private toastrService: NbToastrService,) { }

  async ngOnInit() {
    this.inscritos = true;
    let tipo = this.route.snapshot.paramMap.get('tipo');
    if (tipo === "no-inscritos") {
      this.inscritos = false;
    } else {
      if (tipo === "inscritos") {
        this.inscritos = true;
      }
    }


    this.fechasService.getFechas()
      .subscribe(async resp => {
        this.fechaActual = this.buscarFechaActiva(resp);

        if (this.fechaActual == null) {
          //Se permite unicamente crear registro si existe la fecha
          this.router.navigateByUrl('');
        } else {
          /* this.registroBase.id = ""; */
          this.registroBase.codigo = "";
          this.registroBase.sede = "";
          this.registroBase.fecha = this.fechaActual.fechaDia;

        }
      });



    this.sedesService.getSedes()
      .subscribe(resp => {
        this.sedesAccesso = resp;
      });

  }

  OnChanges() {
    console.log("cambios")
  }

  guardar(form: NgForm) {

    if (form.invalid || this.sedesAccesso.length === 0) {
      Object.values(form.controls).forEach(control => {
        control.markAsTouched();
      });
      return;
    }
    this.registroBase.sede = form.value['sede'];


    this.registroInscritoService.crearRegistro(this.registroBase)
      .subscribe(resp => {

        this.registosAprovados.push(this.registroBase.codigo);
        let tempSedeTemp = this.registroBase.sede;
        this.registroBase = new RegistroInscritoModel()
        this.registroBase.codigo = "";
        this.registroBase.codigo = "";
        this.registroBase.sede = tempSedeTemp;
        this.registroBase.fecha = this.fechaActual.fechaDia;
      });

    Object.values(form.controls).forEach(control => {
      control.markAsUntouched();
    });


  }


  buscarFechaActiva(fechas: FechaModel[]) {

    if (fechas === null) { return null; }

    let fechasAct: FechaModel;

    Object.keys(fechas).forEach(key => {
      const fecha: FechaModel = fechas[key];
      if (this.fechaActiva(fecha.fechaDia)) {
        fechasAct = fecha;
      }
    });
    return fechasAct;
  }

  fechaActiva(fecha: Date) {

    let f1 = new Date(fecha); // Fecha ingresada por el usuario
    let f2 = new Date(Date.now()); //Fecha actual
    f1.setHours(0, 0, 0, 0);
    f1.setDate(f1.getDate() + 1);
    f2.setHours(0, 0, 0, 0);
    if (f1.getTime() == f2.getTime()) {
      return true;
    }
    return false;
  }
  cargarSedes() { //temporal
    let ingenieria = new SedeModel();
    ingenieria.id = "1";
    ingenieria.nombre = "Ingenieria";

    let macarena = new SedeModel();
    macarena.id = "2";
    macarena.nombre = "Macarena";

    let vivero = new SedeModel();
    vivero.id = "3";
    vivero.nombre = "Vivero";

    this.sedesAccesso.push(ingenieria);
    this.sedesAccesso.push(macarena);
    this.sedesAccesso.push(vivero);

  }

  showToast() {
    //'checkmark-square-outline'
    let estudiante = this.registosAprovados.reverse();
    this.toastrService.show('Se registro correctamente', `Estudiante: ${estudiante}`,{position: NbGlobalPhysicalPosition.TOP_RIGHT , status: 'success' , duration: 1500 , icon: 'checkmark-square-outline'});
    //this.toastrService.success("Se registro correctamente", `Estudiante: ${estudiante}`);
    //const iconConfig: NbToast = { icon: iconName, pack: 'eva' };
    //this.toastrService.show('Message', `Toast: ${++this.index}`, iconConfig);
  }
}