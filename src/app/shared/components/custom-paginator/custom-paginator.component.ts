import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'ngx-custom-paginator',
  templateUrl: './custom-paginator.component.html',
  styleUrls: ['./custom-paginator.component.scss']
})
export class CustomPaginatorComponent implements OnInit {

  @Input() page: any;
  @Input() totalElementos: any = 0;
  @Output() pageChange: any= new EventEmitter<any>();
  
  constructor() { }

  ngOnInit() {
  }

}
