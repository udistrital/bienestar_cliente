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
}
