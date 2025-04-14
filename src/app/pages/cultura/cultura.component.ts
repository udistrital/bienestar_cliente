// @ts-check
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router'
import { RolesConstanst } from '../../shared/constants/roles.constants';

@Component({
  selector: 'ngx-cultura',
  templateUrl: './cultura.component.html',
  
})
export class CulturaComponent implements OnInit {
  ROLES_CONSTANTS = RolesConstanst;

  constructor(
    private router: ActivatedRoute, 
    private route: Router,
    ) 
    { 

    }

  ngOnInit() {
  }
  
  nuevaActividad() {
  this.route.navigate([`cultura/crear-actividad`]);
  }
}
