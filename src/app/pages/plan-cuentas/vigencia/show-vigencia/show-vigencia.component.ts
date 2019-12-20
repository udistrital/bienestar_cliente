import { Component, OnInit, OnChanges, SimpleChanges, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'ngx-show-vigencia',
  templateUrl: './show-vigencia.component.html',
  styleUrls: ['./show-vigencia.component.scss']
})
export class ShowVigenciaComponent implements OnInit, OnChanges {
  ngOnChanges(changes: SimpleChanges): void {
  }
  @Input() modificationData: any;
  @Output() eventChange = new EventEmitter();
  readonly = true;
  settings: object;
  listColumns: object;
  source: Array<any>;
  movIDS: Array<string> = [];
  constructor() { }

  ngOnInit() {
    this.listColumns = {

    }
  }
  cambioTab() {
    this.eventChange.emit(false);
}

}
