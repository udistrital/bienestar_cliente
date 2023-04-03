import { Component,TemplateRef, OnInit, ViewChild, ChangeDetectionStrategy, Input, Output, ElementRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DocumentoGestion } from '../../../@core/data/models/documento/documento_Gestion';
import { ApiRestService } from '../api-rest.service';
import { GestionService } from '../gestion-documental.service';
import { ResultadosComponent } from '../resultados/resultados.component';

@Component({
  selector: 'ngx-consultar',
  templateUrl: './consultar.component.html',
  styleUrls: ['./consultar.component.scss'],
})
export class ConsultarComponent implements OnInit {  
  @ViewChild('resultados', { static: true }) resultadosElement: ElementRef;

  private docSearch: FormGroup;
  private busquedaAvanzada: boolean;
  private activo: String;
  private documentos: any;
  private loading: boolean;
  // Estos datos se pueden traer de BD, para poder agregar mas
  tiposDocumento: String [] = ["Acta", "Resolución", "Comunicado", "Contrato"];
  
  constructor(private gestionService: GestionService, private fb: FormBuilder, private apiRestService: ApiRestService) {
    this.busquedaAvanzada= false;
    this.iniciarFormulario();
    this.activo = 'warning';
   }

  ngOnInit() {
  }

  iniciarFormulario(){
    this.docSearch = this.fb.group({
      Tipo: ['', Validators.required],
      Nombre: ['', Validators.required] ,
      Serie: ['', Validators.required] ,
      SubSerie: ['', Validators.required],
      Fecha:['', Validators.required],
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
    this.loading=true;
    await this.apiRestService.get().toPromise().then( res =>{
      this.documentos= res;
    }).catch(error =>{
      this.gestionService.toastrService.mostrarAlerta('Error buscando docmentos '+error);
      console.log('el error es', error)
    });
    
    // Crea un arreglo con los filtros validos en el formulario
    let filtros: any= [];
    let documentosFiltrados: any= [];
    for( let valor in this.docSearch.value){
      if (this.docSearch.get(valor).valid){
        filtros[valor] = this.docSearch.value[valor];
      }
    }

    // Validar cada documento segun los filtros agregados por el ususrio
    for (let documento in this.documentos){
      let valido = true;
      for(let filtro in filtros){
        if (valido && !this.documentos[documento][filtro].toUpperCase().includes(filtros[filtro].toUpperCase()) ){
          valido = false;
        }
      }
      // Si cumple con los filtros se agrega para mostrar
      if (valido){
        documentosFiltrados.splice(0,0,this.documentos[documento]);
      }

    }

    if(filtros){
      this.documentos=documentosFiltrados;
    }

    //se cambian los resultados a un arreglo vacio cuando no hay ningun documento con los criterios de filtros   
    this.loading=false;
    if(this.documentos.length===0){
      this.gestionService.toastrService.mostrarAlerta('No se han encontrado documentos');
    }else{
      this.resultadosElement.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start',inline: "nearest" });
    }
  }
}
