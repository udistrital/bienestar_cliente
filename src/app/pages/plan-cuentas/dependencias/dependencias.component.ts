import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'ngx-dependencias',
  templateUrl: './dependencias.component.html',
  styleUrls: ['./dependencias.component.scss']
})
export class DependenciasComponent implements OnInit {

  @Output() auxcambiotab = new EventEmitter<boolean>();
  constructor() { }

  ngOnInit() {
  }

  activetab(tab): void {
    if (tab === 'other') {
      this.auxcambiotab.emit(false);
    }
  }
}
