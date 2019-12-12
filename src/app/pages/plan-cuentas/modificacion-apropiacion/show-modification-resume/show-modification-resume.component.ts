import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { ModApropiacionHelper } from '../../../../@core/helpers/modApropiacionHelper';
import { ModFuenteHelper } from '../../../../@core/helpers/modificaciones/modFuenteHelper';
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
    @Input() optionMod: any;
    @Output() modificationDataChange: EventEmitter<any> = new EventEmitter();
    @Output() saved: EventEmitter<boolean> = new EventEmitter();
    readonly = true;
    constructor(
        private modApropiacionHelper: ModApropiacionHelper,
        private modFuenteHelper: ModFuenteHelper,
        private popUpManager: PopUpManager) { }

    ngOnInit() { }

    saveModification() {
        if(this.optionMod.value == 'apropiacion') {
            this.modApropiacionHelper.modRegister(this.modificationData).subscribe(res => {
                if (res) {
                    this.popUpManager.showSuccessAlert(res);
                    this.saved.emit(true);
                }
            });
        }else {
                this.modFuenteHelper.modRegister(this.modificationData).subscribe(res => {
                    if (res) {
                        this.popUpManager.showSuccessAlert(res);
                        this.saved.emit(true);
                    }
                });

        }
    }
}
