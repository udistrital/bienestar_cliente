import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArchivosGenericoComponent } from './archivos-generico.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DocumentoService } from '../../../@core/data/documento.service';
import { NuxeoService } from '../../../@core/utils/nuxeo.service';



@NgModule({
  declarations: [ArchivosGenericoComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule 
  ],
  exports: [ArchivosGenericoComponent],
  providers:[
    DocumentoService,
    NuxeoService,
  ]
})
export class ArchivosGenericoModule { }
