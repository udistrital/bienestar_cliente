import { Component, OnInit, Input } from "@angular/core";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { referencia } from "../../../interfaces/index";

import Swal from "sweetalert2";
import { UtilService } from "../../../../../shared/services/utilService";
import { navLinks, logo, sigud } from "../imagesB64";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: "ngx-pdfMaker",
  templateUrl: "./pdfMaker.component.html",
  styleUrls: ["./pdfMaker.component.scss"],
})
export class PdfMakerComponent implements OnInit {
  constructor(private utilsService: UtilService) {}

  ngOnInit() {
    let fecha = new Date();
  }

  @Input()
  public referencia: any = {
    CausaPrincipal: " ",
    MotivoAdministrativo: "string",
    MotivoPersonal: "",
    Nombrecompleto: "",
    codigo: null,
    correo: "",
    documento: null,
    estamento: null,
    proyecto: null,
    telefono: null,
    telefonoAdicional: null,
    tercero: null,
  };
  @Input()
  public tabla: any = {
    apoyo: null,
    equipos: null,
    deportes: null,
    otros: null,
  };
  @Input()
  revisor = {
    persona1: {
      nombre: null,
      programa: null,
      firma: null,
    },
    persona2: {
      nombre: null,
      programa: null,
      firma: null,
    },
  };

  @Input()
  logos = {
    ud: null,
    sigud: null,
  };

  obtenerFechaEnFormato() {
    const meses = [
      "enero",
      "febrero",
      "marzo",
      "abril",
      "mayo",
      "junio",
      "julio",
      "agosto",
      "septiembre",
      "octubre",
      "noviembre",
      "diciembre",
    ];

    const fecha = new Date(); // Obtener la fecha actual
    const dia = fecha.getDate(); // Obtener el día del mes
    const mes = meses[fecha.getMonth()]; // Obtener el nombre del mes
    const año = fecha.getFullYear(); // Obtener el año

    const fechaEnFormato = `${dia} de ${mes} de ${año}`;
    return fechaEnFormato;
  }

