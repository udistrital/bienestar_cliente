import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { EstudiantesService } from "../../../../shared/services/estudiantes.service";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { SaludService } from "../../../../shared/services/salud.service";
//import { ToastrService } from 'ngx-toastr';
//import { UsuariosService } from 'src/app/services/usuarios.service';

@Component({
  selector: "ngx-listar-paciente",
  templateUrl: "./listar-paciente.component.html",
  styleUrls: ["./listar-paciente.component.css"],
})
export class ListarPacienteComponent implements OnInit {
  @Output() newItemEvent = new EventEmitter<string>();
  terceroId: number;
  nombre = "";
  carrera = "";
  codigo = "";
  estado = "";
  telefono = "";
  constructor(private estudianteService: EstudiantesService, private saludService: SaludService) { }
  miFormulario = new FormGroup({
    codigo: new FormControl(null, Validators.required),
  });
  buscarPaciente() {
    this.estudianteService
      .getEstudiante(this.miFormulario.value.codigo)
      .subscribe((data: any) => {
        var paciente = data.datosEstudianteCollection.datosBasicosEstudiante[0];
        this.nombre = paciente.nombre;
        this.codigo = paciente.codigo;
        this.estado = paciente.estado;
        this.estudianteService
          .getProyecto(paciente.carrera)
          .subscribe((data: any) => {
            this.carrera = data.carrerasCollection.carrera[0].nombre;
            // console.log(data);
          });

      });
    this.estudianteService.getInfoPorCodigo(this.miFormulario.value.codigo).subscribe((data) => {
      this.saludService.terceroId = data[0].TerceroId.Id || null;
      this.terceroId = data[0].TerceroId.Id || null;
      this.estudianteService.getInfoComplementaria(this.saludService.terceroId, 51).subscribe((data) => {
        let telefono2 = data[0].Dato;
        let telefonoCorregido = telefono2.replace(/{"/g, '').replace(/"}/g, '').replace(/telefono/g, '').replace(/"/g, '').replace(/:/g, '');
        this.telefono = telefonoCorregido;
      });
    });
  }
  buscarPaciente2() {
    this.estudianteService
      .getTercero(this.miFormulario.value.documento) 
      .subscribe((data: any) => {
        var paciente = data.datosTerceroCollection.datosBasicosTercero[0];
        this.nombre = paciente.nombre;
        this.codigo = paciente.codigo;
        this.estado = paciente.estado;
        this.carrera = paciente.carrera;
            // console.log(data);
          });

      });
   
  }
  ngOnInit() {
  }
}
