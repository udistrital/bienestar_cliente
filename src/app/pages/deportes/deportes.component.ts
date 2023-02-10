import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'
import { NbMenuService } from '@nebular/theme';

@Component({
  selector: 'ngx-deportes',
  templateUrl: './deportes.component.html',
  styleUrls: ['./deportes.component.scss']
})

export class DeportesComponent implements OnInit {

  constructor(private router: Router, private menuService: NbMenuService) { }

  ngOnInit() {
    this.navigateEventos();
  }
  navigateEventos(){
    this.router.navigate(['/pages/deportes/eventos']);
    //this.router.navigateByUrl('registro/inscritos');
    return false;
  }
}


