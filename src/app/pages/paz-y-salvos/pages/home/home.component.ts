import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'ngx-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(
    private route: Router,
    private router: ActivatedRoute,
    ) { }

  ngOnInit() {
  }
  navigateGenerar() {
    // window.open('/pages/paz-y-salvos/generar','_blank');
    this.route.navigate(['/pages/paz-y-salvos/generar']);
    //return false;
  }
  navigateConsultas() {
    // window.open('/pages/paz-y-salvos/generar','_blank');
    this.route.navigate(['/pages/paz-y-salvos/consultas']);
    //return false;
  }
}
