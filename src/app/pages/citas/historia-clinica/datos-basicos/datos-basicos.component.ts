import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HistoriaClinica } from '../../../../shared/models/Salud/historiaClinica.model';
import { EstudiantesService } from '../../../../shared/services/estudiantes.service';
import { SaludService } from '../../../../shared/services/salud.service';
@Component({
  selector: 'ngx-datos-basicos',
  templateUrl: './datos-basicos.component.html',
  styleUrls: ['../historia-clinica.component.css']
})
export class DatosBasicosComponent implements OnInit {
  edad: number;
  nombre = "";
  apellido = "";
  carrera = "";
  estado = "";
  telefono = "";
  direccion = "";
  genero = "";
  codigo!: string;
  fechaNacimiento: Date;
  lugarNacimiento = "";
  terceroId: number;
  datosBasicos: FormGroup = this.fb.group({
    vinculacion: ['', Validators.required],
    tipo: ['', Validators.required],
    situacionAcademica: ['', Validators.required],
  })
  constructor(private fb: FormBuilder, private estudianteService: EstudiantesService, private aRoute: ActivatedRoute, private saludService: SaludService, private toastr: ToastrService) { }
  public calcularEdad(fechaNacimiento): number {
    if (this.fechaNacimiento) {
      const actual = new Date();
      const fechaNacimiento = new Date(this.fechaNacimiento);
      let edad = actual.getFullYear() - fechaNacimiento.getFullYear();
      const mes = actual.getMonth() - fechaNacimiento.getMonth();
      if (mes < 0 || (mes === 0 && actual.getDate() < fechaNacimiento.getDate())) {
        edad--;
      }
      return edad;
    } else {
      return null;
    }
  }
  ngOnInit(): void {
    this.codigo = this.aRoute.snapshot.paramMap.get('codigo');
    this.saludService.IdPersona = this.codigo;
    // this.verificarHistoria();
    this.cargarDatos();

  }
  cargarDatos() {
    this.estudianteService.getInfoPorCodigo(this.codigo).subscribe((data) => {
      this.fechaNacimiento = data[0].TerceroId.FechaNacimiento || '';
      this.edad = this.calcularEdad(this.fechaNacimiento);
      this.nombre = data[0].TerceroId.NombreCompleto;
      this.lugarNacimiento = data[0].TerceroId.LugarOrigen;
      this.terceroId = data[0].TerceroId.Id;
      this.estudianteService.getInfoGrupoComplementaria(this.terceroId, 6).subscribe((data) => {
        this.genero = data[0].InfoComplementariaId.Nombre;
      });
      this.estudianteService.getInfoComplementaria(this.terceroId, 51).subscribe((data) => {
        this.telefono = data[0].Dato;
      });
      this.estudianteService.getInfoComplementaria(this.terceroId, 54).subscribe((data) => {
        this.direccion = data[0].Dato;
      });
      this.saludService.getHistoriaClinica(this.terceroId).subscribe((data: any) => {
        if (data === null) {
          const historia: HistoriaClinica = {
            Id: 0,
            Tercero: this.terceroId,
          }
          this.saludService.postHistoriaClinica(historia).subscribe((data) => {
            // console.log(data);
            this.toastr.success(`Ha creado con éxito la historia clínica para ${this.nombre}`, '¡CREADO!');
          }, (error) => {
            this.toastr.error(`No se pudo crear la historia clínica para ${this.nombre}`, 'Error');
          });
        }
        if (data) {
          this.toastr.success(`Ya existía una historia clínica para ${this.nombre}`, '¡NADA POR HACER!');
        }
      });
    });

    this.estudianteService
      .getEstudiante(this.codigo)
      .subscribe((data: any) => {
        var paciente = data.datosEstudianteCollection.datosBasicosEstudiante[0];
        this.codigo = paciente.codigo;
        this.estado = paciente.estado;
        this.estudianteService
          .getProyecto(paciente.carrera)
          .subscribe((data: any) => {
            this.carrera = data.carrerasCollection.carrera[0].nombre;
          });
      });
  }


}
