import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: "ngx-base64images",
  templateUrl: "./base64images.component.html",
  styleUrls: ["./base64images.component.scss"],
})
export class Base64imagesComponent implements OnInit {
  files: any;
  loading: boolean;
  // firmas: {[key:string]:File} ={};
  revisores = {
    persona1: {
      nombre: "",
      programa: null,
      firma: null,
    },
    persona2: {
      nombre: "",
      programa: "Director(a) Centro de Bienestar Institucional",
      firma: null,
    },
  };

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit() {}

  @Output()
  onNewRevisor: EventEmitter<any> = new EventEmitter();

  onFileSelected(event: any, person: string) {
    const file: File = event.target.files[0];
    if (file.type.includes("image")) {
      this.blobFile(file).then((res: any) => {
        //  this.firmas[person]=res.base;
        this.revisores[person].firma = res.base;
      });
    } else {
      console.warn("no es una imagen");
    }
    // this.files.push(file)
    //  this.firmas[person]=file;

    this.uploadSignature(person);
    // const imagen = event.target.files[0];
    //  console.log(imagen.type);
    // if ((imagen.type).includes('image')) {

    //   this.blobFile(imagen).then((res: any) => {
    //     this.imagenPrevia = res.base;
    //   })
    // } else {
    //   console.warn("no es una imagen")

    // }
    // this.files.push(imagen)
  }

  uploadSignature(person: string) {
    // const file: File = this.firmas[person];
    // this.revisores[person].firma =this.firmas[person]
    // Aquí puedes agregar la lógica para subir el archivo a tu servidor
    // Puedes usar una biblioteca como 'axios' o 'HttpClient' para hacer la solicitud HTTP al servidor.
  }

  imprimir() {
    this.onNewRevisor.emit(this.revisores);
    // aa
  }

  blobFile = async ($event: any) =>
    new Promise((resolve, reject) => {
      try {
        const unsafeImg = window.URL.createObjectURL($event);
        const image = this.sanitizer.bypassSecurityTrustUrl(unsafeImg);
        const reader = new FileReader();
        reader.readAsDataURL($event);
        reader.onload = () => {
          resolve({
            // blob: $event,
            // image,
            base: reader.result,
          });
        };
        reader.onerror = (error) => {
          resolve({
            blob: $event,
            image,
            base: null,
          });
        };
      } catch (e) {
        return null;
      }
    });
}
