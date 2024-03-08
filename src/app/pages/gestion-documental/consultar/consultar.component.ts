import { Component,TemplateRef, OnInit, ViewChild, ChangeDetectionStrategy, Input, Output, ElementRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DocumentoGestion } from '../../../@core/data/models/documento/documento_Gestion';
import { ApiRestService } from '../api-rest.service';
import { GestionService } from '../gestion-documental.service';
import { ResultadosComponent } from '../resultados/resultados.component';
import { DocumentoService } from '../../../@core/data/documento.service';

@Component({
  selector: 'ngx-consultar',
  templateUrl: './consultar.component.html',
  styleUrls: ['./consultar.component.scss'],
})
export class ConsultarComponent implements OnInit {  
  @ViewChild('resultados', { static: true }) resultadosElement: ElementRef;

  private fechaInicio: Date;
  private fechaFin: Date;
  public docSearch: FormGroup;
  public busquedaAvanzada: boolean;
  public activo: String;
  public documentos: any;
  public loading: boolean;
  // Estos datos se pueden traer de BD, para poder agregar mas
  tiposDocumento: { [key: string]: Number };
  public facultades=['ASAB','Ingeníera','Medioambiente y recursos naturales', 'Tecnológica','Ciencias y educación'];
  
  constructor(private gestionService: GestionService, private fb: FormBuilder,
     private apiRestService: ApiRestService, private documentoService: DocumentoService) {
    this.busquedaAvanzada= false;
    this.iniciarFormulario();
    this.activo = 'warning';
   }

  ngOnInit() {
    this.obtenerTiposDocumentos();
  }
  async obtenerTiposDocumentos(){
    this.tiposDocumento=await this.gestionService.consultarTiposDocumento(this.documentoService);
  }

  /**
   * Inicia el formulario de consulta
   */
  iniciarFormulario(){
    this.docSearch = this.fb.group({
      Tipo: ['', Validators.required],
      Nombre: ['', Validators.required] ,
      Serie: ['', Validators.required] ,
      SubSerie: ['', Validators.required],
      FechaInicio:['', Validators.required],
      FechaFin:['', Validators.required],
      Facultad:[[], Validators.required],
    });
    if(this.fechaFin){
      this.fechaInicio=undefined;
    }
    if(this.fechaFin)
      this.fechaFin=undefined;
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

  /**
   * Actualiza la fecha de uno de los datepicker, al selecionarla fecha 
   * en el otro
   */
  actualizarFecha(){
    if(this.fechaInicio){
      if(!this.fechaFin){
        this.fechaFin=this.fechaInicio;
      }
    }else{
      if(this.fechaFin){
       this.fechaInicio=this.fechaFin;
      }
    }
  }

  /**
   * inicia la busqueda de documentos, teniendo en cuenta
   * los filtros seleccionados
   */
  async buscarDocumento(){
    // Trae los documentos del API Rest
    this.loading=true;
    
    // Crea un arreglo con los filtros validos en el formulario
    let filtros: any=[];
    // Arreglo para almacenar documentos filtrados
    let documentosFiltrados: any= [];
    for( let valor in this.docSearch.value){
      if (this.docSearch.get(valor).valid){
        filtros[valor] = this.docSearch.value[valor];
      }
    }

    // Si el filtro es por tipo de documento, se realiza directo en el query al API
    if (filtros['Tipo']){
      this.documentos=await this.gestionService.getDocumentos(this.documentoService,this.gestionService,"%2CTipoDocumento.Id%3A"+filtros['Tipo']);
    }else{
      this.documentos=await this.gestionService.getDocumentos(this.documentoService,this.gestionService);
    }
    // Si no se encontraron resultados los documentos son indefinidos
    if(this.documentos.length==1){
      if(Object.entries(this.documentos[0]).length==0)
        this.documentos = undefined;
    }

    // Validar cada documento segun los filtros agregados por el usuario
    for (let documento in this.documentos){
      this.documentos[documento].Metadatos=JSON.parse(this.documentos[documento].Metadatos);
      let valido = true; //Verificar cuando un documento cumple con los filtros
      for(let filtro in filtros){
        // Filtro por tipo se hace en el query directamente
        if(filtro==='Tipo')
          continue;
        if(filtro=='Nombre'){
          if (valido && !this.documentos[documento][filtro].toUpperCase().includes(filtros[filtro].toUpperCase()) ){
            valido = false;
          }
        }else if(filtro=='Facultad'){
          // Si las falultades del filtro no estan contenidas en las facultades del documento, el documento no es valido para los filtros
          if(!filtros[filtro].every(valor =>this.documentos[documento].Metadatos[filtro].includes(valor))){
            valido=false;
          }else{
            continue;
          }
        }
        else{
          if(filtro==='FechaInicio'){
            if( new Date(this.documentos[documento].Metadatos['Fecha']).getTime() < new Date(this.fechaInicio).getTime() ){
              valido =false;
            }
          }
          else if(filtro==='FechaFin'){
            if( new Date(this.documentos[documento].Metadatos['Fecha']).getTime() > new Date(this.fechaFin).getTime() ){
              valido =false;
            }
          }else if(valido && !this.documentos[documento].Metadatos[filtro].toUpperCase().includes(filtros[filtro].toUpperCase())){
            valido =false;
          } 
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
