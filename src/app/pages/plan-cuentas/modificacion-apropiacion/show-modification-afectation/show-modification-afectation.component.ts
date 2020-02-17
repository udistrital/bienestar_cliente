import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { ModApropiationData } from '../../../../@core/interfaces/modificationInterface';

@Component({
    selector: 'ngx-show-modification-afectation',
    templateUrl: './show-modification-afectation.component.html',
    styleUrls: ['./show-modification-afectation.component.scss'],
})

export class ShowModificationAfectationComponent implements OnInit, OnChanges {
    ngOnChanges(changes: SimpleChanges): void {
        this.afectationData = changes['afectationData'].currentValue;
    }
    constructor() { }
    @Input() afectationData: Array<ModApropiationData>;
    @Output() afectationDataChange = new EventEmitter();
    @Input() readonly: boolean = false;
    ngOnInit() { }
    public removeAprData(daprData: ModApropiationData) {
        this.afectationData = this.afectationData.filter(data => data !== daprData);
        this.afectationDataChange.emit(this.afectationData);
    }
}
