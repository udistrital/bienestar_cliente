export const FORM_CIERRE_VIGENCIA = {

    tipo_formulario: 'currency',
    alertas: true,
    modelo: 'CierreVigencia',
    campos: [
    
        {
            etiqueta: 'select',
            claseGrid: 'col-lg-6 col-md-6 col-sm-6 col-xs-6',
            nombre: 'AreaFuncional',
            label_i18n: 'Area Funcional',
            placeholder_i18n: 'Area Funcional',
            requerido: true,
            entrelazado: true,
            tipo: 'text',
            key: 'valor',
            opciones: [{ Id: 1, valor: 'Rector' }, { Id: 2, valor: 'Convenios' }],
        },
        {
            etiqueta: 'select',
            claseGrid: 'col-lg-6 col-md-6 col-sm-6 col-xs-6',
            nombre: 'Vigencia',
            label_i18n: 'Vigencia',
            placeholder_i18n: 'Vigencia',
            requerido: true,
            deshabilitar: true,
            tipo: 'text',
            key: 'valor',
            opciones: [],
        },
    ],
};
