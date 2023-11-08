import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActividadCultural } from '../../../@core/data/models/cultura/actividad_cultural';
@Component({
  selector: 'ngx-actividad-cultural',
  templateUrl: './actividad-cultural.component.html',
  styleUrls: ['./actividad-cultural.component.scss']
})
export class ActividadCulturalComponent implements OnInit {

  constructor(private router: Router,) { }
  // actividades: ActividadCultural[]
  ngOnInit() {
  }

  
}
