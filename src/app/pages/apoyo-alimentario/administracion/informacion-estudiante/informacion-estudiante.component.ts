import { Component, OnInit } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router'

@Component({
  selector: 'ngx-informacion-estudiante',
  templateUrl: './informacion-estudiante.component.html',
  styleUrls: ['./informacion-estudiante.component.scss']
})
export class InformacionEstudianteComponent implements OnInit {
  
  private codigo = "";

  constructor(private route: ActivatedRoute,private router: Router) { }

  ngOnInit() {
    this.codigo = "nada";
    this.codigo = this.route.snapshot.paramMap.get('cod');
    /* console.log(this.route.params);
    console.log(this.route.snapshot); */
    /* this.route.queryParams.subscribe(params => {
      this.codigo = params['cod'];
    }); */
    /* console.log(this.route); */
  }

}
