import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { CulturaService } from '../../../../shared/services/cultura.service';
import { Documento } from '../../../../shared/models/Salud/documento.model';
import { Observable, ReplaySubject } from 'rxjs';





@Component({
  selector: 'ngx-cargar-evidencias',
  templateUrl: './cargar-evidencias.component.html',
  styleUrls: ['./cargar-evidencias.component.scss']
})
export class CargarEvidenciasComponent implements OnInit {
  cargarEvidencias : FormGroup;
  public previsualizacion :string;
  archivo :any;
  arch:File;
  base64:any = null;
  public archivos:any =[]
  tiposEvidencia: String[] = ['Imagenes', 'Enlaces de videos','Lista de asistencia'];

  selectedFile: File | null = null;

  constructor(private fb: FormBuilder,
              private sanitizer:DomSanitizer,
              private List: CulturaService) {
    this.cargarEvidencias = this.fb.group({
      
      TipoEvidencia: ['', Validators.required]

    })

    
  }

  ngOnInit() {
  }

  
  capturarFile(event):any{
    console.log(event.target.files[0].type);
    if (event.target.files.length > 0) {
      if (event.target.files[0].type == "application/pdf") {
        this.convertFile(event.target.files[0]).subscribe(base64 => {
          this.base64= base64;
          //console.log(this.base64PeriapicalInicio);
        });
      } if (event.target.files[0].type == "image/jpeg" || event.target.files[0].type == "image/png") {
        this.convertFile(event.target.files[0]).subscribe(base64 => {
          this.base64= base64;
          //console.log(this.base64PeriapicalInicio);
        });
      } else {
        //this.toastr.error("Solo permitidos documentos PDF");
        //this.inputPeriapicalInicio.nativeElement.value = "";
        this.base64 = null;
      }
    }
    else {
      this.base64 = null;
    }
    
    /*const archivoCapturado = event.target.files[0];
    this.extraerBase64(archivoCapturado).then((imagen: any) => {
      this.previsualizacion = imagen.base;
      this.archivo = imagen;
      console.log(imagen);
    })*/
    
    
  }

  cargarEvidencia(){
    
    const documento :Documento ={
      IdTipoDocumento : 82,
      nombre :"test4",
      metadatos :{},
      descripcion:"Descripcion test",
      file : this.base64      
    }

    let array = [documento];
    this.List.postDocumento(array).subscribe((data)=>{
      console.log(data);
    });

  }

  extraerBase64 = async ($event:any) => new Promise((resolve,reject) => {
    try {
      const unsafeImg = window.URL.createObjectURL($event);
      const image = this.sanitizer.bypassSecurityTrustUrl(unsafeImg);
      const reader = new FileReader();
      reader.readAsDataURL($event);
      reader.onload =() => {
        resolve({
          base: reader.result
        });
      };
      reader.onerror = error => {  
        resolve({
          base:null
        });
      };
      
    }catch(e){
      return null;
    }

  });

  convertFile(file: File): Observable<string> {
    const result = new ReplaySubject<string>(1);
    const reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = (event) => result.next(btoa(event.target["result"].toString()));
    return result;
  }

  

}

