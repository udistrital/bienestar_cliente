export const FORM_CIERRE_VIGENCIA = {

    tipo_formulario: 'currency',
    alertas: true,
    modelo: 'CierreVigencia',
    campos: [
     
        {
            etiqueta: 'select',
            claseGrid: 'col-lg-6 col-md-6 col-sm-6 col-xs-6',
            nombre: 'Vigencia',
            label_i18n: 'Vigencia',
            placeholder_i18n: 'Vigencia',
            requerido: true,
            tipo: 'text',
            key: 'valor',
            opciones: [{ Id: 1, valor: '2017' }, { Id: 2, valor: '2018' },{ Id: 3, valor: '2019' }, { Id: 4, valor: '2020' }],
        },
        {
            etiqueta: 'select',
            claseGrid: 'col-lg-6 col-md-6 col-sm-6 col-xs-6',
            nombre: 'AreaFuncional',
            label_i18n: 'Area Funcional',
            placeholder_i18n: 'Area Funcional',
            requerido: true,
            tipo: 'text',
            key: 'valor',
            opciones: [{ Id: 1, valor: 'Rector' }, { Id: 2, valor: 'Convenios' }],
        },
    ],
};
