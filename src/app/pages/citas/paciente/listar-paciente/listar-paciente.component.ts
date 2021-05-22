import { Component, OnInit } from "@angular/core";
import { EstudiantesService } from "../../../../shared/services/estudiantes.service";
import { FormGroup, FormControl, Validators } from "@angular/forms";
//import { ToastrService } from 'ngx-toastr';
//import { UsuariosService } from 'src/app/services/usuarios.service';

@Component({
  selector: "ngx-listar-paciente",
  templateUrl: "./listar-paciente.component.html",
  styleUrls: ["./listar-paciente.component.css"],
})
export class ListarPacienteComponent implements OnInit {
  nombre = "";
  carrera = "";
  codigo = "";
  estado = "";
  telefono = "";
  terceroId = "";
  constructor(private estudianteService: EstudiantesService) { }
  miFormulario = new FormGroup({
    codigo: new FormControl(null, Validators.required),
  });
  buscarPaciente() {
    this.estudianteService
      .getEstudiante(this.miFormulario.value.codigo)
      .subscribe((data: any) => {
        // console.log(data);
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
      this.terceroId = data[0].TerceroId.Id;
      this.estudianteService.getInfoComplementaria(this.terceroId, 51).subscribe((data) => {
        this.telefono = data[0].Dato;
        // console.log(this.telefono);
      });
    });
  }
  ngOnInit() {
    this.buscarPaciente();
  }
}
