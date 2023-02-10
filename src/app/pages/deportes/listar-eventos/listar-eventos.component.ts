import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'
import { NbMenuService } from '@nebular/theme';

@Component({
  selector: 'ngx-listar-eventos',
  templateUrl: './listar-eventos.component.html',
  styleUrls: ['./listar-eventos.component.scss']
})
export class ListarEventosComponent implements OnInit {

  constructor(private router: Router, private menuService: NbMenuService) { }

  ngOnInit() {
  }

}
