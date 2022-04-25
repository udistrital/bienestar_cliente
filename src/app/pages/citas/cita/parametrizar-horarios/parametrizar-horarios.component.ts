import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../../environments/environment';
import { EstudiantesService } from '../../../../shared/services/estudiantes.service';
import { SaludService } from '../../../../shared/services/salud.service';

@Component({
  selector: 'ngx-parametrizar-horarios',
  templateUrl: './parametrizar-horarios.component.html',
  styleUrls: ['./parametrizar-horarios.component.scss']
})
export class ParametrizarHorariosComponent implements OnInit {
  parametrizarHorario: FormGroup;
  parametroInicial: any;
  parametroFinal: any;
  estadoInicial: boolean = false;
  estadoFinal: boolean = false;
  constructor(private fb: FormBuilder, private personaService: EstudiantesService, private toastr: ToastrService, private router: Router) {
    this.parametrizarHorario = this.fb.group({
      horaInicio: ['', Validators.required],
      horaFinal: ['', Validators.required],
    })
  }

  ngOnInit() {
    this.personaService.getParametro(environment.IDS.IDHORARIOINICIO).subscribe((res) => {
      this.parametrizarHorario.controls['horaInicio'].setValue(res['Data'].Nombre);
      this.parametroInicial = res['Data'];
      // console.log(this.parametroInicial);
    });
    this.personaService.getParametro(environment.IDS.IDHORARIOFINAL).subscribe((res) => {
      this.parametrizarHorario.controls['horaFinal'].setValue(res['Data'].Nombre);
      this.parametroFinal = res['Data'];
    });
  }

  cambiarHorario() {
    const parametroIni = {
      Activo: true,
      CodigoAbreviacion: this.parametroInicial.CodigoAbreviacion,
      Descripcion: this.parametroInicial.Descripcion,
      FechaCreacion: this.parametroInicial.FechaCreacion,
      FechaModificacion: this.parametroInicial.FechaModificacion,
      Id: this.parametroInicial.Id,
      Nombre: this.parametrizarHorario.controls.horaInicio.value,
      NumeroOrden: 0,
      ParametroPadreId: null,
      TipoParametroId: this.parametroInicial.TipoParametroId
    }
    this.personaService.actualizarParametro(this.parametroInicial.Id, parametroIni).subscribe((res) => {
      this.estadoInicial = true;
      this.comprobarCambio();
    }, error => {
      this.estadoInicial = false;
      this.toastr.error(error); 
    });
    const parametroFin = {
      Activo: true,
      CodigoAbreviacion: this.parametroFinal.CodigoAbreviacion,
      Descripcion: this.parametroFinal.Descripcion,
      FechaCreacion: this.parametroFinal.FechaCreacion,
      FechaModificacion: this.parametroFinal.FechaModificacion,
      Id: this.parametroFinal.Id,
      Nombre: this.parametrizarHorario.controls.horaFinal.value,
      NumeroOrden: 0,
      ParametroPadreId: null,
      TipoParametroId: this.parametroFinal.TipoParametroId
    }
    this.personaService.actualizarParametro(this.parametroFinal.Id, parametroFin).subscribe((res) => {
      this.estadoFinal = true;
      this.comprobarCambio();
    }, error => {
      this.estadoFinal = false;
      this.toastr.error(error); 
    });
  }
  
  comprobarCambio(){
    if (this.estadoInicial && this.estadoFinal){
      this.toastr.success(`Ha registrado con éxito los horarios de atención`);
        setTimeout(() => {
          this.router.navigate(['pages/home']);
        },
          1000);
    }
  }

}
