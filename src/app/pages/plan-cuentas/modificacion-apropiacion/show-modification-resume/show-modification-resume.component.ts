import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { ModApropiacionHelper } from '../../../../@core/helpers/modApropiacionHelper';
import { PopUpManager } from '../../../../@core/managers/popUpManager';

@Component({
    selector: 'ngx-show-modification-resume',
    templateUrl: './show-modification-resume.component.html',
    styleUrls: ['./show-modification-resume.component.scss'],
})

export class ShowModificationResumeComponent implements OnInit, OnChanges {
    ngOnChanges(changes: SimpleChanges): void {
        console.table(changes);
    }
    @Input() modificationData: any;
    @Output() modificationDataChange: EventEmitter<any> = new EventEmitter();
    readonly = true;
    constructor(private modApropiacionHelper: ModApropiacionHelper,
        private popUpManager: PopUpManager) { }

    ngOnInit() { }

    saveModification() {
       
        this.modApropiacionHelper.modRegister(this.modificationData).subscribe(res => {
            if (res) {
                this.popUpManager.showSuccessAlert('Movimiento Registrado Correctamente');
            }
        });
    }
}
