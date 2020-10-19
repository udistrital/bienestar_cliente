import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'ngx-descuento-electoral',
  templateUrl: './descuento-electoral.component.html',
  styleUrls: ['./descuento-electoral.component.scss']
})
export class DescuentoElectoralComponent implements OnInit {

  constructor(private location: Location) { }

  ngOnInit() {
  }

  goBack(): void {
    this.location.back();
  }

  uploadCarnetEst(event: Event) {
    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;
    if (fileList) {
      fileList[0];
    }
  }

  uploadCedula(event: Event) {
    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;
    if (fileList) {
      fileList[0];
    }
  }

  uploadCertificado(event: Event) {
    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;
    if (fileList) {
      fileList[0];
    }
  }

}
