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
  navigateRegistroDiario(){
    this.router.navigate(['/pages/apoyo-alimentario/registro/diario']);
    //this.router.navigateByUrl('registro/inscritos');
    return false;
  }

  navigateConsultar(){
    this.router.navigate(['/pages/apoyo-alimentario/registro/consultar']);
    return false;
  }

  /* Inscripciones */
  navigateInscripciones(){
    this.router.navigate(['/pages/apoyo-alimentario/registro/consultar']);
    return false;
  }

  navigateSolicitudTercero(){
    this.router.navigate(['/pages/apoyo-alimentario/inscripciones/solicitud']);
    return false;
  }
  navigateSolicitudes(){
    this.router.navigate(['/pages/apoyo-alimentario/inscripciones/solicitudes']);
    return false;
  }
  navigateBuscarSolicitud(){
    this.router.navigate(['/pages/apoyo-alimentario/inscripciones/buscarSolicitud']);
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
  
  
  navigateCargarInscripciones(){
    this.router.navigate(['/pages/apoyo-alimentario/administracion/cargar-inscripciones']);
    return false;
  }           
  navigateConsultaCodigo(){
    this.router.navigate(['/pages/apoyo-alimentario/administracion/consulta-codigo']);
    return false;
  }
          
}
