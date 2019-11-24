import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { ModApropiacionHelper } from '../../../../@core/helpers/modApropiacionHelper';

@Component({
    selector: 'ngx-show-modificacion-apropiacion',
    templateUrl: './show-modificacion-apropiacion.component.html',
    styleUrls: ['./show-modificacion-apropiacion.component.scss'],
})

export class ShowModificationApropiacionDataComponent implements OnInit, OnChanges {
    ngOnChanges(changes: SimpleChanges): void {
    }
    @Input() modificationData: any;
    readonly = true;
    constructor(private modApropiacionHelper: ModApropiacionHelper,
        ) { }

    ngOnInit() { }
}
