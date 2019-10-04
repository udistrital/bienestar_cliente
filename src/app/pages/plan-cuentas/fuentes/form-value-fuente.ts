export let FORM_VALUE_FUENTE = {

    tipo_formulario: 'mini',
    titulo: 'Valor Fuente Financiamiento',
    btn: 'Guardar',
    alertas: true,
    modelo: 'FuenteFinanciamiento',
    campos: [
        {
             etiqueta: 'input',
             claseGrid: 'col-lg-12 col-md-12 col-sm-12 col-xs-12',
             nombre: 'ValorOriginal',
             label_i18n: 'valor',
             placeholder_i18n: '$',
             requerido: true,
             tipo: 'number',
             prefix: {
                 value: '',
             },
         },
    ],
};
