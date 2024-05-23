import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'ngx-gestion-documental',
  templateUrl: './gestion-documental.component.html',
  styleUrls: ['./gestion-documental.component.scss']
})
export class GestionDocumentalComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }
  navigateCargar(){
    this.router.navigate(['/pages/gestion-documental/cargar']);
    //this.router.navigateByUrl('registro/inscritos');
    return false;
  }

  navigateConsultar(){
    this.router.navigate(['/pages/gestion-documental/consultar']);
    return false;
  }

  /* Inscripciones */
  navigateGestor(){
    this.router.navigate(['/pages/gestion-documental/gestor']);
    return false;
  }

}
