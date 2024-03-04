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
  selectedFile: File | null = null;

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
  //onFileSelected(event: any): void {
   // this.selectedFile = event.target.files[0] as File;
  //}
  //uploadFile(): void {
    //if (this.selectedFile) {
      // Aquí puedes implementar la lógica para subir el archivo al servidor
     // console.log('Archivo seleccionado:', this.selectedFile);
      // Puedes utilizar servicios como HttpClient para enviar el archivo al servidor
    //} else {
     // console.log('No se ha seleccionado ningún archivo');
    //}
  //}
  

}

