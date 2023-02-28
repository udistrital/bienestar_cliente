import { Component,TemplateRef, OnInit, ViewChild, ChangeDetectionStrategy, Input, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DocumentoG } from '../../../@core/data/models/documento/documento_Gestion';
import { ApiRestService } from '../api-rest.service';
import { GestionService } from '../gestion-documental.service';
import { ResultadosComponent } from '../resultados/resultados.component';

@Component({
  selector: 'ngx-consultar',
  templateUrl: './consultar.component.html',
  styleUrls: ['./consultar.component.scss'],
})
export class ConsultarComponent implements OnInit {  

  private docSearch: FormGroup;
  private busquedaAvanzada: boolean;
  private activo: String;
  private documentos: any;
  private resultado: boolean;
  // Estos datos se pueden traer de BD, para poder agregar mas
  tiposDocumento: String [] = ["Acta", "Resolución", "Comunicado", "Contrato"];
  
  constructor(private gestionService: GestionService, private fb: FormBuilder, private apiRestService: ApiRestService) {
    this.resultado=false;
    this.busquedaAvanzada= false;
    this.iniciarFormulario();
    this.activo = 'warning';
   }

  ngOnInit() {
  }

  iniciarFormulario(){
    this.docSearch = this.fb.group({
      tipoDocumento: ['', Validators.required],
      titulo: ['', Validators.required] ,
      serie: ['', Validators.required] ,
      subSerie: ['', Validators.required],
      fecha:['', Validators.required],
    });
  }

  onClick(){
    // Cambio de estilo del boton busqueda avanzada
    if (this.busquedaAvanzada === false){
      this.activo= 'warning';
      this.busquedaAvanzada= true;
    }else{
      this.activo= 'primary';
      this.busquedaAvanzada= false;
    }
  }

  async buscarDocumento(){
    // Trae los documentos del API Rest
    await this.apiRestService.get().toPromise().then( res =>{
      this.documentos= res;
      this.resultado = true;
    });

 
    //Busqueda en nuxeo, con id y path especificos
    // GestionService.nuxeo.header('X-NXDocumentProperties', '*');
    // GestionService.nuxeo.request('/id/'+'d3fa74ba-d2ec-471b-8e96-39f4f92d5be9')
    // /* '/'+'desarrollo'+'/'+'workspaces'+'/'+'pruebas'+'/'+'GestionDocumental'+'/'+'Documento de prueba.1677189012126' */
    //   .get()
    //   .then(function(res) {
    //     console.log(res);
    //     // res.uid !== null
    //     // res.type === 'Domain'
    // })
    // .catch(function(error) {
    //   throw new Error(error);
    // });
  }
}
