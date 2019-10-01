import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';

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
    constructor() { }

    ngOnInit() { }
}
