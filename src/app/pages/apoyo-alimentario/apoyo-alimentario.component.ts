import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'
import { NbMenuService } from '@nebular/theme';

@Component({
  selector: 'ngx-apoyo-alimentario',
  templateUrl: './apoyo-alimentario.component.html',
  styleUrls: ['./apoyo-alimentario.component.scss']
})
export class ApoyoAlimentarioComponent implements OnInit {

  constructor(private router: Router, private menuService: NbMenuService) { }

  ngOnInit() {
  }
  navigateRegistroInscritos(){
    this.router.navigate(['/pages/apoyo-alimentario/registro/inscritos']);
    //this.router.navigateByUrl('registro/inscritos');
    return false;
  }
  navigateRegistroNoInscritos(){
    this.router.navigate(['/pages/apoyo-alimentario/registro/no-inscritos']);
    return false;
  }

  navigateConsultar(){
    this.router.navigate(['/pages/apoyo-alimentario/registro/consultar']);
    return false;
  }

  navigateInscripciones(){
    this.router.navigate(['/pages/apoyo-alimentario/registro/consultar']);
    return false;
  }
  //Asistencia
  navigateConsultarFallas(){
    this.router.navigate(['/pages/apoyo-alimentario/asistencia/consultar-fallas']);
    return false;
  }

  navigateSanciones(){
    this.router.navigate(['/pages/apoyo-alimentario/asistencia/sanciones']);
    return false;
  }
  
  navigateFallasJustificadas(){
    this.router.navigate(['/pages/apoyo-alimentario/asistencia/fallas-justificadas']);
    return false;
  }
  //Informes
  navigateInformeDiario(){
    this.router.navigate(['/pages/apoyo-alimentario/informes/diario']);
    return false;
  }
  
  navigateInformePeriodo(){
    this.router.navigate(['/pages/apoyo-alimentario/informes/periodo']);
    return false;
  }
  //Administracion
  navigatePeriodos(){
    this.router.navigate(['/pages/apoyo-alimentario/administracion/periodos']);
    return false;
  }
  
  navigateFechas(){
    this.router.navigate(['/pages/apoyo-alimentario/administracion/fechas']);
    return false;
  }
  
  navigateCargarInscripciones(){
    this.router.navigate(['/pages/apoyo-alimentario/administracion/cargar-inscripciones']);
    return false;
  }           
          
}