  createPdf() {
    if (this.validarObjeto(this.revisor) && this.validarObjeto(this.tabla)) {
      const fechaFormateada = this.obtenerFechaEnFormato();

      const pdfDefinition: any = {
        content: [
          //tabla del header
          {
            table: {
              body: [
                // Fila 1
                [
                  {
                    image: `${this.logos.ud}`,
                    width: 50,
                    height: 50,
                    rowSpan: 3,
                    style: "logos",
                  },

                  {
                    text: "FORMATO DE PAZ Y SALVO CENTRO DE BIENESTAR INSTITUCIONAL",
                    style: "logos",
                    bold: true,
                  },
                  { text: "Código: BI-FR-056", style: "logos" },
                  {
                    image: this.logos.sigud,
                    height: 70,
                    width: 50,
                    rowSpan: 3,
                  },
                ],
                // Fila 2
                [
                  {},
                  {
                    text: "Macro Proceso: Apoyo a lo misional",
                    style: "logos",
                    fillColor: "#CCCCCC",
                  },
                  { text: "Versión: 01", fillColor: "#CCCCCC", style: "logos" },
                  {},
                ],
                // Fila 3
                [
                  {},
                  {
                    text: "Proceso:Bienestar Insitucional",
                    style: "logos",
                    fillColor: "#CCCCCC",
                  },
                  {
                    text: "Fecha de Aprobación 09/023/2020 ",
                    fillColor: "#CCCCCC",
                    style: "logos",
                  },
                  {},
                ],
              ],
            },
          },

          //body de la carta

          {
            text: `\n Bogotá D.C.,${fechaFormateada} \n
         Señores`,
            style: "defaultStyle",
          },

          { text: "A QUIEN INTERESE", style: ["defaultStyle", "header"] },

          {
            text: `UNIVERSIDAD DISTRITAL FRANCISCO JOSÉ DE CALDAS 
        Bogotá D.C 
        `,
            style: "defaultStyle",
          },

          {
            text: "Ref.: PAZ Y SALVO CENTRO DE BIENESTAR INSTITUCIONAL",
            style: ["defaultStyle", "header"],
          },
          {
            text: `Respetados Señores:
          
        Me permito comunicarle que revisada la información que reposa en las bases de datos administradas por el Centro de Bienestar Institucional de (El) (La) estudiante ${this.referencia.Nombrecompleto} identificado(a) con Cédula de ciudadanía No. ${this.referencia.documento} y con el Código Estudiantil ${this.referencia.codigo}, Proyecto Curricular de Pregrado, ${this.referencia.proyecto}.
        Se encuentra a paz y salvo en los siguientes conceptos:`,
            style: ["defaultStyle", "body"],
          },

          //   TABLA QUE MUESTRA LOS RPOGRAMAS EN PAZ Y SALVO
          {
            table: {
              headerRows: 1,
              widths: ["*", "auto", "auto", "auto"],

              body: [
                [
                  { text: "CONCEPTO", style: "Theader" },
                  { text: "SI", style: "Theader" },
                  { text: "NO", style: "Theader" },
                  { text: "NO APLICA", style: "Theader" },
                ],
                [
                  "Apoyo Alimentario",
                  `${this.tabla.apoyo === "si" ? "x" : ""}`,
                  `${this.tabla.apoyo === "no" ? "x" : ""}`,
                  `${this.tabla.apoyo === "NA" ? "x" : ""}`,
                ],
                [
                  "Convocatoria Equipos y Conectividad",
                  `${this.tabla.equipos === "si" ? "x" : ""}`,
                  `${this.tabla.equipos === "no" ? "x" : ""}`,
                  `${this.tabla.equipos === "NA" ? "x" : ""}`,
                ],
                [
                  "Deportes",
                  `${this.tabla.deportes === "si" ? "x" : ""}`,
                  `${this.tabla.deportes === "no" ? "x" : ""}`,
                  `${this.tabla.deportes === "NA" ? "x" : ""}`,
                ],
                [
                  "Otros",
                  `${this.tabla.otros === "si" ? "x" : ""}`,
                  `${this.tabla.otros === "no" ? "x" : ""}`,
                  `${this.tabla.otros === "NA" ? "x" : ""}`,
                ],
              ],
            },
          },

          { text: "\n Cordialmente \n", style: ["defaultStyle"] },

          {
            image: `${this.revisor.persona2.firma}`,
            width: 100,
            height: 50,
          },

          { text: `${this.revisor.persona2.nombre}`, style: "header" },
          {
            text: `${this.revisor.persona2.programa} \n`,
            style: "defaultStyle",
          },

          // TABLA QUE MUESTRA LAS FIRMAS
          {
            table: {
              headerRows: 1,
              widths: ["auto", "auto", "auto", "*"],

              body: [
                [
                  "",
                  { text: "Nombre", style: "Theader" },
                  { text: "Programa", style: "Theader" },
                  { text: "Firma", style: "Theader" },
                ],
                [
                  "Proyecto",
                  `${this.revisor.persona1.nombre}`,
                  `${this.revisor.persona1.programa}`,
                  {
                    image: `${this.revisor.persona1.firma}`,
                    width: 100,
                    height: 50,
                  },
                ],
                [
                  "Revisó y Aprobó",
                  `${this.revisor.persona2.nombre}`,
                  `${this.revisor.persona2.programa}`,
                  {
                    image: `${this.revisor.persona2.firma}`,
                    width: 100,
                    height: 50,
                  },
                ],
              ],
            },
          },
        ],

        styles: {
          defaultStyle: {
            fontSize: 11,
            lineHeight: 1.5,
          },
          header: {
            fontSize: 11,
            bold: true,
          },
          Theader: {
            fontSize: 12,
            bold: true,
            alignment: "center",
          },
          logos: {
            fontSize: 10,
            alignment: "center",
          },
          body: {
            alignment: "justify",
          },
          anotherStyle: {
            italics: true,
            alignment: "right",
          },
        },
      };
      const pdf = pdfMake.createPdf(pdfDefinition);
      pdf.open();
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Asegurate de Diligenciar todos los campos",
        footer: "Revisa la tabla y los datos administrativos",
      });
    }
  }

  validarObjeto(objeto) {
    for (let propiedad in objeto) {
      if (objeto.hasOwnProperty(propiedad)) {
        if (!objeto[propiedad]) {
          return false;
        }
        if (
          typeof objeto[propiedad] === "object" &&
          !this.validarObjeto(objeto[propiedad])
        ) {
          return false;
        }
      }
    }
    return true;
  }
}
