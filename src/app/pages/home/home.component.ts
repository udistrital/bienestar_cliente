import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbMenuService } from '@nebular/theme';

@Component({
  selector: 'ngx-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private router: Router, private menuService: NbMenuService) { }

  ngOnInit() {
  }

  navigateReliquidacion(){
    this.router.navigate(['/pages/revision-estudiante']);
    return false;
  }

  navigateApoyoAlimentario(){
    this.router.navigate(['/pages/apoyo-alimentario']);
    return false;
  }

  navigateSalud(){
    this.router.navigate(['/pages/citas/paciente']);
    return false;
  }


}
