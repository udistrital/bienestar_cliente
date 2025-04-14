import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { CKEditorComponent } from 'ng2-ckeditor/ckeditor.component';
import jsPDF from 'jspdf';
/* import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { file } from 'jszip'; */
@Component({
  selector: 'ngx-editor-texto',
  templateUrl: './editor-texto.component.html',
  styleUrls: ['./editor-texto.component.scss']
})
export class EditorTextoComponent implements OnInit {
  @Input() documento: any=undefined;
  @ViewChild("myckeditor",{static: true}) ckeditor: any;
  @Output() accionEvent = new EventEmitter<Map<string,any>>();
  //Opciones para emtir al padre
  private opciones =new Map;

  name = 'ng2-ckeditor';
  ckeConfig: any;
  dom:any;
  mycontent: string;
  log: string = '';
  nombreDocumento: string;
  value: any;

  loading: boolean=false;
  constructor() { }
 
  ngOnInit() {
    this.ckeConfig={
      uiColor : '#FFFFFF',
      height : 400,
      toolbarCanCollapse: true,
      toolbarGroups: [
        { name: 'document', groups: [ 'mode', 'document', 'doctools' ] },
		    { name: 'clipboard', groups: [ 'clipboard', 'undo' ] },
		    { name: 'editing', groups: [ 'find', 'selection', 'spellchecker', 'editing' ] },
        { name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ] },
        { name: 'paragraph', groups: [ 'list', 'indent', 'blocks', 'align', 'bidi', 'paragraph' ] },
        { name: 'links', groups: [ 'links' ] },
        { name: 'insert', groups: [ 'insert' ] },
        { name: 'styles', groups: [ 'styles' ] },
        { name: 'colors', groups: [ 'colors' ] },
        { name: 'tools', groups: [ 'tools' ] },
        { name: 'others', groups: [ 'others' ] },
        { name: 'about', groups: [ 'about' ] }
      ],
      removeButtons: 'Save,ExportPdf,Iframe,Source',
    };
  }
  async cambiarTexto(){
    if(!this.documento)
      return;
    if(this.mycontent==="" ){
      let contenidoLeido;
      await this.leerContenido(this.documento).then(async res=>{
        contenidoLeido=await res;
      });
      this.ckeditor._updateValue(contenidoLeido);
      this.value=contenidoLeido;
      this.mycontent=contenidoLeido;
    }
    if(this.nombreDocumento===""){
      let nombre=this.documento.title;
      this.nombreDocumento=nombre.substring(0, nombre.indexOf('.'));
    }

  }
  async ngOnChanges(changes: SimpleChanges) {
    
    // Actualizar informacion luego de que documentos llegue de la consulta al servicio
    if (changes.documento.currentValue != undefined){
      this.nombreDocumento="";
      this.mycontent="";
      this.cambiarTexto();
    }
  }
  /**
   * Lee el contenido de un documento enviado
   *
   * @param documento evento del editor.
   * @return Promise que contiene el valor leido
   */
  async leerContenido(documento){
    return new Promise(async (res,rej)=>{
      await documento.fetchBlob()
      .then(async function(blob){
        await blob.blob()
        .then(await function (responseblob) {   
            const reader = new FileReader();
            reader.onload=async function(){
              await res(reader.result)
            };
            reader.readAsText(responseblob);
        });
      });
    });
  }

  /**
     * Se ejecuta al detectar cambios en el editor
     *
     * @param event evento del editor.
     *
     */
  guardar(){
    this.opciones.set('accion', 'guardar');
    this.opciones.set('contenido',this.mycontent!==""?this.mycontent:this.value);
    this.opciones.set('nombre',this.nombreDocumento);
    if(this.documento){
      this.opciones.set('documento',this.documento);
    }
    this.accionEvent.emit(this.opciones);
  }
  cancelar(){
    this.opciones.set('accion', 'cancelar');
    this.accionEvent.emit(this.opciones);
  }
  exportar(){ 
    this.loading=true;
    const docHTML = document.createElement('div');
    docHTML.innerHTML = this.mycontent;
    document.body.appendChild(docHTML);
    const pdf = new jsPDF("p", "mm", "a4"); // A4 size page of PDF

    // @TODO: google limita request a las imagenes que se añaden al pdf
    // const scriptElem = document.createElement("script");
    // scriptElem.src = "/";
    // scriptElem.referrerPolicy = "no-referrer";
    // document.body.appendChild(scriptElem);

    const filename=this.nombreDocumento;
    let imp=pdf.html(docHTML, {
      filename: 'this.nombreDocumento.pdf',
      margin: [10, 10, 10, 10],
      image: {type: "jpeg", quality: 200},
      autoPaging: 'text',
      html2canvas: {taintTest: true},
      x: 0,
      y: 0,
      width: 190, //target width in the PDF document
      windowWidth: 675, //window width in CSS pixels
      callback: function (pdf) {
        pdf.save(`${filename}.pdf`);
      },
   });
   document.body.removeChild(docHTML);
   this.loading=false;
  }
  eliminar(){
    this.opciones.set('accion', 'eliminar');
    this.opciones.set('documento',this.documento);
    this.accionEvent.emit(this.opciones);
  }
}