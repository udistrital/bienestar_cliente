import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbGlobalPhysicalPosition, NbToastrService } from '@nebular/theme';
import { Periodo } from '../../../../@core/data/models/parametro/periodo';

@Component({
  selector: 'ngx-diario',
  templateUrl: './diario.component.html',
  styleUrls: ['./diario.component.scss']
})
export class DiarioComponent implements OnInit {

  periodo: Periodo;
  fecha = new Date();
  

  constructor(
    private router: Router,
    private toastrService: NbToastrService
  ) {

   }

  ngOnInit() {
  }

  navigateInformeDiario(){
    let date=formatDate(this.fecha, "dd-MM-yyyy", "en");
    let actual = formatDate(new Date(), "dd-MM-yyyy", "en");
    console.log(actual);
    if(date>actual){
      this.showError("ERROR. Consultar Fecha","La fecha ingresada aún no existe");
      return false;
    }else{
      this.router.navigate([`/pages/apoyo-alimentario/informes/diario/${date}`]);
      return true;
    }
    
  }

  showError(titulo, error) {
    this.toastrService.show(
      error,
      /* `Estudiante: ${this.registroBase.codigo}`, */
      titulo,
      {
        position: NbGlobalPhysicalPosition.TOP_RIGHT,
        status: "danger",
        duration: 3000,
        icon: "checkmark-square-outline",
      }
    );
  }




}
