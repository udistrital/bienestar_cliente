import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'ngx-pdfviewer',
  templateUrl: './pdfviewer.component.html',
  styleUrls: ['./pdfviewer.component.scss']
})
export class PDFviewerComponent implements OnInit {

  @Input('enlacePDF') enlacePDF: string;
  @Input('tituloPDF') tituloPDF: string;
  @Output() goBack = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  cambioTab () {
    this.goBack.emit(false);
  }

}
