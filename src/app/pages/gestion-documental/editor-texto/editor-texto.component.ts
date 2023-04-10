import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { CKEditorComponent } from 'ng2-ckeditor/ckeditor.component';
@Component({
  selector: 'ngx-editor-texto',
  templateUrl: './editor-texto.component.html',
  styleUrls: ['./editor-texto.component.scss']
})
export class EditorTextoComponent implements OnInit {
  
  @ViewChild("myckeditor",{static: true}) ckeditor: any;
  @Output() accionEvent = new EventEmitter<Map<string,any>>();
  //Opciones para emtir al padre
  private opciones =new Map;

  private editorData: any;
  name = 'ng2-ckeditor';
  ckeConfig: any;
  dom:any;
  editor: any;
  mycontent: string;
  log: string = '';
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
        '/',
        { name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ] },
        { name: 'paragraph', groups: [ 'list', 'indent', 'blocks', 'align', 'bidi', 'paragraph' ] },
        { name: 'links', groups: [ 'links' ] },
        { name: 'insert', groups: [ 'insert' ] },
        '/',
        { name: 'styles', groups: [ 'styles' ] },
        { name: 'colors', groups: [ 'colors' ] },
        { name: 'tools', groups: [ 'tools' ] },
        { name: 'others', groups: [ 'others' ] },
        { name: 'about', groups: [ 'about' ] }
      ],
      removeButtons: 'Save,ExportPdf',
    };
  }

  actualizarTexto(event){
    this.editorData=event.editor.getData();
    this.editor=event.editor;
    console.log(event);
    console.log(this.mycontent);
  }
  async onClick(accion: string){  
    this.opciones.set('accion', accion);
    this.opciones.set('documento',this.mycontent);
    this.accionEvent.emit(this.opciones);
    /* console.log(this.editor);
    const content = await this.editor.execCommand('exportPdf'); 
   const content = await this.editor.execCommand('print',true);
   console.log(content); */
    /* const blob = new Blob([content], { type: 'application/pdf' });
    console.log(blob.text);
    const url = URL.createObjectURL(blob);
    window.open(url); */
  }
}
