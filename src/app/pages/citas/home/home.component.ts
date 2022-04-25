import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbMenuService } from '@nebular/theme';

@Component({
  selector: 'ngx-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private router: Router, private menuService: NbMenuService) { }

  ngOnInit() {
  }
  navigateListarCita() {
    this.router.navigate(['/pages/citas/listarCita']);
    return false;
  }

  navigateCrearCita() {
    this.router.navigate(['/pages/citas/crearCita']);
    return false;
  }

  navigateHorarios() {
    this.router.navigate(['/pages/citas/horarios']);
    return false;
  }
  navigateListarPaciente() {
    this.router.navigate(['/pages/citas/listarPaciente']);
    return false;
  }
  navigateHistoriaClinica() {
    this.router.navigate(['/pages/citas/historiaClinica']);
    return false;
  }
  navigateCitaPaciente() {
    this.router.navigate(['/pages/citas/citaPaciente']);
    return false;
  }
}
