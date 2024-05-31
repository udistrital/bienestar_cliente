import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ListService } from '../../../../@core/store/list.service';
import { AccesoHistoria } from '../../../../shared/models/Salud/accesoHistoria.model';
import { HistoriaClinica } from '../../../../shared/models/Salud/historiaClinica.model';
import { EstudiantesService } from '../../../../shared/services/estudiantes.service';
import { SaludService } from '../../../../shared/services/salud.service';
@Component({
  selector: 'ngx-datos-basicos',
  templateUrl: './datos-basicos.component.html',
  styleUrls: ['../historia-clinica.component.css']
})
export class DatosBasicosComponent implements OnInit {
  
  tipo: any;
  dependencia: any = '';
  procedenteDe: any = '';
  edad: number;
  eps:string;
  paciente:any;
  
  nombre = "";
  apellido = "";
  carrera = "";
  vinculacion:string;
  estado: any;
  telefono = "";
  direccion = "";
  genero = "";
  documento:string;
  codigo!: string;
  fechaNacimiento: Date;
  lugarNacimiento = "";
  terceroId: number;
  datosBasicos: FormGroup = this.fb.group({
    vinculacion: ['', Validators.required],
    tipo: ['', Validators.required],
    estado: ['', Validators.required],
  })
  constructor(private fb: FormBuilder, private estudianteService: EstudiantesService, private aRoute: ActivatedRoute, private saludService: SaludService, private toastr: ToastrService, private listService: ListService) { }
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
    this.saludService.IdPersona = parseInt(this.codigo);
    // this.verificarHistoria();
    this.paciente=null;
    this.cargarDatos();

  }
  cargarDatos() {
    this.estudianteService.getInfoTercero(this.codigo).subscribe((data) => {
      this.fechaNacimiento = data[0].TerceroId.FechaNacimiento || '';
      this.edad = this.calcularEdad(this.fechaNacimiento);
      this.nombre = data[0].TerceroId.NombreCompleto;
      this.lugarNacimiento = data[0].TerceroId.LugarOrigen;
      this.terceroId = data[0].TerceroId.Id;
      this.estudianteService.getCodigoTercero(this.terceroId,3).subscribe((data) => {
        this.documento = data[0].Numero;
      });
      this.estudianteService
      .getEstudiante(this.codigo)
      .subscribe((data: any) => {
        this.paciente = data.datosEstudianteCollection.datosBasicosEstudiante[0];
       
        if(this.paciente!=null)
        {
            this.estudianteService
              .getProyecto(this.paciente.carrera)
              .subscribe((data: any) => {
                this.carrera = data.carrerasCollection.carrera[0].nombre;
              });
        }else{
             this.estudianteService

      .getTercero( this.codigo) 
      .subscribe((data: any) => {
        var paciente = data.datosTerceroCollection.datosBasicosTercero[0];
       
        this.carrera = paciente.carrera;


          });

        }
          
      });
      this.estudianteService.getInfoGrupoComplementaria(this.terceroId, 6).subscribe((data) => {
        this.genero = data[0].InfoComplementariaId.Nombre;
      });
      this.estudianteService.getVinculacion(this.terceroId).subscribe((data) => {
        let vinculacion2 = data[0].TipoVinculacionId;
        this.estudianteService.getParametro(vinculacion2).subscribe((data2: any) => {
         this.vinculacion = data2.Data.Nombre;
            
        });
      });
      
      this.estudianteService.getInfoComplementaria(this.terceroId, 607).subscribe((data) => {
        let eps2 = data[0].Dato;
        let epsCorregido = eps2.replace(/{"/g, '').replace(/"}/g, '').replace(/dato/g, '').replace(/"/g, '').replace(/:/g, '');
        this.eps = epsCorregido;
      });
      this.estudianteService.getInfoComplementaria(this.terceroId, 51).subscribe((data) => {
        let telefono2 = data[0].Dato;
        let telefonoCorregido = telefono2.replace(/{"/g, '').replace(/"}/g, '').replace(/telefono/g, '').replace(/"/g, '').replace(/:/g, '');
        this.telefono = telefonoCorregido;
      });
      this.estudianteService.getInfoComplementaria(this.terceroId, 54).subscribe((data) => {
        let direccion2 = data[0].Dato;
        let direccionCorregida = direccion2.replace(/{/g, '').replace(/Data/g, '').replace(/:/g, '').replace(/"/g, '').replace(/}/g, '');
        this.direccion = direccionCorregida;
      });
      this.saludService.getHistoriaClinica(this.terceroId).subscribe((data: any) => {
        if (JSON.stringify(data.Data[0]) === '{}') {
          const historia: HistoriaClinica = {
            Id: 0,
            Tercero: this.terceroId,
            FechaCreacion: new Date(),
            FechaModificacion: new Date(),
            Activo: true
          }
          this.saludService.postHistoriaClinica(historia).subscribe((data) => {
            // console.log(data);
            this.toastr.success(`Ha creado con éxito la historia clínica para ${this.nombre}`, '¡CREADO!');
            setTimeout(() => {
              window.location.reload();
            },
              1500);
          }, (error) => {
            this.toastr.error(`No se pudo crear la historia clínica para ${this.nombre}`, 'Error');
          });
        }
        else {
          let fechaActual = new (Date);
          fechaActual.setHours(fechaActual.getHours() - 5);
          this.listService.getInfoEstudiante().then((resp) => {
            //console.log(resp);
            this.estudianteService.getEstudiantePorDocumento(resp.documento).subscribe((res) => {
              //console.log(res);
              const accesoHistoria: AccesoHistoria = {
                IdAccesoHistoria: 0,
                IdHistoriaClinica: data.Data[0].Id,
                ProfesionalId: res[0].TerceroId.Id,
                FechaAcceso: fechaActual,
                FechaCreacion: new Date(),
                FechaModificacion: new Date(),
                Activo: true
              }
              this.saludService.postAccesoHistoria(accesoHistoria).subscribe((response) => {
                // console.log(response);
              });

            });
          });
          this.toastr.success(`Ya existía una historia clínica para ${this.nombre}`, '¡NADA POR HACER!');
        }
      });
    });

    
  }


}
