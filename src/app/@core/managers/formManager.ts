import { TranslateService } from '@ngx-translate/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

export class FormManager {
    public static getIndexForm(form: any, field: string) {
        for (let index = 0; index < form.campos.length; index++) {
            const element = form.campos[index];
            if (element.nombre === field) {
                return index;
            }
        }
        return -1;
    }


    public static ConstruirForm(form: any, translate: TranslateService, tittle: string) {
        form.titulo = translate.instant(tittle);
        form.btn = form['btn'] ? translate.instant(form['btn']) : undefined;
        for (let i = 0; i < form.campos.length; i++) {
            form.campos[i].label = translate.instant('GLOBAL.' + form.campos[i].label_i18n);
            form.campos[i].placeholder = translate.instant('GLOBAL.placeholder_' + form.campos[i].label_i18n);
        }
        return form;
    }


    /**
     * Builds group form: Set a Reactive Form Object
     * @param fields here pass the fields' form to build. it follows the structure { key: boolean ...} the boolean indicates if field is required.
     * @returns  FormGroup Object
     */
    public static BuildGroupForm(fields: object) {
        const ObjectKeys = Object.keys(fields);
        const targetFields = {};
        for (const key of ObjectKeys) {
            if (fields[key]) {
                targetFields[key] = new FormControl(null, Validators.required);
            } else {
                targetFields[key] = new FormControl(null);
            }
        }
        const formGroup = new FormGroup(targetFields);

        return formGroup;
    }

    /**
     * Adds form control
     * @param group The Group Form to modify
     * @param newFields New Fields to add.
     * @returns  The Group Form with new fields.
     */
    public static addFormControl(group: FormGroup, newFields: object) {
        const ObjectKeys = Object.keys(newFields);

        for (const key of ObjectKeys) {
            if (newFields[key] && newFields[key] === true) {
                group.addControl(key, new FormControl(null, Validators.required));
            } else {
                group.addControl(key, new FormControl(null));
            }
        }
        return group;
    }


}
