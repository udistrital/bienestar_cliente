export class InputGenericoConstants { 
    static PATRONES: any = {
        PRECIO: '^((\\d{1,3}(,\\d{3})+)|(\\d+))(\\.\\d{2})?$',
        MENSAJE_REGEX_PRECIO: 'Debe cumplir el patrón 1,000,000.00',
    } 
}