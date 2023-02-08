import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DocumentoG } from '../../../@core/data/models/documento/documento_Gestion';
import { NbDateService } from '@nebular/theme';
import { NuxeoService } from '../../../@core/utils/nuxeo.service';
import { DocumentoService } from '../../../@core/data/documento.service';

@Component({
  selector: 'ngx-cargar',
  templateUrl: './cargar.component.html',
  styleUrls: ['./cargar.component.scss']
})
export class CargarComponent implements OnInit {

  @ViewChild('labelImport',{static: false})
  labelImport: ElementRef;

  
  // Estos datos se pueden traer de BD, para poder agregar mas
  tiposDocumento: String [] = [
    "Acta",
    "Resolución",
    "Comunicado",
    "Contrato"
  ];
  documento: DocumentoG = new DocumentoG;
  shortLink: string = "";

  
  //Rango de fechas de la carga
  
  min: Date;
  max: Date;
  
  constructor(
    protected dateService: NbDateService<Date>,
    private nuxeoService: NuxeoService,
    private documentoService: DocumentoService
    ) {
    
    this.min = this.dateService.addYear(this.dateService.today(), -20);
    this.max = this.dateService.addMonth(this.dateService.today(), 1);
  }

  ngOnInit() {
  }
  cargarFormulario(){
    this.nuxeoService.getDocumentos$([this.documento.Archivo],this.documentoService).subscribe;
    //this.nuxeoService.getDocumentoById$([12],this.documentoService).subscribe();
    console.log(this.documento.Archivo);
  }
  
  // On file Select
  onChange(files: FileList) {
    //this.documento.Archivo = event.target.files[0];
    this.labelImport.nativeElement.innerText= Array.from(files)
      .map(f => f.name)
      .join(', ');
    this.documento.Archivo = files.item(0);

}

}
