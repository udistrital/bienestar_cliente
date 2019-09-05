import { TranslateService } from '@ngx-translate/core';

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
        form.btn = translate.instant('GLOBAL.guardar');
        for (let i = 0; i < form.campos.length; i++) {
            form.campos[i].label = translate.instant('GLOBAL.' + form.campos[i].label_i18n);
            form.campos[i].placeholder = translate.instant('GLOBAL.placeholder_' + form.campos[i].label_i18n);
        }
        return form;
    }
}
