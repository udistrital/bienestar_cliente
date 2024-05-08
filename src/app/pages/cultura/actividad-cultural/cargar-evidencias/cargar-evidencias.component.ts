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
  enlace : string;
  archivo :any;
  arch:File;
  base64String: string;
  imageSrc: any;
  pdfSrc ="";
  pdf:any;
  

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
      IdTipoDocumento : 85,
      //nombre :"test19",
      nombre :"test9",
      metadatos :{},
      descripcion:"Descripcion test",
      file : this.base64      
    }

    let array = [documento];
    this.List.postDocumento(array).subscribe((data)=>{
      this.enlace = data['res'].Enlace;
      console.log(data);
      
    });

  }

  obtenerFile(){
    console.log(this.enlace);

    this.List.getDocumento(this.enlace).subscribe((data2)=>{
    this.base64String = data2['file'];
    console.log(this.base64String);
    //this.imageSrc = this.convertBase64ToImageSrc(this.base64String);
    //this.pdf = this.convertBase64toFIle(this.base64String);
    
  
    });
  }


 

  convertFile(file: File): Observable<string> {
    const result = new ReplaySubject<string>(1);
    const reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = (event) => result.next(btoa(event.target["result"].toString()));
    return result;
  }

  convertBase64ToImageSrc(base64String: string): any {
    // Convertir la cadena base64 a una URL de objeto
    const imageBlob = this.base64ToBlob(base64String, 'image/png');
    const imageUrl = URL.createObjectURL(imageBlob);
    // Sanitizar la URL para prevenir problemas de seguridad
    return this.sanitizer.bypassSecurityTrustUrl(imageUrl);
  }

  printPdf() {    
    const byteArray = new Uint8Array(
      atob(this.base64String)
        .split("")
        .map(char => char.charCodeAt(0))
    );
    const file = new Blob([byteArray], { type: "application/pdf" });
    const fileURL = URL.createObjectURL(file);
    this.pdfSrc = fileURL;
    console.log(this.pdfSrc);
    window.open(fileURL);
  }

  base64ToBlob(base64String: string, type: string): Blob {
    // Obtener el contenido binario de la cadena base64
    const byteCharacters = atob(base64String);
    const byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    // Crear un objeto Blob a partir de los byteArrays
    return new Blob(byteArrays, { type: type });
  }

}

