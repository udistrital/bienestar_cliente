import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { ListService } from '../../../@core/store/list.service';
import { SaludService } from '../../../shared/services/salud.service';
@Component({
  selector: 'ngx-historia-clinica',
  templateUrl: './historia-clinica.component.html',
  styleUrls: ['./historia-clinica.component.css']
})
export class HistoriaClinicaComponent implements OnInit {
  roles: any[] = [];
  constructor(private fb: FormBuilder, private listService: ListService) { }
  ngOnInit() {
    this.listService.getInfoEstudiante().then((resp) => {
      //console.log(resp);
      this.roles = resp.role;
    });
  }
  especialista = new FormGroup({
    codigo: new FormControl(null, Validators.required),
  });
}
