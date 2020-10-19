import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'ngx-reliquidacion-matricula',
  templateUrl: './reliquidacion-matricula.component.html',
  styleUrls: ['./reliquidacion-matricula.component.scss']
})
export class ReliquidacionMatriculaComponent implements OnInit {

  constructor(private location: Location) { }

  ngOnInit() {
  }

  goBack(): void {
    this.location.back();
  }

  uploadFormularioLink(event: Event) {
    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;
    if (fileList) {
      fileList[0];
    }
  }

  uploadCartaDirectora(event: Event) {
    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;
    if (fileList) {
      fileList[0];
    }
  }

  uploadEstratificacion(event: Event) {
    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;
    if (fileList) {
      fileList[0];
    }
  }

  uploadReciboPublico(event: Event) {
    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;
    if (fileList) {
      fileList[0];
    }
  }

  uploadIngresos(event: Event) {
    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;
    if (fileList) {
      fileList[0];
    }
  }
  
  uploadPensionBachiller(event: Event) {
    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;
    if (fileList) {
      fileList[0];
    }
  }
  
  uploadContratoArrendamiento(event: Event) {
    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;
    if (fileList) {
      fileList[0];
    }
  }
  
  uploadRegistroCivil(event: Event) {
    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;
    if (fileList) {
      console.log("FileUpload -> files", fileList[0].type);
    }
  }
  
  uploadDesplazado(event: Event) {
    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;
    if (fileList) {
      fileList[0];
    }
  }
  
  uploadReciboUniversidad(event: Event) {
    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;
    if (fileList) {
      fileList[0];
    }
  }
  
  uploadOtros(event: Event) {
    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;
    if (fileList) {
      console.log("FileUpload -> files", fileList[0].type);
    }
  }

}
