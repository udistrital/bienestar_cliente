import { Component, OnInit ,Input} from '@angular/core';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { referencia } from '../../../interfaces/index';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'ngx-pdfMaker',
  templateUrl: './pdfMaker.component.html',
  styleUrls: ['./pdfMaker.component.scss']
})
export class PdfMakerComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    let fecha = new Date();
  }

  @Input()
public referencia: any={
  CausaPrincipal: " ",
  MotivoAdministrativo: "string",
  MotivoPersonal: "",
  Nombrecompleto: "",
  codigo: null,
  correo: "",
  documento : null ,
  estamento: null ,
  proyecto: null ,
  telefono: null ,
  telefonoAdicional: null ,
  tercero: null,
}

  generarPDF(){
      console.log("hola mundo");
      
  }
  createPdf(){

    console.log(this.referencia);
    
    const pdfDefinition : any = {
      content: [

        {text:`Bogotá D.C., 2 de diciembre de 2022 \n
         Señores`, style: 'defaultStyle'},

        { text: 'A QUIEN INTERESE', style: ['defaultStyle','header'] },
         
        {text:`UNIVERSIDAD DISTRITAL FRANCISCO JOSÉ DE CALDAS 
        Bogotá D.C 
        `, style: 'defaultStyle'},

        { text: 'Ref.: PAZ Y SALVO CENTRO DE BIENESTAR INSTITUCIONAL', style: ['defaultStyle','header'] },
        {text:`Respetados Señores:
          
        Me permito comunicarle que revisada la información que reposa en las bases de datos administradas por el Centro de Bienestar Institucional de (El) (La) estudiante ${this.referencia.Nombrecompleto} identificado(a) con Cédula de ciudadanía No. 1.233.508.300 y con el Código Estudiantil 20172572062, Proyecto Curricular de Pregrado, Tecnología en Electricidad de Media y Baja Tensión (por ciclos propedéuticos).
        Se encuentra a paz y salvo en los siguientes programas:`,style: ['defaultStyle','body'] },
        { text: 'Another text', style: 'anotherStyle' },
        { text: 'Multiple styles applied', style: [ 'header', 'anotherStyle' ] },


        { // optional
          // layout: 'lightHorizontalLines',
          table:{
           // headers are automatically repeated if the table spans over multiple pages
           // you can declare how many rows should be treated as headers
           headerRows: 1,
           widths: [ '*', 'auto', 'auto', 'auto' ],
   
           body: [
             [ { text: 'PROGRAMA', style: 'Theader' }, { text: 'SI', style: 'Theader' }, { text: 'NO', style: 'Theader' }, { text: 'NO APLICA', style: 'Theader' } ],
             [ 'Convocatoria Equipos y Conectividad', 'x ', '', '' ],
             ['Deportes', '', '', '' ],
             [ 'Otros', 'x', '', '' ]
           ]
          },
        }      

      ],

  
      styles: {
        defaultStyle:{
          fontSize: 12,
          lineHeight:1.5
        },
        header: {
          fontSize: 12,
          bold: true,
        },
        Theader: {
          fontSize: 13,
          bold: true,
          alignment: 'center',
        },
        body:{
          alignment: 'justify',
         

        },
        anotherStyle: {
          italics: true,
          alignment: 'right'
        }
      }
    }
   const pdf  =  pdfMake.createPdf(pdfDefinition);
   console.log(pdf);
   
   pdf.open();
  }


}
