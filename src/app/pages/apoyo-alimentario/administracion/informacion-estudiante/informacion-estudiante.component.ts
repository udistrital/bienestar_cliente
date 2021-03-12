import { Component, OnInit } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router'
import { ListService } from '../../../../@core/store/list.service'

@Component({
  selector: 'ngx-informacion-estudiante',
  templateUrl: './informacion-estudiante.component.html',
  styleUrls: ['./informacion-estudiante.component.scss']
})
export class InformacionEstudianteComponent implements OnInit {
  
  private codigo = "";

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private listService: ListService) { }

  ngOnInit() {
    this.codigo = this.route.snapshot.paramMap.get('cod');
    /* this.listService.findEstudiante(this.codigo); */
  }

}
