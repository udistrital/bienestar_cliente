import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { sigud, logo } from "../../pdfmaker/imagesB64/";
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
  logos = {
    ud: null,
    sigud: null,
  };

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit() {
    this.logos.sigud = sigud[0];
    this.logos.ud = logo[0];
  }

  @Output()
  onNewRevisor: EventEmitter<any> = new EventEmitter();

  @Output()
  onNewHeaders: EventEmitter<any> = new EventEmitter();

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
  }

  imprimir() {
    this.onNewRevisor.emit(this.revisores);
    this.onNewHeaders.emit(this.logos);
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
