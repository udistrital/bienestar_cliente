import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';




@Component({
  selector: 'ngx-cargar-evidencias',
  templateUrl: './cargar-evidencias.component.html',
  styleUrls: ['./cargar-evidencias.component.scss']
})
export class CargarEvidenciasComponent implements OnInit {
  cargarEvidencias : FormGroup;
  tiposEvidencia: String[] = ['Imagenes', 'Enlaces de videos','Lista de asistencia'];
  hideFormImagen = false;
  hideFormVIdeo = false;
  hideFormAsistencia = false;
  constructor(private fb: FormBuilder) {
    this.cargarEvidencias = this.fb.group({
      
      TipoEvidencia: ['', Validators.required]

    })
    
  }

  ngOnInit() {
  }

  tipoEvidenciaRadio(dato: any) {
    if (dato == "Imagen") {
      this.hideFormImagen = true;
    } 
    if (dato == "Video") {
      this.hideFormVIdeo = true;
    } 
    if (dato == "Asistencia") {
      this.hideFormAsistencia = true;
    } 
    
  }
  

}

