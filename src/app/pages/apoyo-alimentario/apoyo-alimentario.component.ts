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
    this.router.navigate(['/pages/apoyo-alimentario/solicitud']);
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
  navigateEvaluacionMasiva(){
    this.router.navigate(['/pages/apoyo-alimentario/inscripciones/evaluacion-masiva']);
    return false;
  }

  //Asistencia
  
  navigateFallasJustificadas(){
    this.router.navigate(['/pages/apoyo-alimentario/registro/fallas-justificadas']);
    return false;
  }
  //Informes
  navigateReportes(){
    this.router.navigate(['/pages/apoyo-alimentario/reportes']);
    return false;
  }
  
  //Administracion
  navigatePeriodos(){
    this.router.navigate(['/pages/apoyo-alimentario/administracion/periodos']);
    return false;
  }
            
}
