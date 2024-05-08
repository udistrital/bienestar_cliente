import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CulturaService } from '../../../../shared/services/cultura.service';
import { MatDialog } from '@angular/material';
import { Observable, ReplaySubject } from 'rxjs';

@Component({
  selector: 'ngx-subir-evidencias-actividades',
  templateUrl: './subir-evidencias-actividades.component.html',
  styleUrls: ['./subir-evidencias-actividades.component.scss']
})
export class SubirEvidenciasActividadesComponent implements OnInit {

  //Id de la actividad cultural a la cual se le van a subir las evidencias
  id:number;

  //Fecha actual
  fechaActual = new Date();

  //Formulario utilizado para recibir informacion de la pagina html
  crearEvidencia: FormGroup;

  //Variables utilizadas para los archivos
  base64img1:any = null;
  enlaceImg1 : string;
  nombreArchivoImg1 = 'Seleccione la imagen del grupo';
  extensionImg1: string;

  base64img2:any = null;
  enlaceImg2 : string;
  nombreArchivoImg2 = 'Seleccione la imagen del grupo';
  extensionImg2: string;

  base64img3:any = null;
  enlaceImg3 : string;
  nombreArchivoImg3 = 'Seleccione la imagen del grupo';
  extensionImg3: string;

  constructor(private fb: FormBuilder, private router: Router,
    private toastr: ToastrService, private route: ActivatedRoute,
    private dialog: MatDialog, private ListCultura: CulturaService) { }

  ngOnInit() {

    this.fechaActual.setDate(this.fechaActual.getDate());

  }

  inicializarFormulario(){
    this.crearEvidencia = this.fb.group({
      FechaCreacion: [this.fechaActual],
      FechaModificacion: [this.fechaActual],
      LinkVideo: this.fb.array([])
    });
  }

  capturarFileImg1(event):any{
    this.extensionImg1 = event.target.files[0].type;
    if (event.target.files.length > 0) {
      if (event.target.files[0].type == "image/jpeg" || event.target.files[0].type == "image/png") {
        this.convertFile(event.target.files[0]).subscribe(base64 => {
          this.nombreArchivoImg1 = 'Imagen seleccionada: ' + event.target.files[0].name;
          this.base64img1= base64;
        });
      } else {
        this.base64img1 = null;
        this.nombreArchivoImg1 = 'Ingrese nuevamente';
        this.toastr.error('Solo se reciben imagenes de tipo png o jpg.');
      }
    }
    else {
      this.base64img1 = null;
    }
    
  }

  capturarFileImg2(event):any{
    this.extensionImg2 = event.target.files[0].type;
    if (event.target.files.length > 0) {
      if (event.target.files[0].type == "image/jpeg" || event.target.files[0].type == "image/png") {
        this.convertFile(event.target.files[0]).subscribe(base64 => {
          this.nombreArchivoImg2 = 'Imagen seleccionada: ' + event.target.files[0].name;
          this.base64img2 = base64;
        });
      } else {
        this.base64img2 = null;
        this.nombreArchivoImg2 = 'Ingrese nuevamente';
        this.toastr.error('Solo se reciben imagenes de tipo png o jpg.');
      }
    }
    else {
      this.base64img2 = null;
    }
    
  }

  capturarFileImg3(event):any{
    this.extensionImg3 = event.target.files[0].type;
    if (event.target.files.length > 0) {
      if (event.target.files[0].type == "image/jpeg" || event.target.files[0].type == "image/png") {
        this.convertFile(event.target.files[0]).subscribe(base64 => {
          this.nombreArchivoImg1 = 'Imagen seleccionada: ' + event.target.files[0].name;
          this.base64img3 = base64;
        });
      } else {
        this.base64img3 = null;
        this.nombreArchivoImg1 = 'Ingrese nuevamente';
        this.toastr.error('Solo se reciben imagenes de tipo png o jpg.');
      }
    }
    else {
      this.base64img3 = null;
    }
    
  }

  convertFile(file: File): Observable<string> {
    const result = new ReplaySubject<string>(1);
    const reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = (event) => result.next(btoa(event.target["result"].toString()));
    return result;
  }

  get GruposCulturales() {
    return this.crearEvidencia.get('LinkVideo') as FormArray;
  }

  agregarFila(){
    const nuevaFila = this.fb.group({
      NombreGrupo: ['']
    });
    this.GruposCulturales.push(nuevaFila);
  }

}
